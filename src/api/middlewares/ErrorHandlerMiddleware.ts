import * as express from "express";
import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from "routing-controllers";

import { Logger, LoggerInterface } from "../../decorators/Logger";

@Middleware({ type: "after" })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    public async error(error: HttpError, req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        if (res.headersSent) {
            return;
        }
        const isErrorCode = (error?.name?.includes(" ") || error?.name === "Error") ?? true;
        const status = error.httpCode || 500;
        res.status(status);
        res.json({
            message: isErrorCode ? error.name : "Error",
            name: isErrorCode ? error.message : error.name,
            // @ts-ignore
            errors: error[`errors`] || undefined,
            statusCode: status
        });

        console.log(error.name, error.message ?? error.stack);
    }
}
