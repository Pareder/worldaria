class Drag {
  node: HTMLElement
  clone: HTMLElement | null
  dragClickOffsetX: number | null
  dragClickOffsetY: number | null
  lastDragX: number | null
  lastDragY: number | null
  onDrop: (event: DragEvent | TouchEvent | Touch) => void

  constructor(node: HTMLElement, onDrop: (event: DragEvent | TouchEvent | Touch) => void) {
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

  onDragStart(e: DragEvent | TouchEvent) {
    const event = this.getEvent(e)
    this.dragClickOffsetX = ('layerX' in event
      ? event.layerX as number
      : 'clientX' in event
        ? event.clientX
        : 0
    ) || 0
    this.dragClickOffsetY = ('layerY' in event
        ? event.layerY as number
        : 'clientY' in event
          ? event.clientY
          : 0
    ) || 0
    this.makeClone()

    this.node.style.opacity = '0'

    document.addEventListener('dragover', this.onDragOver)
    document.addEventListener('touchmove', this.onDragOver)

    document.addEventListener('drop', this.onDragEnd)
    document.addEventListener('touchend', this.onDragEnd)
  }

  onDragOver(e: DragEvent | TouchEvent) {
    e.preventDefault()
    const event = this.getEvent(e)

    const clientX = ('clientX' in event ? event.clientX : 0) || this.lastDragX || 0
    const clientY = ('clientY' in event ? event.clientY : 0) || this.lastDragY || 0

    if (clientX === this.lastDragX && clientY === this.lastDragY) {
      return
    }

    this.translate(clientX - (this.dragClickOffsetX || 0), clientY - (this.dragClickOffsetY || 0))
    this.lastDragX = clientX
    this.lastDragY = clientY
  }

  onDragEnd(e: DragEvent | TouchEvent) {
    const event = this.getEvent(e)
    this.node.style.opacity = '1'
    this.clone?.parentNode?.removeChild(this.clone)
    this.clone = null
    this.onDrop(event)

    document.removeEventListener('dragover', this.onDragOver)
    document.removeEventListener('touchmove', this.onDragOver)

    document.removeEventListener('drop', this.onDragEnd)
    document.removeEventListener('touchend', this.onDragEnd)
  }

  makeClone() {
    this.clone = this.node.cloneNode(true) as HTMLElement
    this.styleClone(this.clone, this.node.offsetWidth, this.node.offsetHeight)
    this.node.parentNode?.insertBefore(this.clone, this.node)
  }

  styleClone(node: HTMLElement, width: number, height: number) {
    node.style.position = 'fixed'
    node.style.zIndex = '9999'
    node.style.width = width + 'px'
    node.style.height = height + 'px'
    node.style.left = '-9999px'
    node.style.margin = '0'
    node.style.padding = '0'
  }

  translate(x: number, y: number) {
    if (!this.clone) {
      return
    }

    this.clone.style.left = x + 'px'
    this.clone.style.top = y + 'px'
  }

  getEvent(event: DragEvent | TouchEvent) {
    if (event instanceof DragEvent) {
      return event
    }

    // To handle touch events because their objects differ from original drag event objects
    return event.targetTouches && event.targetTouches.length
      ? event.targetTouches[0]
      : event.changedTouches && event.changedTouches.length
        ? event.changedTouches[0]
        : event
  }
}

export default Drag
