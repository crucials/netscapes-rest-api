import { Request, Response } from 'express'
import StatusCodeError from '../errors/status-code-error.js'
import collectionsService from '../services/collections-service.js'

class CollectionsController {

    async createCollection(request : Request, response : Response) {
        const accountId = request.headers['account-id']
        if(!accountId) {
            return response.status(500).send('Couldn\'t get account id. Try again later')
        }

        try {
            await collectionsService.addCollection(request.body, +accountId)
            response.send('Collection created successfully')
        }
        catch(error) {
            response.status(500).send('Failed to create collection')
        }
    }


    async deleteCollection(request : Request, response : Response) {
        const accountId = request.headers['account-id']
        if(!accountId) {
            return response.status(500).send('Couldn\'t get account id. Try again later')
        }

        try {
            await collectionsService.deleteCollection(+request.params.id, +accountId)
            response.send('Collection deleted successfully')
        } 
        catch (error) {
            if(error instanceof StatusCodeError) {
                response.status(error.statusCode).send(error.message)
            }
            else {
                response.status(500).send('Failed to delete collection')
            }
        }
    }


    async getCollectionsOfAccount(request : Request, response : Response) {
        const accountId = +request.params.accountId

        try {
            response.json(await collectionsService.getCollectionOfAccount(accountId))
        } 
        catch (error) {
            response.status(500).send('Failed to get collections')
        }
    }


    async getCollectionById(request : Request, response : Response) {
        try {
            response.json(await collectionsService.getCollectionById(+request.params.id))
        }
        catch(error) {
            if(error instanceof StatusCodeError) {
                response.status(error.statusCode).send(error.message)
            }
            else {
                response.status(500).send('Failed to get collection')
            }
        }
    }


    async addImageToCollection(request : Request, response : Response) {
        const pictureId = request.query['picture_id']
        const accountId = request.headers['account-id']

        if(!pictureId) {
            return response.status(400).send('Query parameter \'picture_id\' must be provided')
        }
        if(!accountId) {
            return response.status(500).send('Couldn\'t get account id. Try again later')
        }

        try {
            await collectionsService.addPictureToCollection(+request.params.id, +pictureId, +accountId)
            response.send('Added picture to collection successfully')
        } 
        catch (error) {
            if(error instanceof StatusCodeError) {
                response.status(error.statusCode).send(error.message)
            }
            else {
                response.status(500).send('Failed to add picture to collection')
            }
        }
    }
}

export default new CollectionsController()