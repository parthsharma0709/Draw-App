"use client"
import { useEffect, useRef} from "react"
import { initDraw } from "../draw";

import {Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { IconButton } from "./icons";


export default function Canvas({roomId,socket}:{roomId:string,socket:WebSocket}){
    const canvasRef= useRef<HTMLCanvasElement>(null);
  

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
 <TopBar/>
    </div>
}

function TopBar(){
  return (
    <div className="absolute top-0 left-0 p-3 w-full px-8 py-3 flex justify-evenly items-center bg-slate-400 shadow-md">
    
    <IconButton icon={<Pencil/>} onClick={()=>{}}/>
    <IconButton icon={<RectangleHorizontalIcon/>} onClick={()=>{}}/>
    <IconButton icon={<Circle/>} onClick={()=>{}}/>
    
    
    </div>
  )
}