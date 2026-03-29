let currentMood = null
let currentTask = ''

// --- Screen router ---
function go(screenId) {
  document.querySelectorAll('.sc').forEach(s => s.classList.remove('on'))
  document.getElementById(screenId).classList.add('on')
}

// --- Mood selection ---
function pickMood(moodKey) {
  currentMood = moodKey
  const mood = MOODS[moodKey]

  document.getElementById('mood-tag').className = `tag ${mood.tagClass}`
  document.getElementById('mood-tag').textContent = mood.label
  document.getElementById('mood-tone').textContent = `"${mood.tone}"`
  document.getElementById('action-guide').textContent = mood.guide

  const timerOpts = document.getElementById('timer-opts')
  timerOpts.innerHTML = ''
  mood.timers.forEach((mins, i) => {
    const btn = document.createElement('button')
    btn.className = 'topt' + (i === 0 ? ' sel' : '')
    btn.textContent = mins + ' min'
    btn.dataset.mins = mins
    btn.onclick = () => {
      document.querySelectorAll('.topt').forEach(b => b.classList.remove('sel'))
      btn.classList.add('sel')
    }
    timerOpts.appendChild(btn)
  })

  document.getElementById('task-input').value = ''
  document.getElementById('task-input').classList.remove('err')
  go('s3')
}

// --- Start session ---
function startSession() {
  const input = document.getElementById('task-input')
  currentTask = input.value.trim()
  if (!currentTask) {
    input.classList.add('err')
    input.focus()
    return
  }
  input.classList.remove('err')

  const selBtn = document.querySelector('.topt.sel')
  const mins = selBtn ? +selBtn.dataset.mins : 5

  document.getElementById('session-task').textContent = currentTask
  const tmTag = document.getElementById('session-mood-tag')
  tmTag.className = `tag ${MOODS[currentMood].tagClass}`
  tmTag.textContent = MOODS[currentMood].label

  document.getElementById('pause-btn').textContent = 'Pause'
  document.getElementById('quit-confirm').classList.remove('vis')

  go('s4')

  Timer.start(mins, (completed) => finish(completed))
}

// --- Pause / Resume ---
function togglePause() {
  if (Timer.isPaused()) {
    Timer.resume()
    document.getElementById('pause-btn').textContent = 'Pause'
  } else {
    Timer.pause()
    document.getElementById('pause-btn').textContent = 'Resume'
  }
}

// --- Quit friction ---
function showQuit() {
  document.getElementById('quit-confirm').classList.add('vis')
}
function hideQuit() {
  document.getElementById('quit-confirm').classList.remove('vis')
}
function confirmQuit() {
  const elapsed = Timer.elapsed()
  Timer.stop()
  finish(false, elapsed)
}

// --- Finish ---
function finish(ok, elapsed) {
  Timer.stop()
  const session = {
    date: new Date().toISOString(),
    mood: currentMood,
    task: currentTask,
    duration: ok ? Timer._total : (elapsed || 0),
    ok
  }
  Storage.save(session)

  const done = Storage.completedCount()
  const mins = Math.max(1, Math.round(session.duration / 60))

  document.getElementById('finish-icon').innerHTML = ok
    ? '<div class="done-icon done-ok"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#639922" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>'
    : '<div class="done-icon done-quit"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D85A30" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>'

  document.getElementById('finish-title').textContent = ok ? 'Done. Told you so.' : 'Left early.'
  document.getElementById('finish-sub').textContent = ok
    ? 'You started. You finished. That is the whole thing.'
    : 'Still counts. You showed up.'
  document.getElementById('finish-task').textContent = currentTask
  document.getElementById('finish-meta').textContent = mins + ' min · ' + MOODS[currentMood].label

  const streak = document.getElementById('finish-streak')
  streak.innerHTML = done > 1 ? `<span class="chip">${done} sessions completed</span>` : ''

  go('s5')
}

// --- Splash history ---
window.addEventListener('DOMContentLoaded', () => {
  const sessions = Storage.all()
  const done = sessions.filter(s => s.ok).length
  const total = sessions.length
  const hint = document.getElementById('splash-hint')
  if (total > 0) {
    hint.textContent = `${done} session${done !== 1 ? 's' : ''} completed · ${total} total`
  }
})