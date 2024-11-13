import { db } from "../lib/db.js";
import ErrorHandler from "../lib/errorHandler.js";
import { TryCatch } from "../middleware/error.js";
import { CLIENT_RENEG_LIMIT } from "tls";

const prisma = db;

export const CreateRoom = TryCatch(async (req, res, next) => {
  // Zod validation
  const { name, ownerId } = req.body;
  if (!name || !ownerId) {
    return next(new ErrorHandler("Invalid input", 404));
  }
  const gameRoom = await prisma.gameRoom.create({
    data: { name, ownerId }
  });

  if (!gameRoom) {
    return next(new ErrorHandler("Failed creating game room", 500));
  }

  return res.status(200).json({
    data: gameRoom,
    success: true
  });
});

export const getRoomById = TryCatch(
  async(req,res,next)=>{
    console.log('fetching room')
    const { roomId }= req.body;
    if(!roomId){
      return next( new ErrorHandler('Bad Request !',400))
    }

    const room= await db.gameRoom.findUnique({
      where:{
        id:roomId as string
      },
      include:{
        players:true
      }
    })

    return res.status(200).json({
      data:room,
      success:true
    })

  }
)

export const getUserRoom = TryCatch(async (req, res, next) => {
  const { userId } = req.query; // Changed to req.query
  console.log(req.query);
  console.log(userId);
  if (!userId) {
    return next(new ErrorHandler("User id missing ", 404));
  }

  const rooms = await prisma.gameRoom.findMany({
    where: {
      ownerId: userId as string
    }
  });

  return res.status(200).json({
    data: rooms,
    success: true
  });
});

export const getRoomPlayers = TryCatch(async (req, res, next) => {
  const { roomId } = req.params;

  if (!roomId) {
    return next(new ErrorHandler("Room id missing", 404));
  }

  const players = await prisma.player.findMany({
    where: { gameRoomId: roomId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatarUrl: true
        }
      }
    }
  });

  if (!players) {
    return next(new ErrorHandler("No players found for this room", 404));
  }

  const playersData = players.map(player => ({
    id: player.id,
    userId: player.userId,
    username: player.user.username,
    avatarUrl: player.user.avatarUrl,
    joinedAt: player.joinedAt
  }));

  console.log(playersData)

  return res.status(200).json({
    data: playersData,
    success: true
  });
});