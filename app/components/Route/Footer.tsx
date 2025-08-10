"use client";
import React from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { SiUdemy } from "react-icons/si";

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className={`w-full py-12 transition-colors duration-300`}>
      <div className="w-[90%] 800px:w-[85%] m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="flex flex-col">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <SiUdemy className="text-3xl text-purple-600" />
              <span
                className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                ELearning
              </span>
            </Link>
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              Empowering learners worldwide with high-quality courses and expert
              instructors.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} shadow-md`}
              >
                <FaFacebook className="text-blue-600" />
              </a>
              <a
                href="#"
                className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} shadow-md`}
              >
                <FaTwitter className="text-blue-400" />
              </a>
              <a
                href="#"
                className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} shadow-md`}
              >
                <FaInstagram className="text-pink-600" />
              </a>
              <a
                href="#"
                className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} shadow-md`}
              >
                <FaLinkedin className="text-blue-700" />
              </a>
              <a
                href="#"
                className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} shadow-md`}
              >
                <FaYoutube className="text-red-600" />
              </a>
            </div>
          </div>

          {/* Quick Links and Categories in one row on mobile */}
          <div className="md:col-span-2 grid grid-cols-2 gap-8">
            {/* Quick Links */}
            <div>
              <h3
                className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className={`text-sm hover:text-purple-600 transition-colors ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/courses"
                    className={`text-sm hover:text-purple-600 transition-colors ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Courses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className={`text-sm hover:text-purple-600 transition-colors ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className={`text-sm hover:text-purple-600 transition-colors ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className={`text-sm hover:text-purple-600 transition-colors ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3
                className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                Categories
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/courses/web-development"
                    className={`text-sm hover:text-purple-600 transition-colors ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link
                    href="/courses/data-science"
                    className={`text-sm hover:text-purple-600 transition-colors ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Data Science
                  </Link>
                </li>
                <li>
                  <Link
                    href="/courses/mobile-apps"
                    className={`text-sm hover:text-purple-600 transition-colors ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Mobile Apps
                  </Link>
                </li>
                <li>
                  <Link
                    href="/courses/design"
                    className={`text-sm hover:text-purple-600 transition-colors ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Design
                  </Link>
                </li>
                <li>
                  <Link
                    href="/courses/marketing"
                    className={`text-sm hover:text-purple-600 transition-colors ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Marketing
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info - Below on mobile, last column on desktop */}
          <div className="md:col-span-1 items-center">
            <h3
              className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}
            >
              Contact Us
            </h3>
            <ul
              className={`space-y-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              <li className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                123 Learning St, Education City
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                support@elearning.com
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          className={`h-px w-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} my-8`}
        ></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            Hiya WebTechno © {new Date().getFullYear()} ELearning. All rights
            reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className={`text-sm hover:text-purple-600 transition-colors ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className={`text-sm hover:text-purple-600 transition-colors ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className={`text-sm hover:text-purple-600 transition-colors ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
