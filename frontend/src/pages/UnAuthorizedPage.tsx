import React from "react";
import { useNavigate } from "react-router-dom";

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-2">
          401 - Unauthorized
        </h1>

        <p className="text-gray-600 mb-6">
          You don’t have permission to access this page.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
