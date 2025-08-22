// src/pages/Contact.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Contact.css";
import topPost from "../../assets/top-post1.jpg.webp";

const Contact = () => {
  return (
    <div className="container mt-5 contact-container">
      <h2 className="text-center mb-5 fw-bold animate-title">📬 Contact Us</h2>

      <div className="row align-items-center justify-content-center">
        {/* Image Section */}
        <div className="col-lg-6 mb-4 mb-lg-0 contact-image-section">
          <img
            src={topPost}// Replace with your preferred image URL
            alt="Contact illustration"
            className="img-fluid rounded shadow contact-image animate-fade"
          />
        </div>

        {/* Form Section */}
        <div className="col-lg-6">
          <form className="p-4 shadow rounded bg-white contact-form animate-fade">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Your Name</label>
              <input type="text" className="form-control" id="name" placeholder="Enter your name" required />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Your Email</label>
              <input type="email" className="form-control" id="email" placeholder="Enter your email" required />
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea className="form-control" id="message" rows="5" placeholder="Write your message here..." required></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-100">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
