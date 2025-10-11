import React from "react";
import { Stack, Button, Card } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar({ handleLogout }) {
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
        <Stack direction="row" spacing={2}>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/favorites"
            variant="contained"
            color="success"
          >
            Favorites
          </Button>
        </Stack>

        <Button
          onClick={handleLogout}
          variant="contained"
          color="error"
        >
          Logout
        </Button>
      </Stack>
    </Card>
  );
}
