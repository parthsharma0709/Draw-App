import { WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import { parse } from "url";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config"

const wss= new WebSocketServer({port:8080});


wss.on('connection',function connection(ws, req:IncomingMessage){
   
    const url= req.url;
    if(!url){
        return;
    }
    const { query } = parse(req.url!, true);
    const token = query.token as string;

    const decoded= jwt.verify(token as string, JWT_SECRET) as JwtPayload;
         
    if(!decoded || !(decoded as JwtPayload).userId){
        ws.close();
        return;
    }

    ws.on('message', function message(data){
        ws.send("pong");
    });
});