import type { Action } from "routing-controllers"
import type * as express from "express"
import { AuthService } from "./AuthService"

function extractToken(req: express.Request): string {
    let token: string

    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer")
        token = req.headers.authorization.split(" ")[1]
    else if (req.query && (req.query.token || req.query.state))
        token = (req.query.token as string) ?? (req.query.state as string)

    // @ts-expect-error baum
    return token
}
export function authorizationChecker(): (action: Action) => Promise<boolean> | boolean {
    return async function innerAuthorizationChecker(action: Action): Promise<boolean> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const bearerToken = extractToken(action.request)
        const tokenData: any = await new AuthService().validateToken(bearerToken)

        if (!bearerToken || !tokenData) return false

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
        const user = await new AuthService().validateUser(tokenData.id, tokenData.username)

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        action.request.user = user
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        action.request.token = bearerToken
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (action.request.user === undefined) return false

        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        return !!user
    }
}
