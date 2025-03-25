import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Box, Button, FormControl, Input, InputLabel, Typography, Grid, FormHelperText } from "@mui/material";

const titleSx = {
  fontSize: "25px",
  color: "black",
  fontFamily: "Arvo",
  fontWeight: "bold",
  marginTop: "4px",
};

const formSX = {
  width: "100%",
  padding: "25px 20px",
  marginTop: "10px",
};

const label = {
  color: "#26bb3a",
  fontSize: "20px",
  fontFamily: "Arvo",
};

const boxSX = {
  bgcolor: "#FFFFFF",
  width: "550px",
  borderRadius: "25px",
  textAlign: "center",
  px: "10px",
  padding: "5px 18px",
};

const inputSx = {
  color: "#000000",
  fontSize: "16px",
  fontFamily: "Arvo",
  height: "40px",
  marginTop: "10px",
};

const UpdateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    eventType: "",
    eventDate: "",
    budget: "",
    venue: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/events/${id}`)
      .then((response) => {
        setEventData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const validateForm = () => {
    let validationErrors = {};
    
    if (!eventData.eventType.trim()) {
      validationErrors.eventType = "Event type is required";
    }
    
    if (!eventData.eventDate) {
      validationErrors.eventDate = "Event date is required";
    } else if (new Date(eventData.eventDate) < new Date()) {
      validationErrors.eventDate = "Event date must be in the future";
    }
    
    if (!eventData.budget) {
      validationErrors.budget = "Budget is required";
    } else if (isNaN(eventData.budget) || eventData.budget <= 0) {
      validationErrors.budget = "Budget must be a positive number";
    }
    
    if (!eventData.venue.trim()) {
      validationErrors.venue = "Venue is required";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: name === "budget" ? parseFloat(value) || "" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    try {
      await axios.put(`http://localhost:3000/api/events/${id}`, eventData);
      setMessage("✅ Event updated successfully!");
      setTimeout(() => navigate("/events"), 1500); // Navigate to the events page after 1.5 seconds
    } catch (err) {
      setError("❌ Error updating event: " + err.message);
    }
  };
  

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box sx={boxSX} className="container mt-5 p-4 bg-white rounded-lg shadow-lg">
      <Typography sx={titleSx}>Update Event</Typography>
      {message && <p className="container flex justify-between items-start mr-20 mb-10">{message}</p>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl sx={formSX} error={!!errors.eventType}>
              <InputLabel style={label}>Event Type</InputLabel>
              <Input
                style={inputSx}
                name="eventType"
                value={eventData.eventType}
                onChange={handleChange}
                required
              />
              {errors.eventType && <FormHelperText>{errors.eventType}</FormHelperText>}
            </FormControl>

            <FormControl sx={formSX} error={!!errors.eventDate}>
              <InputLabel style={label}>Event Date</InputLabel>
              <Input
                style={inputSx}
                type="date"
                name="eventDate"
                value={eventData.eventDate}
                onChange={handleChange}
                required
              />
              {errors.eventDate && <FormHelperText>{errors.eventDate}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl sx={formSX} error={!!errors.budget}>
              <InputLabel style={label}>Budget</InputLabel>
              <Input
                style={inputSx}
                type="number"
                name="budget"
                value={eventData.budget}
                onChange={handleChange}
                required
              />
              {errors.budget && <FormHelperText>{errors.budget}</FormHelperText>}
            </FormControl>

            <FormControl sx={formSX} error={!!errors.venue}>
              <InputLabel style={label}>Venue</InputLabel>
              <Input
                style={inputSx}
                name="venue"
                value={eventData.venue}
                onChange={handleChange}
                required
              />
              {errors.venue && <FormHelperText>{errors.venue}</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            sx={{ fontSize: "12px", bgcolor: "red", fontWeight: "bold", width: '150px', height: '40px' }}
            variant="contained"
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>

          <Button
            sx={{ fontSize: "12px", bgcolor: "green", fontWeight: "bold", width: '150px', height: '40px' }}
            variant="contained"
            type="submit">
            UPDATE EVENT
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UpdateEvent;
