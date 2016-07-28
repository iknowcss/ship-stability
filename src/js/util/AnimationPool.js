import autobind from 'src/js/util/autobind'
import Promise from 'bluebird'

const FPS_SCALE = 6 / 100
const FOO = 16

export default class AnimationPool {
  constructor(options = {}) {
    autobind(this)
    this.id = Math.random().toString(32).substring(1)
    this._rafHandler = null
    this.registeredShips = []
    this.eventHandlers = {}

    this._registrationPromise = new Promise(fulfill => {
      this.completeRegistration = fulfill
    })

    this.reset()
    
    if (options.registrationComplete) {
      this.completeRegistration()
    }
  }
  
  on(event, cb) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(cb);
  }

  notify(event) {
    if (this.eventHandlers.hasOwnProperty(event)) {
      this.eventHandlers[event].forEach(cb => cb());
    }
  }

  register(ship) {
    this.registeredShips.push(ship)
    return this._registrationPromise
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
          this.notify('flush')
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