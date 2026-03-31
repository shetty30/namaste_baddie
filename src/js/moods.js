// ── Mood configuration
const MOODS = {
  lazy: {
    label:   'Lazy',
    tag:     't-gold',
    stripe:  '#FFB800',
    arc:     '#FFB800',
    guide:   'Make it tiny. The smallest version still counts.',
    timers:  [2, 5, 10],
    tone:    'Do the smallest version. Right now.'
  },
  over: {
    label:   'Overwhelmed',
    tag:     't-pink',
    stripe:  '#FF1F6D',
    arc:     '#FF1F6D',
    guide:   'Pick one thing. Everything else can wait.',
    timers:  [5, 10, 25],
    tone:    'One thing. Bas. Nothing else.'
  },
  cant: {
    label:   "Can't Start",
    tag:     't-teal',
    stripe:  '#00CFA8',
    arc:     '#00CFA8',
    guide:   'Start before you feel ready. That is the whole move.',
    timers:  [5, 10],
    tone:    'Starting first. Feelings later.'
  },
  bore: {
    label:   'Bored',
    tag:     't-purple',
    stripe:  '#9B5CFF',
    arc:     '#9B5CFF',
    guide:   'Good. Make something useful out of this energy.',
    timers:  [5, 10, 20],
    tone:    'Fine. Make something useful.'
  }
}
