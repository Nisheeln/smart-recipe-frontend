import React from "react";
import { Stack, Button, Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Navbar({ handleLogout }) {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        mb: 4,
        p: 2,
        borderRadius: 3,
        boxShadow: 6,
        background: "#f0f4f8",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Smart Recipe
        </Typography>

        <Stack direction="row" spacing={1}>
          
          <Button
            onClick={() => navigate("/")}
            variant="contained"
            color="secondary"
          >
            Home
          </Button>

          
          <Button
            onClick={() => navigate("/favorites")}
            variant="contained"
            color="primary"
          >
            Favorites
          </Button>

          
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
