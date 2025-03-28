import express , { NextFunction, Response, Request } from "express";
import { JWT_SECRET } from "../config";
import jwt , {JwtPayload } from "jsonwebtoken"

export function userAuthentication(req:Request,res:Response,next:NextFunction){
    const token= req.headers['authorization'];
    
    if(!token){
        res.json({message:"token not received"});
        return;
    }

    try{
        const decoded= jwt.verify(token as string, JWT_SECRET) as JwtPayload;
    req.userId= decoded.userId;
    next();
    }
    catch(error){
        res.status(403).json({message:"invalid or expired token"})
    }
}