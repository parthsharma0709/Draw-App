"use client";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input-box";
import axios from "axios";
import { useState } from "react";

interface SignUpResponse {
  message: string;
}

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");

  async function SignUpButton() {
    try {
      const response = await axios.post<SignUpResponse>("http://localhost:3001/api/v1/user/signup", {
        email,
        password,
        name,
        photo,
      });

      if (response.data.message === "you have signed up successfully") {
        alert("Signed up successfully!");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error during signup", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>

        <div className="space-y-4">
          <Input
            classname="p-2"
            type="email"
            placeholder="Email"
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            classname="p-2"
            type="password"
            placeholder="Password"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            classname="p-2"
            type="text"
            placeholder="John Doe"
            label="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            classname="p-2"
            type="text"
            placeholder="https://example.com/profile.jpg"
            label="Photo URL"
            onChange={(e) => setPhoto(e.target.value)}
          />
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-6 p-3 rounded-xl transition duration-300"
          text="Sign Up"
          onClick={SignUpButton}
        />

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-500 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
