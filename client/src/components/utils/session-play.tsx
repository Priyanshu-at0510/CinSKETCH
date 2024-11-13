import { useEffect, useState } from "react";
import { session } from "@/lib/types";
import { Button } from "../ui/button";
import CountdownTimer from "../utils/clock";
import { Socket } from "socket.io-client";

interface sessionPlayProps {
    session: session & {
        currentMovie: {
            title: string,
            difficulty: string,
            genre: string[]
        }
    };
    currentUserId: string;
    socket: Socket;
    roomId: string;
}

const transformMovieTitle = (title: string): string => {
  return title.toLowerCase().replace(/\s+/g, '');
};

export const SessionPlay = ({
    session,
    currentUserId,
    socket,
    roomId
}: sessionPlayProps) => {

    const [isDrawer, setIsDrawer] = useState(false);
    const [isTimerActive, setIsTimerActive] = useState(false);
    let [currentWord, setCurrentWord] = useState("");

    const sessionMovie = session.currentMovie.title;
     currentWord = transformMovieTitle(sessionMovie);
    

    useEffect(() => {
        const drawerId = session?.drawerId;
        setIsDrawer(drawerId === currentUserId);

        socket.on('gameState', ({ drawer, word }) => {
            setIsDrawer(drawer === currentUserId);
            if (drawer === currentUserId) {
                setCurrentWord(word || sessionMovie);
            }
        });

        return () => {
            socket.off('gameState');
        };
    }, [session, currentUserId, socket, sessionMovie]);

    const handleStartSession = () => {
        socket.emit('startGame', { roomId });
        setIsTimerActive(true);
    }

    const handleTimeUp = () => {
        console.log("Time's up!");
        socket.emit('endRound', { roomId });
        setIsTimerActive(false);
    }

    const handleGuess = (guess: string) => {
        if(guess === currentWord){
            socket.emit('makeGuess', { roomId, userId: currentUserId, guess,message:"correct guess"});

            alert('correct guess ')
        }else{
            socket.emit('makeGuess', { roomId, userId: currentUserId, guess,message:"wrong guess"});

        }

    };

    return (
        <div className="mt-10">
            <CountdownTimer isActive={isTimerActive} onTimeUp={handleTimeUp} />
            
            {isDrawer ? (
                <div>
                    <p>You are the drawer for this round</p>
                    <p>Your word is: {currentWord}</p>
                    <Button onClick={handleStartSession}>Start drawing</Button>
                </div>
            ) : (
                <div>
                    <p>You will guess</p>
                    <input 
                        type="text" 
                        placeholder="Enter your guess"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleGuess(e.currentTarget.value);
                                e.currentTarget.value = '';
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
}