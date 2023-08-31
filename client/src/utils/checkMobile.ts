export default function checkMobile() {
  const WIDTH = 768
  const RATIO = 3
  const { body } = document

  if (!document.hidden) {
    const rect = body.getBoundingClientRect()
    return (rect.width - RATIO < WIDTH)
  }

  return true
}
