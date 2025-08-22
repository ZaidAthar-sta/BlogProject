// src/components/CategoryNav.jsx
import React from "react";
import { Link } from "react-router-dom";
import categories from "../data/categories"; // static list

const CategoryNav = () => {
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-primary text-white fw-bold">
        Categories
      </div>
      <ul className="list-group list-group-flush">
        {categories.map((cat) => (
          <li key={cat} className="list-group-item">
            <Link to={`/category/${cat}`} className="text-decoration-none text-dark text-capitalize">
              {cat}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryNav;
