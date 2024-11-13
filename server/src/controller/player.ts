import { db } from "../lib/db.js";
import { TryCatch } from "../middleware/error.js";
import ErrorHandler from "../lib/errorHandler.js";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

export const SECRET_KEY: Secret = process.env.SECRET_KEY as string;

const prisma =db

export const createPlayer = TryCatch(
  async (req, res, next) => {
    const { userId, gameRoomId } = req.body;

    // Validate input
    if (!userId || !gameRoomId) {
      return next(new ErrorHandler('bad request', 404))
    }


    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Check if the game room exists
    const gameRoom = await prisma.gameRoom.findUnique({
      where: { id: gameRoomId },
    });

    if (!gameRoom || !gameRoom) {
      return next(new ErrorHandler("invalid data", 404))
    }

    const existingPlayer = await prisma.player.findUnique({
      where: {
        userId_gameRoomId: {
          userId,
          gameRoomId,
        },
      },
    });

    if (existingPlayer) {
      return res.status(200).json({
        success: true,
        data: existingPlayer
      });
    }


    const player = await prisma.player.create({
      data: {
        userId,
        gameRoomId,
      },
    });

    return res.status(201).json({
      success: true,
      data: player
    });

  }
);

export const verifyPlayer = TryCatch(
  async (req, res, next) => {
    const { token, roomId } = req.body;

    if (!token) {
      return next(new ErrorHandler("Token is required", 400));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    } catch (error) {
      return next(new ErrorHandler("Invalid token", 401));
    }

    const { email } = decoded;
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const userId = user.id;
    const player = await prisma.player.findFirst({
      where: {
        userId,
        gameRoomId: roomId as string,
      },
    });

    if (!player) {
      return next(new ErrorHandler("User is not a player of this room", 403));
    }

    return res.status(200).json({
      success: true,
    });
  }
);

export const getPlayersOfRoom=TryCatch(
  async(req,res,next)=>{
    const {roomId }= req.body

    if(!roomId){
      return next(new ErrorHandler('Bad request ',404))
    }
    const players = await prisma.player.findMany({
      where:{
        gameRoomId:roomId 
      },include:{
         user:true
      }
    })

    if(!players){
      return next(new ErrorHandler("Internal Error",500))
    }

    res.status(200).json({
      success:true,
      data:players,

    })
  }
)
