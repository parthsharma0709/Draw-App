"use client"
import { useEffect, useRef, useState} from "react"
import { initDraw } from "../draw";

import {Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { IconButton } from "./icons";

type Shape= "circle" | "rect"| "pencil" ;

export default function Canvas({roomId,socket}:{roomId:string,socket:WebSocket}){
    const canvasRef= useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool]= useState<Shape>("circle");
  useEffect(()=>{
 //@ts-ignore
    window.selectedTool= selectedTool
  },[selectedTool])

  useEffect(()=>{
    if(canvasRef.current){
        const canvas= canvasRef.current;
        if(typeof roomId!=="string"){
         return; 
        }
        initDraw(canvas,roomId,socket);
    }

  },[canvasRef])

    return <div className="overflow-hidden static h-100vh">
    
   <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} ></canvas>
 <TopBar setSelectedTool={setSelectedTool} selectedTool= {selectedTool} />
    </div>
}

function TopBar({selectedTool,setSelectedTool}:{selectedTool:Shape,setSelectedTool:(s:Shape)=>void}){
  return (
    <div className="absolute top-0 left-0 p-3 w-full px-8 py-3 flex justify-evenly items-center bg-slate-400 shadow-md">
    
    <IconButton activated= {selectedTool==="pencil"}  icon={<Pencil/>} onClick={()=>{setSelectedTool("pencil")}}/>
    <IconButton activated={selectedTool==="rect"} icon={<RectangleHorizontalIcon/>} onClick={()=>{setSelectedTool("rect")}}/>
    <IconButton activated={selectedTool==="circle"} icon={<Circle/>} onClick={()=>{setSelectedTool("circle")}}/>
    
    
    </div>
  )
}