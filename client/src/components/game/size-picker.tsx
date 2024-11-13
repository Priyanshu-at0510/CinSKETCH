import { Brush } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface SizePickerProps {
    size: number;
    setSize: (size: number) => void;
}

export const SizePicker: React.FC<SizePickerProps> = ({ size, setSize }) => {
    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <button>
                        <Brush 
                            className="h-9 w-9 text-zinc-600 dark:text-zinc-100
                             hover:text-black dark:hover:text-white transition"
                         />
                    </button>
                </PopoverTrigger>

                <PopoverContent>
                    <div className="flex justify-center space-x-2">
                        <button
                            onClick={() => setSize(1)}
                            className={`px-2 ${size === 1 ? "font-bold" : ""}`}
                        >
                            Small
                        </button>

                        <button
                            onClick={() => setSize(3)}
                            className={`px-2 ${size === 3 ? "font-bold" : ""}`}
                        >
                            Medium
                        </button>

                        <button
                            onClick={() => setSize(5)}
                            className={`px-2 ${size === 5 ? "font-bold" : ""}`}
                        >
                            Large
                        </button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
