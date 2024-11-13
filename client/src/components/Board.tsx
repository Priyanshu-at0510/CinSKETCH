import React, { ForwardedRef } from 'react';

interface BoardProps {
  canvasRef: ForwardedRef<HTMLCanvasElement>;
}


const Board: React.FC<BoardProps> = ({ canvasRef }) => {
  

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className='bg-slate-200 dark:bg-slate-800'
    />
  );
};

export default Board;
