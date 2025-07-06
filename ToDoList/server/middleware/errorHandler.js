const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  console.error(" Erro:", err)

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ")
    error = {
      message,
      statusCode: 400,
    }
  }

  if (err.name === "CastError") {
    error = {
      message: "ID inválido",
      statusCode: 400,
    }
  }

  if (err.code === 11000) {
    error = {
      message: "Recurso duplicado",
      statusCode: 400,
    }
  }

  // Erro de upload de arquivo
  const multer = require("multer") 
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      error = {
        message: "Arquivo muito grande. Tamanho máximo: 5MB",
        statusCode: 400,
      }
    }
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Erro interno do servidor",
  })
}

module.exports = errorHandler
