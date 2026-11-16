<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import DormiMascot from '../DormiMascot.vue'
import FeedbackOverlay from '../FeedbackOverlay.vue'
import { playSound } from '../../utils/sound'

const emit = defineEmits(['complete', 'next-level', 'go-map'])

const TARGET_DREAMS = 10

const HAPPY_DREAMS = [
  { label: 'Estrella', emoji: '🌟', color: 'from-amber-200/90 to-yellow-300/90 border-amber-200' },
  { label: 'Unicornio', emoji: '🦄', color: 'from-pink-200/90 to-fuchsia-200/90 border-pink-200' },
  { label: 'Arcoíris', emoji: '🌈', color: 'from-sky-200/90 to-emerald-200/90 border-sky-200' },
  { label: 'Cohete', emoji: '🚀', color: 'from-violet-200/90 to-indigo-200/90 border-violet-200' },
  { label: 'Abrazo', emoji: '🧸', color: 'from-orange-200/90 to-amber-200/90 border-orange-200' },
  { label: 'Mariposa', emoji: '🦋', color: 'from-cyan-200/90 to-sky-200/90 border-cyan-200' },
  { label: 'Nube Dulce', emoji: '☁️', color: 'from-white/95 to-indigo-100/90 border-white' },
]

const NOISE_BUBBLES = [
  { label: 'Alarma', emoji: '⏰', color: 'from-rose-200/95 to-red-300/90 border-rose-300' },
  { label: 'Ruido', emoji: '🥁', color: 'from-orange-200/95 to-rose-200/90 border-rose-300' },
]

const energy = shallowRef(0)
const bubbles = ref([])
const burstMessage = shallowRef('')
const feedback = ref({ show: false, type: 'win', message: '' })

let nextBubbleId = 1
let spawnTimer = null

const energyPercent = computed(() => Math.min(100, Math.round((energy.value / TARGET_DREAMS) * 100)))

function createBubble(initial = false) {
  const isNoise = !initial && Math.random() < 0.22
  const pool = isNoise ? NOISE_BUBBLES : HAPPY_DREAMS
  const template = pool[Math.floor(Math.random() * pool.length)]
  return {
    id: nextBubbleId++,
    ...template,
    isNoise,
    x: 8 + Math.random() * 74,
    y: 12 + Math.random() * 68,
    delay: `${(Math.random() * 1.5).toFixed(2)}s`,
  }
}

function seedBubbles() {
  bubbles.value = Array.from({ length: 6 }, () => createBubble(true))
}

function popBubble(bubble) {
  if (feedback.value.show && feedback.value.type === 'win') return

  if (bubble.isNoise) {
    bubbles.value = bubbles.value.filter((b) => b.id !== bubble.id)
    feedback.value = {
      show: true,
      type: 'retry',
      message: '¡Shhh! Ese ruido puede despertar a Dormi. Toca solo las burbujas de sueños felices.',
    }
    return
  }

  playSound('lullaby')
  energy.value = Math.min(TARGET_DREAMS, energy.value + 1)
  burstMessage.value = `+1 ✨ ${bubble.label}`
  bubbles.value = [
    ...bubbles.value.filter((b) => b.id !== bubble.id),
    createBubble(false),
  ]

  if (energy.value >= TARGET_DREAMS) {
    clearInterval(spawnTimer)
    emit('complete', { levelId: 5, stars: 3 })
    feedback.value = {
      show: true,
      type: 'win',
      message: '¡Qué descanso tan mágico! Dormi recargó toda su energía estelar gracias a ti.',
    }
  }
}

onMounted(() => {
  seedBubbles()
  spawnTimer = setInterval(() => {
    if (bubbles.value.length < 7 && energy.value < TARGET_DREAMS) {
      bubbles.value = [...bubbles.value, createBubble(false)]
    }
  }, 1900)
})

onBeforeUnmount(() => {
  clearInterval(spawnTimer)
})
</script>

<template>
  <section class="max-w-4xl mx-auto px-4 py-6 space-y-5 text-white">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl sm:text-4xl font-display font-bold text-amber-200">
          🌟 Nivel 5: El Gran Sueño Estelar
        </h1>
        <p class="text-sm sm:text-base font-bold text-indigo-100">
          Toca {{ TARGET_DREAMS }} burbujas de sueños felices mientras Dormi descansa
        </p>
      </div>

      <!-- Poder Estelar Meter -->
      <div class="w-full sm:w-72 rounded-3xl bg-indigo-950/90 border-4 border-indigo-400 p-3 shadow-xl">
        <div class="flex justify-between text-sm font-display font-bold text-amber-200 mb-1">
          <span>💤 Energía de Sueño</span>
          <span>{{ energy }} / {{ TARGET_DREAMS }} ⭐</span>
        </div>
        <div class="w-full h-4 bg-indigo-900 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-amber-300 via-yellow-300 to-emerald-300 rounded-full transition-all duration-300"
            :style="{ width: `${energyPercent}%` }"
          />
        </div>
      </div>
    </div>

    <DormiMascot
      mood="sleeping"
      dark
      title="Zzz... Dormi está soñando:"
      message="Toca las burbujas de sueños bonitos que flotan en el cielo para llenar mi energía. ¡Evita las burbujas ruidosas!"
      auto-speak
      compact
    />

    <!-- Starry Dream Sky Canvas -->
    <div
      class="relative w-full h-[360px] sm:h-[410px] rounded-3xl bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-900 border-4 border-indigo-400/70 shadow-2xl overflow-hidden select-none"
    >
      <!-- Ambient Stars -->
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <span class="absolute top-5 left-8 text-2xl opacity-75 animate-pulse">✨</span>
        <span class="absolute top-8 right-12 text-3xl opacity-80 animate-pulse">🌙</span>
        <span class="absolute bottom-6 left-1/4 text-xl opacity-60">⭐</span>
        <span class="absolute bottom-10 right-1/4 text-xl opacity-60">✨</span>
        <span class="absolute bottom-3 left-1/2 -translate-x-1/2 text-indigo-200/80 font-display text-sm sm:text-base">
          {{ burstMessage || '💤 Zzz... toca las burbujas felices' }}
        </span>
      </div>

      <!-- Floating Dream Bubbles -->
      <button
        v-for="bubble in bubbles"
        :key="bubble.id"
        type="button"
        @click="popBubble(bubble)"
        :aria-label="`Burbuja de ${bubble.label}`"
        :style="{
          left: `${bubble.x}%`,
          top: `${bubble.y}%`,
          animationDelay: bubble.delay,
        }"
        :class="bubble.color"
        class="animate-bubble-rise absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br border-4 shadow-xl flex flex-col items-center justify-center gap-0.5 transition-transform active:scale-90 hover:scale-110 cursor-pointer"
      >
        <span class="text-4xl sm:text-5xl drop-shadow" aria-hidden="true">{{ bubble.emoji }}</span>
        <span class="text-[11px] sm:text-xs font-display font-bold text-slate-900 leading-none">
          {{ bubble.label }}
        </span>
      </button>
    </div>

    <FeedbackOverlay
      :show="feedback.show"
      :type="feedback.type"
      :message="feedback.message"
      is-final-level
      @close="feedback.show = false"
      @go-map="emit('go-map')"
    />
  </section>
</template>
