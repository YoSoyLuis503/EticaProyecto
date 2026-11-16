<script setup>
import { computed, watch } from 'vue'
import DonPlumasGuide from './DonPlumasGuide.vue'
import LumiSpirit from './LumiSpirit.vue'
import StickerArt from './StickerArt.vue'
import { CABIN_STICKERS, SLEEP_POSES } from '../data/valleyData'
import { playSound, speak } from '../utils/sound'

const { show, type, message, unlockedPoseId, unlockedStickerId, isFinalLevel } = defineProps({
  show: { type: Boolean, default: false },
  type: { type: String, default: 'win' },
  message: { type: String, default: '' },
  unlockedPoseId: { type: Number, default: 0 },
  unlockedStickerId: { type: Number, default: 0 },
  isFinalLevel: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'next-level', 'go-map', 'open-album'])

const CONFETTI_COLORS = ['#38BDF8', '#40916C', '#FBBF24', '#8B5CF6', '#FB7185']
const confettiPieces = Array.from({ length: 24 }, (_, idx) => ({
  id: idx,
  left: `${(idx * 4.2) % 100}%`,
  delay: `${(idx % 6) * 0.16}s`,
  duration: `${2.3 + (idx % 4) * 0.35}s`,
  color: CONFETTI_COLORS[idx % CONFETTI_COLORS.length],
}))

const unlockedPose = computed(() => SLEEP_POSES.find((p) => p.id === unlockedPoseId) || null)
const unlockedSticker = computed(() => CABIN_STICKERS.find((s) => s.id === unlockedStickerId) || null)

const heading = computed(() =>
  type === 'win' ? '¡Misión Cumplida, Guardián!' : '¡Casi! Inténtalo con calma',
)

watch(
  () => [show, type, message],
  ([isOpen]) => {
    if (!isOpen) return
    playSound(type === 'win' ? 'win' : 'retry')
    speak(
      type === 'win'
        ? `¡Misión cumplida, pequeño guardián! ${message}`
        : `¡Casi! Tú puedes lograrlo. ${message}`,
    )
  },
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      role="dialog"
      aria-modal="true"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/65 backdrop-blur-sm"
    >
      <!-- Confetti on Win -->
      <div v-if="type === 'win'" class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <span
          v-for="piece in confettiPieces"
          :key="piece.id"
          class="confetti-piece absolute -top-6 w-3.5 h-5 rounded-sm"
          :style="{
            left: piece.left,
            backgroundColor: piece.color,
            animationDelay: piece.delay,
            '--fall-duration': piece.duration,
          }"
        />
      </div>

      <div class="relative w-full max-w-2xl ac-parchment p-5 sm:p-7 animate-pop space-y-5 text-center">
        <h2
          :class="type === 'win' ? 'text-valley-moss' : 'text-amber-700'"
          class="text-2xl sm:text-4xl font-display font-bold"
        >
          {{ heading }}
        </h2>

        <!-- Unlocked Sleep Pose + Sticker Showcase -->
        <div
          v-if="type === 'win' && (unlockedPose || unlockedSticker)"
          class="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <div
            v-if="unlockedPose"
            class="rounded-3xl bg-indigo-950 text-white p-4 flex items-center gap-3 text-left border-2 border-sky-300/40 shadow-lg"
          >
            <LumiSpirit state="sleeping" :pose-id="unlockedPose.id" size="sm" />
            <div class="space-y-0.5">
              <span class="text-[11px] font-display font-bold text-amber-300">
                📖 Nueva Pose en Álbum
              </span>
              <h3 class="font-display font-bold text-base sm:text-lg leading-tight">
                {{ unlockedPose.title }}
              </h3>
              <p class="text-xs text-indigo-200">{{ unlockedPose.stars }}</p>
            </div>
          </div>

          <div
            v-if="unlockedSticker"
            class="rounded-3xl bg-amber-50 text-valley-ink p-4 flex items-center gap-3 text-left border-2 border-amber-300 shadow-lg"
          >
            <StickerArt :sticker-id="unlockedSticker.id" size-class="w-16 h-16 shrink-0" />
            <div class="space-y-0.5">
              <span class="text-[11px] font-display font-bold text-amber-700">
                🏡 Nueva Pegatina
              </span>
              <h3 class="font-display font-bold text-base sm:text-lg leading-tight">
                {{ unlockedSticker.name }}
              </h3>
              <p class="text-xs text-slate-600">{{ unlockedSticker.description }}</p>
            </div>
          </div>
        </div>

        <DonPlumasGuide
          :mood="type === 'win' ? 'happy' : 'encouraging'"
          :message="message"
          compact
        />

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <template v-if="type === 'win'">
            <button
              v-if="!isFinalLevel"
              type="button"
              @click="emit('next-level')"
              class="ac-btn w-full sm:w-auto px-8 py-4 min-h-[58px] bg-valley-moss hover:bg-valley-leaf text-white border-b-4 border-emerald-950 text-lg sm:text-xl"
            >
              Siguiente Misión →
            </button>
            <button
              type="button"
              @click="emit('open-album')"
              class="ac-btn w-full sm:w-auto px-6 py-4 min-h-[58px] bg-indigo-600 hover:bg-indigo-500 text-white border-b-4 border-indigo-900 text-lg"
            >
              📖 Ver Álbum
            </button>
            <button
              type="button"
              @click="emit('go-map')"
              class="ac-btn w-full sm:w-auto px-6 py-4 min-h-[58px] bg-amber-300 hover:bg-amber-200 text-amber-950 border-b-4 border-amber-500 text-lg"
            >
              🗺️ Mapa del Valle
            </button>
          </template>

          <button
            v-else
            type="button"
            @click="emit('close')"
            class="ac-btn w-full sm:w-auto px-10 py-4 min-h-[60px] bg-valley-moss hover:bg-valley-leaf text-white border-b-4 border-emerald-950 text-xl"
          >
            ¡Intentarlo otra vez! 💪
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
