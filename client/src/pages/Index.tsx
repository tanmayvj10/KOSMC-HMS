
import { useState, useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check for existing login on component mount
  useEffect(() => {
    const savedLoginState = localStorage.getItem("isLoggedIn");
    if (savedLoginState === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    // Save login state to localStorage
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Clear login state from localStorage
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    // Clear other user state
    localStorage.removeItem("userRole");
    // Navigate back to the login page
    navigate("/");
  };

  return isLoggedIn ? (
    <MainLayout onLogout={handleLogout}>
      <Dashboard />
    </MainLayout>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hotel-50 to-hotel-100">
      <div className="w-full max-w-md px-4">
        <LoginForm onLogin={handleLogin} />
        <p className="text-center mt-6 text-sm text-muted-foreground">
          Demo credentials: Any username and password combination will work
        </p>
      </div>
    </div>
  );
};

export default Index;
