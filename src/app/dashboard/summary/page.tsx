"use client";

import React, { useState, useEffect } from "react";
import data from "../../dummy.json";

function Page() {
  const missions = data.missions;

  // Sort missions by startDate ascending
  const sortedMissions = [...missions].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // Take the two closest (earliest) missions
  const closestMissions = sortedMissions.slice(0, 2);

  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState<Record<string, string>>({});

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % closestMissions.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? closestMissions.length - 1 : prev - 1
    );
  };

  // countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      const updated: Record<string, string> = {};

      closestMissions.forEach((mission) => {
        const diff = new Date(mission.startDate).getTime() - Date.now();

        if (diff <= 0) {
          updated[mission.id] = "Launched 🚀";
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        updated[mission.id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      });

      setTimeLeft(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [closestMissions]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Summary</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 mb-10">
        <div className="flex items-center justify-between bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
          <h2 className="text-gray-400">Items shipped</h2>
          <p className="text-2xl font-bold text-white">22</p>
        </div>
        <div className="flex items-center justify-between bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
          <h2 className="text-gray-400">Missions completed</h2>
          <p className="text-2xl font-bold text-white">22</p>
        </div>
        <div className="flex items-center justify-between bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
          <h2 className="text-gray-400">Upcoming Missions</h2>
          <p className="text-2xl font-bold text-white">
            {closestMissions.length}
          </p>
        </div>
        <div className="flex items-center justify-between bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
          <h2 className="text-gray-400">Upcoming Missions</h2>
          <p className="text-2xl font-bold text-white">
            {closestMissions.length}
          </p>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="overflow-hidden rounded-xl shadow-lg">
          {closestMissions.map((mission, index) => (
            <div
              key={mission.id}
              className={`transition-transform duration-500 ease-in-out ${
                index === current ? "translate-x-0" : "hidden"
              }`}
            >
              <img
                src={mission.coverImage}
                alt={mission.name}
                className="w-full h-64 object-contain"
              />
              <div className="p-4 bg-black text-white ">
                <h2 className="text-xl font-semibold mb-1">{mission.name}</h2>
                <p className="text-gray-400">
                  Start:{" "}
                  {new Date(mission.startDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-400">
                  Destination: {mission.destination}
                </p>

                {/* Countdown */}
                <p className="font-bold text-gray-400">
                  {timeLeft[mission.id] || "Loading..."}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-black text-white p-2 rounded-full shadow hover:bg-gray-700"
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-black text-white p-2 rounded-full shadow hover:bg-gray-700"
        >
          ▶
        </button>
      </div>
    </div>
  );
}

export default Page;
