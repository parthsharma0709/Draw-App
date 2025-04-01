"use client"
import axios from "axios";

import { useRef } from "react"

export default function JoinRoom(){
    
    const slugRef= useRef<HTMLInputElement>(null);
   
   


     async function JoinRoomButton(){
        const slug= slugRef.current?.value;
        if(!slug){
            return;
        }
        try{
            const response= await axios.post("http://localhost:3001/api/v1/user/room",{
                slug 
            },{
                headers :{
                    Authorization:localStorage.getItem("token")
                }
            }
        )
        }
        catch(error){
            console.error("error while room joining", error)
        }
       
      

        
      
    }

    return <div style={{width:"100vw", height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
              <div style={{display:"flex", flexDirection:"column", width:"500px",height:'500px', gap:"10px", border:"1px solid black", padding:"4px"}}>
        <input ref={slugRef} type="text" placeholder="enter roomId to join" style={{padding:"4px"}} />
       
       
        <button style={{padding:"4px"}} onClick={JoinRoomButton} >Join Room</button>
    </div>
    </div>
}