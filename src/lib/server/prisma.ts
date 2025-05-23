import { PrismaClient } from "@prisma/client";

class PrismaRepository extends PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
}

const prisma = new PrismaRepository();

export const userRepository = prisma.user;
export type IUserRepository = typeof userRepository

export const passkeyRepository = prisma.passkey;
export type IPasskeyRepository = typeof passkeyRepository

export const noteRepository = prisma.note;
export type INoteRepository = typeof noteRepository

export const noteCategoryRepository = prisma.noteCategory;
export type INoteCategoryRepository = typeof noteCategoryRepository
