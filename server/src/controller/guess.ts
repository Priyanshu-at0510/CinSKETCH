import {db} from '../lib/db.js'
import ErrorHandler from "../lib/errorHandler.js";
import { TryCatch } from "../middleware/error.js";


export const saveGues = TryCatch(
    async (req, res, next) => {
        const { content, userId, gameRoomId } = req.body;
        if (!content || !userId || !gameRoomId) {
            return next(new ErrorHandler('Missing required fields', 400));

        }


        const guess = await db.guess.create({
            data: {
                content,
                userId,
                gameRoomId,
            },
        });


        res.status(201).json({
            success: true,
            data: guess,
        });

    }
)


export const getGuess = TryCatch(
    async (req, res, next) => {
        const { roomId } = req.params;

        const guesses = await db.guess.findMany({
            where: { gameRoomId: roomId },
            orderBy: { createdAt: 'asc' },
        });

        res.status(200).json({
            success: true,
            data: guesses,
        });
    }
)