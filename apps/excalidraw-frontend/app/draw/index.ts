import axios from "axios";
type Shape={
   type:"rect",
   x:number,
   y:number,
   height:number,
   width:number
} | {
    type:"circle",
    centerX:number,
    centerY:number,
    radius:number
}

// interface ChatMessage {
//     message: Shape;
    
//   }
  
//   interface ChatResponse {
//     messages: string;
//     texts: ChatMessage[];
//   }
  


export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const existingShapes: Shape[] = await getExistingShapes(roomId);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return;
    }

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "chat") {
            const parsedShape = JSON.parse(message.message);
            existingShapes.push(parsedShape);
            clearCanvas(existingShapes, canvas, ctx);
        }
    }

    clearCanvas(existingShapes, canvas, ctx);
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    clearCanvas(existingShapes, canvas, ctx);
    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const height = e.clientY - startY;
        const width = e.clientX - startX;
        const shape: Shape = {
            type: "rect",
            x: startX,
            y: startY,
            width,
            height
        };
        existingShapes.push(shape);

        // Check WebSocket state before sending
        if (socket.readyState === WebSocket.OPEN) {
            console.log("message is sending")
            socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify({ shape }),
                roomId
                   
            }));
        } else {
            console.warn("WebSocket is not open, cannot send message");
        }
    });

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const height = e.clientY - startY;
            const width = e.clientX - startX;

            clearCanvas(existingShapes, canvas, ctx);
            ctx.strokeStyle = "rgba(255,255,255)";
            ctx.strokeRect(startX, startY, width, height);
        }
    });
}



function clearCanvas(existingShapes:Shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = "rgba(0, 0, 0)"; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            existingShapes.map((shape)=>{
                if(shape.type==="rect"){
                    ctx.strokeStyle="rgba(255,255,255)";
                    ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)
                }
            })
}

async function getExistingShapes(roomId:string){
    const response = await axios.get(`http://localhost:3001/api/v1/user/chats/${roomId}`);

    if (!response.data) {
        return;
    }


    const messages= response.data.texts;
    const shapes= messages.map((msg: { message: string; })=>{
        const messageData= JSON.parse(msg.message);
        return messageData.shape;
    });
    return shapes;

}