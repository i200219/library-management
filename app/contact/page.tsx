"use client";

import Image from "next/image";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionSuccess(false);

    try {
      // Here you would typically make an API call to submit the form
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmissionSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bebas-neue text-white mb-4">
            Contact Us
          </h1>
          <p className="text-light-100 max-w-2xl mx-auto">
            Get in touch with us for any inquiries or feedback
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-dark-300/80 backdrop-blur-md rounded-2xl p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-light-100 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-dark-200 text-light-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-light-100 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-dark-200 text-light-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-light-100 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-dark-200 text-light-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-light-100 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-dark-200 text-light-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-primary text-dark-100 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {submissionSuccess && (
              <p className="text-center text-green-400 mt-4">
                Thank you for your message! We will get back to you soon.
              </p>
            )}
          </form>
        </div>

        {/* Contact Information */}
        <div className="bg-dark-300/80 backdrop-blur-md rounded-2xl p-8">
          <h2 className="text-2xl font-bebas-neue text-white mb-6">Our Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Address</h3>
              <p className="text-light-100">
                University of South Africa<br />
                Main Campus<br />
                Nairobi, Kenya
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Contact</h3>
              <p className="text-light-100">
                Email: library@usiuniversity.ac.ke<br />
                Phone: +254 700 123 456<br />
                Library Hours: Mon-Fri 8AM-9PM, Sat-Sun 10AM-6PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
