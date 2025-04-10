"use client"
import { useEffect, useRef} from "react"
import { initDraw } from "../draw";




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

    return <div>
   <canvas ref={canvasRef} width={1530} height={715} ></canvas>
    </div>
}