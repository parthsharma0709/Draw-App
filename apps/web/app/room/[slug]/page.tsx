import ChatRoom from "../../components/ChatRoom";

async function getRoom(slug: string) {
    const response = await fetch(`http://localhost:3001/api/v1/user/room/${slug}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.id;
  }
  
  export default async function SlugPage({ params }: { params: { slug: string } }) {
    const roomId = await getRoom(params.slug);
  
    if (!roomId) {
      return <div>Room not found</div>;
    }
  
    return <div>
        <ChatRoom params={{
            roomId
        }}/>
    </div>;
  }
  