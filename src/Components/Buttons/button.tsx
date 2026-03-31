import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AboutButtonProps {
    title: string;
    hoverTitle: string;
    link: string;
}

const AboutDeveloperBtn = ({ title, hoverTitle, link }: AboutButtonProps) => {
    const navigate = useNavigate();

    return (
        <div className="relative inline-block group select-none">
            <button
                onClick={() => navigate(link)}
                style={{
                    WebkitBoxReflect:
                        'below 0px linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.4))',
                }}
                className="
                    px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3
                    text-sm sm:text-base
                    bg-linear-to-r from-blue-600 to-indigo-700
                    rounded-full shadow-lg hover:shadow-xl
                    hover:shadow-blue-500/50 shadow-blue-500/30
                    uppercase font-serif tracking-widest
                    relative overflow-hidden text-transparent
                    cursor-pointer z-10
                    after:absolute after:rounded-full after:bg-blue-200/20
                    after:h-[85%] after:w-[95%]
                    after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2
                    hover:saturate-[1.15] active:saturate-[1.4]
                "
            >
                Button
                <p className="
                    absolute z-40 font-semibold
                    bg-linear-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent
                    top-1/2 left-1/2 -translate-x-1/2
                    group-hover:-translate-y-full h-full w-full transition-all duration-300
                    -translate-y-[30%] tracking-widest text-xs sm:text-sm md:text-base mx-1
                ">
                    {title}
                </p>
                <p className="
                    absolute z-40 top-1/2 left-1/2
                    bg-linear-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent
                    -translate-x-1/2 translate-y-full h-full w-full transition-all duration-300
                    group-hover:-translate-y-[40%] tracking-widest font-extrabold text-xs sm:text-sm md:text-base
                ">
                    {hoverTitle}
                </p>

                {/* Wave SVG layers – unchanged */}
                <svg className="absolute w-full h-full scale-x-125 rotate-180 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 group-hover:animate-none animate-pulse group-hover:-translate-y-[45%] transition-all duration-300" viewBox="0 0 2400 800">
                    <defs>
                        <linearGradient id="sssurf-grad" y2="100%" x2="50%" y1="0%" x1="50%">
                            <stop offset="0%" stopOpacity={1} stopColor="hsl(37, 99%, 67%)" />
                            <stop offset="100%" stopOpacity={1} stopColor="hsl(316, 73%, 52%)" />
                        </linearGradient>
                    </defs>
                    <g transform="matrix(1,0,0,1,0,-91.0877685546875)" fill="url(#sssurf-grad)">
                        <path opacity="0.05" transform="matrix(1,0,0,1,0,35)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                        <path opacity="0.21" transform="matrix(1,0,0,1,0,70)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                        <path opacity="0.37" transform="matrix(1,0,0,1,0,105)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                        <path opacity="0.53" transform="matrix(1,0,0,1,0,140)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                        <path opacity="0.68" transform="matrix(1,0,0,1,0,175)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                        <path opacity="0.84" transform="matrix(1,0,0,1,0,210)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                        <path opacity={1} transform="matrix(1,0,0,1,0,245)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                    </g>
                </svg>
                <svg className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-[30%] group-hover:-translate-y-[33%] group-hover:scale-95 transition-all duration-500 z-40 fill-red-500" viewBox="0 0 1440 320">
                    <path d="M0,288L9.2,250.7C18.5,213,37,139,55,133.3C73.8,128,92,192,111,224C129.2,256,148,256,166,256C184.6,256,203,256,222,250.7C240,245,258,235,277,213.3C295.4,192,314,160,332,170.7C350.8,181,369,235,388,229.3C406.2,224,425,160,443,122.7C461.5,85,480,75,498,74.7C516.9,75,535,85,554,101.3C572.3,117,591,139,609,170.7C627.7,203,646,245,665,256C683.1,267,702,245,720,245.3C738.5,245,757,267,775,266.7C793.8,267,812,245,831,234.7C849.2,224,868,224,886,218.7C904.6,213,923,203,942,170.7C960,139,978,85,997,53.3C1015.4,21,1034,11,1052,48C1070.8,85,1089,171,1108,197.3C1126.2,224,1145,192,1163,197.3C1181.5,203,1200,245,1218,224C1236.9,203,1255,117,1274,106.7C1292.3,96,1311,160,1329,170.7C1347.7,181,1366,139,1385,128C1403.1,117,1422,139,1431,149.3L1440,160L1440,320L1430.8,320C1421.5,320,1403,320,1385,320C1366.2,320,1348,320,1329,320C1310.8,320,1292,320,1274,320C1255.4,320,1237,320,1218,320C1200,320,1182,320,1163,320C1144.6,320,1126,320,1108,320C1089.2,320,1071,320,1052,320C1033.8,320,1015,320,997,320C978.5,320,960,320,942,320C923.1,320,905,320,886,320C867.7,320,849,320,831,320C812.3,320,794,320,775,320C756.9,320,738,320,720,320C701.5,320,683,320,665,320C646.2,320,628,320,609,320C590.8,320,572,320,554,320C535.4,320,517,320,498,320C480,320,462,320,443,320C424.6,320,406,320,388,320C369.2,320,351,320,332,320C313.8,320,295,320,277,320C258.5,320,240,320,222,320C203.1,320,185,320,166,320C147.7,320,129,320,111,320C92.3,320,74,320,55,320C36.9,320,18,320,9,320L0,320Z" fillOpacity={1} />
                </svg>
            </button>

            {/* Tooltip – updated content */}
            <div
                className="
                    absolute top-full left-[10%] -translate-x-1/2 mt-3
                    invisible opacity-0 group-hover:visible group-hover:opacity-100
                    transition-all duration-300 ease-out transform group-hover:translate-y-0 translate-y-2
                    z-50 w-80 max-w-[90vw]
                "
            >
                <div className="relative p-4 bg-linear-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex overflow-hidden items-center justify-center w-8 h-8 rounded-full bg-blue-500/20">
                            {/* <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-400">
                                <path clipRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" fillRule="evenodd" />
                            </svg> */}
                            <img src="/admin.jpeg" alt="" />
                        </div>
                        <h3 className="text-sm font-semibold text-white">About Developer</h3>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-300">
                            This is developed by <strong className="text-white">Muhammad Abid Hussain</strong>.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd" />
                            </svg>
                            <span>Full-stack developer & UI/UX enthusiast</span>
                        </div>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/10 to-indigo-500/10 blur-xl opacity-50"></div>
                    <div className="absolute -top-1.5 left-[70%] -translate-x-1/2 w-3 h-3 bg-linear-to-br from-gray-900/95 to-gray-800/95 rotate-45 border-l border-t border-white/10"></div>
                </div>
            </div>
        </div>
    );
};

export default AboutDeveloperBtn;