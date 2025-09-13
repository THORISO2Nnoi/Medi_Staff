const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(
  "mongodb+srv://THORISO:THORISO2@cluster0.k3fe5gw.mongodb.net/MEDI_FILES?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Mongoose schema
const staffSchema = new mongoose.Schema({
  email: String,
  password: String,
  fullName: String,
  role: String,
  specialization: [String],
  qualifications: [String],
  experience: String,
  hpcsa: String,
  location: String,
  languages: [String],
  profilePic: String, // file path
  certificates: [String], // array of file paths
}, { collection: "StaffMembers" });

const Staff = mongoose.model("Staff", staffSchema);

// Multer setup for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Add Staff route
app.post("/addStaff", upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "certificates", maxCount: 10 }
]), async (req, res) => {
  try {
    const {
      email, password, fullName, role,
      specialization, qualifications, languages,
      experience, hpcsa, location
    } = req.body;

    const staff = new Staff({
      email,
      password,
      fullName,
      role,
      specialization: specialization ? JSON.parse(specialization) : [],
      qualifications: qualifications ? JSON.parse(qualifications) : [],
      experience,
      hpcsa,
      location,
      languages: languages ? JSON.parse(languages) : [],
      profilePic: req.files["profilePic"] ? req.files["profilePic"][0].path : "",
      certificates: req.files["certificates"] ? req.files["certificates"].map(f => f.path) : []
    });

    await staff.save();
    res.status(201).json({ message: "Staff added successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all staff
app.get("/getStaff", async (req, res) => {
  try {
    const staffList = await Staff.find();
    res.json(staffList);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
