// Sound utility using Web Audio API
// Generates pleasant sounds programmatically for children

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null

  if (!audioContext) {
    try {
      audioContext = new AudioContext()
    } catch {
      console.warn('Web Audio API not supported')
      return null
    }
  }

  // Resume context if suspended (browser autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }

  return audioContext
}

function isMuted(): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem('sound-muted') === 'true'
}

function playTone(
  frequency: number,
  startTime: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.15
) {
  const ctx = getAudioContext()
  if (!ctx || isMuted()) return

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, startTime)

  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.start(startTime)
  oscillator.stop(startTime + duration)
}

/**
 * A pleasant ascending chime (C5 → E5 → G5)
 * Used for correct answers or encouragement
 */
export function playCorrectSound() {
  const ctx = getAudioContext()
  if (!ctx || isMuted()) return

  const now = ctx.currentTime

  // C5 (523 Hz) → E5 (659 Hz) → G5 (784 Hz) - ascending major triad
  playTone(523.25, now, 0.18, 'sine', 0.13)
  playTone(659.25, now + 0.12, 0.18, 'sine', 0.13)
  playTone(783.99, now + 0.24, 0.25, 'sine', 0.15)
}

/**
 * A gentle low buzz - soft and not harsh for kids
 * Used for wrong answers
 */
export function playWrongSound() {
  const ctx = getAudioContext()
  if (!ctx || isMuted()) return

  const now = ctx.currentTime

  // Gentle low buzz using two close frequencies for a soft "wah" effect
  playTone(220, now, 0.25, 'triangle', 0.1)
  playTone(196, now + 0.1, 0.25, 'triangle', 0.08)
}

/**
 * A celebration melody - ascending notes with a joyful feel
 * Used when completing a quiz with a high score
 */
export function playCompleteSound() {
  const ctx = getAudioContext()
  if (!ctx || isMuted()) return

  const now = ctx.currentTime

  // C5 → D5 → E5 → G5 → C6 - ascending celebration
  playTone(523.25, now, 0.15, 'sine', 0.12)
  playTone(587.33, now + 0.1, 0.15, 'sine', 0.12)
  playTone(659.25, now + 0.2, 0.15, 'sine', 0.12)
  playTone(783.99, now + 0.3, 0.2, 'sine', 0.14)
  playTone(1046.50, now + 0.45, 0.4, 'sine', 0.16)
}

/**
 * A subtle click sound for navigation
 * Used when clicking buttons or navigating between questions
 */
export function playClickSound() {
  const ctx = getAudioContext()
  if (!ctx || isMuted()) return

  const now = ctx.currentTime

  // Quick subtle click - very short, soft tap
  playTone(800, now, 0.05, 'sine', 0.06)
  playTone(600, now + 0.02, 0.04, 'sine', 0.04)
}

/**
 * Check if sound is currently muted
 */
export function getSoundMuted(): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem('sound-muted') === 'true'
}

/**
 * Toggle sound mute state
 * Returns the new muted state
 */
export function toggleSoundMuted(): boolean {
  const currentMuted = getSoundMuted()
  const newMuted = !currentMuted
  localStorage.setItem('sound-muted', String(newMuted))
  return newMuted
}
