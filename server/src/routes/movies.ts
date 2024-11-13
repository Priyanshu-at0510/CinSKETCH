import express, { Request, Response } from 'express';
import { createMovie, getAllMovies,
    getMovieById ,deleteMovie, updateMovie,
    assignRandomMoviesToRoom
} from '../controller/movies.js';

const router = express.Router();

router.post('/',createMovie);
router.get('/',getAllMovies);
router.get('/:id',getMovieById);
router.delete('/:id',deleteMovie);
router.put('/:id',updateMovie)

router.post('/gameRoom/:roomId',assignRandomMoviesToRoom)


export default router;
