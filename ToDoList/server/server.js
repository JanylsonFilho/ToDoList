const app = require("./app")
const connectDB = require("./config/database")
require("dotenv").config()

const PORT = process.env.PORT || 3000

connectDB()

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
  console.log(`Frontend disponível em: http://localhost:${PORT}`)
  console.log(`API disponível em: http://localhost:${PORT}/api`)
})
