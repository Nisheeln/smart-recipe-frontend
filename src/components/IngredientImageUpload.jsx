import React, { useState, useRef } from "react";
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
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function IngredientImageUpload({ onAddIngredient, isPhoneUser }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState({});

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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
        `${backendUrl}/api/detect-ingredient`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const ingredients = response.data.ingredients || [];
      if (ingredients.length === 0) {
        alert("No ingredients detected!");
        return;
      }

      const highConfidence = ingredients.filter((i) => i.confidence >= 70);
      const uniqueIngredients = [
        ...new Map(highConfidence.map((i) => [i.name, i])).values(),
      ];

      setDetectedIngredients(uniqueIngredients);

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
    onAddIngredient(selected);
    handleReset();
  };

  const handleReset = () => {
    setImage(null);
    setPreview("");
    setDetectedIngredients([]);
    setSelectedIngredients({});
    stopCamera();
  };

 
  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Cannot access camera.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setDetectedIngredients([]);
      setSelectedIngredients({});
      stopCamera();
    }, "image/jpeg");
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

          
          {isPhoneUser && !cameraActive && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<CameraAltIcon />}
              onClick={startCamera}
            >
              Take Photo
            </Button>
          )}

          {cameraActive && (
            <Stack spacing={1} alignItems="center">
              <video
                ref={videoRef}
                width="300"
                style={{ borderRadius: 8 }}
                autoPlay
              ></video>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" color="success" onClick={takePhoto}>
                  Capture
                </Button>
                <Button variant="contained" color="error" onClick={stopCamera}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          )}

          
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
                  key={`${ingredient.name}-${index}`}
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

          <canvas ref={canvasRef} style={{ display: "none" }} />
        </Stack>
      </CardContent>
    </Card>
  );
}
