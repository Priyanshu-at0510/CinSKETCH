
import {db} from '../lib/db.js'
import { TryCatch } from "../middleware/error.js";
import ErrorHandler from "../lib/errorHandler.js";
const prisma =db

export const createMovie = TryCatch(
  async (req, res, next) => {
    const { title, releaseYear, genre, director, difficulty } = req.body;

    if (!title || !releaseYear || !genre || !director || !difficulty) {
      return next(new ErrorHandler('Bad request: missing fields', 400));
    }

    const movie = await prisma.movie.create({
      data: {
        title, releaseYear, genre, director, difficulty
      }
    });

    if (!movie) {
      return next(new ErrorHandler('Internal Error', 500));
    }

    return res.status(201).json({
      data: movie,
      success: true
    });
  }
);

export const getAllMovies = TryCatch(
  async (req, res, next) => {
    const movies = await prisma.movie.findMany();

    if (!movies || movies.length === 0) {
      return next(new ErrorHandler('No movies found', 404));
    }

    return res.status(200).json({
      data: movies,
      success: true
    });
  }
);

export const getMovieById = TryCatch(
  async (req, res, next) => {
    const { id } = req.params;

    const movie = await prisma.movie.findUnique({
      where: { id }
    });

    if (!movie) {
      return next(new ErrorHandler('Movie not found', 404));
    }

    return res.status(200).json({
      data: movie,
      success: true
    });
  }
);

export const updateMovie = TryCatch(
  async (req, res, next) => {
    const { id } = req.params;
    const { title, releaseYear, genre, director, difficulty, isActive } = req.body;

    const movie = await prisma.movie.update({
      where: { id },
      data: {
        title, releaseYear, genre, director, difficulty, isActive
      }
    });

    if (!movie) {
      return next(new ErrorHandler('Movie not found or update failed', 404));
    }

    return res.status(200).json({
      data: movie,
      success: true
    });
  }
);

export const deleteMovie = TryCatch(
  async (req, res, next) => {
    const { id } = req.params;

    const movie = await prisma.movie.delete({
      where: { id }
    });

    if (!movie) {
      return next(new ErrorHandler('Movie not found or delete failed', 404));
    }

    return res.status(200).json({
      message: 'Movie deleted successfully',
      success: true
    });
  }
);

export const assignRandomMoviesToRoom = TryCatch(
  async (req, res, next) => {
    const { roomId } = req.params;
    const { noOfMovies } = req.body;

    // Check if noOfMovies is 0 or not provided
    if (!noOfMovies || noOfMovies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot assign movies. Number of movies must be greater than 0."
      });
    }

    // Check if the room exists
    const room = await prisma.gameRoom.findUnique({
      where: { id: roomId }
    });

    if (!room) {
      return next(new ErrorHandler('Room not found', 404));
    }

    const activeMovies = await prisma.movie.findMany({
      where: { isActive: true },
      select: { id: true }
    });

    if (activeMovies.length < noOfMovies) {
      return next(new ErrorHandler('Not enough active movies in the database', 400));
    }

    const existingAssignments = await prisma.gameMovie.findMany({
      where: {
        gameRoomId: roomId,
      },
      select: {
        movieId: true
      }
    });

    if (existingAssignments.length >= noOfMovies) {
      return next(new ErrorHandler('Already movies assigned in this room', 400));
    }

    // Shuffle the array to get random movies
    const shuffledMovies = activeMovies.sort(() => 0.5 - Math.random());

    // Get the first noOfMovies from the shuffled array
    const randomMovieIds = shuffledMovies.slice(0, noOfMovies).map(movie => movie.id);

    // Fetch the details of these movies
    const randomMovies = await prisma.movie.findMany({
      where: { id: { in: randomMovieIds } },
      select: {
        id: true,
        title: true
      }
    });

    // Create GameMovie entries for these movies
    const gameMovies = await prisma.gameMovie.createMany({
      data: randomMovies.map(movie => ({
        movieId: movie.id,
        gameRoomId: roomId
      })),
      skipDuplicates: true
    });

    return res.status(200).json({
      data: {
        assignedMovies: randomMovies,
        count: gameMovies.count
      },
      success: true
    });
  }
);