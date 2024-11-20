import Elysia, { error, t } from "elysia"
import type { PasskeyAuthService } from "$lib/server/services/AuthService";
import type { UserService } from "$lib/server/services/UserService";

export class AppController {
    constructor(
        private readonly router: Elysia,
        private readonly userService: UserService,
        private readonly passkeyAuthService: PasskeyAuthService
    ) {}

    private readonly protectedApiPrefix = "/api"

    private readonly errorHandler = (app: Elysia) =>
        app.onError(({ code, error, set }) => {
            if (code == "NOT_FOUND") {
                set.status = 404
                return "Not found"
            }

            if (code == "VALIDATION") {
                set.status = 400
                return "Invalid request"
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (code == 401) {
                // なぜかset.status = 401が型エラーになる
                return new Response("Unauthorized", {status: 401})
            }

            // 想定されないエラーは全部500
            console.error(`ERROR OCCURRED: ${error}`)
            console.error("===== STACK =====")
            console.error(error.stack)
            console.error("=================")
            set.status = 500
            return "An unexpected error occurred. The request was aborted."
        })

    private readonly authMiddleware = (app: Elysia) =>
        app.derive(({ cookie: {token} }) => {
            if (!token || !token.value) {
                return error(401, {
                    message: 'Unauthorized',
                    uid: null,
                })
            }

            try {
                const user = this.passkeyAuthService.decryptToken(token.value, false)
                if (!user) {
                    throw new Error("Invalid token")
                }

                return {
                    uid: user.uid,
                }
            } catch {
                return error(401, {
                    message: 'Unauthorized',
                    uid: null,
                })
            }
        })

    public configAuthRouter() {
        this.router.post("/auth/register-request", async ({body, cookie: {challengeSession}}) => {
            const user = await this.userService.createUser({name: body.displayName})
            const res = await this.passkeyAuthService.genRegisterChallenge(user.id, body.displayName)

            challengeSession.value = res.encryptedChallenge
            challengeSession.httpOnly = true
            challengeSession.secure = true
            challengeSession.sameSite = "strict"
            challengeSession.expires = new Date(Date.now() + 60 * 1000)
            challengeSession.path = "/auth/verify-registration"

            return res.options
        }, {
            body: t.Object({
                displayName: t.String({
                    error: "displayName must be a string"
                })
            })
        })

        this.router.post("/auth/verify-registration", async ({body, cookie}) => {
            const encryptedChallenge = cookie.challengeSession.value
            const ok = await this.passkeyAuthService.verifyRegistration(encryptedChallenge, body as unknown)
            if (!ok) {
                return new Response("Invalid challenge", {status: 400})
            }
        }, {
            cookie: t.Object({
                challengeSession: t.String({
                    error: "challengeSession must be a string"
                })
            })
        })

        this.router.get("/auth/login-request", async ({cookie: {challengeSession}}) => {
            const res = await this.passkeyAuthService.genLoginChallenge()
            challengeSession.value = res.encryptedChallenge
            challengeSession.httpOnly = true
            challengeSession.secure = true
            challengeSession.sameSite = "strict"
            challengeSession.expires = new Date(Date.now() + 60 * 1000)
            challengeSession.path = "/auth/verify-login"

            return res.options
        })

        this.router.post("/auth/verify-login", async ({body, cookie: {challengeSession, token}}) => {
            const encryptedChallenge = challengeSession.value
            const generatedToken = await this.passkeyAuthService.verifyLogin(encryptedChallenge, body as unknown)
            if (!token) {
                return new Response("Invalid challenge", {status: 400})
            }

            token.value = generatedToken
            token.httpOnly = true
            token.secure = true
            token.sameSite = "strict"
            token.expires = new Date(Date.now() + 30 * 60 * 1000)
            token.path = "/api"

            return "OK"
        }, {
            cookie: t.Object({
                challengeSession: t.String({
                    error: "challengeSession must be a string"
                }),
            })
        })
    }

    public configApiRouter() {
        this.router.use(this.errorHandler)
        this.router.use(this.authMiddleware)

        this.router.get("/api/user", async ({uid}) => {
            const user = await this.userService.getUserById(uid)
            return user
        })
    }
}
