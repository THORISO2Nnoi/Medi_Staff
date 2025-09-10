const StaffMember = require('../models/StaffMember');

// @desc Add new staff member
exports.addStaff = async (req, res) => {
  try {
    const staff = new StaffMember(req.body);
    if (req.files?.profilePic) staff.profilePic = req.files.profilePic[0].path;
    if (req.files?.certificates) staff.certificates = req.files.certificates.map(file => file.path);

    await staff.save();
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all staff members
exports.getStaff = async (req, res) => {
  try {
    const staff = await StaffMember.find();
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
