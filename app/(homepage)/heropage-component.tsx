"use client";
import React from "react";
import { WavyBackground } from "../../components/ui/wavy-background";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

export function WavyBackgroundDemo() {
  return (
    <WavyBackground className="max-w-4xl mx-auto pb-40">
      <div className="text-center">
        <p className="text-4xl md:text-5xl lg:text-7xl text-white font-bold inter-var mb-8">
          Hey, I'm Jack 👋
        </p>
        <p className="text-xl md:text-2xl text-white font-bold inter-var mb-12">
          I like to build applications. Often to do with AI & Finance.
        </p>
        <div className="flex justify-center space-x-8">
          <a
            href="https://www.linkedin.com/in/jackretterer/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-200 transition-colors duration-200"
          >
            <FaLinkedin size={32} />
          </a>
          <a
            href="https://twitter.com/jaretterer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-400 transition-colors duration-200"
          >
            <FaTwitter size={32} />
          </a>
          <a
            href="https://github.com/jackretterer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition-colors duration-200"
          >
            <FaGithub size={32} />
          </a>
        </div>
      </div>
    </WavyBackground>
  );
}