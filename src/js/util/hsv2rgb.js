function hsv2rgb(h, s, v) {
  h = Math.round(h) % 360
  if (!(0 <= s && s <= 1)) return undefined
  if (!(0 <= v && v <= 1)) return undefined

  const c = v*s
  const x = c*(1 - Math.abs((h/60) % 2 - 1))
  const m = v - c
  const [r, g, b] = rgbPrime(h, c, x)

  return { 
    r: Math.round(255*(r + m)),
    g: Math.round(255*(g + m)),
    b: Math.round(255*(b + m))
  }
}

function rgbPrime(h, c, x) {
  switch (Math.floor(h/60)) {
  case 0: return [c, x, 0]
  case 1: return [x, c, 0]
  case 2: return [0, c, x]
  case 3: return [0, x, c]
  case 4: return [x, 0, c]
  case 5: return [c, 0, x]
  default: return
  }
}

module.exports = hsv2rgb