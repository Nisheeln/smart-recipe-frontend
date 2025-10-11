import React, { useState, useMemo } from "react";
import IngredientInput from "./IngredientInput";
import RecipeList from "./RecipeList";
import { Container, Paper, Typography, CssBaseline, ThemeProvider, createTheme } from "@mui/material";

// Custom theme for the app
const theme = createTheme({
  palette: {
    primary: { main: "#2563eb" },
    secondary: { main: "#f97316" },
    background: { default: "#f3f4f6" },
  },
  typography: { fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" },
});

export default function ClientApp() {
  const [ingredients, setIngredients] = useState([]);
  const [diet, setDiet] = useState("any");
  const [maxTime, setMaxTime] = useState(null);
  const [difficulty, setDifficulty] = useState("any");

  const filters = useMemo(
    () => ({ diet, maxTime, difficulty }),
    [diet, maxTime, difficulty]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3, background: "linear-gradient(145deg,#ffffff,#e0f2fe)" }}>
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            Smart Recipe Generator
          </Typography>
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
          <RecipeList ingredients={ingredients} filters={filters} />
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
