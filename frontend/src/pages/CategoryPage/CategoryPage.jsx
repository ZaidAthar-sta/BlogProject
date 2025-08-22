// src/pages/CategoryPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import blogContext from "../../context/blogContext";
import "./AllPosts.css"; // ✅ Reuse existing AllPosts styles

const CategoryPage = () => {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backendURL } = useContext(blogContext);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/post/category/${category}`);
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error("Error fetching posts by category", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [category]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center fw-bold animate-title">
        🗂 Posts in "{category.replace("-", " ")}"
      </h2>

      {loading && <p className="text-center">Loading...</p>}

      {!loading && posts.length === 0 && (
        <p className="text-center text-muted">No posts found in this category.</p>
      )}

      <div className="row">
        {posts.map((post) => (
          <div className="col-md-6 mb-4" key={post._id}>
            <div className="card post-card shadow-sm animate-card">
              {post.imageUrl && (
                <div className="image-overlay-container position-relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="card-img-top post-image"
                  />
                  <div className="image-overlay">
                    <h5 className="overlay-title">{post.title}</h5>
                    <p className="overlay-author">
                      By {post.author?.name || "Unknown"}
                    </p>
                    <p className="text-white">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <div className="overlay-buttons mt-2">
                      <Link to={`/post/${post._id}`} className="btn btn-sm btn-outline-light">
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
    