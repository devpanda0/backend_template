import { HttpError } from 'routing-controllers';

export class AuthenticationError extends HttpError {
    constructor() {
        super(400, 'Invalid credentials!');
    }
}
