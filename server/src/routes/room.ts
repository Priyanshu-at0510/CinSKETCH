import express, { Request, Response } from 'express';
import { CreateRoom, getRoomPlayers, getUserRoom,
    getRoomById
} from '../controller/room.js';

const router = express.Router();

router.post('/create-room',CreateRoom)
router.get('/user-room',getUserRoom)
router.get('/players/:roomId',getRoomPlayers)
router.post('/getRoom',getRoomById)

export default router;
