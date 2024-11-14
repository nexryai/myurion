import Elysia, { t } from "elysia"
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
            // 想定されないエラーは全部500
            if (!["VALIDATION", "NOT_FOUND"].includes(code)) {
                console.error(`ERROR OCCURRED: ${error}`)
                console.error("===== STACK =====")
                console.error(error.stack)
                console.error("=================")
                set.status = 500
                return "An unexpected error occurred. The request was aborted."
            }

            if (code == "VALIDATION") {
                return "Invalid request"
            }
        })

    private readonly authMiddleware = (app: Elysia) =>

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        app.derive(({ headers }) => {
            return {
                uid: "DUMMY"
            }
        })

    public configAuthRouter() {
        this.router.post("/auth/register-request", async ({body, cookie: {challengeSession}}) => {
            const user = await this.userService.createUser({name: "DUMMY"})
            const res = await this.passkeyAuthService.genRegisterChallenge(user.id, body.displayName)

            challengeSession.value = res.encryptedChallenge
            challengeSession.httpOnly = true
            challengeSession.secure = true
            challengeSession.sameSite = "strict"
            challengeSession.maxAge = 60

            return res.options
        }, {
            body: t.Object({
                displayName: t.String({
                    error: "displayName must be a string"
                })
            })
        })

        this.router.post("/auth/verify-registration", async ({request, response, body, cookie}) => {
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
    }

    public configApiRouter() {
        this.router.use(this.errorHandler)
        this.router.use(this.authMiddleware)

        this.router.get("/api/ping", async () => {
            return "pong"
        })
    }
}
