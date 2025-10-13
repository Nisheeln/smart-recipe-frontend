import React from "react";
import { Card, CardContent, Typography, Stack, Chip, Divider, Button } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function RecipeCard({ recipe, onRemove, isFavorited, onToggleFavorite }) {
  if (!recipe) return null;

  const { title, cuisine, difficulty, cook_time, ingredients, steps, nutrition } = recipe;

  const handleAddFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/api/favorites/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipe }),
      });

      const result = await res.json();
      if (res.ok) {
        onToggleFavorite(title, true);
      } else {
        alert(result.error || "Failed to add favorite");
      }
    } catch (err) {
      console.error("Error adding favorite:", err);
      alert("Error adding to favorites");
    }
  };

  const handleRemoveFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/api/favorites/remove/${title}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (res.ok) {
        onToggleFavorite(title, false);
      } else {
        alert(result.error || "Failed to remove favorite");
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
      alert("Error removing from favorites");
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        p: 3,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 500,
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {title || "Untitled Recipe"}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: "wrap" }}>
          {cuisine && <Chip label={cuisine} color="secondary" />}
          {difficulty && <Chip label={difficulty} color="warning" />}
          {cook_time != null && <Chip label={`${cook_time} mins`} color="info" />}
        </Stack>

        {ingredients && ingredients.length > 0 && (
          <>
            <Typography variant="h6" fontWeight="medium" sx={{ mt: 1 }}>
              Ingredients:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {ingredients.map((ing, idx) => (
                <Chip key={idx} label={ing} variant="outlined" />
              ))}
            </Stack>
          </>
        )}

        {steps && steps.length > 0 && (
          <>
            <Typography variant="h6" fontWeight="medium" sx={{ mt: 2 }}>
              Steps:
            </Typography>
            <ol>
              {steps.map((step, idx) => (
                <li key={idx}>
                  <Typography variant="body1">{step}</Typography>
                </li>
              ))}
            </ol>
          </>
        )}

        {nutrition && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" fontWeight="medium">
              Nutrition:
            </Typography>
            <Stack direction="row" spacing={2}>
              {nutrition.calories != null && <Chip label={`Calories: ${nutrition.calories}`} />}
              {nutrition.protein != null && <Chip label={`Protein: ${nutrition.protein}g`} />}
            </Stack>
          </>
        )}
      </CardContent>

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color={isFavorited ? "error" : "primary"}
          startIcon={isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          onClick={isFavorited ? handleRemoveFavorite : handleAddFavorite}
          fullWidth
        >
          {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
        </Button>

        {onRemove && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => onRemove(title)}
            fullWidth
          >
            Remove
          </Button>
        )}
      </Stack>
    </Card>
  );
}
