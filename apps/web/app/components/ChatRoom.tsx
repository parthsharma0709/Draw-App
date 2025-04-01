import { ChatRoomClient } from "./ChatRoomClient";

async function getChats(roomId:string) {
    const response= await fetch(`http://localhost:3001/api/v1/user/chats/${roomId}`)
    if(!response.ok){
        return null;
    }
    const data= await response.json();
    return data.texts || [];
    
}

export default async function ChatRoom({ params }: { params: { roomId: string } }) {
    const roomId= params.roomId;
    const messages= await getChats(roomId)
    
    return (
        <div>
            
    <ChatRoomClient params={{
                roomId: roomId,
                messages: messages
            }} />
        </div>
    );
    
}