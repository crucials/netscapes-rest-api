import e, { RequestHandler, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

export function createAuthMiddleware(secure : boolean = true) : RequestHandler {
    return (request, response, next) => {
        if(request.method == 'OPTIONS') {
            next()
        }

        try {
            const token = request.headers.authorization?.split(' ')[1]

            if(!token && secure) {
                return sendUnauthorizedError(response)
            }
            else if(!token && !secure) {
                next()
            }
            else if(token) {
                const { accountId } = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload
                request.headers['account-id'] = accountId
                next()
            }
        }
        catch(error) {
            sendUnauthorizedError(response)
        }
    }
}

function sendUnauthorizedError(response : Response) {
    response.status(401).send('Authentication failed, check your username and password for typos or try again later')
}