module.exports = function (h, s, v) {
  h = Math.round(h) % 360
  if (!(0 <= s && s <= 1)) return undefined
  if (!(0 <= v && v <= 1)) return undefined

  const c = v*s
  const x = c*(1 - Math.abs((h/60) % 2 - 1))
  const m = v - c
  
  let rgb
  h %= 360
  if (0 <= h && h < 60) rgb = [c, x, 0]
  else if (60 <= h && h < 120) rgb = [x, c, 0]
  else if (120 <= h && h < 180) rgb = [0, c, x]
  else if (180 <= h && h < 240) rgb = [0, x, c]
  else if (240 <= h && h < 300) rgb = [x, 0, c]
  else if (300 <= h && h < 360) rgb = [c, 0, x]

  const [r, g, b] = rgb
  return { 
    r: Math.round(255*(r + m)),
    g: Math.round(255*(g + m)),
    b: Math.round(255*(b + m))
  }
}