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
    <div className="md:flex">
    <AsideNav />
    <div className="contact-faculty">
        <div  className="title w-full my-8">Contact Faculty</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email of Faculty:</label>
            <input
              type="email"
              name="facultyEmail"
              value={formData.facultyEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>CC (optional):</label>
            <input
              type="email"
              name="ccEmail"
              value={formData.ccEmail}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Subject:</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Message Content:</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">Send</button>
        </form>
      </div>
      
    </div>
  );
};

export default ForumPage;
