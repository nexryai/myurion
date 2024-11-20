import crypto from "crypto"
import type {
    PublicKeyCredentialCreationOptionsJSON,
    PublicKeyCredentialRequestOptionsJSON,
    RegistrationResponseJSON,
    AuthenticationResponseJSON, AuthenticatorTransportFuture
} from "@simplewebauthn/types";
import {
    generateAuthenticationOptions,
    generateRegistrationOptions, verifyAuthenticationResponse,
    verifyRegistrationResponse
} from "@simplewebauthn/server";
import type { IPasskeyRepository } from "$lib/server/prisma";
import { isoBase64URL } from '@simplewebauthn/server/helpers';

enum TokenPermission {
    APP = "APP",
    CHALLENGE = "CHALLENGE",
}

interface TokenClaims {
    role: TokenPermission
    uid: string
    expireAt: Date
}

interface AppTokenClaims extends TokenClaims {
    role: TokenPermission.APP
}

interface ChallengeTokenClaims extends TokenClaims {
    role: TokenPermission.CHALLENGE
    challenge: string
}

class AuthService {
    private readonly secretKey = crypto.randomBytes(32)
    private readonly challengeSecretKey = crypto.randomBytes(32)

    private encrypt(data: string, key: Buffer): string {
        const iv = crypto.randomBytes(12)
        const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)

        const enc1 = cipher.update(data, "utf8")
        const enc2 = cipher.final()
        return Buffer.concat([enc1, enc2, iv, cipher.getAuthTag()]).toString("base64")
    }

    private decrypt(encryptedData: string, key: Buffer): string {
        const dataBuffer = Buffer.from(encryptedData, "base64")

        const ivStart: number = dataBuffer.length - 28
        const ivEnd: number = dataBuffer.length - 16
        const authTagStart: number = dataBuffer.length - 16

        const iv = dataBuffer.slice(ivStart, ivEnd)
        const authTag = dataBuffer.slice(authTagStart)
        const encryptedText = dataBuffer.slice(0, ivStart)

        const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
        decipher.setAuthTag(authTag)

        const dec1 = decipher.update(encryptedText)
        const dec2 = decipher.final()

        return Buffer.concat([dec1, dec2]).toString("utf8")
    }

    /***
        generateAppToken generates an encrypted token for the user. This token is used for authentication.
            * @param uid unique identifier of the user
            * @param expireAt expiration date of the token
            * @returns encrypted token
     ***/
    protected generateAppToken(uid: string, expireAt: Date): string {
        const payload = JSON.stringify({
            role: TokenPermission.APP,
            uid,
            expireAt: expireAt.toISOString()
        })
        return this.encrypt(payload, this.secretKey)
    }

    /***
        generateAppToken generates an encrypted token for the user. This token is used for the challenge, such as WebAuthn.
        Don't use this token for authentication.
            * @param uid unique identifier of the user
            * @param challenge challenge string
            * @param expireAt expiration date of the token
            * @returns encrypted token
     ***/
    protected generateChallengeToken(uid: string, challenge: string, expireAt: Date): string {
        const payload = JSON.stringify({
            role: TokenPermission.CHALLENGE,
            uid,
            challenge,
            expireAt: expireAt.toISOString()
        })
        return this.encrypt(payload, this.challengeSecretKey)
    }

    /***
        decryptToken decrypts the encrypted token and returns the token claims.
        If the token is invalid or expired, it returns null.
        This method is used for authentication and stateless session management.
            * @param encryptedData encrypted token
            * @param isChallengeToken whether the token is a challenge token
            * @returns token data
     ***/
    public decryptToken(encryptedData: string, isChallengeToken: boolean): { uid: string, expireAt: Date, challenge?: string } | null {
        const decryptedData = this.decrypt(encryptedData, isChallengeToken ? this.challengeSecretKey : this.secretKey)
        const parsedData: TokenClaims = JSON.parse(decryptedData)

        // 有効期限の確認
        const expireAt = new Date(parsedData.expireAt)
        const now = new Date()

        if (expireAt <= now) {
            console.log("Token has expired.")
            return null
        }

        if (isChallengeToken) {
            const parsed = parsedData as ChallengeTokenClaims
            if (!parsed || !parsed.challenge || parsed.role !== TokenPermission.CHALLENGE) {
                console.log("Invalid token.")
                return null
            }

            return {
                uid: parsed.uid,
                challenge: parsed.challenge,
                expireAt
            }
        } else {
            const parsed = parsedData as AppTokenClaims
            if (!parsed || parsed.role !== TokenPermission.APP) {
                console.log("Invalid token.")
                return null
            }

            return {
                uid: parsed.uid,
                expireAt
            }
        }
    }
}

export class PasskeyAuthService extends AuthService {
    private readonly rpName = "Goshenite Notes"
    private readonly rpId = "localhost"
    private readonly origin = "http://localhost:5173"

    constructor(
        private readonly passkeyRepository: IPasskeyRepository
    ) {
        super();
    }

    public async genRegisterChallenge(uid: string, username: string): Promise<{ options: PublicKeyCredentialCreationOptionsJSON, encryptedChallenge: string }> {
        const options: PublicKeyCredentialCreationOptionsJSON = await generateRegistrationOptions({
            rpName: this.rpName,
            rpID: this.rpId,
            userID: Buffer.from(uid, "base64"),
            userName: username,
            // Don't prompt users for additional information about the authenticator
            attestationType: "none",
            // Prevent users from re-registering existing authenticators
            /*
            excludeCredentials: userPasskeys.map(passkey => ({
                id: passkey.id,
                // Optional
                transports: passkey.transports,
            })),
            */
            // See "Guiding use of authenticators via authenticatorSelection" below
            authenticatorSelection: {
                // Require the user to use a resident key
                residentKey: 'required',
                requireResidentKey: true,
                userVerification: 'preferred',
                authenticatorAttachment: 'platform',
            },
        });

        const encryptedChallenge = this.generateChallengeToken(uid, options.challenge, new Date(Date.now() + 6000))
        return { options, encryptedChallenge }
    }

    public async verifyRegistration(encryptedChallenge: string, body: unknown, passkeyName?: string): Promise<boolean> {
        const tokenData = this.decryptToken(encryptedChallenge, true)
        if (!tokenData) {
            return false
        }

        if (!tokenData.challenge) {
            throw new Error('Challenge not found in decrypted token. THIS IS A BUG OR LEAK OF SERVER SECRET KEY.');
        }



        const { verified, registrationInfo } = await verifyRegistrationResponse({
            response: body as RegistrationResponseJSON,
            expectedChallenge: tokenData.challenge,
            expectedOrigin: this.origin,
            expectedRPID: this.rpId,
            requireUserVerification: false,
        });

        if (!verified || !registrationInfo) {
            throw new Error('Verification failed.');
        }

        const credential = registrationInfo.credential;
        const publicKey = isoBase64URL.fromBuffer(credential.publicKey);

        await this.passkeyRepository.create({
            data: {
                passkeyUserId: credential.id,
                name: passkeyName || "Passkey",
                publicKey: publicKey,
                user: {
                    connect: {
                        id: tokenData.uid
                    }
                },
                transports: credential.transports?.join(",") || "",
            }
        })

        return true
    }

    public async genLoginChallenge(): Promise<{options:  PublicKeyCredentialRequestOptionsJSON, encryptedChallenge: string}> {
        const options = await generateAuthenticationOptions({
            rpID: this.rpId,
            allowCredentials: [],
        });

        const encryptedChallenge = this.generateChallengeToken("_LOGIN_CHALLENGE", options.challenge, new Date(Date.now() + 6000))
        return { options, encryptedChallenge }
    }

    public async verifyLogin(encryptedChallenge: string, body: unknown): Promise<string> {
        const tokenData = this.decryptToken(encryptedChallenge, true)
        if (!tokenData) {
            throw new Error('Invalid token.');
        }

        if (!tokenData.challenge) {
            throw new Error('Challenge not found in decrypted token. THIS IS A BUG OR LEAK OF SERVER SECRET KEY.');
        }

        const authRequest = body as AuthenticationResponseJSON;
        const passkeyId = authRequest.id;
        if (!passkeyId) {
            throw new Error('Passkey ID not found in the response.');
        }

        const cred = await this.passkeyRepository.findUniqueOrThrow({
            where: {
                passkeyUserId: passkeyId
            }
        })

        const { verified } = await verifyAuthenticationResponse({
            response: body as AuthenticationResponseJSON,
            expectedChallenge: tokenData.challenge,
            expectedOrigin: this.origin,
            expectedRPID: this.rpId,
            credential: {
                id: cred.id,
                publicKey: isoBase64URL.toBuffer(cred.publicKey),
                transports: cred.transports.split(",") as AuthenticatorTransportFuture[],
                counter: cred.counter,
            },
            requireUserVerification: false,
        });

        if (!verified) {
            throw new Error('Verification failed.');
        } else {
            // Update the counter
            // iCloudキーチェーンがカウンター非対応でエラーになるのでコメントアウト
            // https://stackoverflow.com/questions/78776653/passkey-counter-always-0-macos
            /*
            await this.passkeyRepository.update({
                where: {
                    passkeyUserId: passkeyId
                },
                data: {
                    counter: cred.counter + 1
                }
            })
            */
        }

        return this.generateAppToken(cred.userId, new Date(Date.now() + 30 * 60 * 1000))
    }
}
