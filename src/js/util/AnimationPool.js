import autobind from 'src/js/util/autobind'

export default class AnimationPool {
  constructor() {
    autobind(this)
    this.id = Math.random().toString(32).substring(1)
    this._rafHandler = null
    this.registeredShips = []
    this.reset()
  }

  register(ship) {
    this.registeredShips.push(ship)
  }

  reset() {
    this.blockFlush()
    this.disabledShips = []
    this.pool = []
  }
  
  queue(ship) {
    this.pool.push(ship)
    this.flushIfFull()
  }

  disableShip(ship) {
    if (this.disabledShips.indexOf(ship) < 0) {
      this.disabledShips.push(ship)
    }
    this.flushIfFull()
  }

  flushIfFull() {
    const threshold = this.registeredShips.length - this.disabledShips.length
    if (this.pool.length > 0 && this.pool.length >= threshold) {
      this.flush()
    }
  }

  flush() {
    const toilet = this.pool
    this.pool = []
    this._rafHandler = window.requestAnimationFrame(() => {
      this._rafHandler = null
      toilet.forEach(ship => ship.step())
      toilet.forEach(ship => ship.renderNext())
    })
  }
  
  isFlushing() {
    return !!this._rafHandler
  }
  
  blockFlush() {
    if (this._rafHandler) {
      window.cancelAnimationFrame(this._rafHandler)
      this._rafHandler = null
    }
  }
}