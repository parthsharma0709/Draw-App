"use client"
import { ChangeEvent } from 'react';

interface InputProps {
  label: string;
  type: string;
  placeholder: string;
  classname?: string;
  textColor?:string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({ label, textColor, type, placeholder, classname = "", onChange }: InputProps) => {
  return (
    <div className="flex flex-col gap-3">
      
      <label className={`text-lg font-semibold  ${textColor}` }>{label}</label>
      

      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        className={`p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${classname}`}
      />
    </div>
  );
};