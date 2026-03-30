// ════════════════════════════════════════
// NOTES MODULE
// ════════════════════════════════════════

let editingNoteId = null
let currentNoteColor = '#FF5722'

// ── Render notes list
function renderNotes() {
  const notes = NB.getNotes()
  const el    = document.getElementById('notes-list')
  if (!el) return

  if (!notes.length) {
    el.innerHTML = `<div class="empty-state"><div class="es-icon">📝</div><div class="es-text">No notes yet.<br>Tap + New to start writing.</div></div>`
    return
  }

  el.innerHTML = notes.map((n, i) => {
    const date    = new Date(n.date).toLocaleDateString([], { month: 'short', day: 'numeric' })
    const time    = new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const preview = (n.body || '').slice(0, 72) || 'No content'
    return `
      <div class="note-card" style="border-left-color:${n.color}; animation-delay:${i * 0.04}s;"
           onclick="openNoteEditor(${n.id})">
        <div class="nc-title">${n.title || 'Untitled'}</div>
        <div class="nc-preview">${preview}</div>
        <div class="nc-date">${date} · ${time}</div>
      </div>`
  }).join('')
}

// ── Open editor
function openNoteEditor(noteId = null) {
  editingNoteId    = noteId
  currentNoteColor = '#FF5722'

  const titleEl = document.getElementById('note-title')
  const bodyEl  = document.getElementById('note-body')
  const delBtn  = document.getElementById('note-del-btn')

  if (noteId) {
    const note = NB.getNotes().find(n => n.id === noteId)
    if (note) {
      titleEl.value    = note.title || ''
      bodyEl.value     = note.body  || ''
      currentNoteColor = note.color || '#FF5722'
    }
    delBtn.style.display = 'inline-flex'
  } else {
    titleEl.value        = ''
    bodyEl.value         = ''
    delBtn.style.display = 'none'
  }

  // Sync color dots
  document.querySelectorAll('.nc-dot').forEach(d => {
    d.classList.toggle('active', d.dataset.c === currentNoteColor)
  })

  document.getElementById('note-editor').classList.add('on')
  setTimeout(() => titleEl.focus(), 280)
}

// ── Close editor
function closeNoteEditor() {
  document.getElementById('note-editor').classList.remove('on')
  renderNotes()
}

// ── Pick color
function pickNoteColor(el) {
  document.querySelectorAll('.nc-dot').forEach(d => d.classList.remove('active'))
  el.classList.add('active')
  currentNoteColor = el.dataset.c
}

// ── Save note
function saveNote() {
  const title = document.getElementById('note-title').value.trim()
  const body  = document.getElementById('note-body').value.trim()

  if (!title && !body) { closeNoteEditor(); return }

  const note = {
    id:      editingNoteId || Date.now(),
    title,
    body,
    color:   currentNoteColor,
    date:    editingNoteId
               ? (NB.getNotes().find(n => n.id === editingNoteId)?.date || Date.now())
               : Date.now(),
    updated: Date.now()
  }

  NB.saveNote(note)
  closeNoteEditor()
}

// ── Delete note
function deleteNote() {
  if (!editingNoteId) return
  if (!confirm('Delete this note?')) return
  NB.deleteNote(editingNoteId)
  closeNoteEditor()
}
