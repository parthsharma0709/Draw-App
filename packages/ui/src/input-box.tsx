"use client"

interface InputProps{
    label:string,
    type:string,
    placeholder:string,
    classname?:string

}

export const Input=({label,type,placeholder,classname=""}:InputProps)=> {
    return <div className="flex flex-col gap-2">
    <h1>{label}</h1>
    <input type= {type} placeholder={placeholder} className={classname}/>
    </div>
}