import { Request, Response } from 'express'
import StatusCodeError from '../errors/status-code-error.js'
import authService from '../services/auth-service.js'
import { validationResult } from 'express-validator'

class AuthController {

    async logIn(request : Request, response : Response) {
        const { username, password } = request.body
        
        try {
            response.send(await authService.logIn(username, password))
        }
        catch(error) {
            if(error instanceof StatusCodeError) {
                response.status(error.statusCode).send(error.message)
            }
            else {
                response.status(500).send('Failed to log you in. Try again later')
            }
        }
    }

    async signUp(request : Request, response : Response) {
        const validationErrors = validationResult(request)
        
        if(!validationErrors.isEmpty()) {
            return response.status(400).send(validationErrors.array()[0].msg)
        }

        const { username, password } = request.body

        try {
            await authService.signUp(username, password)
            response.send('Successfully created new account')
        }
        catch(error) {
            if(error instanceof StatusCodeError) {
                response.status(error.statusCode).send(error.message)
            }
            else {
                response.status(500).send('Failed to create new account. Try again later')
            }
        }
    }

}

export default new AuthController()