<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import DonPlumasGuide from '../DonPlumasGuide.vue'
import LumiSpirit from '../LumiSpirit.vue'
import RewardCelebrationModal from '../RewardCelebrationModal.vue'
import { playSound } from '../../utils/sound'

const emit = defineEmits(['complete', 'go-map', 'open-album'])

const TARGET_NOISE_POPS = 10

const NOISE_TYPES = [
  { label: 'Tamborazo', emoji: '🥁' },
  { label: 'Alarma', emoji: '⏰' },
  { label: 'Trueno', emoji: '⚡' },
  { label: 'Travieso', emoji: '👾' },
]

const clearedCount = shallowRef(0)
const noiseBubbles = ref([])
const quietToast = shallowRef('¡Toca las burbujas de ruido antes de que lleguen a Lumi!')
const feedback = ref({ show: false, type: 'win', message: '' })

let nextId = 1
let loopTimer = null
let spawnTick = 0

const dawnPct = computed(() => Math.min(100, Math.round((clearedCount.value / TARGET_NOISE_POPS) * 100)))
const isSunrise = computed(() => clearedCount.value >= TARGET_NOISE_POPS)

const hourLabel = computed(() => {
  const hours = ['12:00 AM', '12:30 AM', '01:00 AM', '02:00 AM', '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM', '06:00 AM ☀️']
  return hours[Math.min(hours.length - 1, clearedCount.value)]
})

const skyBackground = computed(() => {
  if (isSunrise.value) return 'from-sky-300 via-amber-200 to-emerald-200 border-amber-300 text-valley-ink'
  if (clearedCount.value >= 6) return 'from-indigo-800 via-purple-700 to-amber-500/60 border-amber-200/50 text-white'
  return 'from-slate-950 via-indigo-950 to-purple-950 border-indigo-400/50 text-white'
})

function spawnNoiseBubble() {
  const tpl = NOISE_TYPES[Math.floor(Math.random() * NOISE_TYPES.length)]
  // Spawn along edges and drift gently toward center (50, 52)
  const side = Math.floor(Math.random() * 4)
  let x = 50
  let y = 12
  if (side === 0) { x = 12 + Math.random() * 76; y = 10 }
  else if (side === 1) { x = 88; y = 16 + Math.random() * 68 }
  else if (side === 2) { x = 12 + Math.random() * 76; y = 88 }
  else { x = 12; y = 16 + Math.random() * 68 }

  noiseBubbles.value.push({
    id: nextId++,
    ...tpl,
    x,
    y,
  })
}

function stepNight() {
  if (feedback.value.show || isSunrise.value) return

  spawnTick += 1
  if (spawnTick % 20 === 0 && noiseBubbles.value.length < 5) {
    spawnNoiseBubble()
  }

  const remaining = []
  for (const bubble of noiseBubbles.value) {
    const dx = 50 - bubble.x
    const dy = 52 - bubble.y
    const dist = Math.hypot(dx, dy)

    if (dist < 11) {
      playSound('retry')
      quietToast.value = `¡Shhh! Un ${bubble.label} se acercó mucho. ¡Reviéntalos pronto!`
      continue
    }

    remaining.push({
      ...bubble,
      x: bubble.x + (dx / dist) * 0.72,
      y: bubble.y + (dy / dist) * 0.72,
    })
  }
  noiseBubbles.value = remaining
}

function popNoise(bubble) {
  if (isSunrise.value) return
  playSound('noise-pop')
  noiseBubbles.value = noiseBubbles.value.filter((b) => b.id !== bubble.id)
  clearedCount.value += 1
  quietToast.value = `¡Shhh! Silenciaste a "${bubble.label}"`

  if (clearedCount.value >= TARGET_NOISE_POPS) {
    clearInterval(loopTimer)
    noiseBubbles.value = []
    emit('complete', { levelId: 5, poseId: 5, stickerId: 5 })
    feedback.value = {
      show: true,
      type: 'win',
      message: '¡Amaneció en el Valle Dormilón! Protegiste el descanso de Lumi y despertó lleno de luz y alegría.',
    }
  } else if (noiseBubbles.value.length === 0) {
    spawnNoiseBubble()
  }
}

onMounted(() => {
  spawnNoiseBubble()
  spawnNoiseBubble()
  loopTimer = setInterval(stepNight, 80)
})

onBeforeUnmount(() => {
  clearInterval(loopTimer)
})
</script>

<template>
  <section class="max-w-5xl mx-auto px-4 py-6 space-y-5 text-white">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl sm:text-4xl font-display font-bold text-amber-200">
          🌙 Nivel 5: El Sueño de Lumi
        </h1>
        <p class="text-sm sm:text-base font-bold text-indigo-200">
          Equilibrio Vida y Descanso · Protege el sueño de Lumi hasta las 06:00 AM
        </p>
      </div>

      <div class="w-full sm:w-72 sleep-glass px-4 py-2.5">
        <div class="flex justify-between text-xs sm:text-sm font-display font-bold text-amber-200 mb-1 tabular-nums">
          <span>🌅 {{ hourLabel }}</span>
          <span>{{ clearedCount }} / {{ TARGET_NOISE_POPS }}</span>
        </div>
        <div class="w-full h-3.5 bg-indigo-900 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-sky-400 via-amber-300 to-yellow-200 rounded-full transition-all duration-300"
            :style="{ width: `${dawnPct}%` }"
          />
        </div>
      </div>
    </div>

    <DonPlumasGuide
      night
      message="¡Los Traviesos del Ruido envían burbujas ruidosas! Tócalas suavemente para reventarlas en silencio hasta que amanezca."
      auto-speak
      compact
    />

    <!-- Starry Night -> Golden Dawn Arena -->
    <div
      :class="skyBackground"
      class="relative w-full h-[380px] sm:h-[420px] rounded-[32px] border-4 shadow-2xl overflow-hidden select-none transition-colors duration-700"
    >
      <!-- Top Quiet Status -->
      <div class="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-indigo-950/85 text-amber-100 border border-indigo-300/30 text-xs sm:text-sm font-display font-bold whitespace-nowrap">
        {{ quietToast }}
      </div>

      <!-- Center Sleeping / Awakening Lumi -->
      <div class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <LumiSpirit
          :state="isSunrise ? 'joyful' : 'sleeping'"
          :pose-id="isSunrise ? 0 : 5"
          size="md"
        />
        <span
          class="mt-1 px-4 py-1 rounded-full bg-indigo-950/80 text-sky-200 font-display font-bold text-xs border border-sky-300/30"
        >
          {{ isSunrise ? '☀️ ¡Buenos días, Lumi!' : '💤 Protege su aura' }}
        </span>
      </div>

      <!-- Drifting Noise Bubbles from Los Traviesos -->
      <button
        v-for="bubble in noiseBubbles"
        :key="bubble.id"
        type="button"
        @click="popNoise(bubble)"
        :aria-label="`Silenciar burbuja de ruido: ${bubble.label}`"
        :style="{ left: `${bubble.x}%`, top: `${bubble.y}%` }"
        class="absolute -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-rose-500/90 to-slate-800/95 border-4 border-rose-300 shadow-[0_0_24px_rgba(244,63,94,0.6)] flex flex-col items-center justify-center gap-0.5 text-white hover:scale-110 active:scale-90 transition-transform cursor-pointer"
      >
        <span class="text-3xl sm:text-4xl" aria-hidden="true">{{ bubble.emoji }}</span>
        <span class="text-[11px] font-display font-bold">{{ bubble.label }}</span>
      </button>
    </div>

    <RewardCelebrationModal
      :show="feedback.show"
      :type="feedback.type"
      :message="feedback.message"
      :unlocked-pose-id="5"
      :unlocked-sticker-id="5"
      is-final-level
      @close="feedback.show = false"
      @go-map="emit('go-map')"
      @open-album="emit('open-album')"
    />
  </section>
</template>
