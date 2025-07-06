class TaskList {
  constructor() {
    this.container = document.getElementById("tasks-container")
    this.noTasksElement = document.getElementById("no-tasks")
    this.tasksCounter = document.getElementById("tasks-counter")

    this.tasks = []
    this.onToggleCallback = null
    this.onEditCallback = null
    this.onDeleteCallback = null
  }

  /**
   * Configurar callbacks
   */
  onToggle(callback) {
    this.onToggleCallback = callback
  }

  onEdit(callback) {
    this.onEditCallback = callback
  }

  onDelete(callback) {
    this.onDeleteCallback = callback
  }

  /**
   * Renderizar lista de tarefas
   */
  render(tasks) {
    this.tasks = tasks

    if (tasks.length === 0) {
      this.showNoTasks()
      return
    }

    this.hideNoTasks()
    this.container.innerHTML = tasks.map((task) => this.createTaskHTML(task)).join("")
  }

  /**
   * Criar HTML de uma tarefa
   */
  createTaskHTML(task) {
    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) : null;
    const createdDate = new Date(task.createdAt).toLocaleDateString("pt-BR")

    const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
    const nowUtcMidnight = new Date();
    nowUtcMidnight.setUTCHours(0, 0, 0, 0); // Current day at UTC midnight

    const isOverdue = taskDueDate && taskDueDate.setUTCHours(0, 0, 0, 0) < nowUtcMidnight.getTime() && !task.completed;


    return `
      <div class="task-item ${task.completed ? "completed" : ""} ${isOverdue ? "overdue" : ""}" 
           data-id="${task._id}">
        <div class="task-header">
          <div class="task-content">
            <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
            <span class="task-priority priority-${task.priority}">${task.priority}</span>
          </div>
        </div>
        
        ${
          task.description
            ? `
          <div class="task-description">
            ${this.escapeHtml(task.description)}
          </div>
        `
            : ""
        }
        
        <div class="task-meta">
          <div class="task-date">
            <i class="fas fa-calendar"></i>
            Criada em ${createdDate}
          </div>
          ${
            dueDate
              ? `
            <div class="task-date ${isOverdue ? "text-red-500" : ""}">
              <i class="fas fa-${isOverdue ? "exclamation-triangle" : "clock"}"></i>
              ${isOverdue ? "VENCIDA:" : "Prazo:"} ${dueDate}
            </div>
          `
              : ""
          }
        </div>
        
        ${
          task.attachment
            ? `
          <div class="task-attachment">
            <a href="/uploads/${task.attachment.filename}" 
               target="_blank" 
               class="attachment-link">
              <i class="fas fa-paperclip"></i>
              ${this.escapeHtml(task.attachment.originalName)}
            </a>
          </div>
        `
            : ""
        }
        
        <div class="task-actions">
          <button class="btn-${task.completed ? "incomplete" : "complete"}" 
                  onclick="taskList.handleToggle('${task._id}')">
            <i class="fas fa-${task.completed ? "undo" : "check"}"></i>
            ${task.completed ? "Reativar" : "Concluir"}
          </button>
          <button class="btn-edit" onclick="taskList.handleEdit('${task._id}')">
            <i class="fas fa-edit"></i>
            Editar
          </button>
          <button class="btn-delete" onclick="taskList.handleDelete('${task._id}')">
            <i class="fas fa-trash"></i>
            Excluir
          </button>
        </div>
      </div>
    `
  }

  /**
   * Escapar HTML para prevenir XSS
   */
  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  /**
   * Manipular toggle de tarefa
   */
  handleToggle(taskId) {
    if (this.onToggleCallback) {
      this.onToggleCallback(taskId)
    }
  }

  /**
   * Manipular edição de tarefa
   */
  handleEdit(taskId) {
    if (this.onEditCallback) {
      this.onEditCallback(taskId)
    }
  }

  /**
   * Manipular exclusão de tarefa
   */
  handleDelete(taskId) {
    if (this.onDeleteCallback) {
      this.onDeleteCallback(taskId)
    }
  }

  /**
   * Mostrar mensagem de "sem tarefas"
   */
  showNoTasks() {
    this.container.innerHTML = ""
    this.noTasksElement.style.display = "block"
  }

  /**
   * Ocultar mensagem de "sem tarefas"
   */
  hideNoTasks() {
    this.noTasksElement.style.display = "none"
  }

  /**
   * Atualizar contador de tarefas
   */
  updateCounter(total) {
    this.tasksCounter.textContent = `${total} ${total === 1 ? "tarefa" : "tarefas"}`
  }

  /**
   * Obter tarefas atuais
   */
  getTasks() {
    return this.tasks
  }
}

window.TaskList = TaskList
window.taskList = new TaskList()