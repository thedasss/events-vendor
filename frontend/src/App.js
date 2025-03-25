import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import UpdateEvent from "./Components/event/UpdateEvent";
import "./Components/input.css";  



import Teds from "./Components/event/Teds"; // Import the Teds component
import EventsList from "./Components/event/EventsList"; // Import the EventsList component

import Vendor from "./Components/vendor/vendor"; 
import VendorsList from "./Components/vendor/VendorList"; // Import the VendorsList component
import UpdateVendor from "./Components/vendor/updateVendor"; // Adjust the path if needed


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
        </Routes>
      </div>
    </Router>
  );
}

export default App;