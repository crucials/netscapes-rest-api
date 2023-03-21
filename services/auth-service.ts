import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import StatusCodeError from '../errors/status-code-error.js'
import prismaClient from '../prisma-client.js'

class AuthService {

    async logIn(username : string, password : string) {
        const foundUser = await prismaClient.account.findFirst({
            where: {
                username
            }
        })

        if(!foundUser) {
            throw new StatusCodeError(`Invalid username or password`, 401)
        }

        if(bcrypt.compareSync(password, foundUser.password)) {
            return this.generateJwt(foundUser.id)
        }
        else {
            throw new StatusCodeError('Invalid username or password', 401)
        }
    }


    async signUp(username : string, password : string) {
        const foundUser = await prismaClient.account.findFirst({
            where: { username }
        })

        if(foundUser) {
            throw new StatusCodeError( `Account with username '${username}' already exists`, 409)
        }

        const hashedPassword = bcrypt.hashSync(password)

        await prismaClient.account.create({
            data: {
                username,
                password: hashedPassword,
                collections: {
                    create: {
                        name: 'Saved pictures'
                    }
                }
            }
        })
    }


    private generateJwt(accountId : number) {
        return jwt.sign({ accountId }, process.env.JWT_SECRET_KEY as string, { expiresIn: '90d' })
    }

}

export default new AuthService()