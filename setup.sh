# server.js
cat > server.js << 'EOF'
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const staffRoutes = require('./routes/staffRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/staff', staffRoutes);

// Connect DB and Start server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error('❌ DB connection error:', err.message));
EOF

# .env
cat > .env << 'EOF'
PORT=5000
MONGO_URI=mongodb://localhost:27017/medistaff
EOF

# staffController.js
cat > controllers/staffController.js << 'EOF'
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
EOF

# StaffMember.js
cat > models/StaffMember.js << 'EOF'
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: String,
  qualifications: [String],
  experience: Number,
  hpcsaNumber: String,
  location: String,
  languages: [String],
  profilePic: String,
  certificates: [String]
}, { timestamps: true });

module.exports = mongoose.model('StaffMember', staffSchema);
EOF

# staffRoutes.js
cat > routes/staffRoutes.js << 'EOF'
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
EOF

# Update package.json scripts
npx json -I -f package.json -e 'this.scripts={"start":"node server.js","dev":"nodemon server.js"}'

echo "✅ Setup complete! Run 'cd medistaff-backend && npm run dev' to start the server."
