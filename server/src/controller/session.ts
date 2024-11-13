import ErrorHandler from "../lib/errorHandler.js";
import { TryCatch } from "../middleware/error.js";
import { db } from "../lib/db.js";
import { date } from "zod";

export const createSession = TryCatch(
    async(req,res,next)=>{
        const {
            gameRoomId, currentMovieId, drawerId , 
            roundNumber 
        } = req.body 

        if(!gameRoomId  && !currentMovieId && !drawerId
            && !roundNumber
        ){
            return next(new ErrorHandler('Bad request ',404))
        }

        const session = await db.gameSession.create({
            data:{
                gameRoomId, currentMovieId, 
                drawerId ,roundNumber
            }
        })

        if(!session){
            return next(new ErrorHandler('Internal server error ',500))
        }

        return res.status(200).json({
            success:true,
            data:session
        })
    }
)


export const createMultipleSessions = TryCatch(async (req, res, next) => {
    const { gameRoomId, noOfSessions } = req.body;
  
    if (!gameRoomId || !noOfSessions) {
      return next(new ErrorHandler('Bad request', 400));
    }
  
    // Fetch the assigned movies for this game room
    const assignedMovies = await db.gameMovie.findMany({
      where: { gameRoomId },
      select: { movieId: true },
      take: noOfSessions
    });
  
    if (assignedMovies.length < noOfSessions) {
      return next(new ErrorHandler('Not enough movies assigned to this game room', 400));
    }
  
    // Fetch players in the game room
    const players = await db.player.findMany({
      where: { gameRoomId },
      select: { userId: true }
    });
  
    if (players.length < 2) {
      return next(new ErrorHandler('Not enough players in the room', 400));
    }
  
    // Create sessions
    const sessions = [];
    for (let i = 0; i < noOfSessions; i++) {
      const drawerIndex = i % players.length;
      const session = await db.gameSession.create({
        data: {
          gameRoomId,
          currentMovieId: assignedMovies[i].movieId,
          drawerId: players[drawerIndex].userId,
          roundNumber: i + 1
        }
      });
      sessions.push(session);
    }
  
    return res.status(200).json({
      success: true,
      data: sessions
    });
});

export const getSessionOfRoom = TryCatch(
  async(req,res,next)=>{
    const { roomId } = req.params;
    if(!roomId){
      return next(new ErrorHandler('Bad Request',404))
    }

    const sessions = await db.gameSession.findMany({
      where:{
        gameRoomId:roomId
      },
      include:{
        currentMovie:true
      }
    
    })

    return res.status(200).json({
      data:sessions ,
      success:true
    })
  }
)

