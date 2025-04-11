"use client"
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input-box";
import axios from "axios";
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

    async function SignInButton() {
        try {
            const response = await axios.post<SignInProps>("http://localhost:3001/api/v1/user/signin", {
                email,
                password,
            });

            // safer check using "in" keyword
            if ("token" in response.data) {
                localStorage.setItem("token", response.data.token);
                alert("Signed in successfully");
            } else {
                alert("Signed-in is successfull, but token is not set in local storage");
            }

        } catch (error) {
            console.error("Error while signing in", error);
            alert("Something went wrong during sign in.");
        }
    }

    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <div className="h-[300px] w-[350px] border-2 p-2 rounded bg-slate-500 flex flex-col">
                <Input
                    classname="p-2"
                    type="text"
                    placeholder="email"
                    label={"Email"}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    classname="p-2"
                    type="password"
                    placeholder="password"
                    label={"Password"}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    className="bg-black mt-3 text-white p-3 rounded"
                    text="SignIn"
                    onClick={SignInButton}
                />
            </div>
        </div>
    );
}
