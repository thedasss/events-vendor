import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  Typography,
  Grid,
  FormHelperText,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  TextareaAutosize
} from "@mui/material";

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

const UpdateStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staffData, setStaffData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    role: "",
    assignedEvents: [],
    salary: "",
    joiningDate: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState([]);
  const [events, setEvents] = useState([]); // Events for multi-select

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/staff/${id}`)
      .then((response) => {
        setStaffData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const validateForm = () => {
    let validationErrors = {};

    if (!staffData.fullName.trim()) {
      validationErrors.fullName = "Full name is required";
    }

    if (!staffData.phoneNumber || isNaN(staffData.phoneNumber)) {
      validationErrors.phoneNumber = "Valid phone number is required";
    }

    if (!staffData.email || !/\S+@\S+\.\S+/.test(staffData.email)) {
      validationErrors.email = "Valid email is required";
    }

    if (!staffData.role) {
      validationErrors.role = "Role is required";
    }

    if (!staffData.salary || isNaN(staffData.salary) || staffData.salary <= 0) {
      validationErrors.salary = "Salary must be a positive number";
    }

    if (!staffData.joiningDate) {
      validationErrors.joiningDate = "Joining date is required";
    }

    if (!staffData.notes.trim()) {
      validationErrors.notes = "Notes are required";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffData((prev) => ({
      ...prev,
      [name]: name === "assignedEvents" ? value : value.trim(),
    }));
  };

  const handleMultiSelectChange = (e) => {
    setStaffData((prev) => ({
      ...prev,
      assignedEvents: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:3000/api/staff/${id}`, staffData);
      setMessage("✅ Staff updated successfully!");
      setTimeout(() => navigate("/staff"), 1500); // Navigate to staff page after 1.5 seconds
    } catch (err) {
      setError("❌ Error updating staff: " + err.message);
    }
  };

  if (loading) return <p>Loading staff details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box sx={boxSX} className="container mt-5 p-4 bg-white rounded-lg shadow-lg">
      <Typography sx={titleSx}>Update Staff</Typography>
      {message && <p className="container flex justify-between items-start mr-20 mb-10">{message}</p>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl sx={formSX} error={!!errors.fullName}>
              <InputLabel style={label}>Full Name</InputLabel>
              <Input
                style={inputSx}
                name="fullName"
                value={staffData.fullName}
                onChange={handleChange}
                required
              />
              {errors.fullName && <FormHelperText>{errors.fullName}</FormHelperText>}
            </FormControl>

            <FormControl sx={formSX} error={!!errors.phoneNumber}>
              <InputLabel style={label}>Phone Number</InputLabel>
              <Input
                style={inputSx}
                name="phoneNumber"
                value={staffData.phoneNumber}
                onChange={handleChange}
                required
              />
              {errors.phoneNumber && <FormHelperText>{errors.phoneNumber}</FormHelperText>}
            </FormControl>

            <FormControl sx={formSX} error={!!errors.email}>
              <InputLabel style={label}>Email</InputLabel>
              <Input
                style={inputSx}
                name="email"
                value={staffData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
            </FormControl>

            <FormControl sx={formSX} error={!!errors.role}>
              <InputLabel style={label}>Role</InputLabel>
              <Select
                style={inputSx}
                name="role"
                value={staffData.role}
                onChange={handleChange}
                required
              >
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="coordinator">Coordinator</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl sx={formSX}>
              <InputLabel style={label}>Assigned Events</InputLabel>
              <Select
                multiple
                style={inputSx}
                name="assignedEvents"
                value={staffData.assignedEvents}
                onChange={handleMultiSelectChange}
              >
                {events.map((event) => (
                  <MenuItem key={event.id} value={event.id}>
                    <Checkbox checked={staffData.assignedEvents.includes(event.id)} />
                    <ListItemText primary={event.eventType} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={formSX} error={!!errors.salary}>
              <InputLabel style={label}>Salary</InputLabel>
              <Input
                style={inputSx}
                type="number"
                name="salary"
                value={staffData.salary}
                onChange={handleChange}
                required
              />
              {errors.salary && <FormHelperText>{errors.salary}</FormHelperText>}
            </FormControl>

            <FormControl sx={formSX} error={!!errors.joiningDate}>
              <InputLabel style={label}>Joining Date</InputLabel>
              <Input
                style={inputSx}
                type="date"
                name="joiningDate"
                value={staffData.joiningDate}
                onChange={handleChange}
                required
              />
              {errors.joiningDate && <FormHelperText>{errors.joiningDate}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl sx={formSX} error={!!errors.notes}>
              <InputLabel style={label}>Notes</InputLabel>
              <TextareaAutosize
                style={inputSx}
                name="notes"
                value={staffData.notes}
                onChange={handleChange}
                required
                minRows={3}
              />
              {errors.notes && <FormHelperText>{errors.notes}</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            sx={{ fontSize: "12px", bgcolor: "red", fontWeight: "bold", width: '150px', height: '40px' }}
            variant="contained"
            onClick={() => navigate("/staff")}
          >
            Cancel
          </Button>

          <Button
            sx={{ fontSize: "12px", bgcolor: "green", fontWeight: "bold", width: '150px', height: '40px' }}
            variant="contained"
            type="submit">
            UPDATE STAFF
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UpdateStaff;
