import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Layout } from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import { DashboardPage } from "./pages/DashboardPage";
import { UnauthorizedPage } from "./pages/UnAuthorizedPage";
import { AuthProvider } from "./context/AuthContext";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
