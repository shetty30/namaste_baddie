// ── Mood session timer
const Timer = {
  _iv:    null,
  _left:  0,
  _total: 0,
  _paused: false,
  _onDone: null,

  start(minutes, onDone) {
    this._total  = minutes * 60
    this._left   = this._total
    this._paused = false
    this._onDone = onDone
    this._tick()
    clearInterval(this._iv)
    this._iv = setInterval(() => {
      if (!this._paused) {
        this._left--
        this._tick()
        if (this._left <= 0) {
          clearInterval(this._iv)
          this._onDone && this._onDone(true)
        }
      }
    }, 1000)
  },

  pause()    { this._paused = true },
  resume()   { this._paused = false },
  isPaused() { return this._paused },
  elapsed()  { return this._total - this._left },

  stop() {
    clearInterval(this._iv)
    this._iv = null
  },

  _tick() {
    const m = Math.floor(this._left / 60)
    const s = this._left % 60
    const el = document.getElementById('t2-num')
    if (el) el.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')

    const arc = document.getElementById('t2-arc')
    if (arc) {
      const pct = (this._total - this._left) / this._total
      arc.style.strokeDashoffset = 603 * pct
    }
  }
}
