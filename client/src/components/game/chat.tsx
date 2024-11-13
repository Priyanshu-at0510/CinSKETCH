import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiSend, FiMessageSquare } from 'react-icons/fi';

const socket = io("http://localhost:3000");

interface ChatProps {
  roomId: string;
  userId: string;
  userName: string;
}

interface Message {
  content: string;
  userId: string;
  userName: string;
}

const Chat: React.FC<ChatProps> = ({ roomId, userId, userName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.emit("join-room", roomId);
    axios.get<{ data: Message[] }>(`http://localhost:3000/api/v1/guess/${roomId}`)
      .then(response => {
        setMessages(response.data.data);
        scrollToBottom();
      })
      .catch(error => console.error('Error fetching messages:', error));

    socket.on("chatMessage", (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chatMessage", { roomId, message, userId, userName });
      setMessage("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full mx-auto border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
        <FiMessageSquare className="mr-2" /> Game Chat
      </h2>
      <div className="chat-messages h-64 overflow-y-auto mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-3 rounded-lg bg-white dark:bg-gray-600 shadow-sm"
          >
            <p className="font-semibold text-gray-700 dark:text-gray-300">{msg.userName}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{msg.content}</p>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your guess..."
          className="flex-grow mr-2 bg-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors duration-200"
        >
          <FiSend className="mr-2" /> Send
        </Button>
      </div>
    </motion.div>
  );
};

export default Chat;