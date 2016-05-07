import autobind from 'src/js/util/autobind'

const FPS_SCALE = 6 / 100
const FOO = 16

window.foo = []

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
    this.renderWait = 0
    this.lastFlushStart = 0
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

    this._rafHandler = window.setTimeout(() => {
      this._rafHandler = null

      const xValues = toilet.map(ship => {
        const xValue = ship.step()
        ship.renderNext()
        return xValue
      })

      if (this.renderWait <= 0) {
        const renderStart = window.performance.now()
        window.requestAnimationFrame(() => {
          toilet.forEach((ship, i) => ship.updateRoll(xValues[i]))
          this.renderWait = Math.round(FPS_SCALE*(window.performance.now() - renderStart)) - 1
        })
      } else {
        this.renderWait--
      }
    }, FOO)
  }
  
  isFlushing() {
    return !!this._rafHandler
  }
  
  blockFlush() {
    if (this._rafHandler) {
      window.clearTimeout(this._rafHandler)
      this._rafHandler = null
    }
  }
}