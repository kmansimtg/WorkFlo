"use client";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/actions/register";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function RegisterForm() {
  const [error, setError] = useState<string>();
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);





  const handleSubmit = async (formData: FormData) => {
    const r = await register({
        email: formData.get("email"),
        password: formData.get("password"),
        name: formData.get("name")    
      });
      ref.current?.reset();
      if(r?.error){
        setError(r.error);
        return;
      } else {
        return router.push("/login");
      }
};

  

  return (
 
      <div className="grid place-items-center h-screen bg-[linear-gradient(to_top,_#AFA3FF,_#ffffff)]">
        <div className="shadow-lg p-5 rounded-lg border-t-4 bg-white h-[356px] w-[448px]">
          <h1 className="text-xl font-bold my-4">Welcome to <span style={{ color: '#4534AC' }}>Workflo</span>!</h1>
          <form ref = {ref}
        action={handleSubmit} className="flex flex-col gap-3">
             {error && <div className="">{error}</div>}
            <input
              type="text"
              className="bg-[#EBEBEB] placeholder-[#606060] text-black p-2 rounded"
              placeholder="Full Name"
              name="name"
            />
            <input
              type="text"
              className="bg-[#EBEBEB] placeholder-[#606060] text-black p-2 rounded"
              placeholder="Your email"
              name="email"
            />
            <input
              type="password"
              className="bg-[#EBEBEB] placeholder-[#606060] text-black p-2 rounded"
              placeholder="Password"
              name="password"
            />
            <button className=" text-white font-bold cursor-pointer px-6 py-2 bg-[linear-gradient(to_top,_#4B36CC,_#9C93D4)]">
              Sign Up
            </button>
            
            <Link className="text-sm mt-3 text-center" href="/login">
              Already have an account? <span className="underline">Login</span>
            </Link>
          </form>
        </div>
      </div>
    
  );
}
