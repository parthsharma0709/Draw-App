import { LineChart } from "lucide-react";
import { ReactNode } from "react";

export function IconButton({icon,onClick,activated}:{icon:ReactNode, onClick: ()=>void, activated:boolean}){
    return <div className= {`pointer rounded-full border p-2  ${activated ? "text-red-800":"text-black"}`} onClick={onClick}>
        {icon}
    </div>
}