import { type IUserRepository } from "$lib/server/prisma"
import { type User, Prisma } from "@prisma/client"

export class UserService {
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async isExistUser(uid: string): Promise<boolean> {
        const user = await this.userRepository.findUnique({
            where: {id: uid}
        })
        return user !== null
    }

    getUser(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
        return this.userRepository.findUnique({ where })
    }

    createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.userRepository.create({ data })
    }

    updateUser(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput): Promise<User> {
        return this.userRepository.update({ where, data })
    }
}
