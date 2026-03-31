// Generates app icons using pure Node.js (no external dependencies)
// Output: build/icon.png (512x512) for electron-builder
//         src/assets/icon-192.png and src/assets/icon-512.png for PWA

const zlib = require('zlib')
const fs   = require('fs')
const path = require('path')

// ── CRC32 (required by PNG format)
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
    t[n] = c
  }
  return t
})()
function crc32(buf) {
  let c = 0xFFFFFFFF
  for (const b of buf) c = (c >>> 8) ^ CRC_TABLE[(c ^ b) & 0xFF]
  return (c ^ 0xFFFFFFFF) >>> 0
}

// ── Build PNG from raw RGBA pixel function
function makePNG(size, pixelFn) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  function chunk(type, data) {
    const len  = Buffer.alloc(4); len.writeUInt32BE(data.length)
    const tb   = Buffer.from(type)
    const body = Buffer.concat([tb, data])
    const crc  = Buffer.alloc(4); crc.writeUInt32BE(crc32(body))
    return Buffer.concat([len, tb, data, crc])
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 6  // RGBA
  // bytes 10-12: compression=0, filter=0, interlace=0

  const raw = []
  for (let y = 0; y < size; y++) {
    raw.push(0) // filter: None
    for (let x = 0; x < size; x++) {
      raw.push(...pixelFn(x, y, size))
    }
  }

  const idat = zlib.deflateSync(Buffer.from(raw), { level: 9 })

  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
}

// ── Icon design: dark bg + pink radial glow + smaller hot-pink circle
function iconPixel(x, y, size) {
  const cx = size / 2, cy = size / 2
  const dx = x - cx, dy = y - cy
  const dist = Math.sqrt(dx * dx + dy * dy)
  const r = size * 0.38   // main circle radius
  const glow = size * 0.52 // outer glow radius

  // Background: #100D0B
  let pr = 16, pg = 13, pb = 11, pa = 255

  // Outer soft glow (orange-pink)
  if (dist < glow) {
    const t = Math.max(0, 1 - dist / glow)
    const gf = t * t * 0.35
    pr = Math.round(pr + (255 - pr) * gf * 0.6)
    pg = Math.round(pg + (31 - pg) * gf * 0.3)
    pb = Math.round(pb + (109 - pb) * gf * 0.2)
  }

  // Main filled circle with gradient (orange → pink)
  if (dist < r) {
    const t = dist / r               // 0 = center, 1 = edge
    const angle = Math.atan2(dy, dx) // -π to π
    const blend = (angle + Math.PI) / (2 * Math.PI) // 0-1 angular blend

    // #FF5722 → #FF1F6D
    const or = 255, og = 87, ob = 34
    const pk = 255, pg2 = 31, pb2 = 109

    pr = Math.round(or + (pk - or) * blend)
    pg = Math.round(og + (pg2 - og) * blend)
    pb = Math.round(ob + (pb2 - ob) * blend)

    // Subtle inner highlight
    if (dist < r * 0.45) {
      const h = 1 - dist / (r * 0.45)
      pr = Math.min(255, Math.round(pr + 40 * h))
      pg = Math.min(255, Math.round(pg + 20 * h))
      pb = Math.min(255, Math.round(pb + 20 * h))
    }

    // Anti-alias edge
    const aa = Math.max(0, Math.min(1, (r - dist) * 2))
    return [pr, pg, pb, Math.round(255 * aa)]
  }

  return [pr, pg, pb, pa]
}

// ── Write files
const dirs = ['build', 'src/assets'].map(d => path.join(__dirname, '..', d))
dirs.forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }) })

const sizes = [
  { size: 512, out: 'build/icon.png' },
  { size: 512, out: 'src/assets/icon-512.png' },
  { size: 192, out: 'src/assets/icon-192.png' },
]

sizes.forEach(({ size, out }) => {
  const buf = makePNG(size, iconPixel)
  const dest = path.join(__dirname, '..', out)
  fs.writeFileSync(dest, buf)
  console.log(`✓ ${out}  (${size}×${size}, ${(buf.length / 1024).toFixed(1)} KB)`)
})

console.log('\nIcons generated. Now run:  npm run dist  (desktop)  or  npm run deploy  (web/mobile)')
