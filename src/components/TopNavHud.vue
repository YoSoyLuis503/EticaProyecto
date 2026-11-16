<script setup>
import { computed } from 'vue'
import LumiSpirit from './LumiSpirit.vue'

const {
  currentScreen,
  completedLevels,
  unlockedPoses,
  unlockedStickers,
  isMuted,
  demoUnlocked,
} = defineProps({
  currentScreen: { type: String, required: true },
  completedLevels: { type: Array, required: true },
  unlockedPoses: { type: Array, required: true },
  unlockedStickers: { type: Array, required: true },
  isMuted: { type: Boolean, required: true },
  demoUnlocked: { type: Boolean, required: true },
})

const emit = defineEmits([
  'navigate',
  'open-album',
  'open-cabin',
  'toggle-mute',
  'toggle-demo',
  'reset-progress',
])

const isNightScreen = computed(() => currentScreen === 'level4' || currentScreen === 'level5')
const energyPct = computed(() => Math.round((completedLevels.length / 5) * 100))
const lumiState = computed(() => (completedLevels.length > 0 ? 'healthy' : 'sleepy'))
</script>

<template>
  <header
    :class="
      isNightScreen
        ? 'bg-indigo-950/85 border-indigo-400/30 text-white'
        : 'bg-valley-parchment/90 border-[#E8DEC5] text-valley-ink'
    "
    class="sticky top-0 z-30 backdrop-blur-md border-b-4 shadow-sm transition-colors duration-500"
  >
    <div class="max-w-6xl mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2.5">
      <!-- Brand + Lumi Status -->
      <div class="flex items-center gap-2.5">
        <button
          type="button"
          @click="emit('navigate', 'welcome')"
          class="flex items-center gap-2 rounded-full pr-3 pl-1 py-1 hover:bg-sky-100/60 transition-colors"
          aria-label="Ir a la portada del Valle Dormilón"
        >
          <LumiSpirit :state="lumiState" size="xs" />
          <div class="text-left leading-tight">
            <span class="block font-display font-bold text-sm sm:text-base">
              Valle Dormilón
            </span>
            <span class="block text-xs font-bold opacity-80 tabular-nums">
              Energía {{ energyPct }}%
            </span>
          </div>
        </button>

        <button
          v-if="currentScreen !== 'map' && currentScreen !== 'welcome'"
          type="button"
          @click="emit('navigate', 'map')"
          class="ac-btn px-4 py-2 min-h-[44px] bg-valley-leaf hover:bg-emerald-500 text-white border-b-4 border-emerald-900 text-sm"
        >
          🗺️ Mapa
        </button>
      </div>

      <!-- Collectibles & Controls -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          @click="emit('open-album')"
          class="ac-btn px-3.5 py-2 min-h-[44px] bg-sky-100 hover:bg-sky-200 text-sky-950 border-b-4 border-sky-300 text-xs sm:text-sm tabular-nums"
        >
          📖 Álbum {{ unlockedPoses.length }}/5
        </button>

        <button
          type="button"
          @click="emit('open-cabin')"
          class="ac-btn px-3.5 py-2 min-h-[44px] bg-amber-100 hover:bg-amber-200 text-amber-950 border-b-4 border-amber-300 text-xs sm:text-sm tabular-nums"
        >
          🏡 Cabaña {{ unlockedStickers.length }}/5
        </button>

        <button
          type="button"
          @click="emit('toggle-mute')"
          :aria-label="isMuted ? 'Activar voz y sonidos' : 'Silenciar voz y sonidos'"
          :class="
            isMuted
              ? 'bg-slate-200 text-slate-700 border-slate-400'
              : 'bg-indigo-600 text-white border-indigo-900'
          "
          class="ac-btn px-3.5 py-2 min-h-[44px] border-b-4 text-sm"
        >
          {{ isMuted ? '🔇' : '🔊' }}
        </button>

        <button
          type="button"
          @click="emit('toggle-demo')"
          :class="
            demoUnlocked
              ? 'bg-amber-300 text-amber-950 border-amber-500'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          "
          class="ac-btn px-3.5 py-2 min-h-[44px] border-b-4 text-xs sm:text-sm"
        >
          {{ demoUnlocked ? '✨ Demo Activa' : '🔓 Modo Demo' }}
        </button>

        <button
          v-if="completedLevels.length > 0 || demoUnlocked"
          type="button"
          @click="emit('reset-progress')"
          title="Reiniciar aventura"
          aria-label="Reiniciar progreso"
          class="ac-btn px-3 py-2 min-h-[44px] bg-rose-100 hover:bg-rose-200 text-rose-800 border-b-4 border-rose-300 text-sm"
        >
          🔄
        </button>
      </div>
    </div>
  </header>
</template>
