import React from "react";
import { Card, CardContent, Typography, Stack, Chip, Divider, Button } from "@mui/material";
const backendUrl = import.meta.env.VITE_BACKEND_URL ;


export default function RecipeCard({ recipe, onRemove, showAddButton = true }) {
  if (!recipe) return null;

  const { title, cuisine, difficulty, cook_time, ingredients, steps, nutrition } = recipe;

  const handleAddFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Login to add favorites!");

      const res = await fetch(`${backendUrl}/api/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(recipe),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add favorite");
      alert("Recipe added to favorites!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2, width: 300, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 500 }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>{title || "Untitled Recipe"}</Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 1, flexWrap: "wrap" }}>
          {cuisine && <Chip label={cuisine} color="secondary" />}
          {difficulty && <Chip label={difficulty} color="warning" />}
          {cook_time != null && <Chip label={`${cook_time} mins`} color="info" />}
        </Stack>

        {ingredients && ingredients.length > 0 && (
          <>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 1 }}>Ingredients:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {ingredients.map((ing, idx) => <Chip key={idx} label={ing} variant="outlined" />)}
            </Stack>
          </>
        )}

        {steps && steps.length > 0 && (
          <>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 2 }}>Steps:</Typography>
            <ol>{steps.map((step, idx) => <li key={idx}><Typography variant="body2">{step}</Typography></li>)}</ol>
          </>
        )}

        {nutrition && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="medium">Nutrition:</Typography>
            <Stack direction="row" spacing={2}>
              {nutrition.calories != null && <Chip label={`Calories: ${nutrition.calories}`} />}
              {nutrition.protein != null && <Chip label={`Protein: ${nutrition.protein}g`} />}
            </Stack>
          </>
        )}
      </CardContent>

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        {showAddButton && <Button variant="contained" color="primary" onClick={handleAddFavorite} fullWidth>Add to Favorites</Button>}
        {onRemove && <Button variant="contained" color="error" onClick={() => onRemove(title)} fullWidth>Remove</Button>}
      </Stack>
    </Card>
  );
}
