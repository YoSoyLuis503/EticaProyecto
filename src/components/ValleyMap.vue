<script setup>
import { computed } from 'vue'
import DonPlumasGuide from './DonPlumasGuide.vue'
import LumiSpirit from './LumiSpirit.vue'
import { SLEEP_POSES, VALLEY_LEVELS } from '../data/valleyData'
import { playSound } from '../utils/sound'

const { completedLevels, unlockedPoses, demoUnlocked } = defineProps({
  completedLevels: { type: Array, required: true },
  unlockedPoses: { type: Array, required: true },
  demoUnlocked: { type: Boolean, required: true },
})

const emit = defineEmits(['select-level'])

const nextLevel = computed(
  () => VALLEY_LEVELS.find((l) => !completedLevels.includes(l.id)) || VALLEY_LEVELS[0],
)

const guideMessage = computed(() => {
  if (completedLevels.length === VALLEY_LEVELS.length) {
    return '¡Eres un Guardián Completo del Valle Dormilón! Ya puedes jugar cualquier misión o admirar el Álbum de los Sueños.'
  }
  return `Nuestra siguiente parada es la Misión ${nextLevel.value.id}: "${nextLevel.value.title}" en ${nextLevel.value.biome}.`
})

function isUnlocked(levelId) {
  if (demoUnlocked) return true
  if (completedLevels.length === 0) return levelId === 1
  return levelId <= Math.max(...completedLevels) + 1
}

function getPoseTitle(poseId) {
  return SLEEP_POSES.find((p) => p.id === poseId)?.title || ''
}

function openStation(lvl) {
  if (!isUnlocked(lvl.id)) {
    playSound('retry')
    return
  }
  playSound('pop')
  emit('select-level', lvl.screen)
}
</script>

<template>
  <section class="max-w-5xl mx-auto px-4 py-6 space-y-6">
    <div class="text-center space-y-1">
      <h1 class="text-3xl sm:text-4xl font-display font-bold text-valley-moss">
        🗺️ Sendero del Valle Dormilón
      </h1>
      <p class="text-base font-bold text-slate-600">
        Elige la siguiente parada de Lumi para desbloquear poses de sueño y pegatinas
      </p>
    </div>

    <DonPlumasGuide :message="guideMessage" compact />

    <!-- Illustrated Valley Stations -->
    <div class="relative space-y-4 py-2">
      <div
        class="hidden md:block absolute left-1/2 top-8 bottom-8 w-2 -translate-x-1/2 border-l-8 border-dotted border-valley-woodLight/80"
        aria-hidden="true"
      />

      <div
        v-for="(lvl, idx) in VALLEY_LEVELS"
        :key="lvl.id"
        :class="idx % 2 === 0 ? 'md:justify-start md:pr-20' : 'md:justify-end md:pl-20'"
        class="flex justify-center"
      >
        <button
          type="button"
          @click="openStation(lvl)"
          :disabled="!isUnlocked(lvl.id)"
          :class="[
            isUnlocked(lvl.id)
              ? 'bg-valley-parchment hover:-translate-y-1 border-[#DFD2B5] cursor-pointer shadow-xl'
              : 'bg-slate-200/80 border-slate-300 opacity-75 cursor-not-allowed shadow',
            lvl.id === nextLevel.id && !completedLevels.includes(lvl.id)
              ? 'ring-4 ring-sky-400'
              : '',
          ]"
          class="relative w-full md:w-[82%] rounded-[28px] border-4 p-4 sm:p-5 text-left flex items-center gap-4 transition-all"
        >
          <!-- Biome Icon / Completed Sleep Pose Preview -->
          <div
            :class="isUnlocked(lvl.id) ? `bg-gradient-to-br ${lvl.palette}` : 'bg-slate-400'"
            class="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex flex-col items-center justify-center text-white border-4 border-white/80 shadow-inner"
          >
            <LumiSpirit
              v-if="unlockedPoses.includes(lvl.poseId)"
              state="sleeping"
              :pose-id="lvl.poseId"
              size="xs"
            />
            <span v-else class="font-display font-bold text-3xl">
              {{ isUnlocked(lvl.id) ? lvl.id : '🔒' }}
            </span>
          </div>

          <div class="flex-1 min-w-0 space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <span :class="lvl.badgeBg" class="px-3 py-0.5 rounded-full text-xs font-display font-bold">
                {{ lvl.rightLabel }}
              </span>
              <span
                v-if="completedLevels.includes(lvl.id)"
                class="px-2.5 py-0.5 rounded-full bg-indigo-900 text-amber-200 text-xs font-bold"
              >
                Pose: {{ getPoseTitle(lvl.poseId) }}
              </span>
            </div>

            <h2 class="text-xl sm:text-2xl font-display font-bold text-valley-ink">
              {{ lvl.id }}. {{ lvl.title }}
            </h2>
            <p class="text-sm sm:text-base font-semibold text-slate-600 leading-snug">
              {{ lvl.description }}
            </p>
          </div>

          <span
            v-if="isUnlocked(lvl.id)"
            class="hidden sm:inline-flex shrink-0 px-4 py-2.5 rounded-full bg-valley-moss text-white font-display font-bold text-sm shadow"
          >
            {{ completedLevels.includes(lvl.id) ? 'Rejugar' : 'Jugar →' }}
          </span>
        </button>
      </div>
    </div>
  </section>
</template>
