'use client'

import { FC } from 'react';
import Link from 'next/link';

const ContactPage: FC = () => {
    return (
        <div className="h-[92.5vh] bg-gradient-to-b from-black via-black to-indigo-900 text-white flex flex-col relative overflow-hidden">
            <div className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 z-10">
                <div className="max-w-4xl w-full space-y-16 text-center">
                    <h1 className="text-6xl font-bold tracking-tight">
                        Contact Me
                    </h1>
                    <div className="flex justify-center space-x-8">
                        <Link href="https://x.com/jaretterer" target="_blank" rel="noopener noreferrer"
                            className="planet-link twitter">
                            Twitter
                        </Link>
                        <Link href="https://www.linkedin.com/in/jackretterer/" target="_blank" rel="noopener noreferrer"
                            className="planet-link linkedin">
                            LinkedIn
                        </Link>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .planet-link {
                    display: inline-block;
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    font-weight: bold;
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                .planet-link:hover {
                    transform: scale(1.1);
                }
                .twitter {
                    background: radial-gradient(circle at 30% 30%, #1DA1F2, #0C85D0);
                }
                .linkedin {
                    background: radial-gradient(circle at 30% 30%, #0077B5, #005582);
                }
            `}</style>
        </div>
    );
};

export default ContactPage;