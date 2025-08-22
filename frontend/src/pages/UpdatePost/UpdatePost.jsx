import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import blogContext from "../../context/blogContext";

const UpdatePost = () => {
  const { id } = useParams(); // Post ID from route
  const navigate = useNavigate();
  const { backendURL } = useContext(blogContext);

  const [post, setPost] = useState({
    title: "",
    body: "",
    isPublished: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token"); // Adjust based on your auth setup

  // Fetch existing post data (optional)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/post/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { title, body, isPublished } = res.data.post;
        setPost({ title, body, isPublished });
      } catch (err) {
        setError("Failed to load post");
        console.error(err);
      }
    };

    fetchPost();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${backendURL}/api/post/update/${id}`, post, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Post updated successfully!");
      navigate("/all");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update post");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Update Post</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Body:</label>
          <textarea
            name="body"
            value={post.body}
            onChange={handleChange}
            rows="6"
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="isPublished"
              checked={post.isPublished}
              onChange={handleChange}
            />
            Published
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePost;
