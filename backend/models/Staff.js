const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: ['Manager', 'Coordinator', 'Assistant', 'Supervisor'] },
  assignedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }], // Reference to events
  salary: { type: Number, required: true },
  joiningDate: { type: Date, required: true },
  notes: { type: String }
});

module.exports = mongoose.model('Staff', StaffSchema);
