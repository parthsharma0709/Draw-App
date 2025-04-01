import  express , {Request, Response} from "express";
const app =express();
app.use(express.json());
import { JWT_SECRET } from "@repo/backend-common/config"
import {z} from "zod"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { userAuthentication } from "./auth/user-auth";
import {SignInSchema,emailSchema,passwordSchema,SignUpSchema,nameSchema,RoomSchema} from "@repo/common/types"
import {prismaClient} from "@repo/db/client"
import cors from "cors";

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

const hashPassword= async(password:string): Promise<string> =>{
    const saltRound= 10;
    return await bcrypt.hash(password, saltRound);
}

const SignUpHandler= async (req:Request,res:Response) : Promise<void> =>{
     const validateData= SignUpSchema.safeParse(req.body);
     if(!validateData.success){
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
        take:50
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


app.post('/api/v1/user/signup',SignUpHandler);
app.post('/api/v1/user/signin',SignInHandler);
app.post('/api/v1/user/room',userAuthentication, RoomHandler);
app.get('/api/v1/user/chats/:roomId' ,messageHandlers);
app.get('/api/v1/user/room/:slug',  getIdHandler)
app.listen(3001,()=>{
    console.log("http server is  listening on port:3001")
})