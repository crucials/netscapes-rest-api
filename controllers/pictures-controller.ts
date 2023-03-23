import { Picture } from '@prisma/client'
import { Request, Response } from 'express'
import StatusCodeError from '../errors/status-code-error.js'
import picturesService from '../services/pictures-service.js'

class PicturesController {
    async createPicture(request : Request, response : Response) {
        const accountId = request.headers['account-id']
        if(!accountId) {
            return response.status(500).send('Couldn\'t get account id. Try again later')
        }

        try {
            await picturesService.addPicture(request.body, +accountId)
            response.send('Created new picture successfully')
        }
        catch(error) {
            response.status(500).send('Failed to create new picture')
        }
    }


    async getPicturesFeed(request : Request, response : Response) {
        const accountId = request.headers['account-id']
        
        try {
            if(!accountId) {
                return response.json(await picturesService.getShuffledPictures())
            }
            
            response.json(await picturesService.generateFeed(+accountId))
        }
        catch(error) {
            response.status(500).send('Failed to create pictures feed')
        }
    }


    async searchPictures(request : Request, response : Response) {
        const query = request.query.query

        if(query) {
            try {
                response.json(await picturesService.searchPictures(query.toString()))
            }
            catch(error) {
                response.status(500).send('Something went wrong while searching pictures')
            }
        }
        else {
            response.status(400).send('Query parameter \'query\' must be provided')
        }
    }


    async getPicture(request : Request, response : Response) {
        const accountId = Number(request.headers['account-id'])

        try {
            response.json(await picturesService.getPicture(+request.params.id, accountId))
        }
        catch(error) {
            if(error instanceof StatusCodeError) {
                response.status(error.statusCode).send(error.message)
            }
            else {
                response.status(500).send('Something went wrong while getting picture from server')
            }
        }
    }


    async deletePicture(request : Request, response : Response) {
        const accountId = request.headers['account-id']
        if(!accountId) {
            return response.status(500).send('Couldn\'t get account id. Try again later')
        }

        try {
            await picturesService.deletePicture(+request.params.id, +accountId)
            response.send('Deleted picture successfully')
        }
        catch(error) {
            if(error instanceof StatusCodeError) {
                response.status(error.statusCode).send(error.message)
            }
            else {
                response.status(500).send('Failed to delete picture')
            }
        }
    }


    async createComment(request : Request, response : Response) {
        const accountId = request.headers['account-id']
        if(!accountId) {
            return response.status(500).send('Couldn\'t get account id. Try again later')
        }

        try {
            await picturesService.addComment(+request.params.id, request.body.text, +accountId)
            response.send('Created comment successfully')
        }
        catch(error) {
            if(error instanceof StatusCodeError) {
                response.status(error.statusCode).send(error.message)
            }
            else {
                response.status(500).send('Failed to add comment')
            }
        }
    }



    private omitPasswords(picture : Picture) {

    }
}

export default new PicturesController()