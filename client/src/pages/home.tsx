import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import getProfile from "@/lib/getProfile";
import { InvitePeople } from "@/components/game/invite-people.js";
import JoinRoom from "@/components/game/join-room.js";
import { FiFilm, FiPlusCircle, FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";

const Home = () => {
  const [profile, setProfile] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomName, setRoomName] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authentication-token');
        if (!token) {
          navigate('/signin');
          return; // Early return if no token
        }

        const response = await getProfile();

        if (!response || response.success === false) {
          navigate('/signin');
          return; // Early return if profile fetching fails
        }

        setProfile(response.data);
        if (!response.data) {
          navigate('/signin');
        }

        console.log(response);
      } catch (error) {
        console.log(error);
        console.error("Error fetching profile:", error);
        navigate('/signin'); // Navigate on error
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    if (profile?.id) {
      const getRooms = async () => {
        try {
          const response = await axios.get("http://localhost:3000/api/v1/room/user-room", {
            params: { userId: profile.id }, // Correctly passing userId as query parameter
          });
          console.log(response.data.data);
          setRooms(response.data.data);
        } catch (error) {
          console.error("Error fetching rooms:", error);
        }
      };

      getRooms();
    }
  }, [profile]);

  const handleCreateRoom = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/room/create-room", {
        ownerId: profile.id,
        name: roomName,
      });
      // when user create room he should also become player 
      const newRoom = response.data.data;

      //creating user as player 
      const userPlayer = await axios.post("http://localhost:3000/api/v1/player",{
        userId:profile?.id,
        gameRoomId:newRoom?.id
      })
      console.log('user become player of room',userPlayer)

      setRooms([...rooms, newRoom]);
      setRoomName(""); // Clear input field after room creation
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

   // ... (keep your existing state and useEffect logic)

   return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-zinc-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
      >
        <div className="p-6 text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Welcome to CineDraw
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Guess the movie, draw the scene, have fun!
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 p-6">
          {/* Create Room Section */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md w-full md:w-80"
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FiPlusCircle className="mr-2" /> Create a Room
            </h2>
            <Input
              type="text"
              placeholder="Enter room name"
              value={roomName}
              onChange={handleInputChange}
              className="mb-4"
            />
            <Button
              onClick={handleCreateRoom}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Create Room
            </Button>
          </motion.div>

          {/* Join Room Section */}
          {profile?.id && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md w-full md:w-80"
            >
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FiUsers className="mr-2" /> Join a Room
              </h2>
              <JoinRoom userId={profile?.id} />
            </motion.div>
          )}
        </div>

        {/* Your Rooms Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-200 dark:bg-gray-900 p-6"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FiFilm className="mr-2" /> Your Movie Rooms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <motion.div
                key={room.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center"
              >
                <Link
                  to={`/game-room/${room.id}`}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  {room.name}
                </Link>
                <InvitePeople roomId={room.id} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
