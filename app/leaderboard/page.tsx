"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Photo {
  _id: string;
  name: string;
  imageUrl: string;
  rating: number;
}



const isProduction = process.env.NODE_ENV === "production";
const NEXT_PUBLIC_BACKEND_URL = isProduction ? process.env.NEXT_PUBLIC_BACKEND_URL : "http://localhost:5000/";


export default function Leaderboard() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  console.log(NEXT_PUBLIC_BACKEND_URL)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          `${NEXT_PUBLIC_BACKEND_URL}api/photos/leaderboard`
        );
        setPhotos(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <main className="min-h-screen bg-amber-50 flex flex-col items-center text-center p-8">
      <div className="container text-black px-4  md:px-0">
        <h1 className="text-4xl bg-red-600 text-white font-bold mb-4">
          Leaderboard
        </h1>
        <div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 my-10 justify-center items-center">
            {photos.map((photo, index) => (
              <li
                key={photo._id}
                className="flex flex-col items-center bg-white rounded-lg shadow-lg p-8"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.name}
                  width={150}
                  height={150}
                  className="rounded-full"
                />
                <p className="text-2xl font-semibold mt-4">
                  {index + 1}. {photo.name}
                </p>
                <p className="text-xl font-medium mt-2">Rating: {photo.rating}</p>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-2xl font-semibold mt-8">
          Back to
          <a href="/" className="text-red-600 hover:underline">
            Vote
          </a>
        </p>
      </div>
    </main>
  );
}
