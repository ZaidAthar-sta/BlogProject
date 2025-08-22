import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css"; // Optional custom styles
// import categories from "../../data/categories.js";

const categories = [
  "technology",
  "travel",
  "health",
  "finance",
  "lifestyle",
  "education",
  "sports",
];

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark custom-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <i>
            Morning's <span style={{ color: "red" }}>Magazine</span>
          </i>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/all">
                All Posts
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/post/create">
                Create Post
              </Link>
            </li>

            {/* 👇 Categories Dropdown */}
            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle"
                id="categoryDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </span>
              <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                {categories.map((cat) => (
                  <li key={cat}>
                    <Link
                      className="dropdown-item text-capitalize"
                      to={`/category/${cat}`}
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>
          </ul>

          <button
            onClick={handleLogOut}
            className="btn btn-outline-light"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
