// src/pages/About.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./About.css";

const About = () => {
  return (
    <div className="container mt-5 about-page animate-fade-in">
      <div className="row align-items-center">
        <div className="col-md-6 mb-4 mb-md-0">
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
            alt="Blogging"
            className="img-fluid rounded shadow animate-zoom-in"
          />
        </div>
        <div className="col-md-6">
          <h1 className="fw-bold mb-3">About This Blog</h1>
          <p className="lead">
            Welcome to our blogging platform — a space for curious minds,
            passionate writers, and insightful thinkers.
          </p>
          <p>
            Our mission is to create a vibrant and inclusive space where
            creativity meets technology. Whether you're here to share your
            thoughts, explore diverse perspectives, or just get inspired — we're
            glad you're here!
          </p>
          <p>
            Built using <strong>MERN Stack</strong>, this platform embraces
            community-powered storytelling and the freedom to express yourself
            authentically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
