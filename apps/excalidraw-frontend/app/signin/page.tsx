"use client";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input-box";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SignInSuccess {
  status: true;
  message: string;
  token: string;
}

interface SignInFail {
  status: false;
  message: string;
}

type SignInProps = SignInSuccess | SignInFail;

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router= useRouter();

  async function SignInButton() {
    try {
      const response = await axios.post<SignInProps>(
        "http://localhost:3001/api/v1/user/signin",
        { email, password }
      );

      if ("token" in response.data) {
        localStorage.setItem("token", response.data.token);
        alert("Signed in successfully");
        router.push('/dashboard')
      } else {
        alert("Sign-in failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Error while signing in", error);
      alert("Something went wrong during sign in.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign In
        </h2>

        <div className="space-y-4">
          <Input
            classname="p-2"
            type="email"
            placeholder="you@example.com"
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            classname="p-2"
            type="password"
            placeholder="••••••••"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-6 p-3 rounded-xl transition duration-300"
          text="Sign In"
          onClick={SignInButton}
        />

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
