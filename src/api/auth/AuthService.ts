import * as jwt from "jsonwebtoken";
import type { Prisma, User } from "../../../prisma/generated/client";
import { HttpError } from "routing-controllers";
import prisma from "../../connectors/prisma";

export class AuthService {
    async validateToken(token: string): Promise<object> {
        return new Promise((resolve, _) => {
                // eslint-disable-next-line @typescript-eslint/no-misused-promises,@typescript-eslint/require-await,@typescript-eslint/no-unsafe-argument
                jwt.verify(token, "top-secret", async (err: any, decoded: any) => {
                    if (err) {
                        console.log(err);
                    }
                    resolve(decoded);
                })
            }
        );
    }

    async validateUser(id: number, username: string): Promise<User> {
        const user = prisma.user.findUnique({
            where: {
                username
            }
        });
        if (user === null) throw new HttpError(404, "User not found");

        // @ts-ignore
        return user;
    }
}
