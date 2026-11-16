<script setup>
import { computed, watch } from 'vue'
import DormiMascot from './DormiMascot.vue'
import { playSound, speak } from '../utils/sound'

const { show, type, message, subMessage, starsEarned, isFinalLevel } = defineProps({
  show: { type: Boolean, default: false },
  type: { type: String, default: 'win' },
  message: { type: String, default: '' },
  subMessage: { type: String, default: '' },
  starsEarned: { type: Number, default: 3 },
  isFinalLevel: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'next-level', 'go-map'])

const CONFETTI_COLORS = ['#7C3AED', '#10B981', '#F97316', '#FBBF24', '#38BDF8', '#FB7185']

const confettiPieces = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i * 3.7) % 100}%`,
  delay: `${(i % 7) * 0.16}s`,
  duration: `${2.4 + (i % 5) * 0.35}s`,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: i % 2 === 0 ? 'w-3.5 h-5' : 'w-4 h-4 rounded-full',
}))

const headline = computed(() =>
  type === 'win' ? '¡Lo lograste, amiguito!' : '¡Casi! Inténtalo otra vez, tú puedes',
)

const spokenLine = computed(() => {
  if (type === 'win') {
    return `¡Lo lograste, amiguito! ${message}`
  }
  return `¡Casi! Inténtalo otra vez, tú puedes. ${message}`
})

watch(
  () => [show, type, message],
  ([isOpen]) => {
    if (!isOpen) return
    playSound(type === 'win' ? 'win' : 'retry')
    speak(spokenLine.value)
  },
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      role="dialog"
      aria-modal="true"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm"
    >
      <!-- Visual Confetti for Win -->
      <div v-if="type === 'win'" class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <span
          v-for="piece in confettiPieces"
          :key="piece.id"
          :class="piece.size"
          class="confetti-piece absolute -top-6 rounded-sm"
          :style="{
            left: piece.left,
            backgroundColor: piece.color,
            animationDelay: piece.delay,
            '--fall-duration': piece.duration,
          }"
        />
      </div>

      <div
        class="relative w-full max-w-xl rounded-3xl bg-camp-cream border-4 border-white shadow-2xl p-6 sm:p-8 animate-pop text-center space-y-5"
      >
        <!-- Win Stars & Medal -->
        <div v-if="type === 'win'" class="space-y-3">
          <div class="flex items-center justify-center gap-3 text-5xl sm:text-6xl">
            <span
              v-for="n in starsEarned"
              :key="n"
              class="inline-block animate-bounce drop-shadow"
              :style="{ animationDelay: `${n * 0.12}s` }"
            >
              ⭐
            </span>
          </div>

          <div
            v-if="isFinalLevel"
            class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-300 text-amber-950 font-display font-bold text-base sm:text-lg shadow-md border-2 border-white"
          >
            <span aria-hidden="true">🏅</span>
            <span>Diploma: ¡Guardián del Juego y el Descanso!</span>
          </div>
        </div>

        <h2
          :class="type === 'win' ? 'text-violet-700' : 'text-orange-600'"
          class="text-3xl sm:text-4xl font-display font-bold leading-tight"
        >
          {{ headline }}
        </h2>

        <DormiMascot
          :mood="type === 'win' ? 'excited' : 'encouraging'"
          :message="message"
          title="Dormi te dice:"
          compact
        />

        <p v-if="subMessage" class="text-base sm:text-lg font-semibold text-slate-700 px-2">
          {{ subMessage }}
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <template v-if="type === 'win'">
            <button
              v-if="!isFinalLevel"
              type="button"
              @click="emit('next-level')"
              class="btn-tactile w-full sm:w-auto px-8 py-4 min-h-[64px] bg-emerald-500 hover:bg-emerald-400 text-white border-b-4 border-emerald-700 text-xl"
            >
              ¡Siguiente Nivel! 🚀
            </button>
            <button
              type="button"
              @click="emit('go-map')"
              :class="
                isFinalLevel
                  ? 'bg-violet-600 hover:bg-violet-500 text-white border-violet-800'
                  : 'bg-amber-300 hover:bg-amber-200 text-amber-950 border-amber-500'
              "
              class="btn-tactile w-full sm:w-auto px-8 py-4 min-h-[64px] border-b-4 text-xl"
            >
              {{ isFinalLevel ? '🌟 Ver Mapa Completo' : '🗺️ Ir al Mapa' }}
            </button>
          </template>

          <button
            v-else
            type="button"
            @click="emit('close')"
            class="btn-tactile w-full sm:w-auto px-10 py-4 min-h-[64px] bg-emerald-500 hover:bg-emerald-400 text-white border-b-4 border-emerald-700 text-xl"
          >
            ¡Intentarlo otra vez! 💪
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
