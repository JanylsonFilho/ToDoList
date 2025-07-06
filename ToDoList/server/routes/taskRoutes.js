const express = require("express")
const multer = require("multer")
const path = require("path")
const taskController = require("../controllers/taskController")

const router = express.Router()

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  // Tipos de arquivo permitidos
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error("Tipo de arquivo não permitido"))
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: Number.parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB é o tamanho máximo permitido do arquivo
  },
  fileFilter: fileFilter,
})

router.get("/statistics", taskController.getStatistics)

// Rotas CRUD
router.get("/", taskController.getTasks)
router.get("/:id", taskController.getTaskById)
router.post("/", upload.single("attachment"), taskController.createTask)
router.put("/:id", upload.single("attachment"), taskController.updateTask)
router.delete("/:id", taskController.deleteTask)
router.patch("/:id/toggle", taskController.toggleComplete)

module.exports = router
