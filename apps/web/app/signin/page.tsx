"use client"
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input-box";
import axios from "axios";
import { useState } from "react"

export default function SignIn(){
    
    const [email,setEmail]= useState("");
        const [password,setPassword]= useState("");


     async function SignInButton(){
        
      

        try{
            const response= await axios.post("http://localhost:3001/api/v1/user/signin",{
                email,
                password,
               
            });
            localStorage.setItem("token",response.data.token)
            alert("signed in successfully")
        }
        catch(error){
            console.error("error while signup",error)
        }
      
    }

    return <div>
              <div>
              <Input  type="text" placeholder="email" label={"Email"} onChange={(e) => setEmail(e.target.value)} />
              <Input  type="password" placeholder="password" label={"Password"} onChange={(e) => setPassword(e.target.value)}  />
       
        <Button text="SignIn" onClick={SignInButton} />
    </div>
    </div>
}