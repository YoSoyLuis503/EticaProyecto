import { shallowRef } from 'vue'

export const isMuted = shallowRef(false)
export const isSpeaking = shallowRef(false)

let audioCtx = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return null
  if (!audioCtx) audioCtx = new Ctx()
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

function playTone(freq, startOffset, duration, type = 'sine', gainPeak = 0.14) {
  const ctx = getAudioContext()
  if (!ctx) return
  const now = ctx.currentTime + startOffset
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, now)
  gain.gain.setValueAtTime(0.001, now)
  gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + duration + 0.02)
}

const SOUND_PATTERNS = {
  pop: () => playTone(520, 0, 0.09, 'sine', 0.15),
  correct: () => {
    playTone(523.25, 0, 0.12, 'triangle', 0.16)
    playTone(659.25, 0.09, 0.14, 'triangle', 0.16)
    playTone(783.99, 0.18, 0.2, 'triangle', 0.18)
  },
  retry: () => {
    playTone(392, 0, 0.14, 'sine', 0.12)
    playTone(349.23, 0.12, 0.18, 'sine', 0.12)
  },
  win: () => {
    ;[523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      playTone(freq, idx * 0.1, 0.24, 'triangle', 0.18)
    })
  },
  lullaby: () => {
    playTone(659.25, 0, 0.18, 'sine', 0.1)
    playTone(880, 0.1, 0.25, 'sine', 0.11)
  },
}

export function playSound(name) {
  if (isMuted.value) return
  const pattern = SOUND_PATTERNS[name]
  if (pattern) pattern()
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
  isSpeaking.value = false
}

function pickSpanishVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith('es-mx')) ||
    voices.find((v) => v.lang.toLowerCase().startsWith('es-es')) ||
    voices.find((v) => v.lang.toLowerCase().startsWith('es')) ||
    null
  )
}

export function speak(text, onEnd) {
  if (!text) return
  stopSpeaking()
  if (isMuted.value || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd()
    return
  }

  const utterance = new SpeechSynthesisUtterance(text)
  const voice = pickSpanishVoice()
  if (voice) utterance.voice = voice
  utterance.lang = voice?.lang || 'es-ES'
  utterance.pitch = 1.18
  utterance.rate = 0.94

  utterance.onstart = () => {
    isSpeaking.value = true
  }
  utterance.onend = () => {
    isSpeaking.value = false
    if (onEnd) onEnd()
  }
  utterance.onerror = () => {
    isSpeaking.value = false
    if (onEnd) onEnd()
  }

  window.speechSynthesis.speak(utterance)
}

export function toggleMute() {
  isMuted.value = !isMuted.value
  if (isMuted.value) stopSpeaking()
  else playSound('pop')
  return isMuted.value
}
