
class Pagination {
  constructor() {
    this.container = document.getElementById("pagination")
    this.infoElement = document.getElementById("pagination-info")
    this.itemsPerPageSelect = document.getElementById("items-per-page-select")

    this.currentPage = 1
    this.totalPages = 0
    this.totalItems = 0
    this.itemsPerPage = 5

    this.onPageChangeCallback = null
    this.onItemsPerPageChangeCallback = null

    this.bindEvents()
  }

  /**
   * Vincular eventos
   */
  bindEvents() {
    this.itemsPerPageSelect.addEventListener("change", (e) => {
      const newLimit = Number.parseInt(e.target.value)
      this.setItemsPerPage(newLimit)
    })
  }

  /**
   * Configurar callback para mudança de página
   */
  onPageChange(callback) {
    this.onPageChangeCallback = callback
  }

  /**
   * Configurar callback para mudança de itens por página
   */
  onItemsPerPageChange(callback) {
    this.onItemsPerPageChangeCallback = callback
  }

  /**
   * Renderizar paginação
   */
  render(paginationData) {
    this.currentPage = paginationData.currentPage
    this.totalPages = paginationData.totalPages
    this.totalItems = paginationData.totalTasks
    this.itemsPerPage = paginationData.limit

    this.renderControls(paginationData)
    this.renderInfo(paginationData)
  }

  /**
   * Renderizar controles de paginação
   */
  renderControls(pagination) {
    if (pagination.totalPages <= 1) {
      this.container.innerHTML = ""
      return
    }

    let html = ""

    html += this.createButton("Primeira", "fas fa-angle-double-left", 1, pagination.currentPage === 1, "nav-button")

    html += this.createButton(
      "Anterior",
      "fas fa-chevron-left",
      pagination.currentPage - 1,
      !pagination.hasPrev,
      "nav-button",
    )

    html += '<div class="page-numbers">'
    html += this.renderPageNumbers(pagination)
    html += "</div>"

    html += this.createButton(
      "Próximo",
      "fas fa-chevron-right",
      pagination.currentPage + 1,
      !pagination.hasNext,
      "nav-button",
      true,
    )

    html += this.createButton(
      "Última",
      "fas fa-angle-double-right",
      pagination.totalPages,
      pagination.currentPage === pagination.totalPages,
      "nav-button",
      true,
    )

    this.container.innerHTML = html
  }

  /**
   * Renderizar números das páginas
   */
  renderPageNumbers(pagination) {
    let html = ""
    const startPage = Math.max(1, pagination.currentPage - 2)
    const endPage = Math.min(pagination.totalPages, pagination.currentPage + 2)

    // Primeira página se não estiver no range
    if (startPage > 1) {
      html += this.createButton("1", "", 1, false, "page-number")
      if (startPage > 2) {
        html += '<span class="page-info">...</span>'
      }
    }

    // Páginas no range
    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === pagination.currentPage
      html += this.createButton(i.toString(), "", i, false, `page-number ${isActive ? "active" : ""}`)
    }

    // Última página se não estiver no range
    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        html += '<span class="page-info">...</span>'
      }
      html += this.createButton(pagination.totalPages.toString(), "", pagination.totalPages, false, "page-number")
    }

    return html
  }

  /**
   * Criar botão de paginação
   */
  createButton(text, icon, page, disabled, className, iconAfter = false) {
    const iconHtml = icon ? `<i class="${icon}"></i>` : ""
    const content = iconAfter ? `${text} ${iconHtml}` : `${iconHtml} ${text}`

    return `
      <button class="${className}" 
              ${disabled ? "disabled" : ""} 
              onclick="pagination.goToPage(${page})">
        ${content}
      </button>
    `
  }

  /**
   * Renderizar informações de paginação
   */
  renderInfo(pagination) {
    const start = (pagination.currentPage - 1) * pagination.limit + 1
    const end = Math.min(start + pagination.limit - 1, pagination.totalTasks)

    this.infoElement.textContent = `Mostrando ${start}-${end} de ${pagination.totalTasks} tarefas`
  }

  /**
   * Ir para página específica
   */
  goToPage(page) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page
      if (this.onPageChangeCallback) {
        this.onPageChangeCallback(page)
      }
    }
  }

  /**
   * Definir itens por página
   */
  setItemsPerPage(newLimit) {
    this.itemsPerPage = newLimit
    this.currentPage = 1 // Voltar para primeira página

    if (this.onItemsPerPageChangeCallback) {
      this.onItemsPerPageChangeCallback(newLimit)
    }
  }

  /**
   * Obter página atual
   */
  getCurrentPage() {
    return this.currentPage
  }

  /**
   * Obter itens por página
   */
  getItemsPerPage() {
    return this.itemsPerPage
  }
}

window.Pagination = Pagination
window.pagination = new Pagination()
