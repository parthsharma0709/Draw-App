"use client"
import {Button} from "@repo/ui/button"
import {Input} from "@repo/ui/input-box"

export default function SignUp(){
    
    return <div className="w-screen h-screen bg-slate-500 flex justify-center items-center">
      <div className="flex flex-col w-[400px] h-[480px] bg-white rounded border-2">
      <h1 className="text-2xl text-center text-black font-sans p-2">Sign Up</h1>
      <div className="p-3 flex flex-col gap-3">
      <Input label={"Email"} type={"text"} placeholder={"05sharmaparth@gmail.com"} classname="p-2 text-black rounded border-2"/>
      <Input label={"Password"} type={"password"} placeholder={"Parth@12345"} classname="p-2 text-black rounded border-2"/>
      <Input label={"Name"} type={"text"} placeholder={"Parth Sharma"} classname="p-2 text-black rounded border-2"/>
    
     <Input label={"Photo-URL"} type={"text"} placeholder={"http://example/profile.jpg"} classname="p-2 border-2 rounded text-black"/>
       
        <Button text={"Sign Up"} onClick={function (): void {
                    throw new Error("Function not implemented.")
                } } className="bg-black text-white p-3 rounded font-sans  cursor-pointer"/>
               
      </div>
      </div>
    </div>

       
       

  
}