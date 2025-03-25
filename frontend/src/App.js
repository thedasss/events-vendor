import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Components/input.css";  


import UpdateEvent from "./Components/event/UpdateEvent";
import Teds from "./Components/event/Teds"; // Import the Teds component
import EventsList from "./Components/event/EventsList"; // Import the EventsList component

import Vendor from "./Components/vendor/vendor"; // Corrected import name
import VendorsList from "./Components/vendor/VendorList"; // Import the VendorsList component
import UpdateVendor from "./Components/vendor/updateVendor"; // Adjust the path if needed

import Staff from "./Components/staff/Staff"; // Import the Staff component
import StaffList from "./Components/staff/StaffList"; // Import the StaffList component
import UpdateStaff from "./Components/staff/UpdateStaff"; // Import the UpdateStaff component


function App() {
  return (
    <Router>
      <div className="container">
        <br/>
        <Routes>
          <Route path="/teds" element={<Teds />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/update-event/:id" element={<UpdateEvent />} />

          <Route path="/vendor" element={<Vendor />} /> {/* Corrected component name */}        
          <Route path="/vendors" element={<VendorsList />} /> {/* Updated path for vendors */}
          <Route path="/Update-vendor/:id" element={<UpdateVendor />} /> {/* Updated path for updating vendor */}

          {/* Staff management routes */}
          <Route path="/staff" element={<Staff />} /> {/* Add the staff route */}
          <Route path="/update-staff/:id" element={<UpdateStaff />} /> {/* Update staff route */}
          <Route path="/staff-list" element={<StaffList />} /> {/* Staff list route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;