import express, { Request, Response } from 'express';
import { getGuess, saveGues } from '../controller/guess.js';

const router = express.Router();

router.post('/',saveGues)
router.get('/:roomId',getGuess)

export default router;
