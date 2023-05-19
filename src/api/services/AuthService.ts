import type { User } from "../../../prisma/generated/client"
import prisma from "../../connectors/prisma"
import { HttpError } from "routing-controllers"
import { v4 as uuidv4 } from "uuid"
import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcrypt"

interface RegisterData {
    username: string
    displayName: string
    email: string
    password: string
    inviteCode: string
}

export class AuthService {
    async register(data: RegisterData): Promise<string | { success: boolean; data: any }> {
        const user = await prisma.user.findUnique({ where: { username: data.username } })
        if (user) return "UsernameTaken"

        data.password = await bcrypt.hash(data.password, 12)
        const userData = prisma.user.create({
            data: {
                username: data.username,
                displayName: data.username,
                password: data.password,
            },
        })

        return { success: true, data: userData }
    }

    async login(
        username: string,
        password: string,
    ): Promise<string | { user: User; token: string; refreshToken: string }> {
        const user = await prisma.user.findUnique({ where: { username } })
        if (!user) return "InvalidUsername"

        const isSamePassword: boolean = await this.comparePassword(user, password)
        if (!isSamePassword) return "InvalidPassword"

        const refreshToken = await prisma.refreshToken.create({
            data: {
                token: uuidv4(),
                userId: user.id,
                createdAt: new Date(),
            },
        })

        const token = await this.generateToken(user)

        return { user, token, refreshToken: refreshToken.token }
    }

    async comparePassword(user: User, password: string): Promise<boolean> {
        return new Promise((resolve, _) => bcrypt.compare(password, user.password, (err, res) => resolve(res)))
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async generateToken(user: User): Promise<string> {
        return jwt.sign({ id: Number(user.id), username: user.username }, "top-secret", {
            expiresIn: "90d",
        })
    }
}
