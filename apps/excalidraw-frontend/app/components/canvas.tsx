"use client";

import { useEffect, useRef, useState } from "react";
import { Circle, Minus, Pencil, RectangleHorizontalIcon, Shapes, Undo2 } from "lucide-react";
import { IconButton } from "./icons";
import { Game, Shape } from "../draw/Game";
import axios from "axios";
import { getExistingShapes } from "../draw/getshapes";

export type Tool = "circle" | "rect" | "pencil"|"line";

interface deletedProps{
  message:string,
  deleted_id :number
}

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");
  const [game, setGame] = useState<Game>();

  // Update tool in Game when selectedTool changes

async function Undo(){
         const response= await axios.get<deletedProps>(`http://localhost:3001/api/v1/user/deleteChat/${roomId}`);
         if(response.data.message==="Shape deleted successfully."){
          const shapesAfterUndo:Shape[] = await getExistingShapes(roomId);
          game?.setShapes(shapesAfterUndo);
          socket.send(JSON.stringify({
            type:"sync",
            roomId,
            payload :{
              roomId,
              shapes: shapesAfterUndo
            }
          }))
          game?.drawAll();
         }
}

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  // Initialize Game when canvas is ready
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      if (typeof roomId !== "string") return;

      const g = new Game(canvas, roomId, socket);
      setGame(g);

      return () => {
        g.destroy();
      };
    }
  }, [canvasRef]);

  return (
    <div className="overflow-hidden static h-100vh">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
      <TopBar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        onUndo={Undo}
      />
    </div>
  );
}

function TopBar({
  selectedTool,
  setSelectedTool,
  onUndo,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
  onUndo: () => void;
}) {
  return (
    <div className="absolute  top-0 left-0 w-full px-8 py-3 flex justify-evenly items-center bg-slate-400 shadow-md">
     
     <div className="cursor-pointer"> <IconButton 
        activated={selectedTool === "pencil"}
        icon={<Pencil />}
        onClick={() => setSelectedTool("pencil")}
      /></div>

     <div className="cursor-pointer">
     <IconButton
        activated={selectedTool === "rect"}
        icon={<RectangleHorizontalIcon />}
        onClick={() => setSelectedTool("rect")}
      />
     </div>
      
      <div className="cursor-pointer">
      <IconButton
        activated={selectedTool === "circle"}
        icon={<Circle />}
        onClick={() => setSelectedTool("circle")}
      />
      </div>
      <div className="cursor-pointer">
      <IconButton activated={selectedTool==="line"} icon={<Minus/>} onClick={()=>{setSelectedTool("line")}}/>
     </div>
     <div className="cursor-pointer">
     <IconButton activated={false} icon={<Undo2 />} onClick={onUndo} />

     </div>
     
    </div>
  );
}
