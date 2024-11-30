import { Prisma, type Note } from "@prisma/client";
import type { INoteCategoryRepository, INoteRepository } from "$lib/server/prisma";

export class NoteService {
    constructor(
        private readonly noteRepository: INoteRepository,
        private readonly noteCategoryRepository: INoteCategoryRepository
    ) {}

    public async getNoteById(id: string): Promise<Note | null> {
        return this.noteRepository.findUnique({ where: { id } })
    }

    public async getNotesByUserId(uid: string): Promise<Note[]> {
        return this.noteRepository.findMany({ where: { userId: uid } })
    }

    public async createNote(data: Prisma.NoteCreateInput): Promise<Note> {
        return this.noteRepository.create({ data })
    }

    public async updateNoteById(id: string, data: Prisma.NoteUpdateInput): Promise<Note> {
        return this.noteRepository.update({ where: { id }, data })
    }

    public async deleteNoteById(id: string): Promise<void> {
        await this.noteRepository.delete({ where: { id } })
        return
    }

    public async getNoteCategoryByUserId(uid: string): Promise<string[]> {
        const categories = await this.noteCategoryRepository.findMany({ where: { userId: uid } });
        return categories.map(category => category.name);
    }

    public async createNoteCategory(uid: string, categoryName: string, iconName: string): Promise<string> {
        const created = await this.noteCategoryRepository.create({
            data: {
                user: {
                    connect: { id: uid }
                },
                name: categoryName,
                iconName:  iconName
            }
        });

        return created.id;
    }
}
