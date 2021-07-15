class Drag {
  constructor(node, onDrop) {
    this.node = node
    this.onDrop = onDrop

    this.clone = null
    this.dragClickOffsetX = null
    this.dragClickOffsetY = null
    this.lastDragX = null
    this.lastDragY = null
    this.init()
  }

  init() {
    this.node.draggable = true
    this.node.style.userSelect = 'none'

    this.node.addEventListener('dragstart', event => {
      this.dragClickOffsetX = event.layerX
      this.dragClickOffsetY = event.layerY
      this.makeClone()

      event.target.style.opacity = 0
    })

    document.addEventListener('dragenter', event => event.preventDefault())

    document.addEventListener('dragover', event => {
      event.preventDefault()

      let { x, y } = event
      // Odd glitch
      if (x === 0 && y === 0) {
        x = this.lastDragX
        y = this.lastDragY
      }

      if (x === this.lastDragX && y === this.lastDragY) {
        return
      }

      this.translate(x - this.dragClickOffsetX, y - this.dragClickOffsetY)
      this.lastDragX = x
      this.lastDragY = y
    })

    document.addEventListener('drop', event => {
      this.node.style.opacity = 1
      this.clone.parentNode.removeChild(this.clone)
      this.clone = null
      this.onDrop(event)
    })
  }

  makeClone() {
    this.clone = this.node.cloneNode(true)
    this.styleClone(this.clone, this.node.offsetWidth, this.node.offsetHeight)
    this.node.parentNode.insertBefore(this.clone, this.node)
  }

  styleClone(node, width, height) {
    node.style.position = 'fixed'
    node.style.zIndex = 9999
    node.style.width = width + 'px'
    node.style.height = height + 'px'
    node.style.left = '-9999px'
    node.style.margin = 0
    node.style.padding = 0
  }

  translate(x, y) {
    this.clone.style.left = x + 'px'
    this.clone.style.top = y + 'px'
  }
}

export default Drag
