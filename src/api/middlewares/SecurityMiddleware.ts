import * as express from 'express';
const helmet = require("helmet");
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class SecurityMiddleware implements ExpressMiddlewareInterface {
    public use(req: express.Request, res: express.Response, next: express.NextFunction): any {
        return helmet()(req, res, next);
    }

}
