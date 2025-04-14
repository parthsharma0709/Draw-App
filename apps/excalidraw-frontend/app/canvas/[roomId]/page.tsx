
import { RoomCanvas } from "@/app/components/RoomCanvas";
import { Suspense } from "react";
import Loading from "./loading";


export default async function CanvasPage({params}:{params:{roomId:string}}){
    

   const {roomId} =  await params;

  console.log(roomId);

    return <div>
        <Suspense fallback={<Loading/>}>
        <RoomCanvas roomId={roomId}/>
        </Suspense>
        
    </div>
}