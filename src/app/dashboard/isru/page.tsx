"use client";

import React, { useState } from "react";
import Isru from "./isru";
import Parameters from "./parameters";
import Consumption from "./consumption";
import data from "../../dummy.json";
// Mock data
const mockData = data;

function Page() {
  const [activeTab, setActiveTab] = useState<"isru" | "parameters" | "consumption">("isru");

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Inventory Management
            </h1>
          </div>
        </div>
      {/* Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("isru")}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === "isru"
              ? "bg-blue-600 text-white shadow"
              : "bg-black-200 hover:bg-black-300"
          }`}
        >
          ISRU
        </button>
        <button
          onClick={() => setActiveTab("parameters")}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === "parameters"
              ? "bg-blue-600 text-white shadow"
              : "bg-black-200 hover:bg-black-300"
          }`}
        >
          Decision Parameters
        </button>
        <button
          onClick={() => setActiveTab("consumption")}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === "consumption"
              ? "bg-blue-600 text-white shadow"
              : "bg-black-200 hover:bg-black-300"
          }`}
        >
          Resource Consumption
        </button>
      </div>

      {/* Content */}
      <div className="">
        {activeTab === "isru" && <Isru />}
        {activeTab === "parameters" && <Parameters />}
        {activeTab === "consumption" && <Consumption />}
      </div>
    </div>
  );
}

export default Page;
