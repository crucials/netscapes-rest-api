import { Router } from 'express';
import picturesController from '../controllers/pictures-controller.js';
import { createAuthMiddleware } from '../middlewares/auth-middleware.js';
const router = Router();
router.post('/', createAuthMiddleware(), picturesController.createPicture);
router.delete('/:id', createAuthMiddleware(), picturesController.deletePicture);
router.get('/', createAuthMiddleware(false), picturesController.getPicturesFeed);
router.get('/:id', createAuthMiddleware(false), picturesController.getPicture);
router.get('/:id/comments', picturesController.getPictureComments);
router.post('/:id/comments', createAuthMiddleware(), picturesController.createComment);
export default router;
//# sourceMappingURL=pictures.js.map