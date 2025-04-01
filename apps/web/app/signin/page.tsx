"use client"
import axios from "axios";
import { useRef } from "react"

export default function SignIn(){
    
    const emailRef= useRef<HTMLInputElement>(null);
    const passwordRef= useRef<HTMLInputElement>(null);
   


     async function SignInButton(){
        const email= emailRef.current?.value;
        const password= passwordRef.current?.value;
      

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

    return <div style={{width:"100vw", height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
              <div style={{display:"flex", flexDirection:"column", width:"500px",height:'500px', gap:"10px", border:"1px solid black", padding:"4px"}}>
        <input ref={emailRef} type="text" placeholder="email" style={{padding:"4px"}} />
        <input ref={passwordRef} type="password" placeholder="password" style={{padding:"4px"}} />
       
        <button style={{padding:"4px"}} onClick={SignInButton} >SignIN</button>
    </div>
    </div>
}