// routes/staffRoutes.js
const express = require('express');
const Staff = require('../models/Staff');

const router = express.Router();

// 📌 Create a staff member
router.post('/', async (req, res) => {
  try {
    const newStaff = new Staff(req.body);
    const savedStaff = await newStaff.save();
    res.status(201).json(savedStaff);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 Get all staff members
router.get('/', async (req, res) => {
  try {
    // Populate event details based on the assignedEvents array of ObjectIds
    const staff = await Staff.find().populate('assignedEvents');
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get a staff member by ID
router.get('/:id', async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).populate('assignedEvents');
    if (!staff) return res.status(404).json({ message: 'Staff member not found' });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Update a staff member
router.put('/:id', async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('assignedEvents');

    if (!updatedStaff) return res.status(404).json({ message: 'Staff member not found' });
    res.json(updatedStaff);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 Delete a staff member
router.delete('/:id', async (req, res) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
    if (!deletedStaff) return res.status(404).json({ message: 'Staff member not found' });
    res.json({ message: 'Staff member deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
