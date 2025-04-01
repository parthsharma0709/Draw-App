"use client"
import {Button} from "@repo/ui/button"
import {Input} from "@repo/ui/input-box"

export default function Signin(){
    
    return <div className="w-screen h-screen bg-slate-500 flex justify-center items-center">
      <div className="flex flex-col w-[400px] h-[320px] bg-white rounded border-2">
      <h1 className="text-2xl text-center text-black font-sans p-2">Sign In</h1>
      <div className="p-3 flex flex-col gap-3">
      <Input label={"Email"} type={"text"} placeholder={"05sharmaparth@gmail.com"} classname="p-2 text-black rounded border-2"/>
      <Input label={"Password"} type={"password"} placeholder={"Parth@12345"} classname="p-2 text-black rounded border-2"/>
      
        <Button text={"Sign In"} onClick={function (): void {
                    throw new Error("Function not implemented.")
                } } className="bg-black text-white p-3  mt-3 rounded font-sans  cursor-pointer"/>
               
      </div>
      </div>
    </div>

       
       

  
}