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

const UpdateVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState({
    vendorName: "",
    contactPerson: "",
    contactNumber: "",
    serviceType: "",
    email: "",
    address: "",
    contactName: "",
    paymentTerms: "",
    pricingDetails: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch vendor details from the API
    axios
      .get(`http://localhost:3000/api/vendors/${id}`)
      .then((response) => {
        if (response.data) {
          // Convert serviceType array to comma-separated string if necessary
          const fetchedData = {
            ...response.data,
            serviceType: Array.isArray(response.data.serviceType)
              ? response.data.serviceType.join(", ")
              : response.data.serviceType,
          };
          setVendorData(fetchedData);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching vendor details:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const validateForm = () => {
    let validationErrors = {};

    if (!vendorData.vendorName.trim()) {
      validationErrors.vendorName = "Vendor name is required";
    }
    if (!vendorData.contactPerson.trim()) {
      validationErrors.contactPerson = "Contact person is required";
    }
    if (!vendorData.contactNumber.trim()) {
      validationErrors.contactNumber = "Contact number is required";
    }
    if (!vendorData.serviceType.trim()) {
      validationErrors.serviceType = "Service type is required";
    }
    if (!vendorData.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(vendorData.email)) {
      validationErrors.email = "Email is not valid";
    }
    if (!vendorData.address.trim()) {
      validationErrors.address = "Address is required";
    }
    if (!vendorData.contactName.trim()) {
      validationErrors.contactName = "Contact name is required";
    }
    if (!vendorData.paymentTerms.trim()) {
      validationErrors.paymentTerms = "Payment terms are required";
    }
    if (!vendorData.pricingDetails.trim()) {
      validationErrors.pricingDetails = "Pricing details are required";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Convert serviceType from comma separated string to an array
      const updatedData = {
        ...vendorData,
        serviceType: vendorData.serviceType.split(",").map((s) => s.trim()),
      };

      await axios.put(`http://localhost:3000/api/vendors/${id}`, updatedData);
      setMessage("✅ Vendor updated successfully!");
      setTimeout(() => navigate("/vendors"), 1500);
    } catch (err) {
      setError("❌ Error updating vendor: " + err.message);
    }
  };

  if (loading) return <p>Loading vendor details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box sx={boxSX} className="container mt-5 p-4 bg-white rounded-lg shadow-lg">
      <Typography sx={titleSx}>Update Vendor</Typography>
      {message && (
        <p className="container flex justify-between items-start mr-20 mb-10">
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl sx={formSX} error={!!errors.vendorName}>
              <InputLabel style={label}>Vendor Name</InputLabel>
              <Input
                style={inputSx}
                name="vendorName"
                value={vendorData.vendorName}
                onChange={handleChange}
                required
              />
              {errors.vendorName && (
                <FormHelperText>{errors.vendorName}</FormHelperText>
              )}
            </FormControl>

            <FormControl sx={formSX} error={!!errors.contactPerson}>
              <InputLabel style={label}>Contact Person</InputLabel>
              <Input
                style={inputSx}
                name="contactPerson"
                value={vendorData.contactPerson}
                onChange={handleChange}
                required
              />
              {errors.contactPerson && (
                <FormHelperText>{errors.contactPerson}</FormHelperText>
              )}
            </FormControl>

            <FormControl sx={formSX} error={!!errors.contactNumber}>
              <InputLabel style={label}>Contact Number</InputLabel>
              <Input
                style={inputSx}
                name="contactNumber"
                value={vendorData.contactNumber}
                onChange={handleChange}
                required
              />
              {errors.contactNumber && (
                <FormHelperText>{errors.contactNumber}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl sx={formSX} error={!!errors.email}>
              <InputLabel style={label}>Email</InputLabel>
              <Input
                style={inputSx}
                type="email"
                name="email"
                value={vendorData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <FormHelperText>{errors.email}</FormHelperText>
              )}
            </FormControl>

            <FormControl sx={formSX} error={!!errors.address}>
              <InputLabel style={label}>Address</InputLabel>
              <Input
                style={inputSx}
                name="address"
                value={vendorData.address}
                onChange={handleChange}
                required
              />
              {errors.address && (
                <FormHelperText>{errors.address}</FormHelperText>
              )}
            </FormControl>

            <FormControl sx={formSX} error={!!errors.contactName}>
              <InputLabel style={label}>Contact Name</InputLabel>
              <Input
                style={inputSx}
                name="contactName"
                value={vendorData.contactName}
                onChange={handleChange}
                required
              />
              {errors.contactName && (
                <FormHelperText>{errors.contactName}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl sx={formSX} error={!!errors.paymentTerms}>
              <InputLabel style={label}>Payment Terms</InputLabel>
              <Input
                style={inputSx}
                name="paymentTerms"
                value={vendorData.paymentTerms}
                onChange={handleChange}
                required
              />
              {errors.paymentTerms && (
                <FormHelperText>{errors.paymentTerms}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl sx={formSX} error={!!errors.pricingDetails}>
              <InputLabel style={label}>Pricing Details</InputLabel>
              <Input
                style={inputSx}
                name="pricingDetails"
                value={vendorData.pricingDetails}
                onChange={handleChange}
                required
              />
              {errors.pricingDetails && (
                <FormHelperText>{errors.pricingDetails}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl sx={formSX} error={!!errors.serviceType}>
              <InputLabel style={label}>
                Service Type (comma separated)
              </InputLabel>
              <Input
                style={inputSx}
                name="serviceType"
                value={vendorData.serviceType}
                onChange={handleChange}
                required
              />
              {errors.serviceType && (
                <FormHelperText>{errors.serviceType}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            sx={{
              fontSize: "12px",
              bgcolor: "red",
              fontWeight: "bold",
              width: "150px",
              height: "40px",
            }}
            variant="contained"
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
          <Button
            sx={{
              fontSize: "12px",
              bgcolor: "green",
              fontWeight: "bold",
              width: "150px",
              height: "40px",
            }}
            variant="contained"
            type="submit"
          >
            UPDATE VENDOR
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UpdateVendor;
