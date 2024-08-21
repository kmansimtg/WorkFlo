"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function LoginForm() {
  const [error, setError] = useState<string>();
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [session, sessionStatus, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ref.current) return;

    const formData = new FormData(ref.current);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const r = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    ref.current.reset();

    if (r?.error) {
      setError(r.error);
      return;
    } else {
      return router.push("/dashboard");
    }
  };

  return (
    <div className="grid place-items-center h-screen bg-[linear-gradient(to_top,_#4c51bf,_#ffffff)]">
      <div className="shadow-lg p-2 rounded-lg border-t-2 bg-white">
        <h1 className="text-xl font-bold my-4">Welcome to Workflo!</h1>

        {error && <div className="text-black">{error}</div>}

        <form ref={ref} className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your email"
            name="email"
            className="bg-[#EBEBEB] placeholder-[#606060] text-black p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="bg-[#EBEBEB] placeholder-[#606060] text-black p-2 rounded"
            required
          />
          <button
            type="submit"
            className="text-white font-bold cursor-pointer px-6 py-2 bg-[linear-gradient(to_top,_#4B36CC,_#9C93D4)]"
          >
            Login
          </button>

          <Link className="text-sm mt-3 text-right" href={"/register"}>
            Don't have an account? Create a <span className="underline">new account</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
