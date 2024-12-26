'use client'

import { FC } from 'react';
import Link from 'next/link';
import { WavyBackground } from '@/components/ui/wavy-background';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const ContactPage: FC = () => {
    return (
        <WavyBackground className="max-w-4xl mx-auto pb-40">
            <div className="text-center">
                <p className="text-white text-xl mb-4">
                    wanna chat?
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
};

export default ContactPage;