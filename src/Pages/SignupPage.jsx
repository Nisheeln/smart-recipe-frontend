import React from "react";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function SignupPage({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleSignup = async (data) => {
    try {
      const res = await fetch(`${backendUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Signup failed");
        return;
      }

      

      
      localStorage.setItem("token", result.token);
      setIsLoggedIn(true);

      
      navigate("/");
    } catch (err) {
      console.error("Error during signup:", err);
      alert("Error connecting to backend");
    }
  };

  return <AuthForm mode="signup" onSubmit={handleSignup} switchTo="/login" />;
}