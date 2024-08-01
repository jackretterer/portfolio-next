'use client';
import Link from "next/link"

export default function NotFound() {
    return (
        <div className="h-screen bg-black overflow-hidden relative">
            <div className="black-hole"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center z-10 relative w-full px-4">
                    <h1 className="text-6xl font-bold text-white mb-4 animate-pulse">
                        Lost in Space?
                    </h1>
                    <p className="text-xl text-gray-400 mb-8">
                        Oops! Your page got sucked into a black hole. Don't worry, even light can't escape those things!
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 shadow-lg hover:shadow-xl"
                    >
                        Warp Drive Home
                    </Link>
                </div>
            </div>
            <style jsx>{`
        .black-hole {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, #000000 30%, transparent 70%);
          box-shadow: 
            0 0 60px 30px rgba(138, 43, 226, 0.2),
            0 0 100px 60px rgba(138, 43, 226, 0.1),
            0 0 140px 90px rgba(138, 43, 226, 0.05);
          animation: rotate 20s linear infinite, pulsate 5s ease-in-out infinite;
          z-index: 5;
        }
        @keyframes rotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes pulsate {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
        </div>
    )
}