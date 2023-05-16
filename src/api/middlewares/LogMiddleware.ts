import * as express from 'express';
import morgan from 'morgan';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class LogMiddleware implements ExpressMiddlewareInterface {
    public use(req: express.Request, res: express.Response, next: express.NextFunction): any {
        return morgan('dev', {
            stream: {
                write: (message) => {
                    console.log(message.substring(0, message.lastIndexOf('\n')));
                },
            },
        })(req, res, next);
    }

}
