
class Filters {
  constructor() {
    this.searchInput = document.getElementById("search-input")
    this.filterButtons = document.querySelectorAll(".filter-btn")

    this.currentFilter = "all"
    this.currentSearch = ""
    this.searchTimeout = null

    this.onFilterChangeCallback = null
    this.onSearchChangeCallback = null

    this.bindEvents()
  }

  /**
   * Vincular eventos
   */
  bindEvents() {
    this.filterButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const filter = e.target.dataset.filter
        this.setFilter(filter)
      })
    })

    this.searchInput.addEventListener("input", (e) => {
      this.handleSearch(e.target.value)
    })
  }

  /**
   * Configurar callbacks
   */
  onFilterChange(callback) {
    this.onFilterChangeCallback = callback
  }

  onSearchChange(callback) {
    this.onSearchChangeCallback = callback
  }

  /**
   * Definir filtro ativo
   */
  setFilter(filter) {
    this.currentFilter = filter

    this.removeActiveClass(".filter-btn")
    this.setActiveElement(".filter-btn", filter)

    if (this.onFilterChangeCallback) {
      this.onFilterChangeCallback(filter)
    }
  }

  /**
   * Manipular busca com debounce
   */
  handleSearch(searchTerm) {
    this.currentSearch = searchTerm.trim()

    // Debounce para evitar muitas requisições
    clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(() => {
      if (this.onSearchChangeCallback) {
        this.onSearchChangeCallback(this.currentSearch)
      }
    }, 500)
  }

  /**
   * Obter filtro atual
   */
  getCurrentFilter() {
    return this.currentFilter
  }

  /**
   * Obter busca atual
   */
  getCurrentSearch() {
    return this.currentSearch
  }

  /**
   * Limpar busca
   */
  clearSearch() {
    this.searchInput.value = ""
    this.currentSearch = ""
  }

  /**
   * Resetar filtros
   */
  reset() {
    this.setFilter("all")
    this.clearSearch()
  }

  // Helper methods
  removeActiveClass(selector) {
    const elements = document.querySelectorAll(selector)
    elements.forEach((element) => element.classList.remove("active"))
  }

  setActiveElement(selector, filter) {
    const element = document.querySelector(`${selector}[data-filter="${filter}"]`)
    if (element) {
      element.classList.add("active")
    }
  }
}

window.Filters = Filters
window.filters = new Filters()
