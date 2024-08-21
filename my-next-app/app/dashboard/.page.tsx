"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import React from "react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <div>
        Signed in as  <br />
        <button onClick={() => signOut()}>Sign out</button>
        </div>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}