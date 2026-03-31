import React, { useState, useEffect } from 'react';
import useStore from '../Store/Store';
import AboutDeveloperBtn from '../Buttons/button';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, setShowModal } = useStore();
    const isDarkMode = user.mode !== "light";

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 70);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Dark mode background: dark navy with blur (or any dark color you prefer)
    const headerBgClass = isScrolled
        ? isDarkMode
            ? 'bg-blue-950/95 backdrop-blur-sm shadow-md'
            : 'bg-white/95 backdrop-blur-sm shadow-md'
        : isDarkMode
            ? 'bg-blue-950/80 backdrop-blur-sm shadow-md'
            : 'bg-white/80 backdrop-blur-sm shadow-md';

    return (
        <>
            <style>
                {`
          @keyframes moveAndFlip {
            0% {
              transform: translateX(0) scaleX(1);
            }
            35% {
              transform: translateX(calc(90vw - 100%)) scaleX(1);
            }
            45% {
              transform: translateX(calc(130vw - 100%)) scaleX(1);
            }
            50% {
              transform: translateX(calc(100vw - 20%)) scaleX(-1);
            }
            80% {
              transform: translateX(0) scaleX(-1);
            }
            100% {
              transform: translateX(0) scaleX(1);
            }
          }
          .animate-move-and-flip {
            animation: moveAndFlip 15s ease-in-out infinite;
          }
        `}
            </style>

            <header
                className={`
          fixed top-0 left-0 w-full z-50
          overflow-x-visible
          transition-all duration-300 ease-out 
          ${headerBgClass}
        `}
            >
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 overflow-x-visible">
                    <div className="flex justify-between items-center py-2 md:py-3 overflow-x-visible">
                        <img
                            className={`
                relative
                w-12 sm:w-16 md:w-20 lg:w-24 xl:w-28
                cursor-pointer transition-all duration-300 ${user.mode !== "light" ? "filter brightness-0 invert drop-shadow-md" : ""}
                ${user.truckAnimate ? "animate-move-and-flip" : ""}
              `}
                            src={
                                user.truckAnimate
                                    ? user.mode === "light"
                                        ? "/time-trucks.gif"
                                        : "/time-trucks-nobg.gif"
                                    : "/time-trucks-nobg.png"
                            }
                            alt="Time of Trucks"
                            onClick={() => window.location.href = '/'}
                            draggable={false}
                        />
                        {/* Greeting text */}
                        <p
                            className="
                relative select-none cursor-pointer inline-block
                text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl
                font-extrabold tracking-tight
                bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent
                animate-pulse hover:animate-none transition-all duration-300
                after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
                after:bg-linear-to-r after:from-cyan-400 after:via-blue-500 after:to-purple-600
                after:scale-x-0 after:transition-transform after:duration-300 after:origin-left
              "
                            onClick={() => setShowModal(true)}
                        >
                            Hi{' '}
                            <span className="bg-linear-to-r from-pink-400 to-orange-500 bg-clip-text text-transparent">
                                {user.userName}
                            </span>
                        </p>
                        <AboutDeveloperBtn title="Developer" hoverTitle="Continue" link="/developer" />
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;