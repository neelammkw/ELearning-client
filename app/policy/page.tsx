"use client";
import React, { FC, useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Footer from "../components/Route/Footer";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

const Page: FC = () => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [activeItem] = useState(3);
  const [route, setRoute] = useState("Login");

  const policies = [
    {
      title: "Privacy Policy",
      content: [
        "We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information when you use our platform.",
        "We collect information you provide when registering, enrolling in courses, or contacting support. This may include name, email, payment information, and learning progress.",
        "Your data is used to provide services, personalize learning, process payments, and communicate with you. We do not sell your personal information to third parties.",
        "We implement industry-standard security measures to protect your data, including encryption and secure servers. However, no internet transmission is 100% secure.",
      ],
    },
    {
      title: "Refund Policy",
      content: [
        "We offer a 30-day money-back guarantee for all course purchases. If you're unsatisfied with your course, contact us within 30 days of purchase for a full refund.",
        "To request a refund, email support@elearning.com with your order details and reason for requesting a refund. Refunds are processed within 5-7 business days.",
        "Once a refund is issued, you will lose access to the course materials and any earned certificates.",
        "Refunds are not available for subscription payments after the initial 30-day period, but you can cancel future payments at any time.",
      ],
    },
    {
      title: "Terms of Service",
      content: [
        "By using our platform, you agree to these terms. You must be at least 13 years old to create an account or 18 to make purchases.",
        "All course materials are protected by copyright and are for your personal, non-commercial use only. Redistribution or resale is prohibited.",
        "We reserve the right to terminate accounts for violations of these terms, including abusive behavior, fraud, or copyright infringement.",
        "The platform is provided 'as is' without warranties. We're not liable for any indirect damages resulting from your use of the service.",
      ],
    },
    {
      title: "Cookie Policy",
      content: [
        "We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content.",
        "Essential cookies are necessary for the platform to function. Performance cookies help us understand how visitors interact with our site.",
        "You can control cookies through your browser settings, but disabling them may affect functionality.",
        "We may use third-party services that set their own cookies for analytics and advertising purposes.",
      ],
    },
  ];

  return (
    <div
      className={`min-h-screen hero-animation ${
        theme === "dark"
          ? "dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800"
          : "bg-gradient-to-br from-blue-50 to-purple-50"
      }`}
    >
      <section>
        <Heading
          title="Policies - ELearning"
          description="Our platform policies and terms"
          keywords="privacy policy, terms of service, refund policy"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />

        {/* Hero Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1
              className={`text-4xl md:text-5xl  font-bold mb-3 ${
                theme === "dark" ? "text-gray-200" : "text-black"
              } text-center`}
            >
              Our{" "}
              <span className="text-blue-600 dark:text-blue-400">Policies</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Transparency is important to us. Review our policies to understand
              how we operate.
            </p>
          </motion.div>
        </div>

        {/* Policies Section */}
        <div className="py-1 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="space-y-12">
            {policies.map((policy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8"
              >
                <h2 className="text-2xl font-bold mb-6 dark:text-white">
                  {policy.title}
                </h2>
                <div className="space-y-4">
                  {policy.content.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-gray-600 dark:text-gray-300"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Last Updated */}
        <div className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-gray-500 dark:text-gray-400"
          >
            <p>
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="mt-2">
              We may update these policies periodically. Please check back for
              changes.
            </p>
          </motion.div>
        </div>

        <Footer />
      </section>
    </div>
  );
};

export default Page;
