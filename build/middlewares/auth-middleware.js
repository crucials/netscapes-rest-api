import jwt from 'jsonwebtoken';
export function createAuthMiddleware(secure = true) {
    return (request, response, next) => {
        var _a;
        if (request.method == 'OPTIONS') {
            next();
        }
        try {
            const token = (_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token && secure) {
                return sendUnauthorizedError(response);
            }
            else if (!token && !secure) {
                next();
            }
            else if (token) {
                const { accountId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
                request.headers['account-id'] = accountId;
                next();
            }
        }
        catch (error) {
            sendUnauthorizedError(response);
        }
    };
}
function sendUnauthorizedError(response) {
    response.status(401).send('Authentication failed, check your username and password for typos or try again later');
}
//# sourceMappingURL=auth-middleware.js.map