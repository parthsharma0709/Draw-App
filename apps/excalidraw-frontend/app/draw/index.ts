import axios from "axios";

type Shape = {
    type: "rect",
    x: number,
    y: number,
    height: number,
    width: number
} | {
    type: "circle",
    centerX: number,
    centerY: number,
    radius: number
} | {
    type: "pencil",
    startX: number,
    startY: number,
    endX: number,
    endY: number
};

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const existingShapes: Shape[] = await getExistingShapes(roomId);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "chat") {
            const parsed = JSON.parse(message.message);
            const parsedShape = parsed.shape;
            existingShapes.push(parsedShape);
            clearCanvas(existingShapes, canvas, ctx);
        }
    };

    // Initial canvas setup
    ctx.fillStyle = "rgba(0, 0, 0)";
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

        let shape: Shape | null = null;
        // @ts-ignore
        const selectedTool = window.selectedTool;

        if (selectedTool === "rect") {
            shape = {
                type: "rect",
                x: startX,
                y: startY,
                width,
                height
            };
        } else if (selectedTool === "circle") {
            const radius = Math.max(Math.abs(height), Math.abs(width)) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: startX + width / 2,
                centerY: startY + height / 2
            };
        }

        if (!shape) return;

        existingShapes.push(shape);

        if (socket.readyState === WebSocket.OPEN) {
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
            // @ts-ignore
            const selectedTool = window.selectedTool;

            if (selectedTool === "rect") {
                ctx.strokeRect(startX, startY, width, height);
            } else if (selectedTool === "circle") {
                const centerX = startX + width / 2;
                const centerY = startY + height / 2;
                const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();
            }
        }
    });
}

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.forEach((shape) => {
        if (shape.type === "rect") {
            ctx.strokeStyle = "rgba(255,255,255)";
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle" && shape.radius > 0) {
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        }
    });
}

async function getExistingShapes(roomId: string) {
    const response = await axios.get(`http://localhost:3001/api/v1/user/chats/${roomId}`);
    if (!response.data) return [];

    const messages = response.data.texts;
    const shapes = messages.map((msg: { message: string }) => {
        const messageData = JSON.parse(msg.message);
        return messageData.shape;
    });

    return shapes;
}
