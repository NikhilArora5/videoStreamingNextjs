"use client"
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import React from "react";
import { getBooks } from "@/app/ApiService/book";

function page() {
    const router=useRouter()
  return <div>

    <h1 className="text-center text-2xl font-semibold py-4"> Welcome </h1>

    <button onClick={()=>router.push("/book")}>Create Book</button>
    <button onClick={()=>signOut()}>Logout</button>

    <button onClick={()=>getBooks()}>Get Books</button>
   
    
    </div>;
}

export default page;
