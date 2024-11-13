import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogIn } from 'react-icons/fi';

interface JoinRoomProps {
  userId: string;
}

function JoinRoom({ userId }: JoinRoomProps) {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');

  const handleJoinRoom = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/player', {
        userId,
        gameRoomId: roomId,
      });

      if (response.data.success) {
        console.log('Joined room successfully');
        navigate(`game-room/${roomId}`);
      }
    } catch (error) {
      console.error('Error joining room:', error);
      // Handle error (e.g., display an error message to the user)
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FiLogIn className="mr-2" /> Enter Room Code
      </h3>
      <Input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Room Code"
        className="mb-4"
      />
      <Button
        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        onClick={handleJoinRoom}
      >
        Join Room
      </Button>
    </motion.div>
  );
}

export default JoinRoom;