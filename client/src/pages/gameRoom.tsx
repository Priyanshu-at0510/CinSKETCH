import Board from "@/components/Board";
import { ColorPicker } from "@/components/game/color-picker";
import { SizePicker } from "@/components/game/size-picker";
import { Eraser } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import Chat from "@/components/game/chat";
import getProfile from "@/lib/getProfile";
import { LeaderBoard } from "@/components/game/leaderBoard";
import StartGame from "@/components/game/start-game";
import { motion } from "framer-motion";
import GameStartNotification from "@/components/utils/game-starter-notification";
import { SessionPlay } from "@/components/utils/session-play";

const socket = io("http://localhost:3000");

const GameRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [showGameStartNotification, setShowGameStartNotification] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [color, setColor] = useState("#aabbcc");
  const [size, setSize] = useState(5);
  const [profile, setProfile] = useState<any>(null);
  const [isDrawer, setIsDrawer] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [sessions, setSessions] = useState<any>(null);
  const [currentSession, setCurrentSession] = useState<any>(null)
  const [letPlay, setLetPlay] = useState(false)


  const navigate = useNavigate();

  // Add this useEffect for game state changes
  useEffect(() => {
    socket.on('gameState', ({ drawer, started }) => {
      setIsDrawer(drawer === profile?.id);
      setGameStarted(started);
    });

    return () => {
      socket.off('gameState');
    };
  }, [profile]);

  useEffect(() => {
    const fetchSessions = async () => {
      const sessionsResponse = await axios.get(`http://localhost:3000/api/v1/session/${roomId}`);
      if (sessionsResponse.data.data && sessionsResponse.data.data.length > 0) {
        setSessions(sessionsResponse.data.data);
        setCurrentSession(sessionsResponse.data.data[0]);
        if (sessionsResponse.data.data[0].status === 'IN_PROGRESS') {
          console.log('first session ', sessionsResponse.data.data[0])
          // initiateGameplay(sessionsResponse.data.data[0]);
          setLetPlay(true)
          //one 
          // lets make first session happen 
        }
      }
    };

    fetchSessions()


  }, [])



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
    const verifyPlayer = async () => {
      try {
        const token = localStorage.getItem("authentication-token");
        if (!token) {
          navigate("/sign-in");
          return;
        }

        const response = await axios.post("http://localhost:3000/api/v1/player/verify", {
          token,
          roomId,
        });

        if (!response.data.success) {
          navigate("/");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error verifying player:", error);
        navigate("/");
      }
    };

    verifyPlayer();
  }, [navigate, roomId]);

  useEffect(() => {
    if (isLoading) return;

    if (!roomId) return;

    // Join the room
    socket.emit("join-room", roomId);

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const startDrawing = (e: MouseEvent) => {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];

        // Emit drawing data to the server
        socket.emit("canvasImage", { roomId, canvasData: canvas?.toDataURL() });
      }
    };

    const endDrawing = () => {
      isDrawing = false;
    };

    const canvas = canvasRef.current;

    if (canvas) {
      canvas.addEventListener("mousedown", startDrawing);
      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener("mouseup", endDrawing);
      canvas.addEventListener("mouseout", endDrawing);
    }

    // Event listener for receiving canvas data from the socket
    socket.on("canvasImage", (data) => {
      const image = new Image();
      image.src = data;

      const ctx = canvas?.getContext("2d");
      image.onload = () => {
        ctx?.drawImage(image, 0, 0);
      };
    });



    socket.on('startGameForUser', () => {
      console.log('Game started notification received');
      setShowGameStartNotification(true);
    });

    socket.on("clearCanvas", () => {
      const ctx = canvas?.getContext("2d");
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });

    return () => {
      if (canvas) {
        canvas.removeEventListener("mousedown", startDrawing);
        canvas.removeEventListener("mousemove", draw);
        canvas.removeEventListener("mouseup", endDrawing);
        canvas.removeEventListener("mouseout", endDrawing);
      }
      socket.off("canvasImage");
      socket.off("clearCanvas");
      socket.emit("leave-room", roomId); // Leave the room when component unmounts
    };
  }, [color, size, roomId, isLoading]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      socket.emit("clearCanvas", roomId);
    }
  };

  const handleCloseNotification = () => {
    setShowGameStartNotification(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-gray-800 dark:text-white"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col  bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 p-4">

      <div className="flex-grow flex flex-col lg:flex-row gap-4">
        <div className="lg:w-1/5 flex flex-col">
          <LeaderBoard roomId={roomId as string} />
          <SessionPlay
            currentUserId={profile?.id}
            session={currentSession}
            socket={socket}
            roomId={roomId as string}
          />
        </div>

        <div className="lg:w-3/5 flex flex-col">
          {/* this id canvas  */}
          <div className="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <Board canvasRef={canvasRef} />

            <div className="mt-10 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex justify-center items-center space-x-4">
              <button onClick={clearCanvas} className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full transition">
                <Eraser className="h-6 w-6 text-zinc-600 dark:text-zinc-100" />
              </button>
              <SizePicker setSize={setSize} size={size} />
              <ColorPicker color={color} setColor={setColor} />
              <StartGame
                userId={profile?.id}
                gameRoomId={roomId as string}
              />
            </div>
          </div>

        </div>

        <div className="lg:w-1/5 flex flex-col">
          <Chat userName={profile?.username} userId={profile?.id} roomId={roomId as string} />

        </div>


      </div>
    </div>
  );

};

export default GameRoom;
