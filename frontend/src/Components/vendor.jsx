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
    taxID: "",
    businessLicense: "",
    website: "",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};
    if (!vendorData.vendorName) newErrors.vendorName = "Vendor name is required.";
    if (!vendorData.contactPerson) newErrors.contactPerson = "Contact person is required.";
    if (!vendorData.contactNumber.match(/^\d{10}$/)) newErrors.contactNumber = "Contact number must be 10 digits.";
    if (!vendorData.email.match(/\S+@\S+\.\S+/)) newErrors.email = "Invalid email.";
    if (!vendorData.address) newErrors.address = "Address is required.";
    if (!vendorData.serviceType.length) newErrors.serviceType = "Select at least one service.";
    if (!vendorData.paymentTerms) newErrors.paymentTerms = "Select a payment term.";
    if (!vendorData.taxID) newErrors.taxID = "Tax ID is required.";
    if (!vendorData.businessLicense) newErrors.businessLicense = "Business License is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:3000/api/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vendorData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✅ Vendor created successfully!');
        setVendorData({
          vendorName: '',
          contactPerson: '',
          contactNumber: '',
          serviceType: [],
          email: '',
          paymentTerms: '',
          pricingDetails: '',
          address: '',
          contactName: ''
        });
        setErrors({});
        navigate('/vendors'); // Navigate to vendors page upon successful submission
      } else {
        throw new Error(result.error || '❌ Error creating vendor. Please check your input.');
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
          <input type="text" name="vendorName" value={vendorData.vendorName} onChange={handleChange} className="w-full border px-3 py-2" />
          {errors.vendorName && <p className="text-red-500">{errors.vendorName}</p>}
        </div>

        {/* Contact Person */}
        <div className="mb-4">
          <label className="block">Contact Person:</label>
          <input type="text" name="contactPerson" value={vendorData.contactPerson} onChange={handleChange} className="w-full border px-3 py-2" />
          {errors.contactPerson && <p className="text-red-500">{errors.contactPerson}</p>}
        </div>

        {/* Contact Number */}
        <div className="mb-4">
          <label className="block">Contact Number:</label>
          <input type="text" name="contactNumber" value={vendorData.contactNumber} onChange={handleChange} className="w-full border px-3 py-2" />
          {errors.contactNumber && <p className="text-red-500">{errors.contactNumber}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block">Email:</label>
          <input type="email" name="email" value={vendorData.email} onChange={handleChange} className="w-full border px-3 py-2" />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block">Address:</label>
          <input type="text" name="address" value={vendorData.address} onChange={handleChange} className="w-full border px-3 py-2" />
          {errors.address && <p className="text-red-500">{errors.address}</p>}
        </div>

        {/* Services Provided */}
        <div className="mb-4">
          <label className="block">Service Provided:</label>
          <div>
            <label><input type="checkbox" name="serviceType" value="Delivery" checked={vendorData.serviceType.includes("Delivery")} onChange={handleChange} /> Delivery</label>
            <label><input type="checkbox" name="serviceType" value="Repair" checked={vendorData.serviceType.includes("Repair")} onChange={handleChange} /> Repair</label>
            <label><input type="checkbox" name="serviceType" value="Installation" checked={vendorData.serviceType.includes("Installation")} onChange={handleChange} /> Installation</label>
          </div>
          {errors.serviceType && <p className="text-red-500">{errors.serviceType}</p>}
        </div>

        {/* Payment Terms */}
        <div className="mb-4">
          <label className="block">Payment Terms:</label>
          <select name="paymentTerms" value={vendorData.paymentTerms} onChange={handleChange} className="w-full border px-3 py-2">
            <option value="">Select Payment Term</option>
            <option value="Net 30">Net 30</option>
            <option value="Net 60">Net 60</option>
            <option value="Prepaid">Prepaid</option>
          </select>
          {errors.paymentTerms && <p className="text-red-500">{errors.paymentTerms}</p>}
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default Vendor;
