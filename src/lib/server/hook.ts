import Elysia, { type MaybePromise } from "elysia";
import { AppController } from "$lib/server/AppController";
import { UserService } from "$lib/server/services/UserService";
import { PasskeyAuthService } from "$lib/server/services/AuthService";
import { noteCategoryRepository, noteRepository, passkeyRepository, userRepository } from "$lib/server/prisma";
import { NoteService } from "$lib/server/services/NoteService";

export function getServer(): (request: Request) => MaybePromise<Response> {
    const server = new Elysia()
    const mainController = new AppController(
        server,
        new UserService(
            userRepository
        ),
        new NoteService(
            noteRepository,
            noteCategoryRepository
        ),
        new PasskeyAuthService(
            passkeyRepository
        )
    )

    mainController.configAuthRouter()
    mainController.configApiRouter()
    return server.fetch
}
