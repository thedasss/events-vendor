import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "tailwindcss/tailwind.css";

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
      setTimeout(() => navigate("/staff-list"), 1500); // Navigate to staff page after 1.5 seconds
    } catch (err) {
      setError("❌ Error updating staff: " + err.message);
    }
  };

  if (loading) return <p>Loading staff details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg max-w-4xl">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Update Staff</h2>
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="form-control">
            <label className="block text-lg text-green-600 font-semibold">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={staffData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          </div>

          {/* Phone Number */}
          <div className="form-control">
            <label className="block text-lg text-green-600 font-semibold">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={staffData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="block text-lg text-green-600 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={staffData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Role */}
          <div className="form-control">
            <label className="block text-lg text-green-600 font-semibold">Role</label>
            <select
              name="role"
              value={staffData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="manager">Manager</option>
              <option value="coordinator">Coordinator</option>
              <option value="staff">Staff</option>
              <option value="other">Other</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>
        </div>

        {/* Assigned Events */}
        <div className="form-control">
          <label className="block text-lg text-green-600 font-semibold">Assigned Events</label>
          <select
            multiple
            name="assignedEvents"
            value={staffData.assignedEvents}
            onChange={handleMultiSelectChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.eventType}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Salary */}
          <div className="form-control">
            <label className="block text-lg text-green-600 font-semibold">Salary</label>
            <input
              type="number"
              name="salary"
              value={staffData.salary}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            {errors.salary && <p className="text-red-500 text-sm">{errors.salary}</p>}
          </div>

          {/* Joining Date */}
          <div className="form-control">
            <label className="block text-lg text-green-600 font-semibold">Joining Date</label>
            <input
              type="date"
              name="joiningDate"
              value={staffData.joiningDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            {errors.joiningDate && <p className="text-red-500 text-sm">{errors.joiningDate}</p>}
          </div>
        </div>

        {/* Notes */}
        <div className="form-control">
          <label className="block text-lg text-green-600 font-semibold">Notes</label>
          <textarea
            name="notes"
            value={staffData.notes}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={4}
            required
          />
          {errors.notes && <p className="text-red-500 text-sm">{errors.notes}</p>}
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate("/staff-list")}
            className="bg-red-500 text-white py-2 px-6 rounded-md text-lg font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-6 rounded-md text-lg font-semibold"
          >
            Update Staff
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateStaff;
