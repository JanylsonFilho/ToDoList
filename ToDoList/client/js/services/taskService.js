
class TaskService {
  constructor() {
    this.baseURL = "/api/tasks"
  }

  /**
   * Buscar tarefas com filtros e paginação
   */
  async getTasks(params = {}) {
    try {
      const queryParams = new URLSearchParams(params)
      const response = await fetch(`${this.baseURL}?${queryParams}`)
      return await response.json()
    } catch (error) {
      throw new Error(`Erro ao buscar tarefas: ${error.message}`)
    }
  }

  /**
   * Buscar tarefa por ID
   */
  async getTaskById(taskId) {
    try {
      const response = await fetch(`${this.baseURL}/${taskId}`)
      return await response.json()
    } catch (error) {
      throw new Error(`Erro ao buscar tarefa: ${error.message}`)
    }
  }

  /**
   * Criar nova tarefa
   */
  async createTask(formData) {
    try {
      const response = await fetch(this.baseURL, {
        method: "POST",
        body: formData,
      })
      return await response.json()
    } catch (error) {
      throw new Error(`Erro ao criar tarefa: ${error.message}`)
    }
  }

  /**
   * Atualizar tarefa existente
   */
  async updateTask(taskId, formData) {
    try {
      const response = await fetch(`${this.baseURL}/${taskId}`, {
        method: "PUT",
        body: formData,
      })
      return await response.json()
    } catch (error) {
      throw new Error(`Erro ao atualizar tarefa: ${error.message}`)
    }
  }

  /**
   * Excluir tarefa
   */
  async deleteTask(taskId) {
    try {
      const response = await fetch(`${this.baseURL}/${taskId}`, {
        method: "DELETE",
      })
      return await response.json()
    } catch (error) {
      throw new Error(`Erro ao excluir tarefa: ${error.message}`)
    }
  }

  /**
   * Alternar status de conclusão
   */
  async toggleTaskComplete(taskId) {
    try {
      const response = await fetch(`${this.baseURL}/${taskId}/toggle`, {
        method: "PATCH",
      })
      return await response.json()
    } catch (error) {
      throw new Error(`Erro ao alternar status: ${error.message}`)
    }
  }

  /**
   * Buscar estatísticas
   */
  async getStatistics() {
    try {
      const response = await fetch(`${this.baseURL}/statistics`)
      return await response.json()
    } catch (error) {
      throw new Error(`Erro ao buscar estatísticas: ${error.message}`)
    }
  }

  /**
   * Buscar tarefas vencidas
   */
  async getOverdueTasks() {
    try {
      const params = new URLSearchParams({
        page: 1,
        limit: 100,
        completed: false,
      })

      const response = await fetch(`${this.baseURL}?${params}`)
      const data = await response.json()

      if (data.success) {
        const now = new Date()
        const overdueTasks = data.data.tasks.filter((task) => {
          return task.dueDate && new Date(task.dueDate) < now && !task.completed
        })

        return {
          success: true,
          data: { tasks: overdueTasks, total: overdueTasks.length },
        }
      }

      return data
    } catch (error) {
      throw new Error(`Erro ao buscar tarefas vencidas: ${error.message}`)
    }
  }
}

window.taskService = new TaskService()