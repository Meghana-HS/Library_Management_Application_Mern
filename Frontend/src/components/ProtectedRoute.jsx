// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ role, children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" />;
  }

  // make role check case-insensitive
  const userRole = (user.role || "").toUpperCase();
  const requiredRole = (role || "").toUpperCase();

  if (role && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
}
