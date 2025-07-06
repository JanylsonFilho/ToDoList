const express = require("express")
const cors = require("cors")
const path = require("path")
const taskRoutes = require("./routes/taskRoutes")
const errorHandler = require("./middleware/errorHandler")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, "../client")))

// Servir arquivos de upload
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/tasks", taskRoutes)

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"))
})

app.use(errorHandler)

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Rota não encontrada",
  })
})

module.exports = app
