<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import DonPlumasGuide from '../DonPlumasGuide.vue'
import LumiSpirit from '../LumiSpirit.vue'
import RewardCelebrationModal from '../RewardCelebrationModal.vue'
import { playSound } from '../../utils/sound'

const emit = defineEmits(['complete', 'next-level', 'go-map', 'open-album'])

const TARGET_FOODS = 7

const HEALTHY_ITEMS = [
  { label: 'Manzana', emoji: '🍎', healthy: true },
  { label: 'Agua Pura', emoji: '💧', healthy: true },
  { label: 'Brócoli', emoji: '🥦', healthy: true },
  { label: 'Plátano', emoji: '🍌', healthy: true },
  { label: 'Zanahoria', emoji: '🥕', healthy: true },
]

const JUNK_ITEMS = [
  { label: 'Bota Vieja', emoji: '🥾', healthy: false },
  { label: 'Pila Usada', emoji: '🔋', healthy: false },
  { label: 'Piedra', emoji: '🪨', healthy: false },
]

const basketX = shallowRef(50)
const caughtCount = shallowRef(0)
const fallingItems = ref([])
const statusHint = shallowRef('¡Mueve la canasta para atrapar alimentos sanos!')
const stageRef = ref(null)
const feedback = ref({ show: false, type: 'win', message: '' })

let nextId = 1
let tickTimer = null
let spawnCounter = 0

const energyPct = computed(() => Math.min(100, Math.round((caughtCount.value / TARGET_FOODS) * 100)))
const lumiState = computed(() => (caughtCount.value >= 4 ? 'healthy' : 'sleepy'))

function spawnItem() {
  const isHealthy = Math.random() < 0.72
  const pool = isHealthy ? HEALTHY_ITEMS : JUNK_ITEMS
  const template = pool[Math.floor(Math.random() * pool.length)]
  fallingItems.value.push({
    id: nextId++,
    ...template,
    x: 12 + Math.random() * 76,
    y: 4,
    speed: 1.5 + Math.random() * 0.75,
  })
}

function stepGame() {
  if (feedback.value.show) return

  spawnCounter += 1
  if (spawnCounter % 18 === 0 || fallingItems.value.length < 2) {
    spawnItem()
  }

  const next = []
  for (const item of fallingItems.value) {
    const movedY = item.y + item.speed
    const hitBasket = movedY >= 74 && movedY <= 90 && Math.abs(item.x - basketX.value) <= 13

    if (hitBasket) {
      if (item.healthy) {
        playSound('catch')
        caughtCount.value += 1
        statusHint.value = `¡Qué rico! +1 ${item.label} para Lumi`
        if (caughtCount.value >= TARGET_FOODS) {
          clearInterval(tickTimer)
          emit('complete', { levelId: 2, poseId: 2, stickerId: 2 })
          feedback.value = {
            show: true,
            type: 'win',
            message: '¡Lumi recuperó toda su energía con frutas, verduras y agua pura!',
          }
        }
      } else {
        playSound('retry')
        statusHint.value = `¡Ups! "${item.label}" no se come. Esquiva esos objetos.`
      }
      continue
    }

    if (movedY < 96) {
      next.push({ ...item, y: movedY })
    }
  }
  fallingItems.value = next
}

function moveBasketBy(delta) {
  basketX.value = Math.max(10, Math.min(90, basketX.value + delta))
}

function handlePointerMove(event) {
  if (!stageRef.value) return
  const rect = stageRef.value.getBoundingClientRect()
  const pct = ((event.clientX - rect.left) / rect.width) * 100
  basketX.value = Math.max(10, Math.min(90, pct))
}

function handleKeydown(event) {
  if (event.key === 'ArrowLeft') moveBasketBy(-12)
  if (event.key === 'ArrowRight') moveBasketBy(12)
}

onMounted(() => {
  spawnItem()
  tickTimer = setInterval(stepGame, 55)
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  clearInterval(tickTimer)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <section class="max-w-5xl mx-auto px-4 py-6 space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl sm:text-4xl font-display font-bold text-amber-800">
          🍎 Nivel 2: La Cocina de la Energía
        </h1>
        <p class="text-sm sm:text-base font-bold text-slate-600">
          Derecho a la Alimentación · Atrapa {{ TARGET_FOODS }} alimentos saludables en la canasta
        </p>
      </div>

      <div class="w-full sm:w-64 ac-parchment px-4 py-2.5">
        <div class="flex justify-between text-xs sm:text-sm font-display font-bold text-amber-900 mb-1 tabular-nums">
          <span>⚡ Energía de Lumi</span>
          <span>{{ caughtCount }} / {{ TARGET_FOODS }} ({{ energyPct }}%)</span>
        </div>
        <div class="w-full h-3.5 bg-amber-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-300"
            :style="{ width: `${energyPct}%` }"
          />
        </div>
      </div>
    </div>

    <DonPlumasGuide
      message="¡Frutas, verduras y agua pura caen de los árboles! Mueve la canasta de Lumi con tu dedo, el ratón o los botones y esquiva botas y pilas."
      auto-speak
      compact
    />

    <!-- Catcher Stage -->
    <div
      ref="stageRef"
      @pointermove="handlePointerMove"
      @pointerdown="handlePointerMove"
      class="relative w-full h-[360px] sm:h-[400px] rounded-[32px] border-4 border-[#DFD2B5] bg-gradient-to-b from-sky-200 via-emerald-100 to-amber-100 shadow-2xl overflow-hidden select-none touch-none"
    >
      <!-- Canopy leaves -->
      <div class="pointer-events-none absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-emerald-700/80 to-transparent" />

      <div class="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white/85 text-xs sm:text-sm font-display font-bold text-valley-ink shadow">
        {{ statusHint }}
      </div>

      <!-- Falling items -->
      <div
        v-for="item in fallingItems"
        :key="item.id"
        :style="{ left: `${item.x}%`, top: `${item.y}%` }"
        class="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
      >
        <span class="text-4xl sm:text-5xl drop-shadow">{{ item.emoji }}</span>
      </div>

      <!-- Lumi & Basket -->
      <div
        :style="{ left: `${basketX}%` }"
        class="pointer-events-none absolute bottom-3 -translate-x-1/2 flex flex-col items-center transition-[left] duration-75"
      >
        <LumiSpirit :state="lumiState" size="xs" />
        <div
          class="w-24 sm:w-28 h-11 rounded-b-3xl rounded-t-lg bg-gradient-to-b from-amber-500 to-amber-700 border-4 border-amber-900 shadow-lg flex items-center justify-center text-white font-display font-bold text-sm"
        >
          🧺 Canasta
        </div>
      </div>
    </div>

    <!-- Big Touch Controls for Tablets/Keyboard-Free Kids -->
    <div class="flex items-center justify-center gap-4">
      <button
        type="button"
        @click="moveBasketBy(-14)"
        class="ac-btn px-8 py-4 min-h-[58px] bg-amber-400 hover:bg-amber-300 text-amber-950 border-b-4 border-amber-600 text-xl"
      >
        ⬅️ Izquierda
      </button>
      <button
        type="button"
        @click="moveBasketBy(14)"
        class="ac-btn px-8 py-4 min-h-[58px] bg-amber-400 hover:bg-amber-300 text-amber-950 border-b-4 border-amber-600 text-xl"
      >
        Derecha ➡️
      </button>
    </div>

    <RewardCelebrationModal
      :show="feedback.show"
      :type="feedback.type"
      :message="feedback.message"
      :unlocked-pose-id="2"
      :unlocked-sticker-id="2"
      @close="feedback.show = false"
      @next-level="emit('next-level')"
      @go-map="emit('go-map')"
      @open-album="emit('open-album')"
    />
  </section>
</template>
