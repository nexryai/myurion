import { startAuthentication } from "@simplewebauthn/browser";

export async function signIn(): Promise<void> {
    const response = await fetch("/auth/login-request");
    const loginOptions = await response.json();

    let asseResp;
    try {
        // Pass the options to the authenticator and wait for a response
        asseResp = await startAuthentication({ optionsJSON: loginOptions });
    } catch (error) {
        // Some basic error handling
        console.log("Error during authentication: " + error);
        throw error;
    }

    const verificationResp = await fetch("/auth/verify-login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(asseResp),
    });

    if (!verificationResp.ok) {
        throw new Error("Authentication failed");
    }

    localStorage.setItem("isLoggedIn", "true");

    // 15分後に再認証
    // 実際のトークンの有効期限は60分だが、編集中にトークンが切れて保存できなくなることを防止するために15分おきに再認証させる
    localStorage.setItem(
        "nextAuthenticationTime",
        (Date.now() + 15 * 60 * 1000).toString(),
    );
}
