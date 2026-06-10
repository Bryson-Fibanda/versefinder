export async function shareVerse(verse) {
  const text = `${verse.reference}\n\n"${verse.text}"\n\n— VerseFinder`
  if (navigator.share) {
    try {
      await navigator.share({ title: verse.reference, text })
      return true
    } catch {}
  }
  // fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {}
  return false
}

export function drawVerseCard(verse) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1080
  const ctx = canvas.getContext('2d')

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 1080, 1080)
  grad.addColorStop(0, '#FDF8F2')
  grad.addColorStop(1, '#EAF6F4')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1080, 1080)

  // Accent bar
  ctx.fillStyle = '#C8956C'
  ctx.fillRect(80, 80, 6, 920)

  // Reference
  ctx.fillStyle = '#2C2016'
  ctx.font = 'bold 52px serif'
  ctx.fillText(verse.reference, 120, 180)

  // Verse text — word wrap
  ctx.fillStyle = '#3D2B1A'
  ctx.font = 'italic 40px serif'
  const words = `"${verse.text}"`.split(' ')
  let line = '', y = 280, maxW = 840
  for (const word of words) {
    const test = line + word + ' '
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, 120, y)
      line = word + ' '
      y += 60
    } else { line = test }
  }
  ctx.fillText(line, 120, y)

  // Branding
  ctx.fillStyle = '#A89080'
  ctx.font = '32px sans-serif'
  ctx.fillText('VerseFinder', 120, 980)

  return canvas
}
