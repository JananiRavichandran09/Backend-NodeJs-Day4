import express from 'express'
import {  dashboard, forgotpassword, loginUser, registerUser, resetPassword } from '../Controller/userController.js'
import verifyUser from '../Middleware/middleware.js'
const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/forgotpassword', forgotpassword)
router.post('/resetpassword/:id/:token', resetPassword)
router.get('/dashboard',verifyUser, dashboard)
export default router