import { useEffect, useState } from "react";

export function UseSocket(){
    const [loading ,setLoading]= useState(true);
    const [socket, setSocket]=useState<WebSocket>();

    useEffect(()=>{
        const token= localStorage.getItem("token")
        const ws= new WebSocket(`ws://localhost:8080?token=${token}`);
        ws.onopen=()=>{
            setLoading(false);
            setSocket(ws);
        }
    },[]);
    return {
        loading,socket
    }
}