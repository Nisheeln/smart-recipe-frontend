import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import {
  Button,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Typography,
  Chip,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function RecipeGenerator({ ingredients, difficulty, time, diet }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const generateRecipes = async () => {
    if (ingredients.length === 0) {
      alert("Please add some ingredients first!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          difficulty,
          time,
          dietaryPreference: diet,
        }),
      });

      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (err) {
      console.error("Error generating recipes:", err);
      alert("Failed to generate recipes.");
    }

    setLoading(false);
  };

  
  const handleToggleFavorite = (title, add) => {
    if (add) {
      const recipeToAdd = recipes.find((r) => r.title === title);
      if (recipeToAdd) setFavorites((prev) => [...prev, recipeToAdd]);
    } else {
      setFavorites((prev) => prev.filter((r) => r.title !== title));
    }
  };

  return (
    <Card sx={{ mt: 4, mb: 6, p: 3, borderRadius: 3, boxShadow: 4 }}>
      <CardContent>
        <Stack spacing={2} alignItems="center">
          {/* Display selected ingredients as Chips */}
          {ingredients.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
              {ingredients.map((ing, idx) => (
                <Chip key={idx} label={ing} color="primary" variant="outlined" />
              ))}
            </Stack>
          )}

          
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={generateRecipes}
            size="large"
            sx={{
              mt: 2,
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              borderRadius: 3,
              background: "linear-gradient(45deg, #2563eb, #1d4ed8)",
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Recipes"}
          </Button>

          
          {loading && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Getting Recipe From OpenAI, please wait...
            </Typography>
          )}

          
          {recipes.length === 0 && !loading && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Add ingredients and click "Generate Recipes" to see results.
            </Typography>
          )}

          
          <Stack spacing={3} sx={{ width: "100%", mt: 3 }}>
            {recipes.map((recipe, idx) => (
              <RecipeCard
                key={idx}
                recipe={recipe}
                isFavorited={favorites.some((fav) => fav.title === recipe.title)}
                onToggleFavorite={handleToggleFavorite} // pass the function here
              />
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
