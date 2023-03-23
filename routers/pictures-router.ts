import { Router } from 'express'
import picturesController from '../controllers/pictures-controller.js'
import { createAuthMiddleware } from '../middlewares/auth-middleware.js'

const router = Router()

router.get('/:id', createAuthMiddleware(false), picturesController.getPicture)
router.get('/', createAuthMiddleware(false), picturesController.getPicturesFeed)
router.get('/search', picturesController.searchPictures)

router.post('/:id/comments', createAuthMiddleware(), picturesController.createComment)
router.post('/', createAuthMiddleware(), picturesController.createPicture)

router.delete('/:id', createAuthMiddleware(), picturesController.deletePicture)

export default router