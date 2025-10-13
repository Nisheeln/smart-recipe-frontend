import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import IngredientInput from "./components/IngredientInput";
import RecipeGenerator from "./components/RecipeGenerator";
import IngredientImageUpload from "./components/IngredientImageUpload";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import FavoritesPage from "./pages/FavoritesPage";
import Navbar from "./components/Navbar";
import "./App.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
  const [ingredients, setIngredients] = useState([]);
  const [diet, setDiet] = useState("any");
  const [maxTime, setMaxTime] = useState(30);
  const [difficulty, setDifficulty] = useState("Easy");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 p-6">
        {isLoggedIn && <Navbar handleLogout={handleLogout} />}

        <Routes>
          {/* Auth Routes */}
          <Route
            path="/login"
            element={!isLoggedIn ? <LoginPage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!isLoggedIn ? <SignupPage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />}
          />

          {/* Protected Main Page */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <>
                  <IngredientImageUpload
                    onAddIngredient={(ing) => setIngredients((prev) => [...prev, ing])}
                  />

                  <IngredientInput
                    ingredients={ingredients}
                    setIngredients={setIngredients}
                    diet={diet}
                    setDiet={setDiet}
                    maxTime={maxTime}
                    setMaxTime={setMaxTime}
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                  />

                  <RecipeGenerator
                    ingredients={ingredients}
                    difficulty={difficulty}
                    time={maxTime}
                    diet={diet}
                  />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Favorites Page */}
          <Route
            path="/favorites"
            element={
              isLoggedIn ? (
                <FavoritesPage setIsLoggedIn={setIsLoggedIn} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}