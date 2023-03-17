import { Collection } from '@prisma/client'
import StatusCodeError from '../errors/status-code-error.js'
import prismaClient from '../prisma-client.js'
import picturesService from './pictures-service.js'

class CollectionsService {

    async addCollection(collection : Collection, authorId : number) {
        await prismaClient.collection.create({
            data: {
                ...collection,
                authorId
            }
        })
    }


    async deleteCollection(collectionId : number, accountId : number) {
        const collectionToDelete = await prismaClient.collection.findFirst({
            where: { id: collectionId }
        })

        if(!collectionToDelete) {
            throw new StatusCodeError(`Collection with id '${collectionId}' not found`, 404)
        }

        if(collectionToDelete.authorId !== accountId) {
            throw new StatusCodeError('You cannot delete this collection', 403)
        }

        await prismaClient.collection.delete({
            where: { id: collectionToDelete.id }
        })
    }


    async getCollectionOfAccount(accountId : number) {
        return await prismaClient.collection.findMany({
            where: {
                author: {
                    id: accountId
                }
            },
            include: { savedPictures: true }
        })
    }
    

    async getCollectionById(id : number) {
        const foundCollection = await prismaClient.collection.findFirst({
            where: { id },
            include: { savedPictures: true }
        })

        if(!foundCollection) {
            throw new StatusCodeError(`Collection with id '${id}' not found`, 404)
        }

        return foundCollection
    }


    async addPictureToCollection(collectionId : number, pictureId : number, accountId : number) {
        const foundCollection = await prismaClient.collection.findFirst({
            where: { id: collectionId },
            include: { savedPictures: true }
        })
        const foundPicture = await picturesService.getPicture(pictureId)

        if(!foundCollection) {
            throw new StatusCodeError(`Collection with id '${collectionId}' not found`, 404)
        }

        if(foundCollection.authorId !== accountId) {
            throw new StatusCodeError('You cannot update this collection', 403)
        }

        await prismaClient.collection.update({
            where: { id: foundCollection.id },
            data: {
                savedPictures: {
                    connect: {
                        id: foundPicture.id
                    }
                }
            }
        })
    }
}

export default new CollectionsService()