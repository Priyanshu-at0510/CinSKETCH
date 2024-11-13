import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import axios from 'axios';
import { Input } from '../ui/input';
import { io } from 'socket.io-client';


const socket = io("http://localhost:3000");


function StartGame({
  userId,
  gameRoomId
}: {
  userId: string,
  gameRoomId: string
}) {
  const [room, setRoom] = useState<any>(null);
  const [currentPlayer, setCurrentPlayer] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [noOfMovies, setNoOfMovies] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const handleGetRoom = async () => {
      try {
        const response = await axios.post(`http://localhost:3000/api/v1/room/getRoom/`, {
          roomId: gameRoomId
        });
        console.log('response of room ', response.data.data);
        setRoom(response.data.data);
      } catch (error) {
        console.error('Error joining room:', error);
      }
    };

    handleGetRoom();
  }, [gameRoomId]);


  useEffect(() => {
    if (room) {
      const player = room.players.find((player: any) => player.userId === userId);
      console.log(`player is `, player);
      setCurrentPlayer(player);
    }
  }, [room, userId]);

  useEffect(() => {
    if (room && currentPlayer) {
      setIsOwner(currentPlayer.userId === room.ownerId);
    }
  }, [room, currentPlayer]);


  const handleStartGame = async () => {
    console.log('Starting game');
    if (noOfMovies <= 0) {
      alert('Please enter a valid number of movies (greater than 0).');
      return;
    }
    try {
      const roomId = gameRoomId;
      // First, assign movies to the game room
      const assignMoviesResponse = await axios.post(`http://localhost:3000/api/v1/movies/gameRoom/${roomId}`, {
        noOfMovies
      });
      console.log('Assign movies response:', assignMoviesResponse);
      
      if (assignMoviesResponse.data.success) {
        // Now, create the game sessions
        const createSessionsResponse = await axios.post(`http://localhost:3000/api/v1/session/create-multiple`, {
          gameRoomId: roomId,
          noOfSessions: noOfMovies
        });
        
        console.log(createSessionsResponse)
        if (createSessionsResponse.data.success) {
          // Notify all players that the game has started
          socket.emit('gameStarted',  roomId );

          console.log('session createdd ',createSessionsResponse)
          
          // Transition to the game play state
          setGameStarted(true);
        } else {
          alert('Failed to create game sessions: ' + (createSessionsResponse.data.message || 'Unknown error'));
        }
      } else {
        alert('Failed to assign movies: ' + (assignMoviesResponse.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

 

  return (
    <div>
      {isOwner ? (
        <div>
          {room && gameRoomId ? (
            <div className='flex'>
              <Button onClick={handleStartGame}>
                Start Game
              </Button>
              <div>
                <Input
                  onChange={(e) => setNoOfMovies(Number(e.target.value))}
                  className='max-w-20 ml-5 border border-zinc-500'
                  type='number'
                />
              </div>
            </div>
          ) : (
            <div>
              Loading .....
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Add any content or message for non-owners if needed */}
        </div>
      )}
    </div>
  );
}

export default StartGame;
