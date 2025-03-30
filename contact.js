const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const Contact = require("../models/Contact")

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(new Error("Only image files are allowed!"))
  },
})

// @route   POST api/contact
// @desc    Submit contact form
// @access  Public
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    const newContact = new Contact({
      name,
      email,
      subject,
      message,
      imagePath: req.file ? `/uploads/${req.file.filename}` : null,
    })

    const contact = await newContact.save()
    res.status(201).json({ success: true, data: contact })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   GET api/contact
// @desc    Get all contact submissions
// @access  Private (would require auth middleware in a real app)
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json(contacts)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router

