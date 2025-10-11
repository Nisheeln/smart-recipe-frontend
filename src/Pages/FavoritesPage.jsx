import React, { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCardFav";
const backendUrl = import.meta.env.VITE_BACKEND_URL;


export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login.");

      const res = await fetch(`${backendUrl}/api/favorites`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch favorites");

      const data = await res.json();
      const validFavorites = (data.favorites || []).filter(
        (recipe) => recipe.title && recipe.title.trim() !== ""
      );
      setFavorites(validFavorites);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleRemove = async (recipeTitle) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login.");

      const res = await fetch("http://localhost:8080/api/favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title: recipeTitle }),
      });

      if (!res.ok) throw new Error("Failed to remove favorite");

      setFavorites((prev) => prev.filter((r) => r.title !== recipeTitle));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div>
      <h1>Your Favorites</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {favorites.length > 0 ? (
          favorites.map((recipe, idx) => (
            <RecipeCard
              key={recipe._id || idx}
              recipe={recipe}
              showAddButton={false}  // Hide add button
              onRemove={handleRemove} // Show remove button
            />
          ))
        ) : (
          <p>No favorites added yet.</p>
        )}
      </div>
    </div>
  );
}
