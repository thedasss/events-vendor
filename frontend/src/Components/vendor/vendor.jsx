import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Vendor = () => {
  const [vendorData, setVendorData] = useState({
    vendorName: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    address: "",
    serviceType: [],
    paymentTerms: "",
    pricingDetails: "",
    contactName: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setVendorData((prevState) => ({
        ...prevState,
        serviceType: checked
          ? [...prevState.serviceType, value]
          : prevState.serviceType.filter((service) => service !== value),
      }));
    } else {
      setVendorData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
          serviceType: [],
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
          <div>
            <label>
              <input
                type="checkbox"
                name="serviceType"
                value="Delivery"
                checked={vendorData.serviceType.includes("Delivery")}
                onChange={handleChange}
              />{" "}
              Delivery
            </label>
            <label>
              <input
                type="checkbox"
                name="serviceType"
                value="Repair"
                checked={vendorData.serviceType.includes("Repair")}
                onChange={handleChange}
              />{" "}
              Repair
            </label>
            <label>
              <input
                type="checkbox"
                name="serviceType"
                value="Installation"
                checked={vendorData.serviceType.includes("Installation")}
                onChange={handleChange}
              />{" "}
              Installation
            </label>
          </div>
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
