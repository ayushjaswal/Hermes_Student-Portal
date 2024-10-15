import React, { useState } from "react";
import "../index.css"; // Importing the CSS file
import AsideNav from "../components/AppComponents/AsideNav"; // Importing the AsideNav component
import { Button } from "@/components/ui/button";

const ForumPage = () => {
  const [formData, setFormData] = useState({
    facultyEmail: "",
    ccEmail: "",
    subject: "",
    content: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log("Form Submitted:", formData);
    alert("Your message has been sent!");
  };

  return (
    <div className="md:flex min-h-screen ">
      <AsideNav className="fixed top-0 left-0 w-1/4 h-full bg-gray-800 text-white" />

      {/* Main content is responsive */}
      <div className="flex-1 mx-4 mt-6 flex flex-col gap-6">
        <div className="contact-faculty">
          <div className="text-3xl font-bold text-gray-900 mb-8">
            Contact Faculty
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="form-group mb-4">
              <label className="block mb-2 text-gray-700">
                Email of Faculty:
              </label>
              <input
                type="email"
                name="facultyEmail"
                value={formData.facultyEmail}
                onChange={handleChange}
                required
                placeholder="email"
                className="inp w-full"
              />
            </div>

            <div className="form-group mb-4">
              <label className="block mb-2 text-gray-700">CC (optional):</label>
              <input
                type="email"
                name="ccEmail"
                value={formData.ccEmail}
                onChange={handleChange}
                placeholder="CC"
                className="inp w-full"
              />
            </div>

            <div className="form-group mb-4">
              <label className="block mb-2 text-gray-700">Subject:</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="subject"
                className="inp w-full"
              />
            </div>

            <div className="form-group mb-4">
              <label className="block mb-2 text-gray-700">
                Message Content:
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                placeholder="email"
                className="inp w-full"
                rows="6"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full btn"
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
