"use client"
import { forwardRef } from 'react';
import { ForwardedRef } from 'react';

interface InputProps{
    label:string,
    type:string,
    placeholder:string,
    classname?:string,
  

}

export const Input=forwardRef(({label,type,placeholder,classname=""}:InputProps, ref:ForwardedRef<HTMLInputElement>)=> {
    return <div className="flex flex-col gap-2">
    <h1>{label}</h1>
    <input ref={ref} type= {type} placeholder={placeholder} className={classname}/>
    </div>
})
Input.displayName = 'Input';