import { Comment, Picture } from '@prisma/client'
import StatusCodeError from '../errors/status-code-error.js'
import prismaClient from '../prisma-client.js'
import { shuffle } from '../utils.js'

class PicturesService {
    async addPicture(picture : Picture, authorId : number) {
        await prismaClient.picture.create({
            data: {
                ...picture,
                authorId
            },
        })
    }


    async generateFeed(accountId : number) {
        const lastViewedTags = (await prismaClient.account.findFirst({
            where: { id: accountId }
        }))?.lastViewedTags

        if(lastViewedTags) {
            const recommendedPictures = await prismaClient.picture.findMany({
                where: {
                    tags: {
                        hasSome: lastViewedTags
                    }
                },
                include: { author: true }
            })

            const remainingPictures = await prismaClient.picture.findMany({
                where: {
                    NOT: {
                        tags: {
                            hasSome: lastViewedTags
                        }
                    }
                },
                include: { author: true }
            })

            return shuffle(recommendedPictures).concat(shuffle(remainingPictures))
        }
        else {
            return await this.getShuffledPictures()
        }
    }


    async getPicture(id : number, accountId? : number) : Promise<Picture> {
        const foundPicture = await prismaClient.picture.findFirst({
            where: { id },
            include: { comments: true, author: true }
        })
        
        if(!foundPicture) {
            throw new StatusCodeError(`Picture with id '${id}' not found`, 404)
        }

        if(accountId) {
            const lastViewedTags = (await prismaClient.account.findFirst({
                where: { id: accountId }
            }))?.lastViewedTags

            if(lastViewedTags) {
                if(lastViewedTags.length > 3) {
                    lastViewedTags.pop()
                    await prismaClient.account.update({
                        where: { id: accountId },
                        data: {
                            lastViewedTags
                        }
                    })
                }
    
                if(lastViewedTags.includes(foundPicture.tags[0])) {
                    await prismaClient.account.update({
                        where: { id: accountId },
                        data: {
                            lastViewedTags: lastViewedTags.filter(tag => tag !== foundPicture.tags[0])
                        }
                    })
                }

                await prismaClient.account.update({
                    where: { id: accountId },
                    data: {
                        lastViewedTags: {
                            push: foundPicture.tags[0]
                        }
                    }
                })
            }
        }

        return foundPicture
    }


    async getShuffledPictures() {
        return shuffle(await prismaClient.picture.findMany({ include: { author: true } }))
    }


    async deletePicture(pictureId : number, accountId : number) {    
        const pictureToDelete = await prismaClient.picture.findFirst({
            where: { id: pictureId }
        })

        if(!pictureToDelete) {
            throw new StatusCodeError(`Picture with id '${pictureId}' not found`, 404)
        }

        if(pictureToDelete.authorId !== accountId) {
            throw new StatusCodeError('You cannot delete this picture', 403)
        }

        await prismaClient.picture.delete({
            where: { id: pictureToDelete.id }
        })
    }


    async getComments(pictureId : number) {
        const foundPicture = await prismaClient.picture.findFirst({
            where: { id: pictureId },
            include: {
                comments: true
            }
        })

        if(!foundPicture) {
            throw new StatusCodeError(`Picture with id '${pictureId}' not found`, 404)
        }

        return foundPicture.comments
    }


    async addComment(pictureId : number, comment : Comment, accountId : number) {
        const foundPicture = await prismaClient.picture.findFirst({
            where: { id: pictureId },
            include: {
                comments: true
            }
        })
        if(!foundPicture) {
            throw new StatusCodeError(`Picture with id '${pictureId}' not found`, 404)
        }

        const foundUser = await prismaClient.account.findFirst({ where: { id: accountId } })
        if(!foundUser) {
            throw new StatusCodeError(`Account with id '${accountId}' not found`, 404)
        }

        comment.authorUsername = foundUser.username

        await prismaClient.picture.update({
            where: { id: foundPicture.id },
            data: {
                comments: { create: comment }
            }
        })
    }

}

export default new PicturesService()