
class Modal {
  constructor() {
    this.modal = document.getElementById("confirm-modal")
    this.messageElement = document.getElementById("confirm-message")
    this.confirmBtn = document.getElementById("confirm-yes")
    this.cancelBtn = document.getElementById("confirm-no")
    this.confirmCallback = null

    this.bindEvents()
  }

  bindEvents() {
    this.confirmBtn.addEventListener("click", () => {
      this.confirm()
    })

    this.cancelBtn.addEventListener("click", () => {
      this.close()
    })

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.close()
      }
    })

  
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) {
        this.close()
      }
    })
  }


  show(message, callback) {
    this.messageElement.textContent = message
    this.confirmCallback = callback
    this.modal.style.display = "block"
    document.body.style.overflow = "hidden" 
  }

 
  confirm() {
    if (this.confirmCallback) {
      this.confirmCallback()
    }
    this.close()
  }


  close() {
    this.modal.style.display = "none"
    this.confirmCallback = null
    document.body.style.overflow = "auto" 
  }

 
  isOpen() {
    return this.modal.style.display === "block"
  }
}

window.modal = new Modal()
