const express = require('express');
const multer = require('multer');
const path = require('path');
const staffController = require('../controllers/staffController');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir =
      file.fieldname === 'profilePic'
        ? path.join(__dirname, '../uploads/profile_pics')
        : path.join(__dirname, '../uploads/certificates');
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// POST /staff
router.post(
  '/',
  upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'certificates' }
  ]),
  staffController.addStaff
);

// GET /staff
router.get('/', staffController.getStaff);

module.exports = router;
