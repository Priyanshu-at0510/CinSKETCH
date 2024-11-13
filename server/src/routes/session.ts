import express, { Request, Response } from 'express';
import { createMultipleSessions, createSession, getSessionOfRoom } from '../controller/session.js';
const router = express.Router();

//Routes 
router.post('/',createSession)
router.get('/:roomId',getSessionOfRoom)

router.post('/create-multiple', createMultipleSessions);

export default router;
