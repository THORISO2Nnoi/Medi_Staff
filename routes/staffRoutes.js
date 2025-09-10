const express = require('express');
const multer = require('multer');
const staffController = require('../controllers/staffController');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'profilePic') cb(null, 'uploads/profile_pics');
    else cb(null, 'uploads/certificates');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Routes
router.post('/', upload.fields([{ name: 'profilePic', maxCount: 1 }, { name: 'certificates' }]), staffController.addStaff);
router.get('/', staffController.getStaff);

module.exports = router;
