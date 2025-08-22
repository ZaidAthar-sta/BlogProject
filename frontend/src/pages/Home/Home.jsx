import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import top_post from "../../assets/top-post1.jpg.webp";
import AllPosts from "../AllPosts/AllPosts";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-banner bg-light py-5">
        <div className="row container align-items-center hero-section p-5 rounded shadow-sm">
          {/* Text Section */}
          <div className="col-md-6 hero-text">
            <h1 className="display-4 fw-bold animate-fade-in">
              Welcome to Our Blog
            </h1>
            <p className="lead animate-slide-in">
              Discover insightful posts, share your stories, and connect with a
              vibrant community.
            </p>
            <a
              href="/all"
              className="btn btn-primary btn-lg mt-3 animate-button"
            >
              Explore Posts
            </a>
          </div>

          {/* Image Section */}
          <div className="col-md-6 hero-image text-center">
            <img
              src={top_post}
              alt="Hero Banner"
              className="img-fluid rounded shadow-lg animate-zoom-in"
            />
          </div>
        </div>
      </div>

      <div className="all-posts mt-5">
        <AllPosts />
      </div>
    </div>
  );
};

export default Home;
