// ════════════════════════════════════════
// FOCUS MODULE — earn points for deep work
// ════════════════════════════════════════

const LEVELS = [
  { name: 'Beginner Baddie',  min: 0,    max: 60   },
  { name: 'Rising Baddie',    min: 60,   max: 200  },
  { name: 'Focused Baddie',   min: 200,  max: 500  },
  { name: 'Power Baddie',     min: 500,  max: 1000 },
  { name: 'Elite Baddie',     min: 1000, max: 2000 },
  { name: 'Legend Baddie',    min: 2000, max: 99999 }
]

let focusActive = false, focusPaused = false
let focusSec = 0, focusIv = null

// ── Toggle start / pause
function toggleFocus() {
  if (!focusActive) {
    // Start
    focusActive = true; focusPaused = false; focusSec = 0
    document.getElementById('focus-btn').textContent = 'Pause'
    document.getElementById('focus-end-btn').style.display = 'inline-flex'

    focusIv = setInterval(() => {
      if (!focusPaused) {
        focusSec++
        updateFocusDisplay()
      }
    }, 1000)

  } else {
    // Pause / resume
    focusPaused = !focusPaused
    document.getElementById('focus-btn').textContent = focusPaused ? 'Resume' : 'Pause'
  }
}

// ── End session — award points
function endFocus() {
  clearInterval(focusIv)
  focusActive = false; focusPaused = false

  const mins = Math.floor(focusSec / 60)

  if (mins > 0) {
    NB.addPoints(mins)
    NB.touchStreak()
    NB.saveFocusSession({
      id:       Date.now(),
      date:     new Date().toISOString(),
      duration: focusSec,
      pts:      mins
    })
    showPtsPop('+' + mins + ' pts')
    renderFocusHist()
    updateLevelUI()
    updateStats()
  }

  // Reset display
  document.getElementById('focus-btn').textContent = 'Start Focus'
  document.getElementById('focus-end-btn').style.display = 'none'
  document.getElementById('focus-time').textContent  = '00:00:00'
  document.getElementById('focus-pts-lbl').textContent = '+0 pts'
  document.getElementById('focus-arc').style.strokeDashoffset = 0
  focusSec = 0
}

// ── Display tick
function updateFocusDisplay() {
  const h = Math.floor(focusSec / 3600)
  const m = Math.floor((focusSec % 3600) / 60)
  const s = focusSec % 60
  document.getElementById('focus-time').textContent =
    String(h).padStart(2, '0') + ':' +
    String(m).padStart(2, '0') + ':' +
    String(s).padStart(2, '0')

  const totalMins = Math.floor(focusSec / 60)
  document.getElementById('focus-pts-lbl').textContent = '+' + totalMins + ' pts'

  // Arc completes every 60 minutes
  const cycleProgress = (focusSec % 3600) / 3600
  document.getElementById('focus-arc').style.strokeDashoffset = 666 * (1 - cycleProgress)
}

// ── Level UI
function updateLevelUI() {
  const pts = NB.getPoints()
  const lv  = LEVELS.find(l => pts >= l.min && pts < l.max) || LEVELS[LEVELS.length - 1]
  const pct = Math.min(100, ((pts - lv.min) / (lv.max - lv.min)) * 100)

  const nm = document.getElementById('lv-name')
  const pt = document.getElementById('lv-pts')
  const fl = document.getElementById('lv-fill')

  if (nm) nm.textContent = lv.name
  if (pt) pt.textContent = pts + ' pts'
  if (fl) fl.style.width = pct + '%'
}

// ── Focus history
function renderFocusHist() {
  const hist = NB.getFocusSessions()
  const el   = document.getElementById('focus-hist')
  if (!el) return

  if (!hist.length) {
    el.innerHTML = `<div class="empty-state"><div class="es-icon">⏱️</div><div class="es-text">No focus sessions yet.<br>Hit Start Focus above.</div></div>`
    return
  }

  el.innerHTML = hist.slice(0, 10).map(s => {
    const m    = Math.floor(s.duration / 60)
    const h    = Math.floor(m / 60)
    const dur  = h > 0 ? h + 'h ' + (m % 60) + 'm' : m + 'm'
    const date = new Date(s.date).toLocaleDateString([], { month: 'short', day: 'numeric' })
    const time = new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return `
      <div class="hist-item">
        <div class="hi-left">
          <div class="hi-task">Deep focus session</div>
          <div class="hi-meta">${date} · ${time}</div>
        </div>
        <div class="hi-right">
          <div class="hi-dur">${dur}</div>
          <div style="font-size:10px; color:var(--teal); font-family:var(--font-head); font-weight:700; text-align:right; margin-top:2px;">+${s.pts}pts</div>
        </div>
      </div>`
  }).join('')
}

// ── Points pop animation
function showPtsPop(text) {
  const el = document.createElement('div')
  el.className = 'pts-pop'
  el.textContent = text
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 1500)
}
