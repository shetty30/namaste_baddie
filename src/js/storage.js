// ── Storage layer
// In Electron: uses preload.js window.storage (file-based)
// In browser:  falls back to localStorage

const NB = {
  // Raw read/write
  _get(key, fallback = null) {
    try {
      const raw = localStorage.getItem('nb_' + key)
      return raw !== null ? JSON.parse(raw) : fallback
    } catch { return fallback }
  },

  _set(key, val) {
    try { localStorage.setItem('nb_' + key, JSON.stringify(val)) } catch {}
  },

  // ── Sessions (mood timer)
  getSessions()           { return this._get('sessions', []) },
  saveSession(s)          { const a = this.getSessions(); a.unshift(s); this._set('sessions', a) },

  // ── Focus sessions
  getFocusSessions()      { return this._get('focus', []) },
  saveFocusSession(s)     { const a = this.getFocusSessions(); a.unshift(s); this._set('focus', a) },

  // ── Points & streak
  getPoints()             { return this._get('pts', 0) },
  addPoints(n)            { this._set('pts', this.getPoints() + n) },
  getStreak()             { return this._get('streak', 0) },

  touchStreak() {
    const today = new Date().toDateString()
    const last  = this._get('last_day', '')
    let st      = this.getStreak()
    if (last !== today) {
      const yest = new Date(Date.now() - 86400000).toDateString()
      st = (last === yest) ? st + 1 : 1
      this._set('streak', st)
      this._set('last_day', today)
    }
    return st
  },

  // ── Notes
  getNotes()              { return this._get('notes', []) },
  saveNote(note) {
    let notes = this.getNotes()
    const idx = notes.findIndex(n => n.id === note.id)
    if (idx > -1) { notes[idx] = note }
    else           { notes.unshift(note) }
    this._set('notes', notes)
  },
  deleteNote(id)          { this._set('notes', this.getNotes().filter(n => n.id !== id)) },

  // ── Stats helper
  getStats() {
    const sessions = this.getSessions()
    return {
      pts:    this.getPoints(),
      streak: this.getStreak(),
      sess:   sessions.filter(s => s.ok).length
    }
  }
}
