
class TaskForm {
  constructor() {
    this.form = document.getElementById("task-form")
    this.editingTaskId = null
    this.onSubmitCallback = null

    this.elements = {
      title: document.getElementById("form-title"),
      submitBtn: document.getElementById("submit-btn"),
      cancelBtn: document.getElementById("cancel-btn"),
      titleInput: document.getElementById("title"),
      descriptionInput: document.getElementById("description"),
      prioritySelect: document.getElementById("priority"),
      dueDateInput: document.getElementById("dueDate"),
      attachmentInput: document.getElementById("attachment"),
    }

    this.bindEvents()
  }

  /**
   * Vincular eventos
   */
  bindEvents() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleSubmit()
    })

    this.elements.cancelBtn.addEventListener("click", () => {
      this.cancelEdit()
    })
  }

  /**
   * Configurar callback de submit
   */
  onSubmit(callback) {
    this.onSubmitCallback = callback
  }

  /**
   * Manipular submit do formulário
   */
  async handleSubmit() {
    if (!this.validateForm()) {
      return
    }

    const formData = new FormData(this.form)

    try {
      if (this.onSubmitCallback) {
        await this.onSubmitCallback(formData, this.editingTaskId)
      }

      this.reset()
    } catch (error) {
      console.error("Erro no submit do formulário:", error)
    }
  }

  /**
   * Validar formulário
   */
  validateForm() {
    const title = this.elements.titleInput.value.trim()

    if (!title) {
      window.toast.error("Título é obrigatório")
      this.elements.titleInput.focus()
      return false
    }

    if (title.length > 100) {
      window.toast.error("Título não pode exceder 100 caracteres")
      this.elements.titleInput.focus()
      return false
    }

    const description = this.elements.descriptionInput.value.trim()
    if (description.length > 500) {
      window.toast.error("Descrição não pode exceder 500 caracteres")
      this.elements.descriptionInput.focus()
      return false
    }

    return true
  }

  /**
   * Preencher formulário para edição
   */
  populateForEdit(task) {
    this.editingTaskId = task._id

    this.elements.titleInput.value = task.title
    this.elements.descriptionInput.value = task.description || ""
    this.elements.prioritySelect.value = task.priority

    if (task.dueDate) {
      const date = new Date(task.dueDate)
      this.elements.dueDateInput.value = date.toISOString().split("T")[0]
    }

    this.setEditMode(true)
    this.scrollToForm()
  }

  /**
   * Definir modo de edição
   */
  setEditMode(isEditing) {
    if (isEditing) {
      this.elements.title.innerHTML = '<i class="fas fa-edit"></i> Editar Tarefa'
      this.elements.submitBtn.innerHTML = '<i class="fas fa-save"></i> Atualizar Tarefa'
      this.elements.cancelBtn.style.display = "inline-flex"
    } else {
      this.elements.title.innerHTML = '<i class="fas fa-plus-circle"></i> Nova Tarefa'
      this.elements.submitBtn.innerHTML = '<i class="fas fa-save"></i> Salvar Tarefa'
      this.elements.cancelBtn.style.display = "none"
    }
  }

  /**
   * Cancelar edição
   */
  cancelEdit() {
    this.reset()
  }

  /**
   * Resetar formulário
   */
  reset() {
    this.form.reset()
    this.editingTaskId = null
    this.setEditMode(false)
  }

 
  scrollToForm() {
    if (window.DOMHelpers) {
      window.DOMHelpers.scrollToElement(".form-container")
    }
  }

 
  isEditing() {
    return this.editingTaskId !== null
  }

  /**
   * Obter ID da tarefa sendo editada
   */
  getEditingTaskId() {
    return this.editingTaskId
  }
}

window.TaskForm = TaskForm
window.taskForm = new TaskForm()
