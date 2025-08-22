import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useContext } from "react";
import blogContext from "../../context/blogContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { backendURL } = useContext(blogContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("backendURL:", backendURL);
    try {
      const response = await axios.post(backendURL + "/api/user/register", {
        name,
        email,
        password,
      });
      if (response.data.success) {
     
        toast.success(response.data.message);
        navigate("/home")
        
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <>
      <div className="sign-up-form">
        <h1>Sign Up Here !!!</h1>
        <form onSubmit={handleSubmit} action="">
          <div className="name">
            <label htmlFor="name">Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="name"
              placeholder="Enter name here"
            />
          </div>
          <div className="email">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              id="email"
              placeholder="Enter email here"
            />
          </div>
          <div className="password">
            <label htmlFor="password">Password</label>
            <input
              type="text"
              id="password"
              placeholder="Enter password here"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Sign Up</button>
          <p className="mx-3 my-0">Already Have an Account?</p>
          <Link to={"/login"}>Sign In Here</Link>
        </form>
      </div>
    </>
  );
};

export default SignUp;
