import type { Action } from "routing-controllers"
import type { User } from "../../../prisma/generated/client"

export function currentUserChecker(): (action: Action) => Promise<User | undefined> {
    // eslint-disable-next-line @typescript-eslint/require-await
    return async function innerCurrentUserChecker(action: Action): Promise<User | undefined> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
        return action.request.user
    }
}
