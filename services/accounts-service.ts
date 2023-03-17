import StatusCodeError from '../errors/status-code-error.js'
import prismaClient from '../prisma-client.js'

class AccountsService {

    async getAccountById(id : number) {
        const foundAccount = await prismaClient.account.findFirst({
            where: { id },
            include: {
                collections: true,
                publishedPictures: true
            }
        })

        if(!foundAccount) {
            throw new StatusCodeError(`Account with id '${id}' not found`, 404)
        }

        return foundAccount
    }


    async setAvatarUrl(accountId : number, url : string) {
        await prismaClient.account.update({
            where: { id: accountId },
            data: {
                avatarUrl: url
            }
        })
    }

}

export default new AccountsService()