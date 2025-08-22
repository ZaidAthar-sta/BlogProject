import "./App.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp/SignUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Navbar from "./components/Navbar/Navbar";
import Layout from "./components/Layout/Layout";
import CreatePost from "./pages/CreatePost/CreatePost";
import AllPosts from "./pages/AllPosts/AllPosts";
import UpdatePost from "./pages/UpdatePost/UpdatePost";
import { useContext } from "react";
import blogContext from "./context/blogContext";
import SinglePost from "./pages/SinglePost/SinglePost";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import CategoryPage from "./pages/CategoryPage/CategoryPage";

function App() {
  const { backendURL } = useContext(blogContext);

  return (
    <>
      <div className="App">
        <BrowserRouter>
          {/* <h1>Home Page</h1> */}
          <ToastContainer />
          <Routes>
            <Route path="/register" element={<SignUp />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/post/create" element={<CreatePost />} />
                <Route path="/all" element={<AllPosts />} />
                <Route
                  path="/post/:id"
                  element={<SinglePost backendURL={backendURL} />}
                />
                <Route path="/post/edit/:id" element={<UpdatePost />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/category/:category" element={<CategoryPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
