"use client"
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input-box";
import axios from "axios";
import { useState } from "react"

export default function SignUp(){
    
    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");
    const [name, setName]= useState("");
    const [photo, setPhoto]= useState("");

     async function SignUpButton(){
      

        try{
            
            const response= await axios.post("http://localhost:3001/api/v1/user/signup",{
                email,
                password,
                name,
                photo
            });
            alert("signed up successfully")
        }
        catch(error){
            console.error("error while signup",error)
        }
      
    }

    return <div style={{width:"100vw", height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
              <div>
        <Input  type="text" placeholder="email" label={"Email"} onChange={(e) => setEmail(e.target.value)} />
        <Input  type="password" placeholder="password" label={"Password"} onChange={(e) => setPassword(e.target.value)}  />
        <Input  type="text" placeholder="name" label={"Name"} onChange={(e)=>setName(e.target.value)}  />
        <Input  type="text" placeholder="photo_url" label={"Photo_URL"} onChange={(e)=>setPhoto(e.target.value)} />
        <Button text="SignUp" onClick={SignUpButton} />
    </div>
    </div>
}