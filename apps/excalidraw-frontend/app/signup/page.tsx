"use client"
import {Button} from "@repo/ui/button"
import {Input} from "@repo/ui/input-box"
import { useRef } from "react";

export default function SignUp(){
  const emailRef= useRef<HTMLInputElement>(null);
  const passwordRef= useRef<HTMLInputElement>(null);
  const nameRef= useRef<HTMLInputElement>(null);
  const photoRef= useRef<HTMLInputElement>(null);


   async function SignUpButton(){
      const email= emailRef.current?.value;
      const password= passwordRef.current?.value;
      const name= nameRef.current?.value;
      const photo= photoRef.current?.value;

      try{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    return <div className="w-screen h-screen bg-slate-500 flex justify-center items-center">
      <div className="flex flex-col w-[400px] h-[480px] bg-white rounded border-2">
      <h1 className="text-2xl text-center text-black font-sans p-2">Sign Up</h1>
      <div className="p-3 flex flex-col gap-3">
      <Input ref={emailRef} label={"Email"} type={"text"} placeholder={"05sharmaparth@gmail.com"} classname="p-2 text-black rounded border-2"/>
      <Input ref={passwordRef} label={"Password"} type={"password"} placeholder={"Parth@12345"} classname="p-2 text-black rounded border-2"/>
      <Input ref={nameRef} label={"Name"} type={"text"} placeholder={"Parth Sharma"} classname="p-2 text-black rounded border-2"/>
    
     <Input ref={photoRef} label={"Photo-URL"} type={"text"} placeholder={"http://example/profile.jpg"} classname="p-2 border-2 rounded text-black"/>
       
        <Button text={"Sign Up"} onClick={SignUpButton } className="bg-black text-white p-3 rounded font-sans  cursor-pointer"/>
               
      </div>
      </div>
    </div>

       
       

  
}