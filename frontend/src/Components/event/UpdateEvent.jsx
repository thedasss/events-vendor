import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "tailwindcss/tailwind.css";

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
    if (!eventData.budget || isNaN(eventData.budget) || eventData.budget <= 0) {
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
      setTimeout(() => navigate("/events"), 1500);
    } catch (err) {
      setError("❌ Error updating event: " + err.message);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading event details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Update Event</h2>
      {message && <p className="text-green-500 text-center font-medium mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Event Type:</label>
          <select
            name="eventType"
            value={eventData.eventType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
          >
            <option value="">Select Event Type</option>
            <option value="wedding">Wedding</option>
            <option value="corporate">Corporate Event</option>
            <option value="birthday">Birthday Party</option>
            <option value="conference">Conference</option>
            <option value="other">Other</option>
          </select>
          {errors.eventType && <p className="text-red-500 text-sm">{errors.eventType}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Event Date:</label>
          <input
            type="date"
            name="eventDate"
            value={eventData.eventDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
          />
          {errors.eventDate && <p className="text-red-500 text-sm">{errors.eventDate}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Budget ($):</label>
          <input
            type="number"
            name="budget"
            value={eventData.budget}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
          />
          {errors.budget && <p className="text-red-500 text-sm">{errors.budget}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Venue:</label>
          <input
            type="text"
            name="venue"
            value={eventData.venue}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
          />
          {errors.venue && <p className="text-red-500 text-sm">{errors.venue}</p>}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Update Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEvent;
