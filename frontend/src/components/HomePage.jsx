import React, { useState } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const HomePage = () => {
  

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
          {/* Hero section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-extrabold tracking-tight">
              Explore the World with Ease
            </h1>
            <p className="text-lg text-gray-200 mt-4 max-w-2xl mx-auto">
              Discover breathtaking destinations, plan seamless trips, and book your adventures effortlessly.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-3 gap-10 mt-12">
            {/* Feature Cards */}
            {[
              {
                title: "Discover with Image",
                desc: "Upload images of landmarks and get instant insights on your next destination.",
                link: "/image",
                bg: "from-indigo-400 to-purple-500",
                icon: "camera",
              },
              {
                title: "Plan with AI Assistant",
                desc: "Get personalized itineraries and travel recommendations instantly.",
                link: "/chat",
                bg: "from-green-400 to-teal-500",
                icon: "chat",
              },
              {
                title: "Hotel Recommendations",
                desc: "Find and book accommodations tailored to your preferences.",
                link: "/hotel",
                bg: "from-yellow-400 to-orange-500",
                icon: "home",
              },
            ].map(({ title, desc, link, bg, icon }, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${bg} p-8 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 glassmorphism`}
              >
                <div className="flex justify-center items-center text-white text-5xl">
                  <i className={`fas fa-${icon}`} />
                </div>
                <h2 className="text-2xl font-semibold mt-6">{title}</h2>
                <p className="text-gray-100 mt-4">{desc}</p>
                <Link
                  to={link}
                  className="mt-6 inline-block bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-all"
                >
                  Learn More
                </Link>
              </div>
            ))}
          </div>

          {/* CTA section */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-white">Ready to start your journey?</h2>
            <p className="text-lg text-gray-200 mt-3">Plan and book your next adventure today.</p>
            <div className="flex flex-wrap justify-center gap-6 mt-6">
            
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
