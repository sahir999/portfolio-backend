const mongoose = require("mongoose")

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  technologies: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    enum: ["frontend", "backend", "fullstack"],
    required: true,
  },
  liveUrl: {
    type: String,
    required: true,
  },
  githubUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Project", ProjectSchema)

