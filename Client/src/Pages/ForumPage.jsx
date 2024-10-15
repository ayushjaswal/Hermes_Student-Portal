import React, { useState } from "react";
import "../index.css"; // Importing the CSS file
import AsideNav from "../components/AppComponents/AsideNav"; // Importing the AsideNav component

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
    <div className="flex min-h-screen ">
      <AsideNav className="fixed top-0 left-0 w-1/4 h-full bg-gray-800 text-white" />

      {/* Main content is responsive */}
      <div className="ml-1/4 w-full md:ml-1/4 md:w-3/4 p-6">
        <div className="contact-faculty">
          <div className="title text-xl md:text-2xl font-bold my-8">Contact Faculty</div>

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label className="block mb-2 text-gray-700">Email of Faculty:</label>
              <input
                type="email"
                name="facultyEmail"
                value={formData.facultyEmail}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="form-group mb-4">
              <label className="block mb-2 text-gray-700">CC (optional):</label>
              <input
                type="email"
                name="ccEmail"
                value={formData.ccEmail}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
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
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="form-group mb-4">
              <label className="block mb-2 text-gray-700">Message Content:</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows="6"
              />
            </div>

            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
