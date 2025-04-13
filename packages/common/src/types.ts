import {z} from "zod";


export const emailSchema= z.string().min(12,"email must have at least 3 characters").max(50);
export const slugSchema= z.string().min(3);

export const passwordSchema= z.string()
.min(8, "Password must be between 8 and 20 characters")
.max(20)
.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
.regex(/[a-z]/, "Password must contain at least one lowercase letter")
.regex(/[0-9]/, "Password must contain at least one number")
.regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const nameSchema= z.string().min(3,"FirstName must have at least 3 characters").max(20);
const photoSchema= z.string().min(3).max(1000);


export const SignUpSchema= z.object({
    email:emailSchema,
    password:passwordSchema,
    name:nameSchema,
    photo:photoSchema
});

export const SignInSchema= z.object({
    email:emailSchema,
    password:passwordSchema,
});

export const  RoomSchema= z.object({
    slug:slugSchema

})

