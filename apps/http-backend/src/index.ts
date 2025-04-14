import  express , {Request, response, Response} from "express";
const app =express();
app.use(express.json());
import { JWT_SECRET } from "@repo/backend-common/config"
import {string, z} from "zod"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { userAuthentication } from "./auth/user-auth";
import {SignInSchema,emailSchema,passwordSchema,SignUpSchema,nameSchema,RoomSchema} from "@repo/common/types"
import {prismaClient} from "@repo/db/client"
import cors from "cors";

app.use(cors({
    origin: function (origin, callback) {
      if (!origin || origin.startsWith('http://localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    // other options...
  }));
  

const hashPassword= async(password:string): Promise<string> =>{
    const saltRound= 10;
    return await bcrypt.hash(password, saltRound);
}

const SignUpHandler= async (req:Request,res:Response) : Promise<void> =>{
     const validateData= SignUpSchema.safeParse(req.body);
     if(!validateData.success){
        console.log(validateData.error.flatten());
        res.status(403).json({message:"Please enter valid Credintials"});
        return;
     }
     const hashedpassword= await hashPassword(validateData.data.password);

    const user= await prismaClient.user.findUnique({
        where:{
            email:validateData.data.email
        }
    })
    if(user){
        res.json({
            message:"User with this email already exist, Please signin or Continue with a new email-id"
        });
        return;
    }

    const newUser= await prismaClient.user.create({
        data:{
            email:validateData.data.email,
            password:hashedpassword,
            name:validateData.data.name,
            photo:validateData.data.photo
        }
    });

    if(!newUser){
        res.json({message:"something went wrong"});
        return;
    }
  
        res.status(201).json({message:"you have signed up successfully"})
    
}

const SignInHandler= async (req:Request,res:Response) : Promise<void> =>{
    const validateData= SignInSchema.safeParse(req.body);
    if(!validateData.success){
        res.json({message:'please enter valid email and password to signin'});
        return;
    }

    const existingUser= await prismaClient.user.findUnique({
        where : { email: validateData.data.email}
    });
    if(!existingUser || !( await bcrypt.compare(validateData.data.password, existingUser.password))){
        res.status(403).json({message:"invalid email or password "});
        return;
    }
   const token = jwt.sign({userId:existingUser.id}, JWT_SECRET, {expiresIn:"1h"})

   res.status(201).json({message:"user have successfully signed up", token:token})

    
}

const RoomHandler= async (req:Request,res:Response) : Promise<void> =>{
                
  const validateData= RoomSchema.safeParse(req.body);
  if(!validateData.success){
    res.status(403).json({message:"enter a valid slug"});
    return;
  }
  const userId= req.userId;
  if(!userId){
    res.json({message:"userId not found it's required"});
    return;
  }

  try{
    const room= await prismaClient.room.create({
        data:{
            slug:validateData.data.slug,
            adminId:userId
        }
      });
    
      res.status(201).json({message:"slug and room has created", roomId:room.id});
  }catch(error){
    res.status(411).json({message:"room already exist with this slug , please continue with a different slug"})
  }
    
}

const messageHandlers= async (req:Request,res:Response):Promise<void> =>{

    const roomId= Number(req.params.roomId);
 
    const yourMessages= await prismaClient.chat.findMany({
        where:{
            roomId
        },
        orderBy:{
            id:"desc"
        },
        take:1000
    });
    
    res.json({messages:"here are your messages", "texts": yourMessages})

}

const getIdHandler= async (req:Request, res:Response):Promise<void> =>{
    const slug= req.params.slug;
    const room= await prismaClient.room.findFirst({
        where:{
            slug
        }
    });
    if(!room){
        res.json({message:"room with this slug doesn't exists"});
        return;
    }

    res.status(201).json({id:room.id})
}


const getDetailsHandler = async(req:Request,res:Response):Promise<void> =>{
    const userId =req.userId;
    const user= await prismaClient.user.findUnique({
        where :{id:userId}
    });
    if(!user){
        return;
    }
    res.status(200).json({
        message:"here is your user details ",
        name:user.name,
        email:user.email,
        photo_url:user.photo
    })
}

const UserRoomsHandler= async (req:Request,res:Response):Promise<void> =>{
    const adminId= req.userId;
    const filter= req.query.filter?.toString() || " ";
    const Rooms= await prismaClient.room.findMany({
        where:{adminId:adminId,
            slug:{
                contains:filter,
                mode:"insensitive"
            }
        }

    });
    if(!Rooms){
        return;
    }
    res.status(200).json({
        message:"here are your rooms ",
        rooms:Rooms
    })
}
const removeRecentShapeHandler = async (req: Request, res: Response): Promise<void> => {
    const roomId = Number(req.params.roomId);
  
    try {
      const response = await prismaClient.chat.findFirst({
        where: { roomId },
        orderBy: { id: "desc" },
      });
  
      const shapeId = response?.id;
  
      if (!shapeId) {
        res.status(404).json({ message: "No shape found to delete." });
        return;
      }
  
      // Check again if the record exists (extra safety)
      const existingShape = await prismaClient.chat.findUnique({
        where: { id: shapeId },
      });
  
      if (!existingShape) {
         res.status(404).json({ message: "Shape already deleted." });
         return ;
      }
  
      await prismaClient.chat.delete({
        where: { id: shapeId },
      });
  
      res.json({
        message: "Shape deleted successfully.",
        deleted_id: shapeId,
        deleted_shape:JSON.parse(existingShape.message).shape
      });
    } catch (error) {
      console.error("Error in removeRecentShapeHandler:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };

  const addShapeHandler= async (req:Request,res:Response):Promise<void> =>{
    const roomId= Number(req.body.roomId);
    const shapeToAdd= JSON.stringify({ shape: req.body.shapeToAdd });
    
    const room= await prismaClient.room.findUnique({
        where: {id:roomId}
    });
    if(!room){
        res.json({message:"Room with this roomId doesn't exists"});
        return;
    }
    const userId= room.adminId;
   try{
    const addedShape= await prismaClient.chat.create({
        data:{
            userId:userId,
            roomId:roomId,
            message:shapeToAdd
        }
    })
    res.json({message:"shape added successfully",
        addedShape:addedShape,
        theShape:JSON.parse(addedShape.message).shape
    })
   }
   catch(error){
    console.error("Error in adding shape", error);
    res.status(500).json({message:"Shape not added"})
   }

  }

  const ClearChatHandler= async (req:Request, res:Response):Promise<void> =>{
    const roomId= Number(req.params.roomId);
    if(!roomId){
        res.json({message:"roomId doesn't received"});
        return;
    }
   try{
    const deleteChat= await prismaClient.chat.deleteMany({
        where:{roomId:roomId}
    });
    res.json({
        message:"Chat History deleted",
        ChatHistory:deleteChat
    })
   }
   catch(error){
    console.error("Error during chat deletion", error);
    res.status(500).json({message:"chat not deleted at all"})
   }
    
  }
  

app.post('/api/v1/user/signup',SignUpHandler);
app.post('/api/v1/user/signin',SignInHandler);
app.post('/api/v1/user/room',userAuthentication, RoomHandler);
app.get('/api/v1/user/chats/:roomId' , userAuthentication,messageHandlers);
app.get('/api/v1/user/room/:slug', userAuthentication,  getIdHandler);
app.get('/api/v1/user/userDetails',userAuthentication,getDetailsHandler);
app.get('/api/v1/user/existingRooms', userAuthentication,UserRoomsHandler)
app.get('/api/v1/user/deleteChat/:roomId',userAuthentication,removeRecentShapeHandler);
app.post('/api/v1/user/addShape',userAuthentication,addShapeHandler);
app.delete('/api/v1/user/deleteChatHistory/:roomId',userAuthentication,ClearChatHandler)
app.listen(3001,()=>{
    console.log("http server is  listening on port:3001")
})