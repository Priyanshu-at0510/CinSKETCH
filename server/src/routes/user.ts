import express, { Request, Response } from 'express';
import { SignIn, Signup,getUserById,getUserDetails } from '../controller/user.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/signin', SignIn);
router.get('/profile',getUserDetails)
router.get('/user',getUserById)



export default router;
