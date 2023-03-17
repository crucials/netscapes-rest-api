import { Router } from 'express'
import collectionsController from '../controllers/collections-controller.js'
import { createAuthMiddleware } from '../middlewares/auth-middleware.js'

const collectionsRouter = Router()

collectionsRouter.post('/', createAuthMiddleware(), collectionsController.createCollection)
collectionsRouter.delete('/:id', createAuthMiddleware(), collectionsController.deleteCollection)
collectionsRouter.get('/:accountId', collectionsController.getCollectionsOfAccount)
collectionsRouter.put('/:id', createAuthMiddleware(), collectionsController.addImageToCollection)

export default collectionsRouter