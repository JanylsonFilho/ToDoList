const Task = require("../models/Task")


class TaskDAO {
  /**
   * Buscar tarefas com filtros e paginação
   * @param {Object} filter 
   * @param {Object} options 
   * @returns {Promise<Object>}
   */
  async findTasks(filter = {}, options = {}) {
    const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = -1 } = options

    const skip = (page - 1) * limit

    try {
      // Buscar tarefas com paginação
      const tasks = await Task.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean() // Retorna objetos JavaScript simples para melhor performance

      // Contar total de documentos
      const total = await Task.countDocuments(filter)

      return {
        tasks,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      }
    } catch (error) {
      throw new Error(`Erro ao buscar tarefas: ${error.message}`)
    }
  }

  /**
   * Buscar tarefa por ID
   * @param {string} taskId 
   * @returns {Promise<Object|null>} 
   */
  async findById(taskId) {
    try {
      return await Task.findById(taskId).lean()
    } catch (error) {
      throw new Error(`Erro ao buscar tarefa por ID: ${error.message}`)
    }
  }

  /**
   * Criar nova tarefa
   * @param {Object} taskData 
   * @returns {Promise<Object>} 
   */
  async create(taskData) {
    try {
      const task = new Task(taskData)
      const savedTask = await task.save()
      return savedTask.toObject()
    } catch (error) {
      throw new Error(`Erro ao criar tarefa: ${error.message}`)
    }
  }

  /**
   * Atualizar tarefa por ID
   * @param {string} taskId 
   * @param {Object} updateData 
   * @returns {Promise<Object|null>} 
   */
  async updateById(taskId, updateData) {
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { ...updateData, updatedAt: new Date() },
        {
          new: true,
          runValidators: true,
          lean: true,
        },
      )
      return updatedTask
    } catch (error) {
      throw new Error(`Erro ao atualizar tarefa: ${error.message}`)
    }
  }

  /**
   * Excluir tarefa por ID
   * @param {string} taskId 
   * @returns {Promise<Object|null>} 
   */
  async deleteById(taskId) {
    try {
      return await Task.findByIdAndDelete(taskId).lean()
    } catch (error) {
      throw new Error(`Erro ao excluir tarefa: ${error.message}`)
    }
  }

  /**
   * Alternar status de conclusão da tarefa
   * @param {string} taskId 
   * @returns {Promise<Object|null>} 
   */
  async toggleComplete(taskId) {
    try {
      const task = await Task.findById(taskId)
      if (!task) {
        return null
      }

      task.completed = !task.completed
      task.updatedAt = new Date()

      const updatedTask = await task.save()
      return updatedTask.toObject()
    } catch (error) {
      throw new Error(`Erro ao alternar status da tarefa: ${error.message}`)
    }
  }

  /**
   * Contar tarefas por status
   * @returns {Promise<Object>} 
   */
  async getTasksCount() {
    try {
      const total = await Task.countDocuments()
      const completed = await Task.countDocuments({ completed: true })
      const active = await Task.countDocuments({ completed: false })

      return {
        total,
        completed,
        active,
      }
    } catch (error) {
      throw new Error(`Erro ao contar tarefas: ${error.message}`)
    }
  }

  /**
   * Buscar tarefas por texto (título ou descrição)
   * @param {string} searchText 
   * @param {Object} options 
   * @returns {Promise<Object>} 
   */
  async searchTasks(searchText, options = {}) {
    try {
      const searchRegex = new RegExp(searchText, "i")
      const filter = {
        $or: [{ title: searchRegex }, { description: searchRegex }],
      }

      return await this.findTasks(filter, options)
    } catch (error) {
      throw new Error(`Erro ao buscar tarefas por texto: ${error.message}`)
    }
  }

  /**
   * Buscar tarefas com prazo vencido
   * @returns {Promise<Array>} 
   */
  async findOverdueTasks() {
    try {
      const now = new Date()
      return await Task.find({
        dueDate: { $lt: now },
        completed: false,
      }).lean()
    } catch (error) {
      throw new Error(`Erro ao buscar tarefas vencidas: ${error.message}`)
    }
  }
}

module.exports = new TaskDAO()
