import { Router } from 'express';
import { check } from 'express-validator';
import authController from '../controllers/auth-controller.js';
const authRouter = Router();
authRouter.post('/sign-up', [check(['username', 'password']).isLength({ min: 3 }).withMessage('Credentials must be more than 2 chars long')
        .isLength({ max: 15 }).withMessage('Credentials must be less than 15 characters long')], authController.signUp);
authRouter.post('/log-in', authController.logIn);
export default authRouter;
//# sourceMappingURL=auth-router.js.map