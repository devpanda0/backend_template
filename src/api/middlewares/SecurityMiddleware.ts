import * as express from 'express';
const helmet = require("helmet");
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class SecurityMiddleware implements ExpressMiddlewareInterface {
    public use(req: express.Request, res: express.Response, next: express.NextFunction): any {
        // if (env.isProduction && !req.path.includes('payments/webhook')) {
        //     const referer = req.headers.referer;
        //     if (!referer?.toLowerCase().startsWith('https://cp.mediahosting.io')) {
        //         return res.json({ success: false, message: 'NoAccess' });
        //     }
        // }
        return helmet()(req, res, next);
    }

}
