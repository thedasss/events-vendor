import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoSearch } from "react-icons/io5";
import { FiPrinter } from "react-icons/fi";

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roles] = useState(['Manager', 'Coordinator', 'Technician', 'Assistant']); // Role options
  const [newStaff, setNewStaff] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    role: '',
    assignedEvents: [],
    salary: '',
    joiningDate: '',
    notes: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/staff")
      .then((response) => {
        setStaff(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/staff/${id}`);
      setStaff(staff.filter((member) => member._id !== id));
    } catch (err) {
      alert("Error deleting staff member: " + err.message);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update-staff/${id}`);
  };

  // Handle form submission for new staff
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/staff', newStaff);
      setStaff([...staff, response.data]);
      setNewStaff({
        fullName: '',
        phoneNumber: '',
        email: '',
        role: '',
        assignedEvents: [],
        salary: '',
        joiningDate: '',
        notes: ''
      });
    } catch (err) {
      alert("Error adding staff: " + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, options } = e.target;
    // For multiple select, handle selected options
    if (name === "assignedEvents") {
      const selectedOptions = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setNewStaff({
        ...newStaff,
        [name]: selectedOptions
      });
    } else {
      setNewStaff({
        ...newStaff,
        [name]: value
      });
    }
  };

  // Search filter for staff list
  const filteredStaff = staff.filter((member) =>
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to generate report (e.g., printing the page)
  const generateReport = () => {
    window.print();
  };

  if (loading) return <p className="text-center mt-4">Loading staff...</p>;
  if (error) return <p className="text-danger text-center mt-4">Error: {error}</p>;

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Staff Management</h2>
        <div className="input-group w-25">
          <span className="input-group-text">
            <IoSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search staff"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={generateReport} className="btn btn-success">
          <FiPrinter className="me-2" /> Generate Report
        </button>
      </div>

      {/* Add New Staff Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <h3>Add New Staff</h3>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="form-control"
            value={newStaff.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            className="form-control"
            value={newStaff.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={newStaff.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            className="form-control"
            value={newStaff.role}
            onChange={handleChange}
            required
          >
            <option value="">Select role</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="assignedEvents">Assigned Events</label>
          <select
            id="assignedEvents"
            name="assignedEvents"
            className="form-control"
            multiple
            value={newStaff.assignedEvents}
            onChange={handleChange}
          >
            {/* Add dynamic event options here */}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="salary">Salary</label>
          <input
            type="number"
            id="salary"
            name="salary"
            className="form-control"
            value={newStaff.salary}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="joiningDate">Joining Date</label>
          <input
            type="date"
            id="joiningDate"
            name="joiningDate"
            className="form-control"
            value={newStaff.joiningDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            className="form-control"
            value={newStaff.notes}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </form>

      {filteredStaff.map((member) => (
        <div key={member._id} className="card mb-3 shadow-sm">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title">{member.fullName}</h5>
              <p className="card-text">Role: {member.role}</p>
              <p className="card-text">Phone: {member.phoneNumber}</p>
              <p className="card-text">Email: {member.email}</p>
              <p className="text-muted">Joined: {new Date(member.joiningDate).toLocaleString()}</p>
            </div>
            <div>
              <button
                onClick={() => handleUpdate(member._id)}
                className="btn btn-primary me-2"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(member._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StaffList;
