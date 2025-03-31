"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Home() {
  const router = useRouter();
  const slugRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    const slug = slugRef.current?.value;
    if (!slug) {
      alert("Please enter a slug");
      return;
    }
    router.push(`/room/${slug}`);
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
    }}>
      <div>
        <input type="text" placeholder="Enter slug" ref={slugRef} />
        <button style={{ padding: "5px", cursor: "pointer" }} onClick={handleClick}>
          Enter Room
        </button>
      </div>
    </div>
  );
}
