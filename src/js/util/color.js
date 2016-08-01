export function colorVec2Str(drgb) {
  return `rgb(${drgb.map(c => Math.round(c * 255)).join(',')})`
}

export function dhsl2drgb(dhsl) {
  const [ h, s, l ] = dhsl
  let r = 0
  let g = 0
  let b = 0

  if (s === 0) {
    // Achromatic
    r = g = b = l
  } else {
    let q, p
    q = l < .5 ? l*(1. + s) : l + s - l*s
    p = 2*l - q

    r = dhsl2drgbHelper(p, q, h + 1/3)
    g = dhsl2drgbHelper(p, q, h)
    b = dhsl2drgbHelper(p, q, h - 1/3)
  }

  return [ r, g, b ].map(v => clamp(v, 0, 1))
}

function dhsl2drgbHelper (p, q, t) {
  if (t < 0) t += 1
  if (t > 1) t -= 1

  if (t < 1/6) {
    return p + 6*t*(q - p)
  } else if (t < 1/2) {
    return q
  } else if (t < 2/3) {
    return p + 6*(q - p)*(2/3 - t)
  }
  return p
}

function clamp (value, min, max) {
  if (value > max) return max
  if (value < min) return min
  return value
}