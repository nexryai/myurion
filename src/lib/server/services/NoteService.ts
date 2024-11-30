import { Prisma, type Note, type NoteCategory } from "@prisma/client";
import type { INoteCategoryRepository, INoteRepository } from "$lib/server/prisma";
import type { NoteTree } from "$lib/schema/note";

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

    public async updateNoteById(id: string, data: Prisma.NoteUpdateInput): Promise<Note> {
        return this.noteRepository.update({ where: { id }, data })
    }

    public async deleteNoteById(id: string): Promise<void> {
        await this.noteRepository.delete({ where: { id } })
        return
    }

    public async createNote(uid: string, title: string, content: string, categoryId: string): Promise<string> {
        const created = await this.noteRepository.create({
            data: {
                user: {
                    connect: { id: uid }
                },
                title: title,
                content: content,
                category: {
                    connect: {
                        id: categoryId,
                        userId: uid
                    }
                }
            }
        });

        return created.id;
    }

    public async getNoteTreeByUserId(uid: string): Promise<NoteTree[]> {
        return this.noteCategoryRepository.findMany({
            where: { userId: uid },
            select: {
                id: true,
                name: true,
                iconName: true,
                notes: {
                    select: {
                        id: true,
                        title: true,
                        createdAt: true
                    }
                }
            }
        });
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

    public async getNoteCategoriesByUserId(uid: string): Promise<NoteCategory[]> {
        return this.noteCategoryRepository.findMany({
            where: { userId: uid }
        });
    }
}
