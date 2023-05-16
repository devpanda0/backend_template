// eslint-disable-next-line filenames/match-exported
import { Authorized, Body, CurrentUser, Get, HttpError, JsonController, Post, Put, Req } from "routing-controllers"
import { AuthService } from "../services/AuthService"
import express from "express"
import { User } from "../../../prisma/generated/client"
import prisma from "../../connectors/prisma"

interface LoginBody {
    username: string
    password: string
}

interface RegisterBody {
    username: string
    displayName: string
    email: string
    password: string
    inviteCode: string
}

@JsonController("/auth")
export default class AuthController {
    @Get("/me")
    @Authorized()
    async findMe(@CurrentUser() user: User): Promise<any> {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
        // @ts-expect-error - I don't know why this is an error
        delete dbUser?.password

        return dbUser
    }

    @Post("/login")
    async login(@Body() body: LoginBody): Promise<any> {
        if (!body.username || !body.password) throw new HttpError(406, "Invalid credentials")

        const login = await new AuthService().login(body.username, body.password)
        if (!login) throw new HttpError(406, "Invalid credentials")

        return { success: true, data: login }
    }

    @Post("/register")
    async register(@Body() body: RegisterBody): Promise<any> {
        const invite = await prisma.userInvite.findFirst({
            where: {
                token: body.inviteCode,
            },
        })
        if (!invite) throw new HttpError(406, "Invalid invite code")

        if (!body.username || !body.password || !body.displayName || !body.email)
            throw new HttpError(406, "Invalid credentials")

        const register = await new AuthService().register(body)
        if (typeof register === "string") throw new HttpError(406, register)

        await prisma.userInvite.update({
            where: {
                id: invite.id,
            },
            data: {
                useable: false,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                usedByUserId: register.data.id,
            },
        })

        return { success: true, data: register }
    }

    @Put("/token")
    async newToken(@Req() req: express.Request): Promise<any> {
        const refreshToken = req.headers.refreshtoken
        if (!refreshToken) throw new HttpError(401, "InvalidRefreshToken")

        const dbRefreshToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken.toString() },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            include: { User: true },
        })

        // @ts-expect-error - I don't know why this is an error
        const differenceMs = Math.abs(new Date().getTime() - dbRefreshToken?.createdAt.getTime())
        if (!dbRefreshToken || Math.round(Number(differenceMs / (1000 * 60 * 60 * 24))) > 8) {
            if (dbRefreshToken) await prisma.refreshToken.delete({ where: { token: refreshToken.toString() } })

            throw new HttpError(401, "InvalidRefreshToken")
        }
        const targetUser = await prisma.user.findUnique({ where: { id: dbRefreshToken.userId } })
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const token = new AuthService().generateToken(targetUser!)

        return { success: true, token }
    }
}
