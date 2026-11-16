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

function playTone(freq, offset, duration, type = 'sine', peak = 0.13) {
  const ctx = getAudioContext()
  if (!ctx) return
  const t = ctx.currentTime + offset
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  gain.gain.setValueAtTime(0.001, t)
  gain.gain.exponentialRampToValueAtTime(peak, t + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

const SOUND_PATTERNS = {
  pop: () => playTone(560, 0, 0.08, 'sine', 0.12),
  'ac-talk': () => {
    ;[440, 523, 493, 587].forEach((f, idx) => playTone(f, idx * 0.045, 0.055, 'triangle', 0.08))
  },
  shield: () => {
    playTone(587.33, 0, 0.12, 'triangle', 0.14)
    playTone(880, 0.07, 0.2, 'sine', 0.15)
  },
  catch: () => {
    playTone(659.25, 0, 0.09, 'sine', 0.14)
    playTone(987.77, 0.06, 0.14, 'triangle', 0.14)
  },
  'noise-pop': () => {
    playTone(392, 0, 0.07, 'sine', 0.11)
    playTone(523.25, 0.04, 0.1, 'sine', 0.1)
  },
  'music-box': (step = 0) => {
    const scale = [523.25, 659.25, 783.99, 1046.5]
    const note = scale[step % scale.length]
    playTone(note, 0, 0.35, 'sine', 0.14)
    playTone(note * 1.5, 0.08, 0.28, 'triangle', 0.06)
  },
  correct: () => {
    playTone(523.25, 0, 0.12, 'triangle', 0.15)
    playTone(659.25, 0.08, 0.14, 'triangle', 0.15)
    playTone(783.99, 0.16, 0.22, 'triangle', 0.16)
  },
  retry: () => {
    playTone(370, 0, 0.12, 'sine', 0.11)
    playTone(329.63, 0.11, 0.18, 'sine', 0.11)
  },
  win: () => {
    ;[523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, idx) => {
      playTone(freq, idx * 0.09, 0.28, 'triangle', 0.16)
    })
  },
}

export function playSound(name, arg) {
  if (isMuted.value) return
  const fn = SOUND_PATTERNS[name]
  if (fn) fn(arg)
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

  playSound('ac-talk')
  const utterance = new SpeechSynthesisUtterance(text)
  const voice = pickSpanishVoice()
  if (voice) utterance.voice = voice
  utterance.lang = voice?.lang || 'es-ES'
  // Warm, calm wise-owl tone for Don Plumas
  utterance.pitch = 0.98
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
