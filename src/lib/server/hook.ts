import Elysia, { type MaybePromise } from "elysia";
import { AppController } from "$lib/server/AppController";

export function getServer(): (request: Request) => MaybePromise<Response> {
    const server = new Elysia({ aot: false })
    const mainController = new AppController(
        server
    )

    mainController.configAuthRouter()
    mainController.configApiRouter()
    return server.fetch
}
