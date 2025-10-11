import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Stack,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function IngredientImageUpload({ onAddIngredient }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setDetectedIngredients([]);
      setSelectedIngredients({});
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${backendUrl}/api/detect-Ingredient`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const ingredients = response.data.ingredients || [];
      if (ingredients.length === 0) {
        alert("No ingredients detected!");
        return;
      }

      // Filter ingredients with confidence >= 70%
      const highConfidence = ingredients.filter((i) => i.confidence >= 0.7);

      // Remove duplicate ingredient names
      const uniqueIngredients = [
        ...new Map(highConfidence.map((i) => [i.name, i])).values(),
      ];

      setDetectedIngredients(uniqueIngredients);

      // Initialize selected state
      const initSelected = {};
      uniqueIngredients.forEach((i) => (initSelected[i.name] = true));
      setSelectedIngredients(initSelected);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to detect ingredients. Check backend logs.");
    }
  };

  const handleCheckboxChange = (name) => {
    setSelectedIngredients((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleAddSelected = () => {
    const selected = Object.keys(selectedIngredients).filter(
      (name) => selectedIngredients[name]
    );
    onAddIngredient(selected); // Pass array of selected ingredients
    setImage(null);
    setPreview("");
    setDetectedIngredients([]);
    setSelectedIngredients({});
  };

  const handleReset = () => {
    setImage(null);
    setPreview("");
    setDetectedIngredients([]);
    setSelectedIngredients({});
  };

  return (
    <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 6, background: "#f0f4f8" }}>
      <CardHeader title="Upload Ingredient Image" sx={{ color: "#1e3a8a" }} />
      <CardContent>
        <Stack spacing={2} alignItems="center">
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          {preview && (
            <img
              src={preview}
              alt="preview"
              width="200"
              style={{ borderRadius: 8 }}
            />
          )}

          <Button
            variant="outlined"
            color="primary"
            onClick={handleUpload}
            disabled={!image}
          >
            Detect Ingredients
          </Button>

          {detectedIngredients.length > 0 && (
            <Stack spacing={1} alignItems="flex-start" sx={{ mt: 2 }}>
              <Typography variant="h6">Select Ingredients:</Typography>
              {detectedIngredients.map((ingredient, index) => (
                <FormControlLabel
                  key={`${ingredient.name}-${index}`} // unique key
                  control={
                    <Checkbox
                      checked={selectedIngredients[ingredient.name]}
                      onChange={() => handleCheckboxChange(ingredient.name)}
                    />
                  }
                  label={`${ingredient.name} (${ingredient.confidence.toFixed(
                    2
                  )}%)`}
                />
              ))}

              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAddSelected}
                >
                  Add Selected
                </Button>
                <Button variant="contained" color="error" onClick={handleReset}>
                  Reset
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
