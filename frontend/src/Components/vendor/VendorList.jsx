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
      if (window.confirm("Are you sure you want to delete this vendor?")) {
        await axios.delete(`http://localhost:3000/api/vendors/${id}`);
        setVendors((prevVendors) => prevVendors.filter((vendor) => vendor._id !== id));
      }
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

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);

    const title = "Vendor Management Report";
    doc.text(title, doc.internal.pageSize.width / 2, 20, { align: "center" });

    // Add date to the report
    const today = new Date();
    const dateStr = today.toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated on: ${dateStr}`, doc.internal.pageSize.width - 40, 30);

    const tableHeaders = [["Vendor Name", "Contact Name", "Email", "Services Provided", "Pricing Details", "Payment Terms"]];

    const tableData = filteredVendors.map((vendor) => [
      vendor.vendorName || "N/A",
      vendor.contactName || "N/A",
      vendor.email || "N/A",
      Array.isArray(vendor.servicesProvided) ? vendor.servicesProvided.join(", ") : "N/A",
      vendor.pricingDetails || "N/A",
      vendor.paymentTerms || "N/A"
    ]);

    autoTable(doc, {
      startY: 40,
      head: tableHeaders,
      body: tableData,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 5 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    doc.save("Vendor_Management_Report.pdf");
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600">Loading vendors...</p>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 rounded">
      <p className="text-red-700">Error: {error}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-blue-600">Vendors List</h2>
        
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IoSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search vendors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={generateReport} 
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
        >
          <FiPrinter /> Generate Report
        </button>
      </div>

      {filteredVendors.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No vendors found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div key={vendor._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-100">{vendor.vendorName || "N/A"}</h3>
                
                <div className="space-y-3">
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-32">Contact:</span>
                    <span className="text-gray-800">{vendor.contactName || "N/A"}</span>
                  </div>
                  
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-32">Email:</span>
                    <span className="text-gray-800 break-all">{vendor.email || "N/A"}</span>
                  </div>
                  
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-32">Services:</span>
                    <span className="text-gray-800">{Array.isArray(vendor.servicesProvided) ? vendor.servicesProvided.join(", ") : "N/A"}</span>
                  </div>
                  
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-32">Pricing:</span>
                    <span className="text-gray-800">{vendor.pricingDetails || "N/A"}</span>
                  </div>
                  
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-32">Payment Terms:</span>
                    <span className="text-gray-800">{vendor.paymentTerms || "N/A"}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex border-t border-gray-100 bg-gray-50">
                <button 
                  onClick={() => handleUpdate(vendor._id)} 
                  className="flex-1 py-3 text-center text-blue-600 hover:bg-blue-50 font-medium transition-colors duration-200"
                >
                  Update
                </button>
                <span className="w-px bg-gray-200"></span>
                <button 
                  onClick={() => handleDelete(vendor._id)} 
                  className="flex-1 py-3 text-center text-red-600 hover:bg-red-50 font-medium transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorList;