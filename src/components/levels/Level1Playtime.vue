<script setup>
import { computed, ref, shallowRef } from 'vue'
import DormiMascot from '../DormiMascot.vue'
import FeedbackOverlay from '../FeedbackOverlay.vue'
import { playSound } from '../../utils/sound'

const emit = defineEmits(['complete', 'next-level', 'go-map'])

const ROUNDS = [
  {
    prompt: '¡Vamos al pasto verde del parque! ¿Con qué juguete puede saltar y patear Dormi?',
    items: [
      { id: 'ball', label: 'Pelota Saltarina', emoji: '⚽', correct: true, bg: 'bg-emerald-100 border-emerald-300' },
      { id: 'broom', label: 'Escoba', emoji: '🧹', correct: false, bg: 'bg-sky-100 border-sky-300' },
      { id: 'briefcase', label: 'Maletín Pesado', emoji: '💼', correct: false, bg: 'bg-amber-100 border-amber-300' },
      { id: 'rock', label: 'Piedra Dura', emoji: '🪨', correct: false, bg: 'bg-purple-100 border-purple-300' },
    ],
  },
  {
    prompt: '¡Hace un viento rico en la colina! ¿Qué juguete vuela alto en el cielo?',
    items: [
      { id: 'hammer', label: 'Martillo', emoji: '🔨', correct: false, bg: 'bg-rose-100 border-rose-300' },
      { id: 'kite', label: 'Cometa de Colores', emoji: '🪁', correct: true, bg: 'bg-orange-100 border-orange-300' },
      { id: 'pan', label: 'Sartén', emoji: '🍳', correct: false, bg: 'bg-amber-100 border-amber-300' },
      { id: 'brick', label: 'Ladrillo', emoji: '🧱', correct: false, bg: 'bg-sky-100 border-sky-300' },
    ],
  },
  {
    prompt: '¡Hora de imaginar en la manta del parque! ¿Qué juguete sirve para construir torres?',
    items: [
      { id: 'cactus', label: 'Cactus con Espinas', emoji: '🌵', correct: false, bg: 'bg-emerald-100 border-emerald-300' },
      { id: 'alarm', label: 'Despertador', emoji: '⏰', correct: false, bg: 'bg-rose-100 border-rose-300' },
      { id: 'blocks', label: 'Bloques y Osito', emoji: '🧸', correct: true, bg: 'bg-violet-100 border-violet-300' },
      { id: 'soap', label: 'Barra de Jabón', emoji: '🧼', correct: false, bg: 'bg-sky-100 border-sky-300' },
    ],
  },
]

const roundIndex = shallowRef(0)
const shakingId = shallowRef('')
const feedback = ref({ show: false, type: 'win', message: '' })

const currentRound = computed(() => ROUNDS[roundIndex.value])

function chooseToy(item) {
  if (item.correct) {
    playSound('correct')
    if (roundIndex.value < ROUNDS.length - 1) {
      roundIndex.value += 1
      return
    }
    emit('complete', { levelId: 1, stars: 3 })
    feedback.value = {
      show: true,
      type: 'win',
      message: '¡Elegiste los mejores juguetes! Todos los niños tienen derecho a jugar y divertirse.',
    }
    return
  }

  shakingId.value = item.id
  setTimeout(() => {
    shakingId.value = ''
  }, 450)
  feedback.value = {
    show: true,
    type: 'retry',
    message: `Mmm, "${item.label}" no es un juguete para jugar en el parque. ¡Busca el juguete divertido!`,
  }
}
</script>

<template>
  <section class="max-w-4xl mx-auto px-4 py-6 space-y-6">
    <!-- Level Header -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl sm:text-4xl font-display font-bold text-orange-700">
          🪁 Nivel 1: La Hora de Divertirse
        </h1>
        <p class="text-sm sm:text-base font-bold text-slate-700">
          Toca el juguete favorito de Dormi
        </p>
      </div>

      <div class="px-5 py-2.5 rounded-full bg-orange-400 text-white font-display font-bold text-lg shadow-md border-2 border-white">
        Ronda {{ roundIndex + 1 }} de {{ ROUNDS.length }}
      </div>
    </div>

    <DormiMascot
      mood="happy"
      :message="currentRound.prompt"
      auto-speak
    />

    <!-- Big Touchable Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <button
        v-for="item in currentRound.items"
        :key="item.id"
        type="button"
        @click="chooseToy(item)"
        :class="[item.bg, shakingId === item.id ? 'animate-shake-gentle ring-4 ring-rose-400' : 'hover:-translate-y-1']"
        class="btn-tactile min-h-[160px] sm:min-h-[190px] p-6 border-4 border-b-8 flex flex-col items-center justify-center gap-3 text-center"
      >
        <span class="text-6xl sm:text-7xl drop-shadow-sm" aria-hidden="true">{{ item.emoji }}</span>
        <span class="text-xl sm:text-2xl font-display font-bold text-slate-900">
          {{ item.label }}
        </span>
      </button>
    </div>

    <FeedbackOverlay
      :show="feedback.show"
      :type="feedback.type"
      :message="feedback.message"
      @close="feedback.show = false"
      @next-level="emit('next-level')"
      @go-map="emit('go-map')"
    />
  </section>
</template>
