import { Router } from 'express';
import picturesController from '../controllers/pictures-controller.js';
import { createAuthMiddleware } from '../middlewares/auth-middleware.js';
const picturesRouter = Router();
picturesRouter.post('/', createAuthMiddleware(), picturesController.createPicture);
picturesRouter.delete('/:id', createAuthMiddleware(), picturesController.deletePicture);
picturesRouter.get('/', createAuthMiddleware(false), picturesController.getPicturesFeed);
picturesRouter.get('/:id', createAuthMiddleware(false), picturesController.getPicture);
picturesRouter.get('/:id/comments', picturesController.getPictureComments);
picturesRouter.post('/:id/comments', createAuthMiddleware(), picturesController.createComment);
export default picturesRouter;
//# sourceMappingURL=pictures-router.js.map