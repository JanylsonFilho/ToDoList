
class Toast {
  constructor() {
    this.container = document.getElementById("toast-container")
    this.icons = {
      success: "fas fa-check-circle",
      error: "fas fa-exclamation-circle",
      warning: "fas fa-exclamation-triangle",
      info: "fas fa-info-circle",
    }
    this.DOMHelpers = {
      escapeHtml: (text) => {
        return text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;")
      },
    }
  }

  show(message, type = "success", duration = 4000) {
    const toast = this.createToast(message, type)
    this.container.appendChild(toast)

    setTimeout(() => {
      this.remove(toast)
    }, duration)

    return toast
  }


  createToast(message, type) {
    const toast = document.createElement("div")
    toast.className = `toast ${type}`

    toast.innerHTML = `
      <div class="toast-content">
        <i class="${this.icons[type]}"></i>
        <span>${this.DOMHelpers.escapeHtml(message)}</span>
      </div>
    `

    return toast
  }

 
  remove(toast) {
    if (toast && toast.parentNode) {
      toast.parentNode.removeChild(toast)
    }
  }


  success(message, duration) {
    return this.show(message, "success", duration)
  }

  error(message, duration) {
    return this.show(message, "error", duration)
  }

  warning(message, duration) {
    return this.show(message, "warning", duration)
  }

  info(message, duration) {
    return this.show(message, "info", duration)
  }
}

window.toast = new Toast()
