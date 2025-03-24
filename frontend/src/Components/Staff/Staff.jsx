import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Staff = () => {
  const [staffData, setStaffData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    role: '',
    assignedEvents: [],
    salary: '',
    joiningDate: '',
    notes: ''
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Initialize useNavigate hook

  const validateForm = () => {
    let newErrors = {};

    if (!staffData.fullName) newErrors.fullName = 'Full name is required.';
    if (!staffData.phoneNumber) newErrors.phoneNumber = 'Phone number is required.';
    else if (!/^\d{10}$/.test(staffData.phoneNumber)) newErrors.phoneNumber = 'Phone number must be 10 digits.';
    
    if (!staffData.email) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(staffData.email)) newErrors.email = 'Email is not valid.';
    
    if (!staffData.role) newErrors.role = 'Role is required.';
    
    if (!staffData.salary) newErrors.salary = 'Salary is required.';
    else if (staffData.salary <= 0) newErrors.salary = 'Salary must be a positive number.';
    
    if (!staffData.joiningDate) newErrors.joiningDate = 'Joining date is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffData(prevState => ({
      ...prevState,
      [name]: name === "salary" ? Number(value) : value
    }));
  };

  const handleMultiSelectChange = (e) => {
    const { options } = e.target;
    const selectedEvents = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selectedEvents.push(options[i].value);
    }
    setStaffData(prevState => ({
      ...prevState,
      assignedEvents: selectedEvents
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:3000/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(staffData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✅ Staff member added successfully!');
        setStaffData({
          fullName: '',
          phoneNumber: '',
          email: '',
          role: '',
          assignedEvents: [],
          salary: '',
          joiningDate: '',
          notes: ''
        });
        setErrors({});
        navigate('/staff-list'); // Navigate to the staff list page on successful form submission
      } else {
        setMessage(result.error || '❌ Error adding staff member');
      }
    } catch (error) {
      setMessage('❌ Server error. Please try again later.');
    }
  };

  return (
    <div className="container mt-5 p-4 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-center text-2xl font-semibold mb-4">Staff Management Form</h2>
      {message && <p className="text-center text-green-500 font-bold mb-4">{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-lg font-medium text-gray-700">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={staffData.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.fullName && <p className="text-red-500 mt-2 text-sm">{errors.fullName}</p>}
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-lg font-medium text-gray-700">Phone Number:</label>
          <input
            type="number"
            id="phoneNumber"
            name="phoneNumber"
            value={staffData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phoneNumber && <p className="text-red-500 mt-2 text-sm">{errors.phoneNumber}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={staffData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 mt-2 text-sm">{errors.email}</p>}
        </div>

        {/* Role */}
        <div className="mb-4">
          <label htmlFor="role" className="block text-lg font-medium text-gray-700">Role:</label>
          <select
            id="role"
            name="role"
            value={staffData.role}
            onChange={handleChange}
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Role</option>
            <option value="manager">Manager</option>
            <option value="coordinator">Coordinator</option>
            <option value="assistant">Assistant</option>
          </select>
          {errors.role && <p className="text-red-500 mt-2 text-sm">{errors.role}</p>}
        </div>

        {/* Assigned Events (Multi-Select) */}
        <div className="mb-4">
          <label htmlFor="assignedEvents" className="block text-lg font-medium text-gray-700">Assigned Events:</label>
          <select
            id="assignedEvents"
            name="assignedEvents"
            multiple
            value={staffData.assignedEvents}
            onChange={handleMultiSelectChange}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="event1">Event 1</option>
            <option value="event2">Event 2</option>
            <option value="event3">Event 3</option>
            <option value="event4">Event 4</option>
          </select>
          {errors.assignedEvents && <p className="text-red-500 mt-2 text-sm">{errors.assignedEvents}</p>}
        </div>

        {/* Salary */}
        <div className="mb-4">
          <label htmlFor="salary" className="block text-lg font-medium text-gray-700">Salary ($):</label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={staffData.salary}
            onChange={handleChange}
            placeholder="Enter salary"
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.salary && <p className="text-red-500 mt-2 text-sm">{errors.salary}</p>}
        </div>

        {/* Joining Date */}
        <div className="mb-4">
          <label htmlFor="joiningDate" className="block text-lg font-medium text-gray-700">Joining Date:</label>
          <input
            type="date"
            id="joiningDate"
            name="joiningDate"
            value={staffData.joiningDate}
            onChange={handleChange}
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.joiningDate && <p className="text-red-500 mt-2 text-sm">{errors.joiningDate}</p>}
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label htmlFor="notes" className="block text-lg font-medium text-gray-700">Notes:</label>
          <textarea
            id="notes"
            name="notes"
            value={staffData.notes}
            onChange={handleChange}
            placeholder="Enter any additional notes"
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.notes && <p className="text-red-500 mt-2 text-sm">{errors.notes}</p>}
        </div>

        <button type="submit" className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Staff;
