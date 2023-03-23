import { Comment, Picture } from '@prisma/client'
import StatusCodeError from '../errors/status-code-error.js'
import prismaClient from '../prisma-client.js'
import { excludePassword, shuffle } from '../utils.js'

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
                include: { author: excludePassword }
            })

            const remainingPictures = await prismaClient.picture.findMany({
                where: {
                    NOT: {
                        tags: {
                            hasSome: lastViewedTags
                        }
                    }
                },
                include: { author: excludePassword }
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
            include: { 
                comments: { 
                    include: { 
                        authorAccount: excludePassword
                    } 
                },
                author: excludePassword
            }
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
        return shuffle(await prismaClient.picture.findMany({ include: { author: excludePassword } }))
    }


    async searchPictures(query : string) {
        return await prismaClient.picture.findMany({
            include: { author: excludePassword },
            where: {
                OR: {
                    title: { contains: query },
                    description: { contains: query },
                    author: { username: { contains: query } },
                    tags: { has: query }
                }
            }
        })
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

    
    async addComment(pictureId : number, commentText : string, accountId : number) {
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


        await prismaClient.picture.update({
            where: { id: foundPicture.id },
            data: {
                comments: { 
                    create: {
                        text: commentText,
                        authorAccount: {
                            connect: {
                                id: foundUser.id
                            }
                        }
                    }
                }
            }
        })
    }

}

export default new PicturesService()