"use client";
import axios from "axios";
import React, { useState } from "react";
import Link from "next/link";


const isProduction = process.env.NODE_ENV === "production";
const BACKEND_URL = isProduction ? process.env.BACKEND_URL : "http://localhost:5000/";

const page = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) return alert("Please  upload an image.");

    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("photo", file);

    try {
      await axios.post(`${BACKEND_URL}api/photos/upload`, formdata);
      alert("Upload successful!");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };
  return (
    <main className="min-h-screen bg-amber-50 flex flex-col items-center text-center p-8">
      <div className="container text-black px-4  md:px-0">
        <h1 className="text-4xl bg-red-600 text-white font-bold mb-4">
          Upload New Photo
        </h1>
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="p-2 border-2 border-black rounded-md"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="p-2 border-2 border-black rounded-md"
            />
            <button
              type="submit"
              className="bg-red-600 text-white p-2 rounded-md"
            >
              Upload
            </button>
          </form>
          <Link href="/">
            <p className="text-2xl font-semibold mt-8">
              Back to
              <span className="text-red-600 hover:underline"> Vote</span>
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default page;
