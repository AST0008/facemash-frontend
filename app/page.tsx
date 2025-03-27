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
const BACKEND_URL = isProduction
  ? process.env.BACKEND_URL
  : "http://localhost:5000/";

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}api/photos/random`);
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
      await axios.post(`${BACKEND_URL}api/photos/vote`, {
        winnerId,
        loserId,
      });
      fetchPhotos();
    } catch (error) {
      console.error("Error voting on photo:", error);
    }
  };

  if (loading) return <p className="text-2xl">Loading...</p>;

  return (
    <main className="min-h-screen bg-amber-50 flex flex-col items-center text-center p-8">
      <div className="container text-black px-4  md:px-0">
        <h1 className="text-4xl bg-red-600 text-white font-bold mb-4">
          FACEMASH
        </h1>
        <div>
          <blockquote className="text-2xl my-10 font-semibold ">
            Were we let in for our looks? No. Will we be judged on them? Yes.
          </blockquote>
        </div>
        <div className="grid grid-cols-1 my-10 justify-center items-center gap-8">
          {photos.length === 2 && (
            <div className="flex items-center my-10 justify-center gap-8">
              {/* First Image */}
              <div className="flex flex-col items-center">
                <img
                  src={photos[0].imageUrl}
                  alt={photos[0].name}
                  width={300}
                  height={600}
                  className="rounded-lg shadow-lg cursor-pointer"
                  onClick={() => handleVote(photos[0]._id, photos[1]._id)}
                />
                <p className="text-xl text-green-600 font-semibold mt-2">
                  {photos[0].name} (Rating: {photos[0].rating})
                </p>
              </div>

              {/* "Vs" in the middle */}
              <div className="text-6xl font-bold">OR</div>

              {/* Second Image */}
              <div className="flex flex-col items-center">
                <img
                  src={photos[1].imageUrl}
                  alt={photos[1].name}
                  width={300}
                  height={600}
                  className="rounded-lg shadow-lg cursor-pointer"
                  onClick={() => handleVote(photos[1]._id, photos[0]._id)}
                />
                <p className="text-xl text-green-600 font-semibold mt-2">
                  {photos[1].name} (Rating: {photos[1].rating})
                </p>
              </div>
            </div>
          )}
        </div>
        <Link href="/leaderboard">
          <p className="text-2xl font-semibold italic">View Leaderboard</p>
        </Link>
        <Link href="/add">
          <p className="text-2xl font-semibold italic">Add Photo</p>
        </Link>
      </div>
    </main>
  );
}
