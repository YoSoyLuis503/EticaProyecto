<script setup>
import { computed } from 'vue'
import DormiMascot from './DormiMascot.vue'
import { CAMP_LEVELS } from '../data/levels'
import { playSound } from '../utils/sound'

const { completedLevels, levelStars, demoUnlocked } = defineProps({
  completedLevels: { type: Array, required: true },
  levelStars: { type: Object, required: true },
  demoUnlocked: { type: Boolean, required: true },
})

const emit = defineEmits(['select-level'])

const maxUnlockedLevel = computed(() => {
  if (demoUnlocked) return CAMP_LEVELS.length
  if (completedLevels.length === 0) return 1
  return Math.min(CAMP_LEVELS.length, Math.max(...completedLevels) + 1)
})

const mapMessage = computed(() => {
  if (completedLevels.length === CAMP_LEVELS.length) {
    return '¡Completaste todo el campamento! Puedes volver a jugar el nivel que más te guste.'
  }
  const next = CAMP_LEVELS.find((l) => !completedLevels.includes(l.id)) || CAMP_LEVELS[0]
  return `¡Toca el nivel ${next.id}: "${next.title}" para seguir nuestra aventura!`
})

function isUnlocked(id) {
  return demoUnlocked || id <= maxUnlockedLevel.value
}

function openLevel(lvl) {
  if (!isUnlocked(lvl.id)) {
    playSound('retry')
    return
  }
  playSound('pop')
  emit('select-level', lvl.screen)
}
</script>

<template>
  <section class="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
    <div class="text-center space-y-1">
      <h1 class="text-3xl sm:text-4xl font-display font-bold text-violet-900">
        🗺️ Ruta del Campamento
      </h1>
      <p class="text-base sm:text-lg font-semibold text-slate-700">
        Sigue el caminito desde el parque hasta las estrellas
      </p>
    </div>

    <DormiMascot
      :mood="completedLevels.length === 5 ? 'excited' : 'happy'"
      :message="mapMessage"
      compact
    />

    <!-- Winding Caminitera Trail -->
    <div class="relative py-4">
      <!-- Dotted Camp Path Connector (visible on md+) -->
      <div
        class="hidden sm:block absolute left-1/2 top-10 bottom-10 w-3 -translate-x-1/2 rounded-full border-l-8 border-dotted border-amber-400/80"
        aria-hidden="true"
      />

      <div class="relative space-y-5">
        <div
          v-for="(lvl, idx) in CAMP_LEVELS"
          :key="lvl.id"
          :class="idx % 2 === 0 ? 'sm:pr-24 sm:justify-start' : 'sm:pl-24 sm:justify-end'"
          class="flex justify-center"
        >
          <button
            type="button"
            @click="openLevel(lvl)"
            :disabled="!isUnlocked(lvl.id)"
            :aria-label="`Nivel ${lvl.id}: ${lvl.title}. ${isUnlocked(lvl.id) ? 'Desbloqueado' : 'Bloqueado'}`"
            :class="[
              isUnlocked(lvl.id)
                ? 'bg-white hover:scale-[1.02] cursor-pointer border-white shadow-xl'
                : 'bg-slate-200/85 opacity-75 cursor-not-allowed border-slate-300 shadow-md',
              lvl.id === maxUnlockedLevel && !completedLevels.includes(lvl.id)
                ? 'ring-4 ring-amber-400'
                : '',
            ]"
            class="btn-tactile w-full sm:w-[82%] p-4 sm:p-5 border-4 text-left flex items-center gap-4 sm:gap-5 transition-transform"
          >
            <!-- Level Number & Big Badge -->
            <div
              :class="isUnlocked(lvl.id) ? lvl.accentBg : 'bg-slate-400'"
              class="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl shadow-inner border-4 border-white/80"
            >
              <span aria-hidden="true">{{ isUnlocked(lvl.id) ? lvl.badge : '🔒' }}</span>
              <span
                class="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-violet-700 text-white font-display font-bold text-base flex items-center justify-center border-2 border-white shadow"
              >
                {{ lvl.id }}
              </span>
            </div>

            <!-- Level Info -->
            <div class="flex-1 min-w-0 space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  :class="isUnlocked(lvl.id) ? lvl.pillBg : 'bg-slate-300 text-slate-700'"
                  class="px-3 py-0.5 rounded-full text-xs sm:text-sm font-display font-bold"
                >
                  {{ lvl.skillLabel }}
                </span>

                <span
                  v-if="completedLevels.includes(lvl.id)"
                  class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold"
                >
                  {{ '⭐'.repeat(levelStars[lvl.id] || 3) }}
                </span>
              </div>

              <h2 class="text-xl sm:text-2xl font-display font-bold text-slate-900 truncate">
                {{ lvl.title }}
              </h2>
              <p class="text-sm sm:text-base font-medium text-slate-600 leading-snug">
                {{ lvl.description }}
              </p>
            </div>

            <!-- Go Pill -->
            <div
              v-if="isUnlocked(lvl.id)"
              class="hidden sm:flex shrink-0 px-4 py-3 rounded-2xl bg-violet-600 text-white font-display font-bold text-base shadow"
            >
              {{ completedLevels.includes(lvl.id) ? 'Repetir' : '¡Vamos!' }}
            </div>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
