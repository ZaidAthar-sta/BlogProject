import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import blogContext from "../../context/blogContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./AllPosts.css";

const AllPosts = () => {
  const { backendURL } = useContext(blogContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentsCount, setCommentsCount] = useState({});
  const [visibleComments, setVisibleComments] = useState({}); // ⬅️ New
  const [comments, setComments] = useState({}); // ⬅️ New
  const [newComment, setNewComment] = useState({});

  const token = localStorage.getItem("token");

  let currentUserId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded.userId || decoded.id || decoded._id;
    } catch (err) {
      console.error("Invalid token");
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/post/all`);
        const postsData = response.data.posts || [];
        setPosts(postsData);

        const countsPromises = postsData.map((post) =>
          axios
            .get(`${backendURL}/api/comments/count/${post._id}`)
            .then((res) => ({ postId: post._id, count: res.data.count }))
            .catch(() => ({ postId: post._id, count: 0 }))
        );

        const countsResults = await Promise.all(countsPromises);
        const countsObj = {};
        countsResults.forEach(({ postId, count }) => {
          countsObj[postId] = count;
        });
        setCommentsCount(countsObj);
      } catch (err) {
        setError("Failed to fetch posts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [backendURL]);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.post(
        `${backendURL}/api/post/delete/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      setCommentsCount((prevCounts) => {
        const newCounts = { ...prevCounts };
        delete newCounts[postId];
        return newCounts;
      });
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Failed to delete post");
    }
  };

  const toggleComments = async (postId) => {
    const isVisible = visibleComments[postId];

    if (isVisible) {
      // Hide comments
      setVisibleComments((prev) => ({ ...prev, [postId]: false }));
    } else {
      // Show comments
      if (!comments[postId]) {
        try {
          const res = await axios.get(`${backendURL}/api/comments/${postId}`);
          setComments((prev) => ({
            ...prev,
            [postId]: res.data.comments || [],
          }));
        } catch (err) {
          console.error("Failed to fetch comments:", err);
          alert("Error fetching comments");
        }
      }
      setVisibleComments((prev) => ({ ...prev, [postId]: true }));
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!newComment[postId]?.trim()) return;

    try {
      const res = await axios.post(
        `${backendURL}/api/comments/${postId}`,
        { content: newComment[postId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createdComment = res.data.comment;

      setComments((prev) => ({
        ...prev,
        [postId]: [createdComment, ...(prev[postId] || [])],
      }));

      setCommentsCount((prev) => ({
        ...prev,
        [postId]: (prev[postId] || 0) + 1,
      }));

      setNewComment((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Failed to post comment:", err);
      alert("Failed to add comment");
    }
  };

  return (
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
          const count = commentsCount[post._id] || 0;
          const isVisible = visibleComments[post._id];

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
                    <div className="image-overlay d-flex flex-column justify-content-end p-3">
                      <h5 className="overlay-title">{post.title}</h5>
                      <p className="overlay-author">
                        By {post.author?.name || "Unknown"}
                      </p>
                      <p className="text-light small">
                        💬 {count} {count === 1 ? "comment" : "comments"}
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
                          onClick={() => toggleComments(post._id)}
                        >
                          {isVisible ? "Hide" : "Comments"}
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
                {/* Show Comments if visible */}
                {isVisible && (
                  <div className="card-body bg-light">
                    <h6 className="fw-bold mb-2">Comments:</h6>
                    {comments[post._id]?.length > 0 ? (
                      <ul className="list-group list-group-flush">
                        {comments[post._id].map((comment) => (
                          <li key={comment._id} className="list-group-item">
                            <strong>
                              {comment.author?.name || "Anonymous"}:
                            </strong>{" "}
                            {comment.content}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">No comments yet.</p>
                    )}

                    {token && (
                      <div className="mt-3">
                        <textarea
                          className="form-control"
                          rows="2"
                          placeholder="Write a comment..."
                          value={newComment[post._id] || ""}
                          onChange={(e) =>
                            setNewComment((prev) => ({
                              ...prev,
                              [post._id]: e.target.value,
                            }))
                          }
                        ></textarea>
                        <button
                          className="btn btn-sm btn-primary mt-2"
                          onClick={() => handleCommentSubmit(post._id)}
                        >
                          Post Comment
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllPosts;
