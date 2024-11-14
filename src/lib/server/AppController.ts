import Elysia from "elysia"


export class AppController {
    constructor(
        private readonly router: Elysia,
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

    }

    public configApiRouter() {
        this.router.use(this.errorHandler)
        this.router.use(this.authMiddleware)

        this.router.get("/api/ping", async () => {
            return "pong"
        })

    }
}
