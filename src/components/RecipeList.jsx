import React, { useMemo } from "react";
import RecipeCard from "./RecipeCard";
import { Grid, Typography } from "@mui/material";
import { RECIPES } from "../data/recipes";

export default function RecipeList({ ingredients, filters }) {
  const filteredRecipes = useMemo(() => {
    if (ingredients.length === 0) return [];
    return RECIPES.filter(recipe => {
      const ingredientMatch = ingredients.every(i => recipe.ingredients.includes(i.toLowerCase()));
      const dietMatch = filters.diet === "any" || recipe.tags.includes(filters.diet);
      const timeMatch = !filters.maxTime || recipe.cook_time <= filters.maxTime;
      const difficultyMatch = filters.difficulty === "any" || recipe.difficulty === filters.difficulty;
      return ingredientMatch && dietMatch && timeMatch && difficultyMatch;
    });
  }, [ingredients, filters]);

  if (!filteredRecipes.length) {
    return <Typography>No recipes found — try adding more ingredients or relaxing filters.</Typography>;
  }

  return (
    <Grid container spacing={3}>
      {filteredRecipes.map(recipe => (
        <Grid item xs={12} sm={6} md={4} key={recipe.id}>
          <RecipeCard recipe={recipe} />
        </Grid>
      ))}
    </Grid>
  );
}
