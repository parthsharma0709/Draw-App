import  express , {Request, Response} from "express";
const app =express();
app.use(express.json());
import { JWT_SECRET } from "./config";
import {z} from "zod"
import bcrypt from "bcrypt"
import { userAuthentication } from "./auth/user-auth";

const usernameSchema= z.string().min(3,"username must have at least 3 characters").max(20);
const passwordSchema= z.string()
.min(8, "Password must be between 8 and 20 characters")
.max(20)
.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
.regex(/[a-z]/, "Password must contain at least one lowercase letter")
.regex(/[0-9]/, "Password must contain at least one number")
.regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

const FirstNameSchema= z.string().min(3,"FirstName must have at least 3 characters").max(20);
const LastNameSchema= z.string().min(3,"FirstName must have at least 3 characters").max(20);

const SignUpSchema= z.object({
    username:usernameSchema,
    password:passwordSchema,
    FirstName:FirstNameSchema,
    LastName:LastNameSchema
});

const SignInSchema= z.object({
    username:usernameSchema,
    password:passwordSchema,
});

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