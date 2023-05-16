import * as express from 'express';
const helmet = require("helmet");
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class SecurityHstsMiddleware implements ExpressMiddlewareInterface {
    public use(req: express.Request, res: express.Response, next: express.NextFunction): any {
        return helmet.hsts({
            maxAge: 31536000,
            includeSubDomains: true,
        })(req, res, next);
    }
}
