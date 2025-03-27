"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Photo {
  _id: string;
  imageUrl: string;
  name: string;
  rating: number;
}

const isProduction = process.env.NODE_ENV === "production";
const NEXT_PUBLIC_BACKEND_URL = isProduction
  ? process.env.NEXT_PUBLIC_BACKEND_URL
  : "http://localhost:5000/";

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(`${NEXT_PUBLIC_BACKEND_URL}api/photos/random`);
      setPhotos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleVote = async (winnerId: string, loserId: string) => {
    try {
      await axios.post(`${NEXT_PUBLIC_BACKEND_URL}api/photos/vote`, {
        winnerId,
        loserId,
      });
      fetchPhotos();
    } catch (error) {
      console.error("Error voting on photo:", error);
    }
  };

  if (loading) return <p className="text-2xl text-center mt-10">Loading...</p>;

  return (
    <main className="min-h-screen bg-amber-50 text-black flex flex-col items-center text-center px-4 py-10">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl md:text-5xl bg-red-600 text-white font-bold py-3 mb-6 rounded-lg">
          FACEMASH
        </h1>
        <blockquote className="text-lg  md:text-2xl my-6 font-semibold px-4 md:px-0">
          Were we let in for our looks? No. Will we be judged on them? Yes.
        </blockquote>
        <blockquote className="text-lg md:text-3xl my-6 font-semibold px-4 md:px-0">
         Who's Hotter?, Click To Choose
        </blockquote>

        {photos.length === 2 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
            {/* First Image */}
            <div className="flex flex-col items-center">
              <img
                src={photos[0].imageUrl}
                alt={photos[0].name}
                className="rounded-lg shadow-lg cursor-pointer w-[450px] md:w-[500px] h-auto"
                onClick={() => handleVote(photos[0]._id, photos[1]._id)}
              />
              <p className="text-lg md:text-xl text-green-600 font-semibold mt-2">
                {photos[0].name} (Rating: {photos[0].rating})
              </p>
            </div>

            {/* "OR" in the middle */}
            <div className="text-4xl md:text-6xl font-bold">OR</div>

            {/* Second Image */}
            <div className="flex flex-col items-center">
              <img
                src={photos[1].imageUrl}
                alt={photos[1].name}
                className="rounded-lg shadow-lg cursor-pointer w-[450px] md:w-[500px] h-auto"
                onClick={() => handleVote(photos[1]._id, photos[0]._id)}
              />
              <p className="text-lg md:text-xl text-green-600 font-semibold mt-2">
                {photos[1].name} (Rating: {photos[1].rating})
              </p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <Link href="/leaderboard">
            <p className="text-lg text-black md:text-2xl font-semibold italic underline cursor-pointer">
              View Leaderboard
            </p>
          </Link>
          <Link href="/add">
            <p className="text-lg text-red-800 md:text-2xl font-semibold italic underline cursor-pointer">
              Add Photo
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
