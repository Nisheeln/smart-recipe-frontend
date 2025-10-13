import React, { useState, useEffect } from "react";
import { Grid, Typography, Container, CircularProgress, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${backendUrl}/api/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch favorites");

      const result = await res.json();
      setFavorites(result.favorites || []);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      alert("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (title) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/api/favorites/remove/${title}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setFavorites(favorites.filter(fav => fav.title !== title));
        alert("Recipe removed from favorites");
      } else {
        alert("Failed to remove recipe");
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
      alert("Error removing from favorites");
    }
  };

  const handleToggleFavorite = (title, isFavorited) => {
    if (!isFavorited) {
      setFavorites(favorites.filter(fav => fav.title !== title));
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        My Favorite Recipes
      </Typography>

      {favorites.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            You haven't added any favorites yet!
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{ mt: 2 }}
          >
            Browse Recipes
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((recipe) => (
            <Grid key={recipe.title}>
              <RecipeCard
                recipe={recipe}
                isFavorited={true}
                onToggleFavorite={handleToggleFavorite}
                onRemove={handleRemoveFavorite}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
