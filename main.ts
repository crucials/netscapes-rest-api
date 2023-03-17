import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prismaClient from './prisma-client.js'

import authRouter from './routers/auth-router.js'
import picturesRouter from './routers/pictures-router.js'
import collectionsRouter from './routers/collections-router.js'
import accountsRouter from './routers/accounts-router.js'


dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRouter)
app.use('/pictures', picturesRouter)
app.use('/collections', collectionsRouter)
app.use('/accounts', accountsRouter)

app.listen(5000, () => {
    console.log('Server started')
    prismaClient.account.findMany().then(accounts => {
        console.log(accounts)
    })
})