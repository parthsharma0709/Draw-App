import Canvas from "@/app/components/canvas";


export default async function CanvasPage({params}:{params:{roomId:string}}){
    

   const {roomId} =  await params;

  console.log(roomId);

    return <div>
        <Canvas roomId={roomId}/>
    </div>
}