import { describe, it, expect } from "vitest";

import { UnsafeDebugAuthService } from "$lib/server/services/AuthService";

describe("AuthService test", () => {
    const authService = new UnsafeDebugAuthService();

    it("App Tokenを正常に生成できる", () => {
        const uid = "DUMMY_USER_ID";
        const encrypted = authService.genAppToken(uid);
        const decrypted = authService.decryptAppToken(encrypted);
        expect(decrypted?.uid).toBe(uid);
    });

    it("App Tokenに余計な文字列が追加されていたら検証に失敗する", () => {
        const uid = "DUMMY_USER_ID";
        const encrypted = authService.genAppToken(uid);
        expect(() => authService.decryptAppToken(encrypted + "INVALID_CHAR")).toThrow();
    });

    it("App Tokenの有効期限が切れていたらnullを返す", () => {
        const uid = "DUMMY_USER_ID";
        const before = new Date(0);
        const encrypted = authService.genAppToken(uid, before);
        const decrypted = authService.decryptAppToken(encrypted);
        expect(decrypted).toBeNull();
    });

    it("Challenge Tokenを正常に生成できる", () => {
        const uid = "DUMMY_USER_ID";
        const challenge = "DUMMY_CHALLENGE";
        const encrypted = authService.genChallengeToken(uid, challenge);
        const decrypted = authService.decryptChallengeToken(encrypted);
        expect(decrypted?.uid).toBe(uid);
        expect(decrypted?.challenge).toBe(challenge);
    });

    it("Challenge Tokenに余計な文字列が追加されていたら検証に失敗する", () => {
        const uid = "DUMMY_USER_ID";
        const challenge = "DUMMY_CHALLENGE";
        const encrypted = authService.genChallengeToken(uid, challenge);
        expect(() => authService.decryptChallengeToken(encrypted + "INVALID_CHAR")).toThrow();
    });

    it("Challenge Tokenの有効期限が切れていたらnullを返す", () => {
        const uid = "DUMMY_USER_ID";
        const challenge = "DUMMY_CHALLENGE";
        const before = new Date(0);
        const encrypted = authService.genChallengeToken(uid, challenge, before);
        const decrypted = authService.decryptChallengeToken(encrypted);
        expect(decrypted).toBeNull();
    });

    it("App TokenをChallenge Tokenとして渡すとエラーになる", () => {
        const uid = "DUMMY_USER_ID";
        const encrypted = authService.genAppToken(uid);
        expect(() => authService.decryptChallengeToken(encrypted)).toThrow();
    });

    it("Challenge TokenをApp Tokenとして渡すとエラーになる", () => {
        const uid = "DUMMY_USER_ID";
        const challenge = "DUMMY_CHALLENGE";
        const encrypted = authService.genChallengeToken(uid, challenge);
        expect(() => authService.decryptAppToken(encrypted)).toThrow();
    });
});
