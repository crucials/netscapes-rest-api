import { Router } from 'express'
import { check } from 'express-validator'
import authController from '../controllers/auth-controller.js'

const router = Router()

router.post('/sign-up', 
    [ check(['username', 'password']).isLength({ min: 3 }).withMessage('Credentials must be more than 2 chars long')
    .isLength({ max: 15 }).withMessage('Credentials must be less than 15 characters long') ], 
    authController.signUp)
router.post('/log-in', authController.logIn)

export default router