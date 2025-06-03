const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve frontend static files from "public" folder
app.use(express.static(path.join(__dirname, "public")))

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hanif-portfolio")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// News Schema
const newsSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const News = mongoose.model("News", newsSchema)

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Only image files are allowed!"), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
})

// Routes

// Get all news posts with full image URLs
app.get("/api/news", async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit) || 0
    const news = await News.find().sort({ createdAt: -1 }).limit(limit)

    const newsWithUrls = news.map(item => ({
      _id: item._id,
      title: item.title,
      description: item.description,
      image: `${req.protocol}://${req.get("host")}/uploads/${item.image}`,
      createdAt: item.createdAt,
    }))

    res.json(newsWithUrls)
  } catch (error) {
    console.error("Error fetching news:", error)
    res.status(500).json({ error: "Failed to fetch news" })
  }
})

// Create a new news post with image upload
app.post("/api/news", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" })
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" })
    }

    const news = new News({
      title,
      description,
      image: req.file.filename,
    })

    await news.save()

    res.status(201).json({
      message: "News post created successfully",
      news,
    })
  } catch (error) {
    console.error("Error creating news post:", error)
    res.status(500).json({ error: "Failed to create news post" })
  }
})

// Get single news post
app.get("/api/news/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
    if (!news) {
      return res.status(404).json({ error: "News post not found" })
    }

    const newsWithUrl = {
      _id: news._id,
      title: news.title,
      description: news.description,
      image: `${req.protocol}://${req.get("host")}/uploads/${news.image}`,
      createdAt: news.createdAt,
    }

    res.json(newsWithUrl)
  } catch (error) {
    console.error("Error fetching news post:", error)
    res.status(500).json({ error: "Failed to fetch news post" })
  }
})

// Delete news post and its image
app.delete("/api/news/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
    if (!news) {
      return res.status(404).json({ error: "News post not found" })
    }

    const imagePath = path.join(uploadsDir, news.image)
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath)
    }

    await News.findByIdAndDelete(req.params.id)

    res.json({ message: "News post deleted successfully" })
  } catch (error) {
    console.error("Error deleting news post:", error)
    res.status(500).json({ error: "Failed to delete news post" })
  }
})

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Multer error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Max size is 5MB." })
    }
  }
  console.error("Unhandled error:", error)
  res.status(500).json({ error: "Internal server error" })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`API available at http://localhost:${PORT}/api`)
})
