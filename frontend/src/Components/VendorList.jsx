import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoSearch } from "react-icons/io5";
import { FiPrinter } from "react-icons/fi";

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/vendors")
      .then((response) => {
        if (response.data) {
          console.log("Fetched Vendors:", response.data); // Debugging
          setVendors(response.data);
          setLoading(false);
        } else {
          setError("No vendors found.");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching vendors:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/vendors/${id}`);
      setVendors((prevVendors) => prevVendors.filter((vendor) => vendor._id !== id));
    } catch (err) {
      alert("Error deleting vendor: " + err.message);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update-vendor/${id}`);
  };
  const generateReport = () => {
    if (!vendors || vendors.length === 0) {
      alert("No data available to generate the report.");
      return;
    }
  
    const filteredVendors = vendors.filter((vendor) =>
      vendor.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    if (filteredVendors.length === 0) {
      alert("No vendors found matching the search term.");
      return;
    }
  
    const doc = new jsPDF("p", "mm", "a4");
  
    // Center the title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    const title = "Vendor Management Report";
    const pageWidth = doc.internal.pageSize.width;
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 20);
  
    // Define table headers
    const tableHeaders = [
      ["Vendor Name", "Contact Name", "Email", "Services Provided", "Pricing Details", "Payment Terms"]
    ];
  
    // Define table data
    const tableData = filteredVendors.map((vendor) => [
      vendor.vendorName || "N/A",
      vendor.contactName || "N/A",
      vendor.email || "N/A",
      Array.isArray(vendor.servicesProvided) ? vendor.servicesProvided.join(", ") : "N/A",
      vendor.pricingDetails || "N/A",
      vendor.paymentTerms || "N/A" // Ensure "Payment Terms" is included
    ]);
  
    // Adjust table styles
    autoTable(doc, {
      startY: 30,
      head: tableHeaders,
      body: tableData,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 4, valign: "middle", overflow: "linebreak" },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        0: { cellWidth: 30 }, // Vendor Name
        1: { cellWidth: 25 }, // Contact Name
        2: { cellWidth: 40 }, // Email
        3: { cellWidth: 30 }, // Services Provided
        4: { cellWidth: 40 }, // Pricing Details
        5: { cellWidth: 30 }  // Payment Terms - Adjusted width
      },
      margin: { left: 10, right: 10 } // Ensure content fits within the page
    });
  
    doc.save("Vendor_Management_Report.pdf");
  };
  
  const filteredVendors = vendors.filter((vendor) =>
    vendor.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center mt-4">Loading vendors...</p>;
  if (error) return <p className="text-danger text-center mt-4">Error: {error}</p>;

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Vendors List</h2>
        <div className="input-group w-25">
          <span className="input-group-text">
            <IoSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search vendors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={generateReport} className="btn btn-success">
          <FiPrinter className="me-2" /> Generate Report
        </button>
      </div>

      {filteredVendors.length === 0 ? (
        <p className="text-center">No vendors found.</p>
      ) : (
        filteredVendors.map((vendor) => (
          <div key={vendor._id} className="card mb-3 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title">{vendor.vendorName || "N/A"}</h5>
                <p className="card-text">Contact: {vendor.contactName || "N/A"}</p>
                <p className="card-text">Email: {vendor.email || "N/A"}</p>
                <p className="card-text">Services: {Array.isArray(vendor.servicesProvided) ? vendor.servicesProvided.join(", ") : "N/A"}</p>
                <p className="card-text">Pricing: {vendor.pricingDetails || "N/A"}</p>
                <p className="card-text">Payment Terms: {vendor.paymentTerms || "N/A"}</p>
              </div>
              <div>
                <button onClick={() => handleUpdate(vendor._id)} className="btn btn-primary me-2">
                  Update
                </button>
                <button onClick={() => handleDelete(vendor._id)} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default VendorList;
