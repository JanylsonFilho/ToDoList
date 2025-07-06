
class TodoApp {
  constructor() {
    this.currentPage = 1
    this.itemsPerPage = 5

    this.init()
  }


  async init() {
    await this.waitForComponents()

    this.setupComponents()
    this.bindComponentEvents()

    await this.loadInitialData()
  }


  async waitForComponents() {
    let attempts = 0
    const maxAttempts = 50

    while (attempts < maxAttempts) {
      if (
        window.taskService &&
        window.taskForm &&
        window.taskList &&
        window.filters &&
        window.pagination &&
        window.statisticsDashboard &&
        window.toast &&
        window.loading &&
        window.modal &&
        window.DOMHelpers
      ) {
        break
      }

      await new Promise((resolve) => setTimeout(resolve, 100))
      attempts++
    }

    if (attempts >= maxAttempts) {
      console.error("Timeout aguardando componentes serem carregados")
    }
  }


  setupComponents() {
    this.taskService = window.taskService
    this.taskForm = window.taskForm
    this.taskList = window.taskList
    this.filters = window.filters
    this.pagination = window.pagination
    this.statisticsDashboard = window.statisticsDashboard
    this.toast = window.toast
    this.loading = window.loading
    this.modal = window.modal
    this.DOMHelpers = window.DOMHelpers
  }

 
  bindComponentEvents() {
    // Formulário de tarefas
    this.taskForm.onSubmit(async (formData, editingTaskId) => {
      await this.handleTaskSubmit(formData, editingTaskId)
    })

    // Lista de tarefas
    this.taskList.onToggle(async (taskId) => {
      await this.handleTaskToggle(taskId)
    })

    this.taskList.onEdit(async (taskId) => {
      await this.handleTaskEdit(taskId)
    })

    this.taskList.onDelete(async (taskId) => {
      await this.handleTaskDelete(taskId)
    })

    // Filtros
    this.filters.onFilterChange(async (filter) => {
      await this.handleFilterChange(filter)
    })

    this.filters.onSearchChange(async (searchTerm) => {
      await this.handleSearchChange(searchTerm)
    })

    // Paginação
    this.pagination.onPageChange(async (page) => {
      await this.handlePageChange(page)
    })

    this.pagination.onItemsPerPageChange(async (itemsPerPage) => {
      await this.handleItemsPerPageChange(itemsPerPage)
    })
  }


  async loadInitialData() {
    try {
      await Promise.all([this.loadTasks(), this.statisticsDashboard.load()])
    } catch (error) {
      console.error("Erro ao carregar dados iniciais:", error)
      this.toast.error("Erro ao carregar dados da aplicação")
    }
  }

  async loadTasks() {
    try {
      this.loading.show("tasks")

      const params = {
        page: this.currentPage,
        limit: this.itemsPerPage,
      }

      const currentFilter = this.filters.getCurrentFilter()
      if (currentFilter !== "all") {
        params.completed = currentFilter === "completed"
      }

      const currentSearch = this.filters.getCurrentSearch()
      if (currentSearch) {
        params.search = currentSearch
      }

      const response = await this.taskService.getTasks(params)

      if (response.success) {
        this.taskList.render(response.data.tasks)
        this.taskList.updateCounter(response.data.pagination.totalTasks)
        this.pagination.render(response.data.pagination)
      } else {
        throw new Error(response.message || "Erro ao carregar tarefas")
      }
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error)
      this.toast.error("Erro ao carregar tarefas")
    } finally {
      this.loading.hide("tasks")
    }
  }

 
  async handleTaskSubmit(formData, editingTaskId) {
    try {
      let response

      if (editingTaskId) {
        response = await this.taskService.updateTask(editingTaskId, formData)
      } else {
        response = await this.taskService.createTask(formData)
        this.currentPage = 1 
      }

      if (response.success) {
        this.toast.success(response.message)
        await this.refreshData()
      } else {
        throw new Error(response.message || "Erro ao salvar tarefa")
      }
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error)
      this.toast.error(error.message)
      throw error
    }
  }

  
  async handleTaskToggle(taskId) {
    try {
      const response = await this.taskService.toggleTaskComplete(taskId)

      if (response.success) {
        this.toast.success(response.message)
        await this.refreshData()
      } else {
        throw new Error(response.message || "Erro ao atualizar tarefa")
      }
    } catch (error) {
      console.error("Erro ao alternar tarefa:", error)
      this.toast.error(error.message)
    }
  }

 
  async handleTaskEdit(taskId) {
    try {
      const response = await this.taskService.getTaskById(taskId)

      if (response.success) {
        this.taskForm.populateForEdit(response.data)
      } else {
        throw new Error(response.message || "Erro ao carregar tarefa")
      }
    } catch (error) {
      console.error("Erro ao carregar tarefa para edição:", error)
      this.toast.error("Erro ao carregar tarefa para edição")
    }
  }

 
  async handleTaskDelete(taskId) {
    this.modal.show("Tem certeza que deseja excluir esta tarefa?", async () => {
      try {
        const response = await this.taskService.deleteTask(taskId)

        if (response.success) {
          this.toast.success(response.message)
          await this.refreshData()
        } else {
          throw new Error(response.message || "Erro ao excluir tarefa")
        }
      } catch (error) {
        console.error("Erro ao excluir tarefa:", error)
        this.toast.error(error.message)
      }
    })
  }


  async handleFilterChange(filter) {
    this.currentPage = 1
    await this.loadTasks()
  }

 
  async handleSearchChange(searchTerm) {
    this.currentPage = 1
    await this.loadTasks()
  }

  async handlePageChange(page) {
    this.currentPage = page
    await this.loadTasks()
  }

 
  async handleItemsPerPageChange(itemsPerPage) {
    this.itemsPerPage = itemsPerPage
    this.currentPage = 1
    await this.loadTasks()
  }

 
  async refreshData() {
    await Promise.all([this.loadTasks(), this.statisticsDashboard.load()])
  }

  async showActiveTasksOnly() {
    try {
      if (this.filters) {
        this.filters.setFilter("active")
      }
      if (this.DOMHelpers) {
        this.DOMHelpers.scrollToElement(".tasks-section")
      }
    } catch (error) {
      console.error("Erro ao mostrar tarefas ativas:", error)
      if (this.toast) {
        this.toast.error("Erro ao filtrar tarefas ativas")
      }
    }
  }

  async showOverdueTasks() {
    try {
      if (this.loading) {
        this.loading.show("overdue")
      }

      const response = await this.taskService.getOverdueTasks()

      if (response && response.success) {
        if (this.taskList) {
          this.taskList.render(response.data.tasks)
          this.taskList.updateCounter(response.data.total)
        }

        // Limpar paginação para tarefas vencidas
        if (this.pagination && this.pagination.container) {
          this.pagination.container.innerHTML = ""
        }
        if (this.pagination && this.pagination.infoElement) {
          this.pagination.infoElement.textContent = `${response.data.total} tarefas vencidas encontradas`
        }

        // Limpar filtros ativos
        if (this.DOMHelpers) {
          this.DOMHelpers.removeActiveClass(".filter-btn")
          this.DOMHelpers.scrollToElement(".tasks-section")
        }

        if (this.toast) {
          this.toast.info(`${response.data.total} tarefas vencidas encontradas`)
        }
      } else {
        throw new Error(response?.message || "Erro ao carregar tarefas vencidas")
      }
    } catch (error) {
      console.error("Erro ao carregar tarefas vencidas:", error)
      if (this.toast) {
        this.toast.error("Erro ao carregar tarefas vencidas")
      }
    } finally {
      if (this.loading) {
        this.loading.hide("overdue")
      }
    }
  }

  async refreshStatistics() {
    try {
      if (this.statisticsDashboard) {
        await this.statisticsDashboard.refresh()
      } else {
        throw new Error("Dashboard de estatísticas não está disponível")
      }
    } catch (error) {
      console.error("Erro ao atualizar estatísticas:", error)
      if (this.toast) {
        this.toast.error("Erro ao atualizar estatísticas")
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.todoApp = new TodoApp()
})
