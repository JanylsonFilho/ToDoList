
class Loading {
  constructor() {
    this.loadingElement = document.getElementById("loading")
    this.tasksContainer = document.getElementById("tasks-container")
    this.activeLoaders = new Set()
  }

 
  show(loaderId = "default") {
    this.activeLoaders.add(loaderId)
    this.updateVisibility()
  }


  hide(loaderId = "default") {
    this.activeLoaders.delete(loaderId)
    this.updateVisibility()
  }

 
  updateVisibility() {
    const shouldShow = this.activeLoaders.size > 0

    if (shouldShow) {
      this.loadingElement.style.display = "block"
      this.tasksContainer.style.display = "none"
    } else {
      this.loadingElement.style.display = "none"
      this.tasksContainer.style.display = "block"
    }
  }

 
  isLoading() {
    return this.activeLoaders.size > 0
  }

 
  clear() {
    this.activeLoaders.clear()
    this.updateVisibility()
  }
}

window.loading = new Loading()
