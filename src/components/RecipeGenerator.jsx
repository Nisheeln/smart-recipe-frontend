// RecipeGenerator.jsx
import React, { useState } from "react";
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

          {/* Generate Recipes Button */}
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
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Recipes"}
          </Button>

          {/* Message when no recipes */}
          {recipes.length === 0 && !loading && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Add ingredients and click "Generate Recipes" to see results.
            </Typography>
          )}

          {/* Recipes List */}
          <Stack spacing={3} sx={{ width: "100%", mt: 3 }}>
            {recipes.map((recipe, idx) => (
              <RecipeCard key={idx} recipe={recipe} />
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
