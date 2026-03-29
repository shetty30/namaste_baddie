const { contextBridge } = require('electron')
const fs = require('fs')
const path = require('path')

const SESSIONS_FILE = path.join(__dirname, 'data', 'sessions.json')

contextBridge.exposeInMainWorld('storage', {
  read: () => {
    try {
      if (!fs.existsSync(SESSIONS_FILE)) return []
      const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8')
      return JSON.parse(raw || '[]')
    } catch {
      return []
    }
  },
  append: (session) => {
    try {
      const existing = JSON.parse(
        fs.existsSync(SESSIONS_FILE)
          ? fs.readFileSync(SESSIONS_FILE, 'utf-8') || '[]'
          : '[]'
      )
      existing.push(session)
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(existing, null, 2))
    } catch (e) {
      console.error('Storage error:', e)
    }
  },
  clear: () => {
    fs.writeFileSync(SESSIONS_FILE, '[]')
  }
})