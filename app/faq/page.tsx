"use client";
import React, { FC, useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Footer from "../components/Route/Footer";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const Page: FC = () => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [activeItem] = useState(4); // Assuming FAQ is item 4 in your navigation
  const [route, setRoute] = useState("Login");
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer:
        "You can enroll in any course by clicking the 'Enroll Now' button on the course page. You'll need to create an account or log in if you already have one. After enrollment, you'll get immediate access to the course materials.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and in some regions, bank transfers. All payments are processed securely through our payment gateway partners.",
    },
    {
      question: "Can I access courses on mobile devices?",
      answer:
        "Yes! Our platform is fully responsive and works on all devices including smartphones and tablets. You can also download our mobile app from the App Store or Google Play for an optimized learning experience.",
    },
    {
      question: "What if I'm not satisfied with a course?",
      answer:
        "We offer a 30-day money-back guarantee for all courses. If you're not satisfied with your purchase, simply contact our support team within 30 days of enrollment for a full refund.",
    },
    {
      question: "How do certificates work?",
      answer:
        "Upon successful completion of a course (including all assignments and exams), you'll receive a digital certificate that you can download and share on LinkedIn or print for your records. Our certificates include a unique verification URL.",
    },
    {
      question: "Are there any prerequisites for courses?",
      answer:
        "Prerequisites vary by course. Some beginner courses require no prior knowledge, while advanced courses may have specific requirements. These are clearly listed on each course description page.",
    },
  ];

  const toggleQuestion = (index: number) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

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
          title="FAQ - ELearning"
          description="Frequently asked questions about our platform"
          keywords="elearning faq, course questions, help center"
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
              className={`text-4xl md:text-5xl  font-bold mb-6 ${
                theme === "dark" ? "text-gray-200" : "text-black"
              } text-center`}
            >
              Frequently Asked{" "}
              <span className="text-blue-600 dark:text-blue-400">
                Questions
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find answers to common questions about our platform, courses, and
              policies.
            </p>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <div className=" px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  className={`w-full p-6 text-left flex justify-between items-center ${activeQuestion === index ? "bg-blue-50 dark:bg-gray-700" : "bg-white dark:bg-gray-800"}`}
                  onClick={() => toggleQuestion(index)}
                >
                  <h3 className="text-lg font-medium dark:text-white">
                    {faq.question}
                  </h3>
                  {activeQuestion === index ? (
                    <FiChevronUp className="text-gray-500 dark:text-gray-400 text-xl" />
                  ) : (
                    <FiChevronDown className="text-gray-500 dark:text-gray-400 text-xl" />
                  )}
                </button>
                {activeQuestion === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6 pt-2 bg-white dark:bg-gray-800"
                  >
                    <p className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Support CTA */}
        <div className="py-4 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-blue-600 dark:bg-blue-700 rounded-xl p-8 text-white"
          >
            <h2 className="text-3xl font-bold mb-6">Still have questions?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Our support team is here to help you 24/7.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
              Contact Support
            </button>
          </motion.div>
        </div>

        <Footer />
      </section>
    </div>
  );
};

export default Page;
