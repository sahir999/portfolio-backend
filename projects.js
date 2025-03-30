const express = require("express")
const router = express.Router()
const Project = require("../models/Project")

// @route   GET api/projects
// @desc    Get all projects
// @access  Public
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 })
    res.json(projects)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   GET api/projects/:id
// @desc    Get project by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ msg: "Project not found" })
    }

    res.json(project)
  } catch (err) {
    console.error(err.message)

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found" })
    }

    res.status(500).send("Server Error")
  }
})

// @route   POST api/projects
// @desc    Create a project
// @access  Private (would require auth middleware in a real app)
router.post("/", async (req, res) => {
  try {
    const { title, description, imageUrl, technologies, category, liveUrl, githubUrl } = req.body

    const newProject = new Project({
      title,
      description,
      imageUrl,
      technologies,
      category,
      liveUrl,
      githubUrl,
    })

    const project = await newProject.save()
    res.json(project)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private (would require auth middleware in a real app)
router.put("/:id", async (req, res) => {
  try {
    const { title, description, imageUrl, technologies, category, liveUrl, githubUrl } = req.body

    // Build project object
    const projectFields = {}
    if (title) projectFields.title = title
    if (description) projectFields.description = description
    if (imageUrl) projectFields.imageUrl = imageUrl
    if (technologies) projectFields.technologies = technologies
    if (category) projectFields.category = category
    if (liveUrl) projectFields.liveUrl = liveUrl
    if (githubUrl) projectFields.githubUrl = githubUrl

    let project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ msg: "Project not found" })
    }

    project = await Project.findByIdAndUpdate(req.params.id, { $set: projectFields }, { new: true })

    res.json(project)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private (would require auth middleware in a real app)
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ msg: "Project not found" })
    }

    await project.remove()
    res.json({ msg: "Project removed" })
  } catch (err) {
    console.error(err.message)

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found" })
    }

    res.status(500).send("Server Error")
  }
})

module.exports = router

