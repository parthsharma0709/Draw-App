
import { RoomCanvas } from "@/app/components/RoomCanvas";


export default async function CanvasPage({params}:{params:{roomId:string}}){
    

   const {roomId} =  await params;

  console.log(roomId);

    return <div>
        <RoomCanvas roomId={roomId}/>
    </div>
}