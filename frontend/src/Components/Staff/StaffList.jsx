import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoSearch } from "react-icons/io5";
import { FiPrinter } from "react-icons/fi";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

const StaffList = () => {
  const [event, setEvents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roles] = useState(['Manager', 'Coordinator', 'Technician', 'Assistant']); // Role options
  const [newStaff, setNewStaff] = useState({
   
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
    if (!staff || staff.length === 0) {
      alert("No data available to generate the report.");
      return;
    }
  
    // Use filteredStaff to filter by searchTerm
    const filteredStaff = staff.filter((member) =>
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    if (filteredStaff.length === 0) {
      alert("No staff found matching the search term.");
      return;
    }
  
    const doc = new jsPDF();
  
    // Set title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
  
    // Calculate the width of the text for centering
    const title = "Staff Report";
    const titleWidth = doc.getTextWidth(title);
  
    // Calculate the x position to center the text
    const x = (doc.internal.pageSize.width - titleWidth) / 2;
  
    // Set y position (you can adjust it to your preference)
    const y = 20;
  
    // Add centered title
    doc.text(title, x, y);
  
    // Define table headers
    const tableHeaders = [["Full Name", "Role", "Phone", "Email", "Joining Date"]];
  
    // Define table data for filtered staff
    const tableData = filteredStaff.map(member => [
      member.fullName,
      member.role,
      member.phoneNumber,
      member.email,
      new Date(member.joiningDate).toLocaleDateString() // Format the joining date
    ]);
  
    // Add table using autoTable
    autoTable(doc, {
      startY: 30,
      head: tableHeaders,
      body: tableData,
      theme: "grid",
      styles: { fontSize: 12, cellPadding: 5 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
  
    // Save the PDF with the name "Staff_Report.pdf"
    doc.save("Staff_Report.pdf");
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

      {filteredStaff.map((member) => (
        <div key={member._id} className="card mb-3 shadow-sm">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title">{member.fullName}</h5>
              <p className="card-text">Role: {member.role}</p>
              <p className="card-text">Phone: {member.phoneNumber}</p>
              <p className="card-text">Email: {member.email}</p>
              <p className="card-text">Notes: {member.notes}</p>
              <p className="card-text">Salary: {member.salary}</p>
              <p className="card-text">Assigned Events: {event.eventType}</p>
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
