import React, { useState } from "react";
import { Card, CardContent, CardHeader, TextField, Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function AuthForm({ mode = "login", onSubmit, switchTo }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (mode === "signup" && !name)) {
      setError("All fields are required.");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const data = mode === "signup" ? { name, email, password } : { email, password };
    onSubmit(data);
  };

  return (
    <Card
      sx={{
        width: { xs: "90%", sm: 400 }, // 90% width on mobile, fixed 400px on tablet+
        mx: "auto",
        mt: { xs: 6, sm: 10 }, // smaller top margin on mobile
        borderRadius: 3,
        boxShadow: 6,
      }}
    >
      <CardHeader
        title={mode === "login" ? "Login" : "Sign Up"}
        sx={{
          textAlign: "center",
          color: "#1e3a8a",
          fontSize: { xs: "1.3rem", sm: "1.5rem" }, // responsive font size
        }}
      />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {error && <Typography color="error" sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}>{error}</Typography>}

            {mode === "signup" && (
              <TextField
                label="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
                size="small"
              />
            )}

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              size="small"
            />

            {mode === "signup" && (
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
                size="small"
              />
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: { xs: 1.5, sm: 2 } }} // responsive button padding
            >
              {mode === "login" ? "Login" : "Sign Up"}
            </Button>

            {/* Switch link */}
            {switchTo && (
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  mt: 1,
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                }}
              >
                <Link to={switchTo}>{mode === "login" ? "Create an account" : "Already have an account?"}</Link>
              </Typography>
            )}
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
