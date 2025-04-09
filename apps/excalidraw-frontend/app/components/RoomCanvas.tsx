import { useEffect, useState } from "react";
import { WS_URL } from "../config";
import Canvas from "./canvas";


export function RoomCanvas({roomId}:{roomId:string}){
    const [socket, setSocket]=useState<WebSocket | null>(null);

    useEffect(()=>{
        const token= localStorage.getItem("token");
        const ws= new WebSocket(`WS_URL?token=${token}`);
        ws.onopen =()=>{
            setSocket(ws);
        }
    },[]);

    if(!socket){
        return <div>
            connecting to server...
        </div>
    }
    return <div>
        <Canvas roomId={roomId}/>
    </div>
}