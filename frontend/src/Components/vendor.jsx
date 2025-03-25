import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Vendor = () => {
  const [vendorData, setVendorData] = useState({
    vendorName: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    address: "",
    serviceType: "",
    paymentTerms: "",
    pricingDetails: "",
    contactName: ""
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const standardEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return standardEmailPattern.test(email) || gmailPattern.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setVendorData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    
    // Service Type validation
    if (!vendorData.serviceType) {
      validationErrors.serviceType = "Service Type is required.";
    }

    // Email validation
    if (!validateEmail(vendorData.email)) {
      validationErrors.email = "Please enter a valid email address (either generic or Gmail).";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('✅ Vendor created successfully!');
        setVendorData({
          vendorName: "",
          contactPerson: "",
          contactNumber: "",
          email: "",
          address: "",
          serviceType: "",
          paymentTerms: "",
          pricingDetails: "",
          contactName: ""
        });
        navigate('/vendors');
      } else {
        throw new Error(result.error || '❌ Error creating vendor.');
      }
    } catch (error) {
      setMessage(error.message || '❌ Server error. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto mt-5 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-center text-2xl font-semibold mb-4">Vendor Registration</h2>
      {message && <p className="text-center text-green-500 font-bold">{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Vendor Name */}
        <div className="mb-4">
          <label className="block">Vendor Name:</label>
          <input
            type="text"
            name="vendorName"
            value={vendorData.vendorName}
            onChange={handleChange}
            className="w-full border px-3 py-2"
          />
        </div>

        {/* Contact Person */}
        <div className="mb-4">
          <label className="block">Contact Person:</label>
          <input
            type="text"
            name="contactPerson"
            value={vendorData.contactPerson}
            onChange={handleChange}
            className="w-full border px-3 py-2"
          />
        </div>

        {/* Contact Number */}
        <div className="mb-4">
          <label className="block">Contact Number:</label>
          <input
            type="text"
            name="contactNumber"
            value={vendorData.contactNumber}
            onChange={handleChange}
            className="w-full border px-3 py-2"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block">Email:</label>
          <input
            type="email"
            name="email"
            value={vendorData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block">Address:</label>
          <input
            type="text"
            name="address"
            value={vendorData.address}
            onChange={handleChange}
            className="w-full border px-3 py-2"
          />
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

        {/* Payment Terms */}
        <div className="mb-4">
          <label className="block">Payment Terms:</label>
          <select
            name="paymentTerms"
            value={vendorData.paymentTerms}
            onChange={handleChange}
            className="w-full border px-3 py-2"
          >
            <option value="">Select Payment Term</option>
            <option value="Net 30">Net 30</option>
            <option value="Net 60">Net 60</option>
            <option value="Prepaid">Prepaid</option>
          </select>
        </div>

        {/* Pricing Details */}
        <div className="mb-4">
          <label className="block">Pricing Details:</label>
          <input
            type="text"
            name="pricingDetails"
            value={vendorData.pricingDetails}
            onChange={handleChange}
            className="w-full border px-3 py-2"
          />
        </div>

        {/* Contact Name */}
        <div className="mb-4">
          <label className="block">Contact Name:</label>
          <input
            type="text"
            name="contactName"
            value={vendorData.contactName}
            onChange={handleChange}
            className="w-full border px-3 py-2"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Vendor;
