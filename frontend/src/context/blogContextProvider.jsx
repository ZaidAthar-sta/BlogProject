import React from "react";
import blogContext from "./blogContext";

const BlogContextProvider = ({ children }) => {
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const contextVal = {
    backendURL
  };

  return (
    <blogContext.Provider value={contextVal}>

        {children}
       
        </blogContext.Provider>
  );
};

export default BlogContextProvider;
