import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useContext } from "react";
import blogContext from "../../context/blogContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { backendURL } = useContext(blogContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendURL + "/api/user/login", {
        email,
        password,
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        console.log(response.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="main-container p-0 container mt-5 form-control d-flex">
        {/* <div className="login-img">
                         <img src={} alt="" />
                    </div> */}
        <div className="login-form d-flex flex-column justify-content-center align-items-center">
          <h1>
            <strong> Sign In Here</strong>
          </h1>
          <form onSubmit={handleSubmit} action="">
            <div className="email-div my-3">
              <label className="m-2" htmlFor="email">
                <b>Email</b>
              </label>
              <input
                placeholder="Enter Your Email"
                className=" form-control"
                type="text"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="password-div my-3">
              <label className="m-2" htmlFor="password">
                <b>Password</b>
              </label>
              <input
                placeholder="Enter Password here"
                className=" form-control"
                type="text"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="btn-link">
              <button className="btn bg-success text-white" type="submit">
                Login
              </button>
              <div className="d-flex mt-4 justify-content-center">
                <p className="mx-3 my-0">Don't Have an Account?</p>
                <Link to={"/register"}>Create Account</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
