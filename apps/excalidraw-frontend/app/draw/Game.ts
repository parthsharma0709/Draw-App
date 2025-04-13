import { getExistingShapes } from "./getshapes"; 
import { Tool } from "../components/canvas"; 

export type Shape =
  | { type: "rect"; x: number; y: number; height: number; width: number }
  | { type: "circle"; centerX: number; centerY: number; radius: number }
  | { type: "pencil"; points: { x: number; y: number }[] }
  | { type: "line"; startX: number; startY: number; endX: number; endY: number };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private shapes: Shape[] = [];
  private roomId: string;
  private socket: WebSocket;
  private clicked = false;
  private startX = 0;
  private startY = 0;
  private selectedTool: Tool = "rect";
  private currentPencilPoints: { x: number; y: number }[] = [];

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.roomId = roomId;
    this.socket = socket;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  async init() {
    this.shapes = await getExistingShapes(this.roomId);
    this.drawAll();
  }

  setShapes(newShapes: Shape[]) {
    this.shapes = newShapes;
  }

  drawAll() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = "white";

    for (const shape of this.shapes) {
      if (shape.type === "rect") {
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "pencil") {
        const points = shape.points;
        if (points.length > 1) {
          this.ctx.beginPath();
          this.ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
          }
          this.ctx.stroke();
          this.ctx.closePath();
        }
      } else if (shape.type === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  }

  mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.startX = x;
    this.startY = y;
    if (this.selectedTool === "pencil") {
      this.currentPencilPoints = [{ x, y }];
    }
  };

  mouseUpHandler = (e: MouseEvent) => {
    if (!this.clicked) return;
    this.clicked = false;

    const rect = this.canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const width = endX - this.startX;
    const height = endY - this.startY;

    let shape: Shape | null = null;

    if (this.selectedTool === "rect") {
      shape = { type: "rect", x: this.startX, y: this.startY, width, height };
    } else if (this.selectedTool === "circle") {
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
      shape = {
        type: "circle",
        centerX: this.startX + width / 2,
        centerY: this.startY + height / 2,
        radius,
      };
    } else if (this.selectedTool === "pencil") {
      shape = { type: "pencil", points: [...this.currentPencilPoints] };
      this.currentPencilPoints = [];
    } else if (this.selectedTool === "line") {
      shape = {
        type: "line",
        startX: this.startX,
        startY: this.startY,
        endX,
        endY,
      };
    }

    if (!shape) return;

    this.shapes.push(shape);
    this.drawAll();

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({ shape }),
          roomId: this.roomId,
        })
      );
    }
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (!this.clicked) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (this.selectedTool === "pencil") {
      this.currentPencilPoints.push({ x, y });
      this.drawAll();
      this.ctx.strokeStyle = "gray";
      this.ctx.beginPath();
      const points = this.currentPencilPoints;
      if (points.length > 1) {
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          this.ctx.lineTo(points[i].x, points[i].y);
        }
        this.ctx.stroke();
        this.ctx.closePath();
      }
    } else {
      const width = x - this.startX;
      const height = y - this.startY;

      this.drawAll();
      this.ctx.strokeStyle = "gray";

      if (this.selectedTool === "rect") {
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      } else if (this.selectedTool === "circle") {
        const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
        const centerX = this.startX + width / 2;
        const centerY = this.startY + height / 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (this.selectedTool === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  };

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
  
      if (message.type === "chat") {
        const parsed = JSON.parse(message.message);
        const parsedShape = parsed.shape;
        this.shapes.push(parsedShape);
        this.drawAll();
      }
  
      if (message.type === "sync") {
        // Handle full shape list from sync payload
        const payload = message.payload;
        if (payload && Array.isArray(payload.shapes)) {
          this.setShapes(payload.shapes);
          this.drawAll();
        }
      }
    };
  }
  

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

 
}
