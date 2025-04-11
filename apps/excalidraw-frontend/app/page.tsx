"use client";

import Link from "next/link";
import { Button } from "@repo/ui/button";

export default function Home() {
  return (
    <div className="h-screen overflow-y-hidden bg-gradient-to-br from-slate-900 to-slate-700 text-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full px-8 py-4 flex justify-between items-center bg-slate-800 shadow-md">
        <h1 className="text-2xl font-bold text-white">DrawTogether</h1>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {/* Hero Section */}
        <div className="mb-6">
          <h1 className="text-5xl font-bold mb-4">Welcome to DrawTogether</h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            A collaborative drawing app like Excalidraw. Work with your team in real-time,
            share ideas visually, and save your canvas to return to anytime.
          </p>
        </div>

        {/* About Us Section */}
        <div className="bg-white text-slate-900 py-10 px-6 rounded-3xl shadow-2xl max-w-4xl w-full text-center mt-6">
          <h2 className="text-3xl font-bold mb-3">About DrawTogether</h2>
          <p className="text-md text-gray-700 leading-relaxed mb-8">
            DrawTogether is a collaborative whiteboard platform where teams can sketch ideas,
            create diagrams, and brainstorm visually in real-time. Whether you're designing a
            product, teaching a concept, or solving a problem, our intuitive interface makes it
            easy for everyone to contribute from anywhere in the world.
          </p>

          {/* CTA Panels */}
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {/* New User */}
            <div className="bg-slate-100 p-6 rounded-xl shadow-inner w-full sm:w-1/2">
              <h3 className="text-xl font-semibold mb-2">New Here?</h3>
              <p className="text-gray-600 mb-3">Create your account and start collaborating instantly.</p>
              <Link href="/signup">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded text-white"
                  text={"Sign Up"}
                 
                />
              </Link>
            </div>

            {/* Existing User */}
            <div className="bg-slate-100 p-6 rounded-xl shadow-inner w-full sm:w-1/2">
              <h3 className="text-xl font-semibold mb-2">Already a User?</h3>
              <p className="text-gray-600 mb-3">Log in and continue your drawing session.</p>
              <Link href="/signin">
                <Button
                  className="w-full bg-slate-700 hover:bg-slate-600 rounded text-white p-3"
                  text={"Sign In"}
                  
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
