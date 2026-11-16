<script setup>
import LumiSpirit from './LumiSpirit.vue'
import { SLEEP_POSES } from '../data/valleyData'
import { playSound } from '../utils/sound'

const { show, unlockedPoses } = defineProps({
  show: { type: Boolean, default: false },
  unlockedPoses: { type: Array, required: true },
})

const emit = defineEmits(['close'])

function closeAlbum() {
  playSound('pop')
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      role="dialog"
      aria-modal="true"
      aria-label="Álbum de los Sueños"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-indigo-950/70 backdrop-blur-sm"
    >
      <div
        class="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-900 border-4 border-indigo-300/40 shadow-2xl p-5 sm:p-7 text-white space-y-5 animate-pop"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-2xl sm:text-3xl font-display font-bold text-amber-200">
              📖 Álbum de los Sueños de Lumi
            </h2>
            <p class="text-sm sm:text-base text-indigo-200 font-semibold">
              Colecciona las 5 posturas dormilonas completando cada misión ({{ unlockedPoses.length }} / 5)
            </p>
          </div>

          <button
            type="button"
            @click="closeAlbum"
            class="ac-btn px-6 py-3 min-h-[48px] bg-amber-300 hover:bg-amber-200 text-amber-950 border-b-4 border-amber-500 text-base"
          >
            Cerrar ✕
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <article
            v-for="pose in SLEEP_POSES"
            :key="pose.id"
            :class="
              unlockedPoses.includes(pose.id)
                ? 'bg-indigo-900/80 border-sky-300/50'
                : 'bg-slate-900/70 border-slate-700/70 opacity-75'
            "
            class="rounded-3xl border-2 p-4 flex flex-col items-center text-center gap-2 shadow-lg"
          >
            <div class="w-full flex items-center justify-between text-xs font-display font-bold">
              <span class="px-2.5 py-1 rounded-full bg-indigo-950 text-sky-200 border border-sky-400/30">
                Pose #{{ pose.id }}
              </span>
              <span v-if="unlockedPoses.includes(pose.id)" class="text-amber-300 tabular-nums">
                {{ pose.stars }}
              </span>
              <span v-else class="text-slate-400">🔒 Bloqueada</span>
            </div>

            <div class="py-1">
              <LumiSpirit
                v-if="unlockedPoses.includes(pose.id)"
                state="sleeping"
                :pose-id="pose.id"
                size="sm"
              />
              <LumiSpirit v-else state="sleepy" size="sm" class="opacity-35 grayscale" />
            </div>

            <h3 class="font-display font-bold text-lg text-amber-100">
              {{ unlockedPoses.includes(pose.id) ? pose.title : '??? Sueño Secreto' }}
            </h3>

            <span class="px-3 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold">
              {{ pose.rightTag }}
            </span>

            <p class="text-xs sm:text-sm text-indigo-100/90 leading-snug">
              {{
                unlockedPoses.includes(pose.id)
                  ? pose.description
                  : 'Supera este nivel del valle para descubrir cómo duerme Lumi.'
              }}
            </p>
          </article>
        </div>
      </div>
    </div>
  </Teleport>
</template>
