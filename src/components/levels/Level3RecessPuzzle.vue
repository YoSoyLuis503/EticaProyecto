<script setup>
import { computed, ref, shallowRef } from 'vue'
import DonPlumasGuide from '../DonPlumasGuide.vue'
import LumiSpirit from '../LumiSpirit.vue'
import RewardCelebrationModal from '../RewardCelebrationModal.vue'
import { playSound } from '../../utils/sound'

const emit = defineEmits(['complete', 'next-level', 'go-map', 'open-album'])

const PARK_TILES = [
  { id: 1, title: 'Sol Alegre', emoji: '☀️', bg: 'from-amber-200 to-yellow-100' },
  { id: 2, title: 'Árbol del Valle', emoji: '🌳', bg: 'from-emerald-200 to-lime-100' },
  { id: 3, title: 'Arcoíris', emoji: '🌈', bg: 'from-sky-200 to-violet-100' },
  { id: 4, title: 'Resbaladilla', emoji: '🛝', bg: 'from-orange-200 to-amber-100' },
  { id: 5, title: 'Cuerda Feliz', emoji: '🪢', bg: 'from-pink-200 to-rose-100' },
  { id: 6, title: 'Flores', emoji: '🌸', bg: 'from-teal-200 to-emerald-100' },
]

// Intentionally scrambled 6-tile park puzzle
const tiles = ref([
  PARK_TILES[3],
  PARK_TILES[0],
  PARK_TILES[5],
  PARK_TILES[2],
  PARK_TILES[4],
  PARK_TILES[1],
])

const selectedIndex = shallowRef(null)
const phase = shallowRef('puzzle') // 'puzzle' | 'rope'
const jumps = shallowRef(0)
const isJumping = shallowRef(false)
const feedback = ref({ show: false, type: 'win', message: '' })

const TARGET_JUMPS = 6

const correctCount = computed(() =>
  tiles.value.filter((tile, idx) => tile.id === idx + 1).length,
)

const joyPct = computed(() => Math.min(100, Math.round((jumps.value / TARGET_JUMPS) * 100)))

const guideText = computed(() => {
  if (phase.value === 'puzzle') {
    return '¡Armemos el parque de juegos! Toca dos piezas para intercambiarlas hasta que queden en orden del 1 al 6.'
  }
  return '¡El parque está listo! Ahora toca a Lumi y sus amigos para que salten la cuerda y llenen la barra de alegría.'
})

function clickTile(idx) {
  playSound('pop')
  if (selectedIndex.value === null) {
    selectedIndex.value = idx
    return
  }
  if (selectedIndex.value === idx) {
    selectedIndex.value = null
    return
  }

  const copy = [...tiles.value]
  const temp = copy[selectedIndex.value]
  copy[selectedIndex.value] = copy[idx]
  copy[idx] = temp
  tiles.value = copy
  selectedIndex.value = null

  if (copy.every((tile, i) => tile.id === i + 1)) {
    playSound('correct')
    phase.value = 'rope'
  }
}

function jumpRope() {
  if (isJumping.value || jumps.value >= TARGET_JUMPS) return
  isJumping.value = true
  playSound('catch')
  jumps.value += 1

  setTimeout(() => {
    isJumping.value = false
    if (jumps.value >= TARGET_JUMPS) {
      emit('complete', { levelId: 3, poseId: 3, stickerId: 3 })
      feedback.value = {
        show: true,
        type: 'win',
        message: '¡Qué alegría jugar en equipo! Todos los niños tienen derecho al recreo y a reír con amigos.',
      }
    }
  }, 560)
}
</script>

<template>
  <section class="max-w-5xl mx-auto px-4 py-6 space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl sm:text-4xl font-display font-bold text-sky-900">
          🛝 Nivel 3: ¡Hora de Recreo!
        </h1>
        <p class="text-sm sm:text-base font-bold text-slate-600">
          Derecho a Jugar · {{ phase === 'puzzle' ? 'Paso 1: Arma el rompecabezas' : 'Paso 2: ¡Salta la cuerda!' }}
        </p>
      </div>

      <div class="px-5 py-2.5 rounded-full bg-sky-600 text-white font-display font-bold text-base shadow tabular-nums">
        {{ phase === 'puzzle' ? `Piezas bien: ${correctCount} / 6` : `Alegría: ${joyPct}%` }}
      </div>
    </div>

    <DonPlumasGuide :message="guideText" auto-speak compact />

    <!-- Phase 1: 6-Piece Sliding/Swap Park Puzzle -->
    <div v-if="phase === 'puzzle'" class="ac-parchment p-5 sm:p-6 space-y-4">
      <div class="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
        <button
          v-for="(tile, idx) in tiles"
          :key="tile.id"
          type="button"
          @click="clickTile(idx)"
          :class="[
            `bg-gradient-to-br ${tile.bg}`,
            selectedIndex === idx ? 'ring-4 ring-indigo-600 scale-105' : 'hover:-translate-y-0.5',
            tile.id === idx + 1 ? 'border-emerald-500' : 'border-white',
          ]"
          class="relative rounded-3xl border-4 p-4 min-h-[120px] sm:min-h-[145px] shadow-lg flex flex-col items-center justify-center gap-1.5 transition-all"
        >
          <span
            :class="tile.id === idx + 1 ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700'"
            class="absolute top-2 left-2 w-7 h-7 rounded-full font-display font-bold text-sm flex items-center justify-center shadow"
          >
            {{ tile.id }}
          </span>
          <span v-if="tile.id === idx + 1" class="absolute top-2 right-2 text-emerald-700 font-bold">✓</span>
          <span class="text-4xl sm:text-5xl" aria-hidden="true">{{ tile.emoji }}</span>
          <span class="font-display font-bold text-xs sm:text-sm text-slate-900">
            {{ tile.title }}
          </span>
        </button>
      </div>
    </div>

    <!-- Phase 2: Interactive Jump Rope Park -->
    <div
      v-else
      class="ac-parchment p-6 bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200 space-y-5 text-center"
    >
      <div class="max-w-md mx-auto bg-white/85 rounded-full p-2 border-2 border-white shadow">
        <div class="flex justify-between text-xs font-display font-bold text-sky-900 px-3 mb-1 tabular-nums">
          <span>😄 Barra de Alegría</span>
          <span>{{ jumps }} / {{ TARGET_JUMPS }} saltos</span>
        </div>
        <div class="w-full h-4 bg-sky-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400 rounded-full transition-all duration-300"
            :style="{ width: `${joyPct}%` }"
          />
        </div>
      </div>

      <!-- Lumi & Friends Jumping Rope -->
      <button
        type="button"
        @click="jumpRope"
        class="relative w-full max-w-xl mx-auto py-8 px-4 rounded-[32px] bg-white/45 border-4 border-white/80 shadow-inner flex items-end justify-center gap-4 sm:gap-8 cursor-pointer"
      >
        <div :class="{ 'animate-jump-rope': isJumping }" class="flex items-end gap-4 sm:gap-8">
          <span class="text-5xl sm:text-6xl" aria-hidden="true">🐰</span>
          <LumiSpirit state="joyful" size="sm" />
          <span class="text-5xl sm:text-6xl" aria-hidden="true">🦊</span>
        </div>
        <span
          v-if="isJumping"
          class="absolute top-3 right-6 px-3 py-1 rounded-full bg-amber-300 text-amber-950 font-display font-bold text-sm animate-pop"
        >
          ¡Jiji! ¡Wiii! ✨
        </span>
      </button>

      <button
        type="button"
        @click="jumpRope"
        class="ac-btn px-10 py-4 min-h-[64px] bg-gradient-to-b from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-white border-b-4 border-blue-800 text-xl sm:text-2xl"
      >
        🪢 ¡Saltar la Cuerda!
      </button>
    </div>

    <RewardCelebrationModal
      :show="feedback.show"
      :type="feedback.type"
      :message="feedback.message"
      :unlocked-pose-id="3"
      :unlocked-sticker-id="3"
      @close="feedback.show = false"
      @next-level="emit('next-level')"
      @go-map="emit('go-map')"
      @open-album="emit('open-album')"
    />
  </section>
</template>
