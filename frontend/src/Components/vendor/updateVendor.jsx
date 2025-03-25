import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
    axios.get(`http://localhost:3000/api/vendors/${id}`)
      .then((response) => {
        if (response.data) {
          setVendorData({
            ...response.data,
            serviceType: Array.isArray(response.data.serviceType)
              ? response.data.serviceType.join(", ")
              : response.data.serviceType,
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const validateForm = () => {
    let validationErrors = {};

    if (!vendorData.vendorName.trim()) validationErrors.vendorName = "Vendor name is required";
    if (!vendorData.contactPerson.trim()) validationErrors.contactPerson = "Contact person is required";
    if (!vendorData.contactNumber.trim() || !/^[0-9]+$/.test(vendorData.contactNumber)) {
      validationErrors.contactNumber = "Valid contact number is required";
    }
    if (!vendorData.serviceType.trim()) validationErrors.serviceType = "Service type is required";
    if (!vendorData.email.trim() || !/\S+@\S+\.\S+/.test(vendorData.email)) {
      validationErrors.email = "Valid email is required";
    }
    if (!vendorData.address.trim()) validationErrors.address = "Address is required";
    if (!vendorData.contactName.trim()) validationErrors.contactName = "Contact name is required";
    if (!vendorData.paymentTerms.trim()) validationErrors.paymentTerms = "Payment terms are required";
    if (!vendorData.pricingDetails.trim()) validationErrors.pricingDetails = "Pricing details are required";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
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
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Update Vendor</h2>
      {message && <p className="text-green-600 text-center mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(vendorData).map((field) => (
          <div key={field}>
            <label className="block text-gray-700 font-semibold">{field.replace(/([A-Z])/g, ' $1')}</label>
            <input
              type="text"
              name={field}
              value={vendorData[field]}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
          </div>
        ))}
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => navigate("/vendors")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Update Vendor
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateVendor;
