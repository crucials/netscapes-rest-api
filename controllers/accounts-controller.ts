import { Request, Response } from 'express'
import StatusCodeError from '../errors/status-code-error.js'
import accountsService from '../services/accounts-service.js'

class AccountsController {

    async getCurrentAccount(request : Request, response : Response) {
        const accountId = request.headers['account-id']
        if(!accountId) {
            return response.status(500).send('Couldn\'t get account id. Try again later')
        }

        try {
            response.json(await accountsService.getAccountById(+accountId))
        } 
        catch (error) {
            if(error instanceof StatusCodeError) {
                response.status(error.statusCode).send(error.message)
            }
            else {
                response.status(500).send('Failed to get current account info')
            }
        }
    }


    async setAvatar(request : Request, response : Response) {
        const avatarUrl = request.query['avatar_url']
        const accountId = request.headers['account-id']

        if(!accountId) {
            return response.status(500).send('Couldn\'t get account id. Try again later')
        }
        if(!avatarUrl) {
            return response.status(400).send('Query parameter \'avatar_url\' must be provided')
        }

        try {
            await accountsService.setAvatarUrl(+accountId, avatarUrl as string)
            response.send('Set the avatar successfully')
        }
        catch(error) {
            response.status(500).send('Failed to set the avatar')
        }
    }


    async getAccount(request : Request, response : Response) {
        const accountId = +request.params.id

        try {
            response.json(await accountsService.getAccountById(accountId))
        }
        catch(error) {
            if(error instanceof StatusCodeError) {
                response.status(error.statusCode).send(error.message)
            }
            else {
                response.status(500).send('Failed to get account info')
            }
        }
    }

}

export default new AccountsController()