import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface User {
  id: string;
  userName: string;
  user: {
    username: string;
    score?: number;
  };
}

export const LeaderBoard = ({ roomId }: { roomId: string }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/v1/player/get', { roomId });
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchPlayers();

    // Set up an interval to refresh the leaderboard every 30 seconds
    const intervalId = setInterval(fetchPlayers, 30000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [roomId]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Leaderboard</h2>
      <div className="space-y-2">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex items-center justify-between"
          >
            <div className="flex items-center">
              <span className="text-lg font-semibold mr-3 text-gray-600 dark:text-gray-300">
                #{index + 1}
              </span>
              <span className="text-gray-800 dark:text-white">{user.user.username}</span>
            </div>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {user.user.score || 0} pts
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};