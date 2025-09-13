const StaffMember = require('../models/StaffMember');

// @desc Add new staff member
exports.addStaff = async (req, res) => {
  try {
    const data = { ...req.body };

    // If files are uploaded
    if (req.files?.profilePic?.[0]) {
      data.profilePic = req.files.profilePic[0].path;
    }

    if (req.files?.certificates?.length) {
      data.certificates = req.files.certificates.map(file => file.path);
    }

    const staff = new StaffMember(data);
    await staff.save();

    res.status(201).json(staff);
  } catch (error) {
    console.error(error);
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
