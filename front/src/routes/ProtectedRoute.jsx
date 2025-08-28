import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const BASE_PATH = "/new-inntech"; 

  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <Navigate to={`${BASE_PATH}/login`} replace />;
  }

  return children;
};

export default ProtectedRoute;
