const taskDAO = require("../dao/taskDAO")
const fs = require("fs").promises
const path = require("path")


class TaskService {
  /**
   * Listar tarefas com filtros, busca e paginação
   * @param {Object} queryParams 
   * @returns {Promise<Object>} 
   */
  async getTasks(queryParams) {
    try {
      const {
        page = 1,
        limit = 10,
        completed,
        priority,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = queryParams

      // Validar parâmetros de paginação
      const validatedPage = Math.max(1, Number.parseInt(page))
      const validatedLimit = Math.min(20, Math.max(1, Number.parseInt(limit) || 5)) // Padrão 5, máximo 20 itens por página

      // Construir filtros
      const filter = {}

      if (completed !== undefined) {
        filter.completed = completed === "true"
      }

      if (priority && ["baixa", "média", "alta"].includes(priority)) {
        filter.priority = priority
      }

      const options = {
        page: validatedPage,
        limit: validatedLimit,
        sortBy,
        sortOrder: sortOrder === "desc" ? -1 : 1,
      }

      let result

      if (search && search.trim()) {
        result = await taskDAO.searchTasks(search.trim(), options)
      } else {
        result = await taskDAO.findTasks(filter, options)
      }

      return {
        success: true,
        data: {
          tasks: result.tasks,
          pagination: {
            currentPage: result.page,
            totalPages: result.totalPages,
            totalTasks: result.total,
            hasNext: result.hasNext,
            hasPrev: result.hasPrev,
            limit: result.limit,
          },
        },
      }
    } catch (error) {
      throw new Error(`Erro no serviço ao buscar tarefas: ${error.message}`)
    }
  }

  /**
   * Obter tarefa por ID
   * @param {string} taskId 
   * @returns {Promise<Object>} 
   */
  async getTaskById(taskId) {
    try {
      if (!this._isValidObjectId(taskId)) {
        throw new Error("ID da tarefa inválido")
      }

      const task = await taskDAO.findById(taskId)

      if (!task) {
        throw new Error("Tarefa não encontrada")
      }

      return {
        success: true,
        data: task,
      }
    } catch (error) {
      throw new Error(`Erro no serviço ao buscar tarefa: ${error.message}`)
    }
  }

  /**
   * Criar nova tarefa
   * @param {Object} taskData 
   * @param {Object} file 
   * @returns {Promise<Object>} 
   */
  async createTask(taskData, file = null) {
    try {
      await this._validateTaskData(taskData)

      const newTaskData = {
        title: taskData.title.trim(),
        description: taskData.description?.trim() || "",
        priority: taskData.priority || "média",
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
        completed: false,
      }

      if (newTaskData.dueDate && newTaskData.dueDate < new Date()) {
        throw new Error("Data de vencimento não pode ser no passado")
      }

      if (file) {
        await this._validateFile(file)
        newTaskData.attachment = {
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype,
        }
      }

      const createdTask = await taskDAO.create(newTaskData)

      return {
        success: true,
        message: "Tarefa criada com sucesso",
        data: createdTask,
      }
    } catch (error) {
      if (file && file.path) {
        await this._removeFile(file.path)
      }
      throw new Error(`Erro no serviço ao criar tarefa: ${error.message}`)
    }
  }

  /**
   * Atualizar tarefa existente
   * @param {string} taskId 
   * @param {Object} taskData
   * @param {Object} file 
   * @returns {Promise<Object>} 
   */
  async updateTask(taskId, taskData, file = null) {
    try {
      if (!this._isValidObjectId(taskId)) {
        throw new Error("ID da tarefa inválido")
      }

      const existingTask = await taskDAO.findById(taskId)
      if (!existingTask) {
        throw new Error("Tarefa não encontrada")
      }

      if (taskData.title) {
        await this._validateTaskData(taskData)
      }

      const updateData = {}

      if (taskData.title) updateData.title = taskData.title.trim()
      if (taskData.description !== undefined) updateData.description = taskData.description.trim()
      if (taskData.priority) updateData.priority = taskData.priority
      if (taskData.completed !== undefined)
        updateData.completed = taskData.completed === "true" || taskData.completed === true

      if (taskData.dueDate) {
        const dueDate = new Date(taskData.dueDate)
        if (dueDate < new Date()) {
          throw new Error("Data de vencimento não pode ser no passado")
        }
        updateData.dueDate = dueDate
      }

      if (file) {
        await this._validateFile(file)

        if (existingTask.attachment && existingTask.attachment.path) {
          await this._removeFile(existingTask.attachment.path)
        }

        updateData.attachment = {
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype,
        }
      }

      const updatedTask = await taskDAO.updateById(taskId, updateData)

      return {
        success: true,
        message: "Tarefa atualizada com sucesso",
        data: updatedTask,
      }
    } catch (error) {
      if (file && file.path) {
        await this._removeFile(file.path)
      }
      throw new Error(`Erro no serviço ao atualizar tarefa: ${error.message}`)
    }
  }

  /**
   * Excluir tarefa
   * @param {string} taskId
   * @returns {Promise<Object>}
   */
  async deleteTask(taskId) {
    try {
      if (!this._isValidObjectId(taskId)) {
        throw new Error("ID da tarefa inválido")
      }

      const existingTask = await taskDAO.findById(taskId)
      if (!existingTask) {
        throw new Error("Tarefa não encontrada")
      }

      if (existingTask.attachment && existingTask.attachment.path) {
        await this._removeFile(existingTask.attachment.path)
      }

      await taskDAO.deleteById(taskId)

      return {
        success: true,
        message: "Tarefa excluída com sucesso",
      }
    } catch (error) {
      throw new Error(`Erro no serviço ao excluir tarefa: ${error.message}`)
    }
  }

  /**
   * Alternar status de conclusão da tarefa
   * @param {string} taskId 
   * @returns {Promise<Object>} 
   */
  async toggleTaskComplete(taskId) {
    try {
      if (!this._isValidObjectId(taskId)) {
        throw new Error("ID da tarefa inválido")
      }

      const updatedTask = await taskDAO.toggleComplete(taskId)

      if (!updatedTask) {
        throw new Error("Tarefa não encontrada")
      }

      return {
        success: true,
        message: `Tarefa marcada como ${updatedTask.completed ? "concluída" : "pendente"}`,
        data: updatedTask,
      }
    } catch (error) {
      throw new Error(`Erro no serviço ao alternar status da tarefa: ${error.message}`)
    }
  }

  /**
   * Obter estatísticas das tarefas
   * @returns {Promise<Object>} 
   */
  async getTasksStatistics() {
    try {
      const counts = await taskDAO.getTasksCount()
      const overdueTasks = await taskDAO.findOverdueTasks()

      return {
        success: true,
        data: {
          total: counts.total,
          completed: counts.completed,
          active: counts.active,
          overdue: overdueTasks.length,
          completionRate: counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0,
        },
      }
    } catch (error) {
      throw new Error(`Erro no serviço ao obter estatísticas: ${error.message}`)
    }
  }


  /**
   * Validar dados da tarefa
   * @private
   */
  async _validateTaskData(taskData) {
    if (!taskData.title || taskData.title.trim().length === 0) {
      throw new Error("Título é obrigatório")
    }

    if (taskData.title.trim().length > 100) {
      throw new Error("Título não pode exceder 100 caracteres")
    }

    if (taskData.description && taskData.description.length > 500) {
      throw new Error("Descrição não pode exceder 500 caracteres")
    }

    if (taskData.priority && !["baixa", "média", "alta"].includes(taskData.priority)) {
      throw new Error("Prioridade deve ser: baixa, média ou alta")
    }
  }

  /**
   * Validar arquivo anexo
   * @private
   */
  async _validateFile(file) {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error("Tipo de arquivo não permitido")
    }

    const maxSize = 5 * 1024 * 1024 // 5MB é o tamanho máximo permitido do arquivo
    if (file.size > maxSize) {
      throw new Error("Arquivo muito grande. Tamanho máximo: 5MB")
    }
  }

  /**
   * Remover arquivo do sistema
   * @private
   */
  async _removeFile(filePath) {
    try {
      await fs.unlink(filePath)
    } catch (error) {
      console.error("Erro ao remover arquivo:", error.message)
    }
  }

  /**
   * Validar se é um ObjectId válido do MongoDB
   * @private
   */
  _isValidObjectId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id)
  }
}

module.exports = new TaskService()
