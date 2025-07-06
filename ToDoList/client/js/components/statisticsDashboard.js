
class StatisticsDashboard {
  constructor() {
    this.statistics = {}
    this.elements = {}
    this.initializeElements()
    this.bindEvents()
  }


  initializeElements() {
    try {
      this.elements = {
        totalTasks: document.getElementById("total-tasks"),
        activeTasks: document.getElementById("active-tasks"),
        completedTasks: document.getElementById("completed-tasks"),
        overdueTasks: document.getElementById("overdue-tasks"),
        completionPercentage: document.getElementById("completion-percentage"),
        progressFill: document.getElementById("progress-fill"),
        progressText: document.querySelector(".progress-text"),
        overdueCard: document.querySelector(".stat-card.overdue"),
      }

      const missingElements = Object.entries(this.elements)
        .filter(([key, element]) => !element)
        .map(([key]) => key)

      if (missingElements.length > 0) {
        console.warn("Elementos DOM não encontrados:", missingElements)
      }
    } catch (error) {
      console.error("Erro ao inicializar elementos do dashboard:", error)
    }
  }


  bindEvents() {
   
  }

  /**
   * Carregar estatísticas
   */
  async load() {
    try {
      if (!window.taskService) {
        throw new Error("TaskService não está disponível")
      }

      const response = await window.taskService.getStatistics()

      if (response && response.success) {
        this.statistics = response.data
        this.render(response.data)
        return response.data
      } else {
        throw new Error(response?.message || "Erro ao carregar estatísticas")
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)

      // Mostrar estatísticas padrão em caso de erro
      const defaultStats = {
        total: 0,
        active: 0,
        completed: 0,
        overdue: 0,
        completionRate: 0,
      }

      this.render(defaultStats)

      if (window.toast) {
        window.toast.error("Erro ao carregar estatísticas")
      }

      throw error
    }
  }

  /**
   * Renderizar estatísticas
   */
  render(stats) {
    try {
      this.updateCards(stats)
      this.updateProgressBar(stats)
      this.updateMotivationalText(stats)
      this.highlightProblems(stats)
    } catch (error) {
      console.error("Erro ao renderizar estatísticas:", error)
    }
  }

  /**
   * Atualizar cards de estatísticas
   */
  updateCards(stats) {
    try {
      if (this.elements.totalTasks) {
        this.elements.totalTasks.textContent = stats.total || 0
      }
      if (this.elements.activeTasks) {
        this.elements.activeTasks.textContent = stats.active || 0
      }
      if (this.elements.completedTasks) {
        this.elements.completedTasks.textContent = stats.completed || 0
      }
      if (this.elements.overdueTasks) {
        this.elements.overdueTasks.textContent = stats.overdue || 0
      }
    } catch (error) {
      console.error("Erro ao atualizar cards:", error)
    }
  }

  /**
   * Atualizar barra de progresso
   */
  updateProgressBar(stats) {
    try {
      const completionRate = stats.completionRate || 0

      if (this.elements.completionPercentage) {
        this.elements.completionPercentage.textContent = `${completionRate}%`
      }

      if (this.elements.progressFill) {
        this.elements.progressFill.style.width = "0%"
        setTimeout(() => {
          this.elements.progressFill.style.width = `${completionRate}%`
        }, 100)
      }
    } catch (error) {
      console.error("Erro ao atualizar barra de progresso:", error)
    }
  }

  /**
   * Atualizar texto motivacional
   */
  updateMotivationalText(stats) {
    try {
      if (!this.elements.progressText) return

      const completionRate = stats.completionRate || 0
      let message, color

      if (completionRate >= 80) {
        message = "Excelente! Você está arrasando!"
        color = "#48bb78"
      } else if (completionRate >= 50) {
        message = "Muito bem! Continue assim!"
        color = "#ed8936"
      } else if (completionRate > 0) {
        message = "Bom começo! Vamos continuar!"
        color = "#4299e1"
      } else {
        message = "Que tal começar marcando algumas tarefas como concluídas?"
        color = "#718096"
      }

      this.elements.progressText.textContent = message
      this.elements.progressText.style.color = color
    } catch (error) {
      console.error("Erro ao atualizar texto motivacional:", error)
    }
  }

  /**
   * Destacar problemas (tarefas vencidas)
   */
  highlightProblems(stats) {
    try {
      if (!this.elements.overdueCard) return

      const overdueCount = stats.overdue || 0

      if (overdueCount > 0) {
        this.elements.overdueCard.style.animation = "pulse 2s infinite"
        this.elements.overdueCard.style.borderLeftWidth = "6px"
        this.elements.overdueCard.style.borderLeftColor = "#f56565"
      } else {
        this.elements.overdueCard.style.animation = "none"
        this.elements.overdueCard.style.borderLeftWidth = "4px"
      }
    } catch (error) {
      console.error("Erro ao destacar problemas:", error)
    }
  }

  /**
   * Atualizar estatísticas
   */
  async refresh() {
    try {
      await this.load()
      if (window.toast) {
        window.toast.success("Estatísticas atualizadas!")
      }
    } catch (error) {
      console.error("Erro ao atualizar estatísticas:", error)
    }
  }

  /**
   * Obter estatísticas atuais
   */
  getStatistics() {
    return this.statistics
  }

  /**
   * Verificar se o dashboard está funcionando
   */
  isReady() {
    return Object.values(this.elements).some((element) => element !== null)
  }
}

if (!document.querySelector("style[data-dashboard-animations]")) {
  const style = document.createElement("style")
  style.setAttribute("data-dashboard-animations", "true")
  style.textContent = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `
  document.head.appendChild(style)
}

window.StatisticsDashboard = StatisticsDashboard
window.statisticsDashboard = new StatisticsDashboard()
