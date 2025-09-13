const StaffMember = require('../models/StaffMember');

exports.addStaff = async (req, res) => {
  try {
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    const data = { ...req.body };

    // Normalize fields to arrays
    const toArray = (val) =>
      Array.isArray(val)
        ? val
        : (val || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

    data.specialization = toArray(req.body.specialization);
    data.qualifications = toArray(req.body.qualifications);
    data.languages = toArray(req.body.languages);

    // Files
    data.profilePic = req.files?.profilePic?.[0]?.path || '';
    data.certificates = (req.files?.certificates || []).map((f) => f.path);

    const staff = new StaffMember(data);
    await staff.save();

    res.status(201).json(staff);
  } catch (error) {
    console.error('Add staff error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getStaff = async (req, res) => {
  try {
    const staff = await StaffMember.find();
    res.json(staff);
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ message: error.message });
  }
};
