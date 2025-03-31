async function getChats(roomId:string) {
    const response= await fetch(`http://localhost:3001/api/v1/user/chats/${roomId}`)
    if(!response.ok){
        return null;
    }
    const data= await response.json();
    return data.texts;
    
}

export default async function ChatRoom({ params }: { params: { roomId: string } }) {
    const messages= await getChats(params.roomId)
    return (
        <div>
            <h2>Chat Room</h2>
            <ul>
                {messages && messages.length > 0 ? (
                    messages.map(msg => <li key={msg.id}>{msg.message}</li>)
                ) : (
                    <p>No messages found</p>
                )}
            </ul>
        </div>
    );
    
}