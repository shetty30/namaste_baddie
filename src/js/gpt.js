// ── Baddie GPT — offline, rule-based with personality
// Hinglish tone: honest, warm, no-nonsense

const GPT = {
  kb: {
    greet: [
      'Arre yaar, kya scene hai? Main sun raha hoon. 👂',
      'Haan bolo — judge-free zone hai yahan. Kya feel ho raha hai?',
      'Baddie mode: ON. Tujhe kya ho raha hai aaj?',
      'Yaar, bolo freely. Main ready hoon.',
      'Koi drama nahi, koi judgment nahi. Bas bol.'
    ],
    lazy: [
      'Lazy? Okay. Ab ek cheez — SIRF ek — choti si. Abhi. That\'s it.',
      'Tujhe sab kuch nahi karna. Bas shuru karna hai. 2 minute bhi chalega.',
      'Lazy feeling = brain avoiding discomfort. Override it. Koi bhi kaam le, shuru kar.',
      'You\'re not lazy. Tum starting se dara rahe ho. So start badly. Badly done beats not done.',
      'Antidote to laziness: task ko itna chota bana do ki refuse karna embarrassing lage.',
      'Ek minute bhi kaam karo. Seriously. Sirf ek. Dekhna kaise change hoga feel.'
    ],
    over: [
      'Overwhelm = brain mein too many tabs open. Sab band karo. Ek rakho. That one.',
      'Poori thali ek saath nahi khate. Ek dish lo. Wahan shuru karo.',
      'List bana. Ek cheez circle karo. Baaki temporarily bhool jao.',
      'One thing. Seriously, SIRF ek. Abhi choose karo.',
      'Overwhelmed feel is actually you caring too much about too many things. Narrow karo.',
      'Brain mein sab kuch hai — paper pe dalo. Phir decide karo kya pehle.'
    ],
    procrastinate: [
      'Procrastination = time theft from your future self. Usse rob mat karo.',
      'Jo tum avoid kar rahe ho — wahi tumhara next move hai. That\'s it.',
      '2-minute rule: agar 2 minute ka kaam hai, abhi karo. Nahi toh schedule karo.',
      'Future tum stressed hogi kyunki present tum ne kuch nahi kiya. Choose wisely.',
      'Kya avoid kar rahe ho abhi? Wahi cheez — start karo. Tomorrow nahi. Abhi.',
      'Procrastination ka cure: imperfect action. Perfect action se behtar hai.'
    ],
    bore: [
      'Boredom = unused energy. Channel karo isko. Kuch bana, kuch seekh, kuch likh.',
      'Bored minds are creative minds waiting to be fed. Kuch worthy doh usse.',
      'Bored? Perfect. Creativity usually boredom ke baad aati hai. Let it happen.',
      '40 minute scroll karne ki jagah — 10 minute kuch karo. Difference dekhna.',
      'Boredom ka matlab: brain stimulation chahta hai. Kuch worth its time do usse.'
    ],
    stuck: [
      'Stuck? Smallest possible next step kya hai? Woh karo. Poora kaam nahi — next step.',
      'Being stuck is temporary. Starting is the only cure. Badly start karna bhi theek hai.',
      'Toro isko. Chota. Chota se bhi chota. Jab tak itna chota na ho jaye ki refuse nahi kar sako.',
      'Kya rok raha hai exactly? Usually jab describe karte ho — next step khud reveal ho jaata hai.',
      'Progress over perfection. Hamesha. No exceptions.'
    ],
    anxious: [
      'Pehle breath lo. 4 in, 4 hold, 4 out. Kuch aur karne se pehle yahi karo.',
      'Anxiety = brain overdrive mein. Sab kuch fix nahi karna — sirf next 5 minute handle karo.',
      'Feelings valid hain. Aur they will pass. Abhi ke liye: breathe, phir ek chota action.',
      'Ek cheez at a time, yaar. Anxiety multiply hoti hai jab sab kuch ek saath hold karte ho.',
      'Anxiety ko acknowledge karo. Phir ek tiny move karo. Inertia todna zaroori hai.'
    ],
    motivate: [
      'Motivation pehle nahi aata — action pehle aata hai. Action ke baad motivation aata hai.',
      'Ready feel karne ka wait mat karo. Nobody does. Bas jao.',
      'Discipline > motivation. Motivation ek mood hai. Discipline ek choice hai.',
      'Gap between where you are aur where you want to be — woh gap today ke actions se bharta hai.',
      'Koi rescue karne nahi aayega. Tum pehle se jaante ho yeh. Toh chalo.'
    ],
    sad: [
      'Yaar, main sun raha hoon. Kya chal raha hai? Poora bolo.',
      'That sounds heavy. Ek minute ke liye acknowledge karo. Phir — ek tiny move kya help karega?',
      'It\'s okay to not be okay. Feelings real hain. Kya chahiye abhi tujhe?',
      'Kuch din aise hote hain. Iska matlab nahi ki hamesha aise rahega. Abhi kya feel ho raha hai?',
      'Tujhe sab kuch theek karne ki zaroorat nahi. Sirf next hour handle karo.'
    ],
    default: [
      'Interesting. Thoda aur bata — situation exactly kya hai?',
      'Haan, main samjha. Aur kya feel ho raha hai is baare mein?',
      'Okay. Toh question hai — ek cheez kya hogi jo aaj ka din win bana de?',
      'Main judge nahi kar raha. Bas bolo — exactly kya rok raha hai tujhe?',
      'That makes sense. Yahan se smallest possible next step kya hoga?',
      'Seedha poochu — abhi, is moment mein, ek kaam jo tum kar sakte ho, kya hai?'
    ]
  },

  _detect(text) {
    const s = text.toLowerCase()
    if (s.match(/lazy|aalsi|tired|no energy|bhaari|thaka|bore ho/))     return 'lazy'
    if (s.match(/overwhelm|too much|so much|stress|busy|sab kuch|bahut/)) return 'over'
    if (s.match(/procrastinat|delay|later|kal kar|avoid|putting off|tal/)) return 'procrastinate'
    if (s.match(/bor(e|ing|ed)|nothing to do|kuch nahi|bakwas/))         return 'bore'
    if (s.match(/stuck|block|can.t start|frozen|nahi ho raha|shuru|start/)) return 'stuck'
    if (s.match(/anxi|worried|nervous|scared|tension|darr|ghabra/))      return 'anxious'
    if (s.match(/motivat|inspire|push|help me|kaise|how do/))            return 'motivate'
    if (s.match(/sad|down|depressed|unhappy|bura|dukh|rona|cry/))        return 'sad'
    return 'default'
  },

  getReply(text) {
    const pool = this.kb[this._detect(text)]
    return pool[Math.floor(Math.random() * pool.length)]
  },

  getGreeting() {
    const pool = this.kb.greet
    return pool[Math.floor(Math.random() * pool.length)]
  }
}

// ── Chat UI state
let chatInited = false

function initChat() {
  const wrap = document.getElementById('chat-messages')
  wrap.innerHTML = ''
  chatInited = true
  addChatMsg('bot', GPT.getGreeting())
}

function addChatMsg(role, text) {
  const wrap = document.getElementById('chat-messages')
  const el   = document.createElement('div')
  el.className = 'cmsg ' + role
  el.textContent = text
  wrap.appendChild(el)
  el.scrollIntoView({ behavior: 'smooth', block: 'end' })
}

function showTyping() {
  const wrap = document.getElementById('chat-messages')
  const ty   = document.createElement('div')
  ty.className = 'typing-indicator'
  ty.id = 'typing'
  ty.innerHTML = '<span></span><span></span><span></span>'
  wrap.appendChild(ty)
  ty.scrollIntoView({ behavior: 'smooth', block: 'end' })
}

function removeTyping() {
  const t = document.getElementById('typing')
  if (t) t.remove()
}

function sendChatMsg() {
  const inp  = document.getElementById('chat-input')
  const text = inp.value.trim()
  if (!text) return
  inp.value = ''
  addChatMsg('user', text)
  showTyping()
  setTimeout(() => {
    removeTyping()
    addChatMsg('bot', GPT.getReply(text))
  }, 500 + Math.random() * 800)
}

function clearChat() {
  chatInited = false
  initChat()
}
