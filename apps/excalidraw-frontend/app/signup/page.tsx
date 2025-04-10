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

    return   <div className="h-screen w-screen flex justify-center items-center">
    <div className="h-[420px] w-[400px] border-2 p-2 rounded bg-slate-500 flex flex-col">
    <Input classname="p-2" type="text" placeholder="email" label={"Email"} onChange={(e) => setEmail(e.target.value)} />
    <Input classname="p-2" type="password" placeholder="password" label={"Password"} onChange={(e) => setPassword(e.target.value)}  />
    <Input classname="p-2" type="text" placeholder="Parth Sharma" label={"Name"} onChange={(e) => setName(e.target.value)}  />
    <Input classname="p-2" type="text" placeholder="https://example.com/profile.jpg" label={"Photo_URL"} onChange={(e) => setPhoto(e.target.value)}  />

<Button className="bg-black mt-6 text-white p-3 rounded" text="SignUp"  onClick={SignUpButton} />
</div>
</div>
}