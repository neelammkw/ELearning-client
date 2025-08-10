"use client";
import React, { FC, useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Footer from "../components/Route/Footer";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaChalkboardTeacher,
  FaUsers,
  FaAward,
} from "react-icons/fa";

const Page: FC = () => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [activeItem] = useState(2); // Assuming About is item 3 in your navigation
  const [route, setRoute] = useState("Login");

  const stats = [
    {
      value: "10,000+",
      label: "Students Enrolled",
      icon: <FaGraduationCap className="text-3xl" />,
    },
    {
      value: "500+",
      label: "Expert Instructors",
      icon: <FaChalkboardTeacher className="text-3xl" />,
    },
    {
      value: "100+",
      label: "Courses Available",
      icon: <FaUsers className="text-3xl" />,
    },
    {
      value: "24/7",
      label: "Learning Support",
      icon: <FaAward className="text-3xl" />,
    },
  ];

  const teamMembers = [
    { name: "Alex Johnson", role: "Founder & CEO", image: "/team1.jpg" },
    {
      name: "Maria Garcia",
      role: "Chief Learning Officer",
      image: "/team2.jpg",
    },
    { name: "James Wilson", role: "Tech Lead", image: "/team3.jpg" },
    { name: "Sarah Lee", role: "Content Director", image: "/team4.jpg" },
  ];

  return (
    <div
      className={`min-h-screen hero-animation ${
        theme === "dark"
          ? "dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800"
          : "bg-gradient-to-br from-blue-50 to-purple-50"
      } `}
    >
      <section>
        <Heading
          title="About Us - ELearning"
          description="Learn more about our mission, team, and values"
          keywords="about elearning, education platform, our team"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={2}
          setRoute={setRoute}
          route={route}
        />

        {/* about Section */}
        <div
          className={`mt-20 '
                    }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1
              className={`text-4xl md:text-5xl  font-bold mb-6 ${
                theme === "dark" ? "text-gray-200" : "text-black"
              } text-center`}
            >
              About{" "}
              <span className="text-blue-600 dark:text-blue-400">
                ELearning
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Empowering learners worldwide with accessible, high-quality
              education since 2015.
            </p>
          </motion.div>
        </div>

        {/* Mission Section */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2
                className={`text-3xl font-bold mb-6  ${
                  theme === "dark" ? "text-gray-200" : "text-black"
                } text-center`}
              >
                Our Mission
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                At ELearning, we believe that education should be accessible to
                everyone, everywhere. Our mission is to break down barriers to
                learning by providing affordable, high-quality courses taught by
                industry experts.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                We&apos;re committed to creating a learning experience that is
                engaging, interactive, and tailored to meet the needs of modern
                learners in a rapidly changing world.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-blue-100 dark:bg-gray-700 rounded-xl p-8 h-full"
            >
              <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                Our Values
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full p-2 mr-4">
                    1
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Accessibility for all learners
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full p-2 mr-4">
                    2
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Innovation in education
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full p-2 mr-4">
                    3
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Quality above all
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full p-2 mr-4">
                    4
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Lifelong learning
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <div
          className={`py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto rounded-xl shadow-lg  ${
            theme === "dark" ? "bg-gray-500" : "bg-gray-300"
          } text-center`}
        >
          <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">
            By The Numbers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex justify-center text-blue-500 dark:text-blue-400 mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold mb-2 dark:text-white">
                  {stat.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div
          className={`py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${
            theme === "dark" ? "text-gray-200" : "text-black"
          } `}
        >
          <h2
            className={`text-3xl font-bold mb-12 text-center ${
              theme === "dark" ? "text-gray-200" : "text-black"
            } `}
          >
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-gray-200 dark:bg-gray-600 rounded-full w-40 h-40 mx-auto mb-4 overflow-hidden">
                  {/* Replace with actual image */}
                  <div className="w-full h-full bg-gray-300 dark:bg-gray-500 flex items-center justify-center">
                    <span className="text-4xl">👤</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold dark:text-white">
                  {member.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-blue-600 dark:bg-blue-700 rounded-xl p-12 text-white"
          >
            <h2 className="text-3xl font-bold mb-6">
              Ready to start learning?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of students who are advancing their careers with
              our courses.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
              Explore Courses
            </button>
          </motion.div>
        </div>

        <Footer />
      </section>
    </div>
  );
};

export default Page;
