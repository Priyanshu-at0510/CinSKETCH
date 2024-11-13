import React, { useState, useEffect } from 'react';

interface GameStartNotificationProps {
  show: boolean;
  onClose: () => void;
}

const GameStartNotification: React.FC<GameStartNotificationProps> = ({ show, onClose }) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 3000); // Show for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg animate-bounce">
        <h2 className="text-2xl font-bold">Game Started!</h2>
        <p>Get ready to draw and guess!</p>
      </div>
    </div>
  );
};

export default GameStartNotification;