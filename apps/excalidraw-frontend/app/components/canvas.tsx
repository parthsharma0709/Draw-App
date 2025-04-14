"use client";

import { useEffect, useRef, useState } from "react";
import { Circle, DeleteIcon, Minus, Pencil, RectangleHorizontalIcon, Redo2, Shapes, Undo2 } from "lucide-react";
import { IconButton } from "./icons";
import { Game, Shape } from "../draw/Game";
import axios from "axios";
import { getExistingShapes } from "../draw/getshapes";

export type Tool = "circle" | "rect" | "pencil"|"line";

interface deletedProps{
  message:string,
  deleted_id :number,
  deleted_shape:Shape
}
interface chatHistory{
  count:number
}
interface ClearProps{
  message:string,
  ChatHistory:chatHistory
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
  const deletedShapeRef = useRef<Shape | null>(null);
  const undoStackRef = useRef<Shape[]>([]);
  const redoStackRef = useRef<Shape[]>([]);




  useEffect(() => {
    const savedUndo = localStorage.getItem("undoStack");
    const savedRedo = localStorage.getItem("redoStack");
  
    try {
      if (savedUndo) undoStackRef.current = JSON.parse(savedUndo);
      if (savedRedo) redoStackRef.current = JSON.parse(savedRedo);
    } catch (err) {
      console.error("Error loading undo/redo stacks:", err);
    }
  }, []);
  
  function syncUndoRedoToLocalStorage() {
    localStorage.setItem("undoStack", JSON.stringify(undoStackRef.current));
    localStorage.setItem("redoStack", JSON.stringify(redoStackRef.current));
  }
  



  // Update tool in Game when selectedTool changes

async function Undo(){
         const response= await axios.get<deletedProps>(`http://localhost:3001/api/v1/user/deleteChat/${roomId}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
         );
         if(response.data.message==="Shape deleted successfully."){
          const shapesAfterUndo:Shape[] = await getExistingShapes(roomId);
          
          deletedShapeRef.current = response.data.deleted_shape;
          undoStackRef.current.push(deletedShapeRef.current)
          syncUndoRedoToLocalStorage(); 
          console.log(deletedShapeRef.current)

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

async function  Redo() {
  const shapesBeforeRedo:Shape[] = await getExistingShapes(roomId);
  console.log(shapesBeforeRedo);
  const shapeToRedo= undoStackRef.current.pop();
  if (!shapeToRedo) {
    alert("No shape to redo");
    return;
  }
  redoStackRef.current.push(shapeToRedo!);
  syncUndoRedoToLocalStorage(); 
  
const response= await axios.post("http://localhost:3001/api/v1/user/addShape",{
  roomId,
  shapeToAdd:shapeToRedo
},{
  headers :{
    Authorization:localStorage.getItem("token")
  }
})
   console.log("added shaped is :", response.data.theShape)
  const shapesAfterRedo: Shape[] = await getExistingShapes(roomId);

  console.log(shapesAfterRedo);
  
  game?.setShapes(shapesAfterRedo);
  socket.send(JSON.stringify({
    type:"sync",
    roomId,
    payload :{
      roomId,
      shapes: shapesAfterRedo
    }
  }))
  game?.drawAll();
  
}

async function clearCanvas() {
  const response = await axios.delete<ClearProps>(`http://localhost:3001/api/v1/user/deleteChatHistory/${roomId}`, {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  });
  if(response.data.ChatHistory.count===0){
    alert("Nothing to clear");
    return;
  }
  game?.setShapes([]);  
  game?.drawAll();
  socket.send(JSON.stringify({
    type: "sync",
    roomId,
    payload: {
      roomId,
      shapes: []
    }
  }));
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
        onRedo={Redo}
        onClear={clearCanvas}
      />
    </div>
  );
}

function TopBar({
  selectedTool,
  setSelectedTool,
  onUndo,
  onRedo,
  onClear
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
  onUndo: () => void;
  onRedo:()=>void ;
  onClear:()=>void;
}) {
  return (
    <div className="absolute  top-0 left-0 w-full px-2 py-3 flex justify-between items-center bg-slate-400 shadow-md">
     <h1 className="text-2xl font-bold text-emerald-900">DrawTogether</h1>
     <div className="flex gap-20 mr-10">
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
     <div className="cursor-pointer"><IconButton activated={false} icon={<Redo2/>} onClick={onRedo}/></div>
     <div className="cursor-pointer"><IconButton activated={false} icon={<DeleteIcon/>} onClick={onClear}/> </div>
     </div>
    </div>
  );
}
