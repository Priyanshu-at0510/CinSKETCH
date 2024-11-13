import { HexColorPicker } from "react-colorful";
import { Palette } from "lucide-react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


interface ColorPickerProps {
    color: string;
    setColor: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, setColor }) => {
    return (

        <TooltipProvider >
            <Tooltip >
                <TooltipTrigger >
                    <Popover>
                        <PopoverTrigger>
                            <Palette className="text-rose-500 h-9 w-9 hover:text-rose-800" />
                        </PopoverTrigger>

                        <PopoverContent >
                            <HexColorPicker color={color} onChange={setColor} />
                        </PopoverContent>
                    </Popover>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Pick color for brush.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

    )
}

