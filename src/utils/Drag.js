class Drag {
  constructor(node, onDrop) {
    this.node = node
    this.onDrop = onDrop

    this.clone = null
    this.dragClickOffsetX = null
    this.dragClickOffsetY = null
    this.lastDragX = null
    this.lastDragY = null
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.init()
  }

  init() {
    this.node.draggable = true
    this.node.style.userSelect = 'none'

    this.node.addEventListener('dragstart', this.onDragStart)
    this.node.addEventListener('touchstart', this.onDragStart)
    document.addEventListener('dragenter', event => event.preventDefault())
  }

  onDragStart(e) {
    const event = this.getEvent(e)
    console.log(event)
    this.dragClickOffsetX = event.layerX || event.clientX
    this.dragClickOffsetY = event.layerY || event.clientY
    this.makeClone()

    this.node.style.opacity = 0

    document.addEventListener('dragover', this.onDragOver)
    document.addEventListener('touchmove', this.onDragOver)

    document.addEventListener('drop', this.onDragEnd)
    document.addEventListener('touchend', this.onDragEnd)
  }

  onDragOver(e) {
    e.preventDefault()
    const event = this.getEvent(e)

    let { clientX, clientY } = event
    // Odd glitch
    if (clientX === 0 && clientY === 0) {
      clientX = this.lastDragX
      clientY = this.lastDragY
    }

    if (clientX === this.lastDragX && clientY === this.lastDragY) {
      return
    }

    console.log(clientX, this.dragClickOffsetX)
    console.log(clientY, this.dragClickOffsetY)
    this.translate(clientX - this.dragClickOffsetX, clientY - this.dragClickOffsetY)
    this.lastDragX = clientX
    this.lastDragY = clientY
  }

  onDragEnd(e) {
    const event = this.getEvent(e)
    this.node.style.opacity = 1
    // this.clone.parentNode.removeChild(this.clone)
    // this.clone = null
    this.onDrop(event)

    document.removeEventListener('dragover', this.onDragOver)
    document.removeEventListener('touchmove', this.onDragOver)

    document.removeEventListener('drop', this.onDragEnd)
    document.removeEventListener('touchend', this.onDragEnd)
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

  getEvent(event) {
    // To handle touch events because their objects differ from original drag event objects
    return event.targetTouches && event.targetTouches.length
      ? event.targetTouches[0]
      : event.changedTouches && event.changedTouches.length
        ? event.changedTouches[0]
        : event
  }
}

export default Drag
