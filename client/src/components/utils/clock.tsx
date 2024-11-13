import React, { useEffect, useState } from 'react';
import { Card } from '../ui/card'; // Example import from Shadcn UI

interface CountdownTimerProps {
  isActive: boolean;
  onTimeUp: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ isActive, onTimeUp }) => {
  const [seconds, setSeconds] = useState<number>(60);

  useEffect(() => {
    if (isActive && seconds > 0) {
      const intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    } else if (seconds === 0) {
      onTimeUp();
    }
  }, [isActive, seconds, onTimeUp]);

  return (
    <Card className="max-w-xs mx-auto p-4 mt-10 bg-gray-800 text-white text-center rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2">Countdown Timer</h2>
      <div className="text-5xl">{seconds}</div>
    </Card>
  );
}

export default CountdownTimer;
