import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import blogContext from "../../context/blogContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // fixed import (not destructured)
import "./AllPosts.css";

const AllPosts = () => {
  const { backendURL } = useContext(blogContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [commentCounts, setCommentCounts] = useState({});

  const token = localStorage.getItem("token");

  let currentUserId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded.userId || decoded.id || decoded._id; // Adjust according to your token payload
    } catch (err) {
      console.error("Invalid token");
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/post/all`);
        setPosts(response.data.posts || []);
      } catch (err) {
        setError("Failed to fetch posts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCommentCounts = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/comments/counts`);
        setCommentCounts(res.data || {});
      } catch (err) {
        console.error("Failed to fetch comment counts", err);
      }
    };

    fetchPosts();
    fetchCommentCounts();
  }, [backendURL]);

  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`${backendURL}/api/comments/${postId}`);
      setComments((prev) => ({ ...prev, [postId]: res.data }));
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleInputChange = (postId, value) => {
    setNewComment((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId) => {
    try {
      await axios.post(
        `${backendURL}/api/comments/${postId}`,
        { content: newComment[postId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
      fetchComments(postId);
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("Failed to submit comment");
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`${backendURL}/api/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete post");
    }
  };

  return (
    <>
      <div className="mt-5 container">
        <h2 className="mb-4 text-center fw-bold animate-title">
          📝 All Blog Posts
        </h2>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-danger text-center">{error}</p>}

        {posts.length === 0 && !loading && (
          <p className="text-center text-muted">No posts found.</p>
        )}

        <div className="row">
          {posts.map((post) => {
            const isAuthor = post.author?._id === currentUserId;

            return (
              <div className="col-md-6 mb-4" key={post._id}>
                <div
                  className={`card post-card shadow-sm animate-card ${
                    isAuthor ? "border-primary" : ""
                  }`}
                >
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
                        <p className="text-muted">
                          💬 {commentCounts[post._id] || 0} comments
                        </p>
                        <div className="overlay-buttons mt-2">
                          {isAuthor && (
                            <button
                              className="btn btn-sm btn-outline-light me-2"
                              onClick={() => handleDelete(post._id)}
                            >
                              Delete
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-outline-light me-2"
                            onClick={() => fetchComments(post._id)}
                          >
                            Comments
                          </button>
                          <Link
                            to={`/post/${post._id}`}
                            className="btn btn-sm btn-outline-light"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Comment input */}
                  <div className="p-3 border-top comment-input-section">
                    <div className="d-flex">
                      <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Write a comment..."
                        value={newComment[post._id] || ""}
                        onChange={(e) =>
                          handleInputChange(post._id, e.target.value)
                        }
                      />
                      <button
                        className="btn send-btn btn-primary"
                        onClick={() => handleCommentSubmit(post._id)}
                        disabled={!newComment[post._id]}
                      >
                        Send
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {comments[post._id] && (
                    <div className="comment-section p-3 border-top">
                      <h6 className="mb-3">💬 Comments</h6>
                      {comments[post._id].length > 0 ? (
                        comments[post._id].map((comment) => (
                          <div
                            key={comment._id}
                            className="mb-2 pb-2 border-bottom comment-item"
                          >
                            <p className="mb-1">{comment.content}</p>
                            <small className="text-muted">
                              <span className="comment-author">
                                {comment.author?.name || "Anonymous"}
                              </span>{" "}
                              | {new Date(comment.createdAt).toLocaleString()}
                            </small>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">No comments yet.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default AllPosts;
