"use client";
import { Button } from "@repo/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@repo/ui/input-box";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";


interface RoomProps {
  message: string;
  roomId: number;
}
interface UserProps{
    message:string,
    name:string,
    email:string,
    photo_url:string
}
interface Room{
    id:string,
    slug:string,
    createdAt:string,
    adminId:string
}
interface oldRoomsProps{
    message:string,
    rooms:Room[]
}

export default function DashBoard() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [existingSlugs, setExistingSlugs]= useState<Room[]>([]);
  const [roomId, setRoomId] = useState<number>();
  const [userName, setUserName]= useState("");
  const [filter, setFilter]=useState("");

  function LogOut() {
    localStorage.removeItem("token");
    alert("You have successfully logged out. Please sign in to continue.");
    router.push("/signin");
  }


  useEffect(()=>{
    async function User() {
        const response= await axios.get<UserProps>("http://localhost:3001/api/v1/user/userDetails",{
            headers:{
                Authorization: localStorage.getItem("token")
            }
        })
        setUserName(response.data.name)
        

    }
    User();
  },[])

  useEffect(()=>{
    async function getRooms() {
        const response= await axios.get<oldRoomsProps>(`http://localhost:3001/api/v1/user/existingRooms?filter=${filter}`,{
            headers :{
                Authorization: localStorage.getItem("token")
            }
        });
        if(!response){
            return;
        }
       
        const oldRooms= response.data.rooms
        setExistingSlugs(oldRooms)
       
    }
    getRooms();
  },[filter])

  async function JoinRoom() {
    try {
      const response = await axios.post<RoomProps>(
        "http://localhost:3001/api/v1/user/room",
        { slug },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const roomId = response.data.roomId;
      setRoomId(roomId);
      alert("Room joined successfully!");
      router.push(`/canvas/${roomId}`);
    } catch (error) {
      alert("Room already exists with this slug. Please choose a different one.");
      console.error("Error during room joining", error);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-800 to-gray-900 text-white flex flex-col">
      {/* NavBar */}
      <nav className="w-full px-6 py-4 bg-slate-900 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold text-emerald-400">DrawTogether</h1>
        
<div className="flex gap-8">
<div className="rounded-full h-10 w-10 flex justify-center items-center font-bold text-xl cursor-pointer text-black bg-white">{userName.split(" ")[0].charAt(0)}</div>
        <Button
          text="Log Out"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition duration-200"
          onClick={LogOut}
        />
</div>
      </nav>
         <div className="text-white mt-5 text-2xl font-semibold text-center">Hello <span className="text-emerald-400">{userName.split(" ")[0]} </span>, Welcome to DrawTogether </div>
      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="bg-slate-700 shadow-xl rounded-2xl p-8 max-w-md w-full space-y-6">
          <h2 className="text-xl font-semibold text-center">Join a New Room To Draw</h2>
          <div className="space-y-4">
            <Input
            classname="text-black"
              label="Room Name"
              type="text"
              placeholder="Enter room name (e.g. red)"
              onChange={(e) => setSlug(e.target.value)}
            />
            <Button
              text="Join Room"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-lg transition duration-200"
              onClick={JoinRoom}
            />
          </div>
        </div>
        <div>
            <Input label={"Search for existing Rooms you have joined"} type={"text"} placeholder={"blue"} classname="text-black" onChange={(e)=>setFilter(e.target.value)}/>
        </div>
        <div className="pl-5 text-lg">
        {Array.isArray(existingSlugs) && existingSlugs.map((r, index) => (
  <RoomCard key={index} room={r} />
))}

      </div>
      </main>
    </div>
  );
}



function RoomCard({ room }: { room: Room }) {
    const router = useRouter();
    const roomId = room.id;
    return (
      <div className="flex gap-4 p-2 items-center">
        <div className="text-white text-md font-medium">{room.slug}</div>
        <Button
          text={"Continue"}
          className="bg-emerald-500 text-white px-3 py-1 rounded"
          onClick={() => router.push(`/canvas/${roomId}`)}
        />
      </div>
    );
  }
  