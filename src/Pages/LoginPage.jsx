import React from "react";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;



export default function LoginPage({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Login failed");
        return;
      }

      localStorage.setItem("token", result.token);
      setIsLoggedIn(true); // update login state
      navigate("/"); // redirect to main page
    } catch (err) {
      console.error("Error connecting to backend:", err);
      alert("Error connecting to backend");
    }
  };

  return <AuthForm mode="login" onSubmit={handleLogin} switchTo="/signup" />;
}
