// ════════════════════════════════════════
// NAMASTE BADDIE — Main App Controller
// ════════════════════════════════════════

// ── Mood timer state
let curMood = null, curTask = ''

// ════════════════════════════════════════
// LOADING SCREEN
// ════════════════════════════════════════
const LD_MSGS = [
  'Loading your baddie energy...',
  'Warming up the vibe...',
  'Getting focus mode ready...',
  'Bas ek second...',
  'Almost there, queen...',
  'Sab kuch set ho raha hai...'
]

function startLoading() {
  const fill = document.getElementById('ld-fill')
  const msg  = document.getElementById('ld-msg')
  let msgIdx = 0

  setTimeout(() => { fill.style.width = '65%' }, 100)

  const msgIv = setInterval(() => {
    msg.textContent = LD_MSGS[++msgIdx % LD_MSGS.length]
  }, 480)

  setTimeout(() => {
    fill.style.width = '100%'
    clearInterval(msgIv)
    msg.textContent = 'Ready. Chalo! ✨'
  }, 2000)

  setTimeout(() => {
    document.getElementById('loading').classList.add('out')
    setTimeout(() => {
      const ld = document.getElementById('loading')
      if (ld) ld.style.display = 'none'
    }, 750)
  }, 2600)
}

// ════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════
let currentPage = 'home'

function goPage(name) {
  // Pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'))
  const pg = document.getElementById('pg-' + name)
  void pg.offsetWidth   // force reflow so animation re-fires
  pg.classList.add('on')

  // Nav buttons
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('on'))
  document.getElementById('nb-' + name).classList.add('on')

  // Chat bar visibility
  document.getElementById('chat-bar').classList.toggle('on', name === 'gpt')

  // Page-specific init
  currentPage = name
  if (name === 'home')  { updateStats(); renderHomeHist() }
  if (name === 'focus') { renderFocusHist(); updateLevelUI(); updateStats() }
  if (name === 'notes') { renderNotes() }
  if (name === 'gpt' && !chatInited) { initChat() }
}

// ════════════════════════════════════════
// GREETING
// ════════════════════════════════════════
function setGreeting() {
  const h = new Date().getHours()
  let g
  if      (h < 5)  g = 'Still up?'
  else if (h < 12) g = 'Good morning ☀️'
  else if (h < 17) g = 'Good afternoon'
  else if (h < 21) g = 'Good evening 🌆'
  else             g = 'Late night grind 🌙'
  const el = document.getElementById('greet-time')
  if (el) el.textContent = g
}

// ════════════════════════════════════════
// STATS
// ════════════════════════════════════════
function updateStats() {
  const stats = NB.getStats()
  const ptEl  = document.getElementById('st-pts')
  const stEl  = document.getElementById('st-streak')
  const ssEl  = document.getElementById('st-sess')
  if (ptEl) ptEl.textContent = stats.pts
  if (stEl) stEl.textContent = stats.streak
  if (ssEl) ssEl.textContent = stats.sess
}

// ════════════════════════════════════════
// HOME HISTORY
// ════════════════════════════════════════
function renderHomeHist() {
  const sessions = NB.getSessions()
  const el       = document.getElementById('home-hist')
  if (!el) return

  if (!sessions.length) {
    el.innerHTML = `<div class="empty-state"><div class="es-icon">🌱</div><div class="es-text">No sessions yet.<br>Pick a mood to begin.</div></div>`
    return
  }

  el.innerHTML = sessions.slice(0, 5).map((s, i) => {
    const mins = Math.max(1, Math.round(s.duration / 60))
    const time = new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const mood = MOODS[s.mood]?.label || s.mood
    return `
      <div class="hist-item" style="animation-delay:${i * 0.05}s;">
        <div class="hi-left">
          <div class="hi-task">${s.task}</div>
          <div class="hi-meta">${mood} · ${time}</div>
        </div>
        <div class="hi-right">
          <div class="hi-dur">${mins}m ${s.ok ? '✓' : '—'}</div>
        </div>
      </div>`
  }).join('')
}

// ════════════════════════════════════════
// MOOD FLOW
// ════════════════════════════════════════
function openMood(moodKey) {
  curMood = moodKey
  const md = MOODS[moodKey]

  // Mood stripe
  const stripe = document.getElementById('ms-stripe')
  stripe.className = 'mood-stripe ms-' + moodKey

  const tagEl = document.getElementById('ms-tag')
  tagEl.className = 'tag ' + md.tag
  tagEl.textContent = md.label

  document.getElementById('ms-tone').textContent = '"' + md.tone + '"'

  // Timer pills
  const pillsEl = document.getElementById('ms-pills')
  pillsEl.innerHTML = ''
  md.timers.forEach((mins, i) => {
    const btn = document.createElement('button')
    btn.className = 'tpills'  // container class exists in HTML
    btn.className = i === 0 ? 'tpill on' : 'tpill'
    btn.textContent = mins + ' min'
    btn.dataset.mins = mins
    btn.onclick = () => {
      document.querySelectorAll('.tpill').forEach(b => b.classList.remove('on'))
      btn.classList.add('on')
    }
    pillsEl.appendChild(btn)
  })

  // Reset fields
  document.getElementById('ms-task').value = ''
  document.getElementById('ms-task').classList.remove('err')

  // Show step 1
  showMoodStep(1)
  document.getElementById('mood-overlay').classList.add('on')
  setTimeout(() => document.getElementById('ms-task').focus(), 420)
}

function closeMoodOv() {
  document.getElementById('mood-overlay').classList.remove('on')
  Timer.stop()
  updateStats()
  renderHomeHist()
}

function showMoodStep(n) {
  document.getElementById('ms-step1').style.display = n === 1 ? 'block' : 'none'
  document.getElementById('ms-step2').style.display = n === 2 ? 'block' : 'none'
  document.getElementById('ms-step3').style.display = n === 3 ? 'block' : 'none'
}

// ── Start timer
function startMoodTimer() {
  const inp = document.getElementById('ms-task')
  curTask = inp.value.trim()
  if (!curTask) { inp.classList.add('err'); inp.focus(); return }
  inp.classList.remove('err')

  const selPill = document.querySelector('.tpill.on')
  const mins    = selPill ? +selPill.dataset.mins : 5

  // Populate step 2
  document.getElementById('t2-task').textContent = curTask
  const t2tag = document.getElementById('t2-tag-wrap')
  t2tag.innerHTML = `<span class="tag ${MOODS[curMood].tag}">${MOODS[curMood].label}</span>`

  // Set arc color to mood color
  document.getElementById('t2-arc').style.stroke = MOODS[curMood].arc

  // Reset timer UI
  document.getElementById('t2-pause').textContent = 'Pause'
  document.getElementById('t2-ring').classList.remove('paused')
  document.getElementById('quit-box').classList.remove('on')

  showMoodStep(2)
  Timer.start(mins, (completed) => finishTimer(completed))
}

// ── Pause / resume
function toggleTimerPause() {
  const ring = document.getElementById('t2-ring')
  if (Timer.isPaused()) {
    Timer.resume()
    document.getElementById('t2-pause').textContent = 'Pause'
    ring.classList.remove('paused')
  } else {
    Timer.pause()
    document.getElementById('t2-pause').textContent = 'Resume'
    ring.classList.add('paused')
  }
}

function showQuitBox() { document.getElementById('quit-box').classList.add('on') }
function hideQuitBox() { document.getElementById('quit-box').classList.remove('on') }

// ── Finish session
function finishTimer(ok) {
  Timer.stop()
  const elapsed = ok ? Timer._total : Timer.elapsed()
  const mins    = Math.max(1, Math.round(elapsed / 60))

  const session = {
    id:       Date.now(),
    date:     new Date().toISOString(),
    mood:     curMood,
    task:     curTask,
    duration: elapsed,
    ok
  }
  NB.saveSession(session)

  if (ok) {
    NB.addPoints(mins)
    NB.touchStreak()
    showPtsPop('+' + mins + ' pts')
  }

  updateLevelUI()

  // Completion screen
  const icon = document.getElementById('comp-icon')
  icon.className = 'comp-icon ' + (ok ? 'ci-ok' : 'ci-quit')
  icon.innerHTML = ok
    ? `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--pink)" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`

  document.getElementById('comp-title').textContent = ok ? 'Done. Told you so.' : 'Left early.'
  document.getElementById('comp-sub').textContent   = ok
    ? 'You started. You finished. That is the whole thing.'
    : 'Still counts. You showed up.'
  document.getElementById('comp-task').textContent  = curTask
  document.getElementById('comp-meta').textContent  = mins + ' min  ·  ' + MOODS[curMood].label
  document.getElementById('comp-pts').innerHTML     = ok
    ? `<span class="chip">+${mins} pts earned</span>` : ''

  showMoodStep(3)
  updateStats()
}

// ── Reset mood flow for "One more"
function resetMoodFlow() {
  showMoodStep(1)
  document.getElementById('ms-task').value = ''
}

// ════════════════════════════════════════
// KEYBOARD SHORTCUT — Enter to send chat
// ════════════════════════════════════════
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    const focused = document.activeElement
    if (focused === document.getElementById('chat-input')) {
      e.preventDefault()
      sendChatMsg()
    }
    if (focused === document.getElementById('ms-task')) {
      e.preventDefault()
      startMoodTimer()
    }
  }
})

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  startLoading()
  setGreeting()
  updateStats()
  renderHomeHist()
  setInterval(setGreeting, 60000)
})
