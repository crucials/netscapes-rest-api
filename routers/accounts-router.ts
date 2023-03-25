import { Router } from 'express'
import accountsController from '../controllers/accounts-controller.js'
import { createAuthMiddleware } from '../middlewares/auth-middleware.js'

const router = Router()

router.get('/me', createAuthMiddleware(), accountsController.getCurrentAccount)
router.get('/:id', accountsController.getAccount)
router.post('/me/avatar', createAuthMiddleware(), accountsController.setAvatar)

export default router