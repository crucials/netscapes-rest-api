import { Router } from 'express'
import collectionsController from '../controllers/collections-controller.js'
import { createAuthMiddleware } from '../middlewares/auth-middleware.js'

const router = Router()

router.post('/', createAuthMiddleware(), collectionsController.createCollection)
router.delete('/:id', createAuthMiddleware(), collectionsController.deleteCollection)
router.get('/:accountId', collectionsController.getCollectionsOfAccount)
router.put('/:id', createAuthMiddleware(), collectionsController.addImageToCollection)

export default router