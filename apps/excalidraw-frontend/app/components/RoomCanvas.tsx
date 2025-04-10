"use client"

import { useEffect, useState } from "react";
import { WS_URL } from "../config";
import Canvas from "./canvas";


export function RoomCanvas({roomId}:{roomId:string}){
    const [socket, setSocket]=useState<WebSocket | null>(null);

    useEffect(()=>{
        const token= localStorage.getItem("token");
        const ws= new WebSocket(`ws://localhost:8080?token=${token}`);
        ws.onopen =()=>{
            setSocket(ws);
            ws.send(JSON.stringify({
                type:"join_room",
                roomId:roomId
            }))
        }
    },[]);

    if(!socket){
        return <div>
            connecting to server...
        </div>
    }
    return <div>
        <Canvas roomId={roomId} socket={socket}/>
    </div>
}