import React, { useState } from "react";
import {
  Card, CardContent, CardHeader,
  TextField, Button, Stack, Chip
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

export default function IngredientInput({
  ingredients, setIngredients,
  diet, setDiet,
  maxTime, setMaxTime,
  difficulty, setDifficulty
}) {
  const [newIngredient, setNewIngredient] = useState("");

  const handleAddIngredient = () => {
    const ing = newIngredient.trim();
    if (ing && !ingredients.includes(ing)) {
      setIngredients([...ingredients, ing]);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (ing) => {
    setIngredients(ingredients.filter(i => i !== ing));
  };

  return (
    <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 6, background: "#f0f4f8" }}>
      <CardHeader title="Ingredients Input" sx={{ color: "#1e3a8a" }} />
      <CardContent>
        <Stack spacing={2}>
          {/* Manual Input */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Enter Ingredient"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={handleAddIngredient}
            >
              Add
            </Button>
          </Stack>

          {/* Ingredient Chips */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {ingredients.map((ing, idx) => (
              <Chip
                key={idx}
                label={ing}
                color="primary"
                onDelete={() => handleRemoveIngredient(ing)}
                deleteIcon={<DeleteIcon />}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>

          {/* Filters */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              select
              label="Diet"
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="any">Any</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten-Free</option>
            </TextField>

            <TextField
              label="Max Cooking Time (min)"
              type="number"
              value={maxTime || ""}
              onChange={(e) => setMaxTime(Number(e.target.value))}
            />

            <TextField
              select
              label="Difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="any">Any</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </TextField>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
