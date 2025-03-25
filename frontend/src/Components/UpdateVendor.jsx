import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

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
          // Ensure serviceType has a default value if empty or undefined
          const fetchedData = {
            ...response.data,
            serviceType: Array.isArray(response.data.serviceType)
              ? response.data.serviceType.join(", ")
              : response.data.serviceType || "N/A", // Default to "N/A" if empty
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
      // Convert serviceType from comma-separated string to an array
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
    <div className="container mt-5 p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-black mb-4">Update Vendor</h2>
      {message && (
        <p className="text-center text-green-600 mb-4">{message}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-semibold text-green-600">Vendor Name</label>
              <input
                type="text"
                name="vendorName"
                value={vendorData.vendorName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              {errors.vendorName && (
                <p className="text-red-600 text-sm">{errors.vendorName}</p>
              )}
            </div>

            <div>
              <label className="block text-lg font-semibold text-green-600">Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                value={vendorData.contactPerson}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              {errors.contactPerson && (
                <p className="text-red-600 text-sm">{errors.contactPerson}</p>
              )}
            </div>

            <div>
              <label className="block text-lg font-semibold text-green-600">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={vendorData.contactNumber}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              {errors.contactNumber && (
                <p className="text-red-600 text-sm">{errors.contactNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-lg font-semibold text-green-600">Email</label>
              <input
                type="email"
                name="email"
                value={vendorData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-lg font-semibold text-green-600">Address</label>
              <input
                type="text"
                name="address"
                value={vendorData.address}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              {errors.address && (
                <p className="text-red-600 text-sm">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-lg font-semibold text-green-600">Contact Name</label>
              <input
                type="text"
                name="contactName"
                value={vendorData.contactName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              {errors.contactName && (
                <p className="text-red-600 text-sm">{errors.contactName}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-lg font-semibold text-green-600">Payment Terms</label>
              <select
                name="paymentTerms"
                value={vendorData.paymentTerms}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select Payment Term</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 60">Net 60</option>
                <option value="Prepaid">Prepaid</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-semibold text-green-600">Pricing Details</label>
              <input
                type="text"
                name="pricingDetails"
                value={vendorData.pricingDetails}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              {errors.pricingDetails && (
                <p className="text-red-600 text-sm">{errors.pricingDetails}</p>
              )}
            </div>

           {/* Service Provided */}
        <div className="mb-4">
          <label className="block">Service Provided:</label>
          <select
            name="serviceType"
            value={vendorData.serviceType}
            onChange={handleChange}
            className="w-full border px-3 py-2 mt-2"
          >
            <option value="">Select Service Type</option>
            <option value="Delivery">Delivery</option>
            <option value="Repair">Repair</option>
            <option value="Installation">Installation</option>
          </select>
          {errors.serviceType && <p className="text-red-500 text-sm">{errors.serviceType}</p>}
        </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="submit"
            className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Update Vendor
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateVendor;
