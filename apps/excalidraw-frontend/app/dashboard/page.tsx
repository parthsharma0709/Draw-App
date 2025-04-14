"use client";
import { Button } from "@repo/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@repo/ui/input-box";
import { useEffect, useState } from "react";
import axios from "axios";


interface RoomProps {
  message: string;
  roomId: number;
}
interface UserProps {
  message: string;
  name: string;
  email: string;
  photo_url: string;
}
interface Room {
  id: string;
  slug: string;
  createdAt: string;
  adminId: string;
}
interface oldRoomsProps {
  message: string;
  rooms: Room[];
}

export default function DashBoard() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [existingSlugs, setExistingSlugs] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState<number>();
  const [userName, setUserName] = useState("");
  const [filter, setFilter] = useState("");
  const [picture , setPicture]=useState<string| null>(null);


  function LogOut() {
    localStorage.removeItem("token");
    alert("You have successfully logged out. Please sign in to continue.");
    router.push("/signin");
  }

  useEffect(() => {
    async function User() {
      const response = await axios.get<UserProps>("http://localhost:3001/api/v1/user/userDetails", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      if (!response) return;
      setUserName(response.data.name);
      setPicture(response.data.photo_url);
    }
    User();
  }, []);

  useEffect(() => {
    async function getRooms() {
      if (!filter.trim()) {
        setExistingSlugs([]); 
        return;
      }
      const response = await axios.get<oldRoomsProps>(
        `http://localhost:3001/api/v1/user/existingRooms?filter=${filter}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (!response) return;
      setExistingSlugs(response.data.rooms);
    }
  
    getRooms();
  }, [filter]);
  

  async function JoinRoom() {
    if(slug===""){
      alert("Please join a room to draw.");
      return;
    }
    else{
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
        if (!response) return;
        const roomId = response.data.roomId;
        setRoomId(roomId);
        alert("Room joined successfully!");
        router.push(`/canvas/${roomId}`);
      } catch (error) {
        alert("Room already exists with this slug. Please choose a different one.");
        console.error("Error during room joining", error);
      }
    }
   
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-800 to-gray-900 text-white flex flex-col">
      {/* NavBar */}
      <nav className="w-full px-6 py-4 bg-slate-900 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold flex text-emerald-400">DrawTogether </h1>
        <div className="flex gap-4 items-center">
      

         <div className="rounded-full h-14 w-14 flex justify-center items-center font-bold text-xl cursor-pointer text-black bg-white">
           
           {picture ? (
   <img
     src={picture}
     alt="User profile"
     className="h-14 w-14 rounded-full object-cover border-2 border-emerald-400"
   />
 ) : (
   <div className="h-14 w-14 rounded-full bg-white text-black flex items-center justify-center font-bold">
     {userName?.charAt(0) || "?"}
   </div>
 )}
 
 
           </div>
        

          <Button
            text="Log Out"
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2 rounded-lg transition duration-200"
            onClick={LogOut}
          />
          {/* <div className= "rounded-full ml-4 h-12 w-12 flex justify-center items-center font-bold text-xl cursor-pointer text-black bg-white" > {userName.split(" ")[0].charAt(0)}</div> */}
        </div>
      </nav>

      {/* Greeting */}
      <div className="text-white mt-6 text-4xl font-semibold text-center">
        Hello <span className="text-emerald-400">{userName.split(" ")[0]}</span> , Welcome to DrawTogether
      </div>

      {/* Main */}
      <main className="flex flex justify-evenly items-center flex-1 px-4 mt-10 space-y-8">
        {/* Join Room */}
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
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-2 rounded-lg text-lg transition duration-200"
              onClick={JoinRoom}
            />
          </div>
        </div>
     {/* Filter Input + Room List */}
<div className="max-w-md w-full space-y-4">
  <Input
    label="Search for Existing Rooms You Have Joined"
    type="text"
    placeholder="blue"
    classname="text-black w-full"
    onChange={(e) => setFilter(e.target.value)}
  />

  {/* Room List */}
  <div className="h-64 overflow-y-auto bg-slate-700 rounded-lg p-3 space-y-2 shadow-inner w-full">
    {existingSlugs.length === 0 ? (
      <p className="text-gray-400 text-center text-sm">No rooms found.</p>
    ) : (
      existingSlugs.map((r, index) => <RoomCard key={index} room={r} />)
    )}
  </div>
</div>

      </main>
    </div>
  );
}

function RoomCard({ room }: { room: Room }) {
  const router = useRouter();
  const roomId = room.id;
  return (
    <div className="flex justify-between items-center bg-slate-800 px-4 py-3 rounded-lg shadow   hover:bg-slate-500 transition">
      <div className="text-white  text-md font-medium">{room.slug}-{roomId}</div>
      <Button
        text="Continue"
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1 rounded-md"
        onClick={() => router.push(`/canvas/${roomId}`)}
      />
    </div>
  );
}
