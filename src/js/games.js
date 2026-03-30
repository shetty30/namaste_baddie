// ════════════════════════════════════════
// GAMES MODULE
// ════════════════════════════════════════

function openGame(name) {
  document.getElementById('game-' + name).classList.add('on')
  if (name === 'memory')   initMemory()
  if (name === 'reaction') initRxn()
  if (name === 'breathe')  initBreathe()
}

function closeGame(name) {
  document.getElementById('game-' + name).classList.remove('on')
  if (name === 'reaction') stopRxn()
  if (name === 'breathe')  stopBreathe()
}

// ────────────────────────────────────────
// MEMORY MATCH
// ────────────────────────────────────────
const MEM_EMOJIS = ['🐯', '🦊', '🐉', '🌸', '⚡', '🎯', '🔥', '🌙']
let memFlipped = [], memMatched = 0, memMoves = 0, memSec = 0, memIv = null

function initMemory() {
  memFlipped = []; memMatched = 0; memMoves = 0; memSec = 0
  clearInterval(memIv)

  document.getElementById('mem-moves').textContent = '0'
  document.getElementById('mem-pairs').textContent = '0/8'
  document.getElementById('mem-time').textContent  = '0s'

  memIv = setInterval(() => {
    memSec++
    document.getElementById('mem-time').textContent = memSec + 's'
  }, 1000)

  const pairs = [...MEM_EMOJIS, ...MEM_EMOJIS].sort(() => Math.random() - 0.5)
  const grid  = document.getElementById('mem-grid')
  grid.innerHTML = pairs.map((emoji, i) => `
    <div class="mem-card" id="mc${i}" data-emoji="${emoji}" onclick="flipCard(${i})">
      <div class="mc-back">?</div>
      <div class="mc-front">${emoji}</div>
    </div>
  `).join('')
}

function flipCard(i) {
  const card = document.getElementById('mc' + i)
  if (!card || card.classList.contains('flipped') || card.classList.contains('matched') || memFlipped.length >= 2) return

  card.classList.add('flipped')
  memFlipped.push(i)

  if (memFlipped.length === 2) {
    memMoves++
    document.getElementById('mem-moves').textContent = memMoves

    const [a, b] = memFlipped
    const ea = document.getElementById('mc' + a).dataset.emoji
    const eb = document.getElementById('mc' + b).dataset.emoji

    if (ea === eb) {
      document.getElementById('mc' + a).classList.add('matched')
      document.getElementById('mc' + b).classList.add('matched')
      memMatched++
      document.getElementById('mem-pairs').textContent = memMatched + '/8'
      memFlipped = []
      if (memMatched === 8) {
        clearInterval(memIv)
        setTimeout(() => alert(`🎉 You won!\n${memMoves} moves · ${memSec} seconds`), 300)
      }
    } else {
      setTimeout(() => {
        document.getElementById('mc' + a).classList.remove('flipped')
        document.getElementById('mc' + b).classList.remove('flipped')
        memFlipped = []
      }, 900)
    }
  }
}

// ────────────────────────────────────────
// REACTION SPEED
// ────────────────────────────────────────
let rxnState = 'idle', rxnTimeout = null, rxnStart = 0, rxnTimes = [], rxnRound = 0

function initRxn() {
  rxnState = 'idle'; rxnTimes = []; rxnRound = 0
  setRxnUI('idle', 'Tap to Start', 'Get ready to react fast')
  document.getElementById('rxn-avg').textContent   = '—'
  document.getElementById('rxn-best').textContent  = '—'
  document.getElementById('rxn-count').textContent = '0/5'
}

function stopRxn() {
  clearTimeout(rxnTimeout)
  rxnState = 'idle'
}

function setRxnUI(state, lbl, sub) {
  const area = document.getElementById('rxn-area')
  area.className = 'rxn-area rxn-' + state
  document.getElementById('rxn-lbl').textContent = lbl
  document.getElementById('rxn-sub').textContent = sub
}

function handleRxn() {
  if (rxnState === 'idle' || rxnState === 'result') {
    rxnState = 'ready'
    setRxnUI('ready', 'Wait...', 'Tap ONLY when it turns green!')
    rxnTimeout = setTimeout(() => {
      rxnState = 'go'
      rxnStart = Date.now()
      setRxnUI('go', 'TAP NOW!', '')
    }, 1500 + Math.random() * 3000)

  } else if (rxnState === 'go') {
    const t = Date.now() - rxnStart
    rxnTimes.push(t); rxnRound++
    const avg  = Math.round(rxnTimes.reduce((a, b) => a + b, 0) / rxnTimes.length)
    const best = Math.min(...rxnTimes)
    document.getElementById('rxn-avg').textContent   = avg
    document.getElementById('rxn-best').textContent  = best
    document.getElementById('rxn-count').textContent = rxnRound + '/5'

    if (rxnRound >= 5) {
      rxnState = 'result'
      const grade = avg < 200 ? '⚡ Insane!' : avg < 280 ? '🔥 Great!' : avg < 380 ? '👍 Decent' : '🐢 Keep practicing'
      setRxnUI('result', avg + 'ms avg', grade + ' — tap to retry')
    } else {
      rxnState = 'idle'
      setRxnUI('idle', t + 'ms!', 'Tap to go again')
    }

  } else if (rxnState === 'ready') {
    clearTimeout(rxnTimeout)
    rxnState = 'idle'
    setRxnUI('idle', 'Too early! 😅', 'Tap to try again')
  }
}

// ────────────────────────────────────────
// BOX BREATHING
// ────────────────────────────────────────
const BR_PHASES = [
  { name: 'Inhale',  dur: 4, scale: 1.55 },
  { name: 'Hold',    dur: 4, scale: 1.55 },
  { name: 'Exhale',  dur: 4, scale: 1.0  },
  { name: 'Hold',    dur: 4, scale: 1.0  }
]

let brActive = false, brPhaseIdx = 0, brCount = 0, brIv = null

function initBreathe() {
  brActive = false
  document.getElementById('br-btn').textContent  = 'Start'
  document.getElementById('br-phase').textContent = '—'
  document.getElementById('br-count').textContent = '—'
  document.getElementById('br-circle').style.transform = 'scale(1)'
  document.getElementById('br-circle').textContent = 'Tap Start'
}

function toggleBreathe() {
  brActive ? stopBreathe() : startBreathe()
}

function startBreathe() {
  brActive = true; brPhaseIdx = 0
  document.getElementById('br-btn').textContent = 'Stop'
  runBrPhase()
}

function stopBreathe() {
  brActive = false
  clearInterval(brIv)
  initBreathe()
}

function runBrPhase() {
  if (!brActive) return
  const p = BR_PHASES[brPhaseIdx]
  brCount = p.dur
  document.getElementById('br-phase').textContent = p.name
  document.getElementById('br-count').textContent = brCount
  document.getElementById('br-circle').style.transform = `scale(${p.scale})`
  document.getElementById('br-circle').textContent = p.name
  clearInterval(brIv)
  brIv = setInterval(() => {
    brCount--
    document.getElementById('br-count').textContent = brCount
    if (brCount <= 0) {
      clearInterval(brIv)
      brPhaseIdx = (brPhaseIdx + 1) % BR_PHASES.length
      setTimeout(runBrPhase, 200)
    }
  }, 1000)
}
