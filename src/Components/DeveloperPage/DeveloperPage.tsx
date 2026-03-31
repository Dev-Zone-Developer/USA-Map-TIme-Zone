// pages/DeveloperPage.tsx
import React from 'react';
import { FaCode, FaTools, FaClock } from 'react-icons/fa';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';

const DeveloperPage: React.FC = () => {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Icon / Illustration */}
                    <div className="mb-8 flex justify-center">
                        <div className="p-6 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg">
                            <FaTools className="w-16 h-16 text-white" />
                        </div>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600 mb-4">
                        Coming Soon
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                        The developer page is currently under construction.
                    </p>

                    {/* Clock / Countdown feel */}
                    <div className="flex justify-center items-center gap-2 text-gray-500 dark:text-gray-400 mb-8">
                        <FaClock className="w-5 h-5" />
                        <span>Launching in early 2026</span>
                    </div>

                    {/* Developer Credit (short) */}
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
                        <p className="text-gray-700 dark:text-gray-300">
                            This site is being developed by{' '}
                            <strong className="text-blue-600 dark:text-blue-400">Muhammad Abid Hussain</strong>{' '}
                            during his work at <strong className="text-indigo-600 dark:text-indigo-400">Aims Dispatch LLC</strong>.
                        </p>
                        <div className="mt-4 flex justify-center gap-4">
                            <a
                                href="#"
                                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition"
                                aria-label="GitHub"
                            >
                                <FaCode size={20} />
                            </a>
                            {/* Add other social links if needed */}
                        </div>
                    </div>

                    {/* Back to Home Link */}
                    <div className="mt-10">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition font-medium"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeveloperPage;