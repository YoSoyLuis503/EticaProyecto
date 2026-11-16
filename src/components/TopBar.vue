<script setup>
import { computed } from 'vue'
import { CAMP_LEVELS } from '../data/levels'

const { currentScreen, stars, completedLevels, isMuted, demoUnlocked } = defineProps({
  currentScreen: { type: String, required: true },
  stars: { type: Number, required: true },
  completedLevels: { type: Array, required: true },
  isMuted: { type: Boolean, required: true },
  demoUnlocked: { type: Boolean, required: true },
})

const emit = defineEmits(['go-home', 'go-map', 'toggle-mute', 'unlock-all', 'reset-progress'])

const progressPercent = computed(() => Math.min(100, Math.round((stars / 15) * 100)))
const isNightMode = computed(() => currentScreen === 'level5')
</script>

<template>
  <header
    :class="
      isNightMode
        ? 'bg-indigo-950/90 border-indigo-700 text-white'
        : 'bg-white/90 border-amber-200 text-slate-800'
    "
    class="sticky top-0 z-30 backdrop-blur-md border-b-4 shadow-md transition-colors duration-500"
  >
    <div class="max-w-5xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
      <!-- Navigation left -->
      <div class="flex items-center gap-2">
        <button
          v-if="currentScreen !== 'welcome'"
          type="button"
          @click="emit('go-home')"
          class="btn-tactile px-4 py-2.5 min-h-[48px] bg-amber-300 hover:bg-amber-200 text-amber-950 border-b-4 border-amber-500 text-sm sm:text-base flex items-center gap-1.5"
          aria-label="Ir al inicio"
        >
          <span aria-hidden="true">⛺</span>
          <span class="hidden sm:inline">Inicio</span>
        </button>

        <button
          v-if="currentScreen.startsWith('level')"
          type="button"
          @click="emit('go-map')"
          class="btn-tactile px-4 py-2.5 min-h-[48px] bg-emerald-400 hover:bg-emerald-300 text-emerald-950 border-b-4 border-emerald-600 text-sm sm:text-base flex items-center gap-1.5"
          aria-label="Volver al mapa de niveles"
        >
          <span aria-hidden="true">🗺️</span>
          <span>Mapa</span>
        </button>

        <span
          v-if="currentScreen === 'welcome'"
          class="font-display font-bold text-lg sm:text-xl flex items-center gap-2 text-violet-700"
        >
          <span aria-hidden="true">⛺</span>
          <span>Campamento de los Sueños</span>
        </span>
      </div>

      <!-- Star Progress Bar -->
      <div class="flex-1 min-w-[180px] max-w-md flex flex-col gap-1">
        <div class="flex items-center justify-between text-xs sm:text-sm font-display font-bold px-1">
          <span class="flex items-center gap-1">
            <span aria-hidden="true">⭐</span>
            <span>{{ stars }} / 15 Estrellas</span>
          </span>
          <div class="flex items-center gap-1" aria-label="Niveles completados">
            <span
              v-for="lvl in CAMP_LEVELS"
              :key="lvl.id"
              :title="lvl.title"
              :class="
                completedLevels.includes(lvl.id)
                  ? 'bg-amber-400 text-amber-950 scale-105'
                  : isNightMode
                    ? 'bg-indigo-800 text-indigo-300'
                    : 'bg-slate-200 text-slate-500'
              "
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-transform"
            >
              {{ completedLevels.includes(lvl.id) ? '★' : lvl.id }}
            </span>
          </div>
        </div>
        <div
          :class="isNightMode ? 'bg-indigo-900' : 'bg-amber-100'"
          class="w-full h-3.5 rounded-full overflow-hidden border-2 border-amber-300"
        >
          <div
            class="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 rounded-full transition-all duration-500"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>
      </div>

      <!-- Right Controls: Sound + Presenter Demo Toggle -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="emit('toggle-mute')"
          :aria-label="isMuted ? 'Activar sonido' : 'Silenciar sonido'"
          :class="
            isMuted
              ? 'bg-slate-200 text-slate-700 border-slate-400'
              : 'bg-violet-600 text-white border-violet-800'
          "
          class="btn-tactile px-3.5 py-2.5 min-h-[48px] border-b-4 text-sm sm:text-base flex items-center gap-1.5"
        >
          <span aria-hidden="true">{{ isMuted ? '🔇' : '🔊' }}</span>
          <span class="hidden md:inline">{{ isMuted ? 'Silencio' : 'Audio' }}</span>
        </button>

        <button
          type="button"
          @click="emit('unlock-all')"
          :title="demoUnlocked ? 'Todos los niveles desbloqueados para demostración' : 'Desbloquear los 5 niveles para demostración en clase'"
          :class="
            demoUnlocked
              ? 'bg-amber-300 text-amber-950 border-amber-500'
              : 'bg-sky-200 hover:bg-sky-300 text-sky-950 border-sky-400'
          "
          class="btn-tactile px-3 py-2.5 min-h-[48px] border-b-4 text-xs sm:text-sm"
        >
          {{ demoUnlocked ? '🔓 Demo Activa' : '🔓 Modo Demo' }}
        </button>

        <button
          v-if="stars > 0 || demoUnlocked"
          type="button"
          @click="emit('reset-progress')"
          title="Reiniciar estrellas"
          aria-label="Reiniciar progreso"
          class="btn-tactile px-3 py-2.5 min-h-[48px] bg-rose-100 hover:bg-rose-200 text-rose-800 border-b-4 border-rose-300 text-sm"
        >
          🔄
        </button>
      </div>
    </div>
  </header>
</template>
