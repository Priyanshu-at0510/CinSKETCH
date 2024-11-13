import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { config } from 'dotenv';
import { errorMiddleware } from './middleware/error.js';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// importing routes
import userRoutes from './routes/user.js';
import roomRoutes from './routes/room.js';
import playerRoutes from './routes/player.js';
import guesRoutes from './routes/guess.js'
import moviesRoutes from './routes/movies.js'
import sessionRoute from './routes/session.js'

import { db } from './lib/db.js';

config({ path: './.env' });

const prisma = db
const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/room', roomRoutes);
app.use('/api/v1/player', playerRoutes);
app.use('/api/v1/guess', guesRoutes);
app.use('/api/v1/movies', moviesRoutes);
app.use('/api/v1/session', sessionRoute)

app.get('/', (req, res) => {
  res.send('Hello world!');
});

// Using error middleware
app.use(errorMiddleware);

// CORS configuration for socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`User left room: ${roomId}`);
  });

  socket.on('canvasImage', ({ roomId, canvasData }) => {
    socket.to(roomId).emit('canvasImage', canvasData);
  });

  socket.on('chatMessage', async (data) => {
    const { roomId, message, userId } = data;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        console.error('Invalid userId');
        return;
      }

      const gameRoom = await prisma.gameRoom.findUnique({
        where: { id: roomId },
      });

      if (!gameRoom) {
        console.error('Invalid gameRoomId');
        return;
      }

      const savedGuess = await prisma.guess.create({
        data: {
          content: message,
          userId,
          gameRoomId: roomId,
        },
      });

      io.to(roomId).emit('chatMessage', savedGuess);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('gameStarted', ({ roomId, sessionId }) => {
    console.log('game started on room ', roomId);
    io.to(roomId).emit('gameStarted', { roomId, sessionId });
  });

  socket.on('clearCanvas', (roomId) => {
    socket.to(roomId).emit('clearCanvas');
  });

  // New events for game play
  socket.on('startRound', async ({ roomId, sessionId }) => {
    try {
      const session = await prisma.gameSession.findUnique({
        where: { id: sessionId },
        include: { currentMovie: true, drawer: true },
      });

      if (session) {
        io.to(roomId).emit('roundStarted', {
          drawerId: session.drawerId,
          movieTitle: session?.currentMovie?.title,
          roundNumber: session.roundNumber,
        });
      }
    } catch (error) {
      console.error('Error starting round:', error);
    }
  });

  socket.on('endRound', async ({ roomId, sessionId }) => {
    try {
      const updatedSession = await prisma.gameSession.update({
        where: { id: sessionId },
        data: { roundNumber: { increment: 1 } },
        include: { currentMovie: true, drawer: true },
      });

      io.to(roomId).emit('roundEnded', {
        nextDrawerId: updatedSession.drawerId,
        roundNumber: updatedSession.roundNumber,
      });
    } catch (error) {
      console.error('Error ending round:', error);
    }
  });

  socket.on('guess', async ({ roomId, sessionId, userId, guess }) => {
    try {
      const session = await prisma.gameSession.findUnique({
        where: { id: sessionId },
        include: { currentMovie: true },
      });

      //@ts-ignore
      if (session && session.currentMovie.title.toLowerCase() === guess.toLowerCase()) {
        const updatedPlayerSession = await prisma.playerSession.updateMany({
          where: { gameSessionId: sessionId, player: { userId } },
          data: { scoreEarned: { increment: 10 } }, // Adjust score as needed
        });

        io.to(roomId).emit('correctGuess', { userId, guess });
      } else {
        io.to(roomId).emit('incorrectGuess', { userId, guess });
      }
    } catch (error) {
      console.error('Error processing guess:', error);
    }
  });


  socket.on('makeGuess', async ({ roomId, sessionId, userId, guess,message }) => {
    console.log('i ma here ')
    console.log(message)
  });
  
  socket.on('startGame', async ({ roomId }) => {
    try {
      const gameRoom = await prisma.gameRoom.findUnique({
        where: { id: roomId },
        include: { players: true },
      });
  
      if (!gameRoom) {
        console.error('Invalid game room');
        return;
      }
  
      const randomMovie = await prisma.movie.findFirst({
        orderBy: { id: 'asc' },
        skip: Math.floor(Math.random() * await prisma.movie.count()),
      });
  
      if (!randomMovie) {
        console.error('No movies available');
        return;
      }
  
      const randomDrawer = gameRoom.players[Math.floor(Math.random() * gameRoom.players.length)];
  
      const newSession = await prisma.gameSession.create({
        data: {
          status: 'IN_PROGRESS',
          gameRoomId: roomId,
          drawerId: randomDrawer.id,
          currentMovieId: randomMovie.id,
          roundNumber: 1,
        },
      });
  
      io.to(roomId).emit('gameState', { 
        drawer: randomDrawer.id, 
        started: true, 
        word: randomMovie.title,
        sessionId: newSession.id
      });
    } catch (error) {
      console.error('Error starting game:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});