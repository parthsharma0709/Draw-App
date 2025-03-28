import  express , {Request, Response} from "express";
const app =express();
app.use(express.json());
import { JWT_SECRET } from "@repo/backend-common/config"
import {z} from "zod"
import bcrypt from "bcrypt"
import { userAuthentication } from "./auth/user-auth";
import {SignInSchema,usernameSchema,passwordSchema,SignUpSchema,FirstNameSchema,LastNameSchema} from "@repo/common/types"

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


    

}

const SignInHandler= async (req:Request,res:Response) : Promise<void> =>{
    const validateData= SignInSchema.safeParse(req.body);
    if(!validateData.success){
        res.json({message:'please enter valid username and password to signin'});
        return;
    }


    
}

const RoomHandler= async (req:Request,res:Response) : Promise<void> =>{


    
}






app.post('/api/v1/user/signup',SignUpHandler);
app.post('/api/v1/user/signin',SignInHandler);
app.post('/api/v1/user/room',userAuthentication, RoomHandler);
app.listen(3001,()=>{
    console.log("http server is  listening on port:3001")
})