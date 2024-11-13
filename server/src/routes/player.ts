import express, { Request, Response } from 'express';
import { verifyPlayer, createPlayer ,getPlayersOfRoom} from '../controller/player.js';

const router = express.Router();
router.post('/',createPlayer)
router.post('/get',getPlayersOfRoom
)

router.post('/verify',verifyPlayer)


export default router;
