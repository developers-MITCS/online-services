import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, logout } = useAuth();
  useEffect(() => {
    // if no token, ensure cleanup
    if (!token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
