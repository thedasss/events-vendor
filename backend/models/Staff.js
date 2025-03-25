// models/Staff.js
const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['Manager', 'Coordinator', 'Assistant', 'Supervisor'] 
  },
  // Store assignedEvents as an array of ObjectIds referencing the Event model
  assignedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  salary: { type: Number, required: true },
  joiningDate: { type: Date, required: true },
  notes: { type: String }
});

module.exports = mongoose.model('Staff', StaffSchema);
