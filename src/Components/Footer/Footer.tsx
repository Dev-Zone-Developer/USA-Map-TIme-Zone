import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import useStore from '../Store/Store';

const Footer = () => {
    const { user } = useStore();
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`w-full py-4 px-6 text-sm border-t flex flex-wrap items-center justify-between gap-2 ${user.mode === 'light' ? 'text-gray-600 border-gray-200 bg-white' : 'text-gray-400 border-gray-700 bg-black'}`}>
            {/* Copyright */}
            <div>&copy; {currentYear} Muhammad Abid Hussain – Aims Dispatch LLC</div>

            {/* Social Media Links */}
            <div className="flex gap-4">
                <a
                    href="https://github.com/dev-Zone-Developer/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-500 transition-colors"
                    aria-label="GitHub"
                >
                    <FaGithub size={21} />
                </a>
                <a
                    href="https://www.linkedin.com/in/muhammad-abid-hussain-ba4556314"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-500 transition-colors"
                    aria-label="LinkedIn"
                >
                    <FaLinkedin size={21} />
                </a>
                <a
                    href="mailto:this.m.abidhussain@gmail.com"
                    className="hover:text-blue-500 transition-colors"
                    aria-label="Email"
                >
                    <FaEnvelope size={21} />
                </a>
                <a
                    href="https://wa.me/+923436544231"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-500 transition-colors"
                    aria-label="WhatsApp"
                >
                    <FaWhatsapp size={21} />
                </a>
            </div>
        </footer>
    );
};

export default Footer;