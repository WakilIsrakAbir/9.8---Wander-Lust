"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Select, ListBox } from "@heroui/react";

function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/destinations")
      .then(res => res.json())
      .then(data => {
        setDestinations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch destinations", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Explore All Destinations
          </h1>
          <p className="text-gray-500 text-lg">
            Find your perfect travel experience from our curated collection
          </p>
        </div>

        {/* Filters Section (Static for now to match UI) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200 rounded-sm bg-white mb-6">
          <div className="p-4 border-b md:border-b-0 md:border-r border-gray-200 flex justify-between items-center text-gray-500 text-sm">
            <span>CATEGORY</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
          <div className="p-4 border-b md:border-b-0 md:border-r border-gray-200 flex justify-between items-center text-gray-500 text-sm">
            <span>PRICE RANGE</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
          <div className="p-4 flex justify-between items-center text-gray-500 text-sm">
            <span>SORT BY</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        {/* Showing Count */}
        <p className="text-gray-500 mb-6">Showing {destinations.length} destinations</p>

        {/* Grid Section */}
        {loading ? (
          <div className="text-center py-20">Loading destinations...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest, index) => (
              <div key={index} className="bg-white group cursor-pointer">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={dest.imageUrl || "https://placehold.co/600x400?text=No+Image"} 
                    alt={dest.destinationName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 flex items-center gap-1 rounded-sm shadow-sm">
                    <span className="text-sm font-semibold">4.5</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-black">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Content Container */}
                <div className="py-5">
                  {/* Location */}
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    {dest.country}
                  </div>

                  {/* Title and Price */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-medium text-gray-900">{dest.destinationName}</h3>
                    <div className="text-right">
                      <span className="text-xl font-semibold text-gray-900">${dest.price}</span>
                      <span className="text-xs text-gray-500">/Person</span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    {dest.duration}
                  </div>

                  {/* Book Now Link */}
                  <Link href={`/destinations/${dest._id}`} className="inline-flex items-center gap-1 text-cyan-600 font-medium hover:text-cyan-700 transition-colors uppercase text-sm border-b border-cyan-600/30 pb-0.5">
                    BOOK NOW
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DestinationsPage;