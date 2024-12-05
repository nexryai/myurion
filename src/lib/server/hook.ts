import Elysia, { type MaybePromise } from "elysia";

import { AppController } from "$lib/server/AppController";
import { noteCategoryRepository, noteRepository, passkeyRepository, userRepository } from "$lib/server/prisma";
import { PasskeyAuthService } from "$lib/server/services/AuthService";
import { NoteService } from "$lib/server/services/NoteService";
import { UserService } from "$lib/server/services/UserService";

export function getServer(): (request: Request) => MaybePromise<Response> {
    const server = new Elysia();
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
    );

    mainController.configAuthRouter();
    mainController.configApiRouter();
    return server.fetch;
}
