import {z} from "zod"

export const usernameSchema= z.string().min(3,"username must have at least 3 characters").max(20);

export const passwordSchema= z.string()
.min(8, "Password must be between 8 and 20 characters")
.max(20)
.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
.regex(/[a-z]/, "Password must contain at least one lowercase letter")
.regex(/[0-9]/, "Password must contain at least one number")
.regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const FirstNameSchema= z.string().min(3,"FirstName must have at least 3 characters").max(20);
export const LastNameSchema= z.string().min(3,"FirstName must have at least 3 characters").max(20);

export const SignUpSchema= z.object({
    username:usernameSchema,
    password:passwordSchema,
    FirstName:FirstNameSchema,
    LastName:LastNameSchema
});

export const SignInSchema= z.object({
    username:usernameSchema,
    password:passwordSchema,
});
