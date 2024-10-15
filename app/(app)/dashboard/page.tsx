"use client";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import React from "react";
import { getBooks } from "@/app/apiService/book";

function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
          Welcome
        </h1>

        <div className="space-y-4">
          <button
            onClick={() => router.push("video/upload")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            Upload Video
          </button>

          <button
            onClick={() => signOut()}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            Logout
          </button>

          <button
            onClick={() => getBooks()}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            Get Books
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
