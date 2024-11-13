import { Copy, User } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { motion } from 'framer-motion';

interface InvitePeopleProps {
  roomId: string;
}

export const InvitePeople = ({ roomId }: InvitePeopleProps) => {
  const inviteCode = roomId;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Popover>
            <PopoverTrigger>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <User className="h-6 w-6 text-blue-500 hover:text-blue-600" />
              </motion.div>
            </PopoverTrigger>
            <PopoverContent className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-semibold mb-4">Invite Friends</h3>
                <div className="flex items-center space-x-2">
                  <Input value={inviteCode} readOnly className="flex-grow" />
                  <Button
                    onClick={handleCopy}
                    className={`p-2 ${
                      copied
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                  >
                    {copied ? 'Copied!' : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </motion.div>
            </PopoverContent>
          </Popover>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-gray-800 text-white p-2 rounded">
          <p>Invite people to room</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};