import { Router } from 'express'
import accountsController from '../controllers/accounts-controller.js'
import { createAuthMiddleware } from '../middlewares/auth-middleware.js'

const accountsRouter = Router()

accountsRouter.get('/me', createAuthMiddleware(), accountsController.getCurrentAccount)
accountsRouter.post('/me/avatar', createAuthMiddleware(), accountsController.setAvatar)

export default accountsRouter