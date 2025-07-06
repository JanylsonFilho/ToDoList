const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Título é obrigatório"],
    trim: true,
    maxlength: [100, "Título não pode exceder 100 caracteres"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Descrição não pode exceder 500 caracteres"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ["baixa", "média", "alta"],
    default: "média",
  },
  dueDate: {
    type: Date,
  },
  attachment: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

taskSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

taskSchema.pre(["updateOne", "findOneAndUpdate"], function (next) {
  this.set({ updatedAt: Date.now() })
  next()
})

module.exports = mongoose.model("Task", taskSchema)
