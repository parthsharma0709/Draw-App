import { WebSocketServer ,WebSocket} from "ws";
import { IncomingMessage } from "http";
import { parse } from "url";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config"
import { prismaClient } from "@repo/db/client";

const wss= new WebSocketServer({port:8080});


function CheckUser(token:string):string | null {
    const decoded= jwt.verify(token , JWT_SECRET) as JwtPayload;

    if(!decoded || !(decoded as JwtPayload).userId){
        return null;
    }
    return decoded.userId;

}

// ugly way to state management
interface User {
    ws:WebSocket,
    rooms:string[],
    userId: string
}

const users:User[]=[];
//

wss.on('connection',function connection(ws, req:IncomingMessage){
   
    const url= req.url;
    if(!url){
        return;
    }
    const { query } = parse(url, true);

    const token = query.token?.toString();
    if(!token){
        console.error("token is missing")
        return;
    }
         
    const userId= CheckUser(token);
    if(!userId){
        ws.close();
        return;
    }

    users.push({
        userId,
        rooms:[],
        ws
    })


    ws.on('message',async function message(data){
       
         const paredData= JSON.parse(data.toString());

         if(paredData.type==="join_room"){
            const user= users.find(x=>x.ws===ws);
            if (!user) {
                console.log("User not found!");
                return;
            }
        
        
            if (!user.rooms.includes(paredData.roomId)) {
                user.rooms.push(paredData.roomId);
                console.log(`${user.userId} joined room: ${paredData.roomId}`);
            }
         }

         if(paredData.type==="leave_room"){
            const user= users.find(x=>x.ws===ws);
            if(!user){
                return;
            }
            user.rooms = user.rooms.filter(room => room !== paredData.roomId);

         }

         if(paredData.type==="chat"){
            const roomId= paredData.roomId;
            const message= paredData.message;
             
            await prismaClient.chat.create({
                data:{
                    roomId,
                    message,
                    userId
                }
            });


            users.forEach(user =>{
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type:"chat",
                        message:message,
                        roomId
                    }))
                }
            })
         }


    });
});