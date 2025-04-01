"use client";

import { useEffect, useState } from "react";
import { UseSocket } from "../hooks/useSocket";

export function ChatRoomClient({ params }: { params: { roomId: string; messages: { message: string }[] } }) {
    const { socket, loading } = UseSocket();
    const [chats, setChats] = useState(params.messages); 
    const [currentMessage, setCurrentMessage] = useState("");

   
    useEffect(() => {
        setChats(params.messages);
    }, [params.messages]);

    useEffect(() => {
        if (socket && !loading) {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: "join_room", roomId: params.roomId }));
            }

          
            socket.onmessage = (event: MessageEvent) => {
                const parsedData = JSON.parse(event.data);
                if (parsedData.type === "chat") {
                    setChats(prevChats => [...prevChats, { message: parsedData.message }]);
                }
            };

        
            return () => {
                socket.onmessage = null;
            };
        }
    }, [socket, loading, params.roomId]);

    
    const sendMessage = () => {
        if (socket && socket.readyState === WebSocket.OPEN && currentMessage.trim()) {
            socket.send(JSON.stringify({ type: "chat", roomId: params.roomId, message: currentMessage }));
            setCurrentMessage(""); 
        }
    };

    return (
        <div>
            {chats.map((m, index) => (
                <div key={index}>{m.message}</div>
            ))}
            <input 
                type="text" 
                placeholder="Enter messages" 
                value={currentMessage} 
                onChange={(e) => setCurrentMessage(e.target.value)} 
            />
            <button onClick={sendMessage}>Send Message</button>
        </div>
    );
}
