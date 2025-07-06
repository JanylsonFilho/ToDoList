
class DOMHelpers {

  static escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

 
  static toggleElement(elementId, show) {
    const element = document.getElementById(elementId)
    if (element) {
      element.style.display = show ? "block" : "none"
    }
  }

 
  static addClass(elementId, className) {
    const element = document.getElementById(elementId)
    if (element) {
      element.classList.add(className)
    }
  }

  
  static removeClass(elementId, className) {
    const element = document.getElementById(elementId)
    if (element) {
      element.classList.remove(className)
    }
  }

 
  static scrollToElement(selector, behavior = "smooth") {
    const element = document.querySelector(selector)
    if (element) {
      element.scrollIntoView({ behavior })
    }
  }

 
  static clearElement(elementId) {
    const element = document.getElementById(elementId)
    if (element) {
      element.innerHTML = ""
    }
  }


  static setContent(elementId, content) {
    const element = document.getElementById(elementId)
    if (element) {
      element.innerHTML = content
    }
  }

 
  static setText(elementId, text) {
    const element = document.getElementById(elementId)
    if (element) {
      element.textContent = text
    }
  }

 
  static getValue(elementId) {
    const element = document.getElementById(elementId)
    return element ? element.value : ""
  }

 
  static setValue(elementId, value) {
    const element = document.getElementById(elementId)
    if (element) {
      element.value = value
    }
  }

  
  static addEventListener(elementId, event, callback) {
    const element = document.getElementById(elementId)
    if (element) {
      element.addEventListener(event, callback)
    }
  }

 
  static removeActiveClass(selector) {
    document.querySelectorAll(selector).forEach((element) => {
      element.classList.remove("active")
    })
  }

  
  static setActiveElement(selector, targetValue) {
    const element = document.querySelector(`${selector}[data-filter="${targetValue}"]`)
    if (element) {
      element.classList.add("active")
    }
  }
}

window.DOMHelpers = DOMHelpers
