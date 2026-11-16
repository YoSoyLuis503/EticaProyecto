<script setup>
import { computed, watch } from 'vue'
import { isSpeaking, playSound, speak } from '../utils/sound'

const {
  message,
  mood = 'wise',
  autoSpeak = false,
  compact = false,
  night = false,
} = defineProps({
  message: { type: String, required: true },
  mood: {
    type: String,
    default: 'wise',
    validator: (v) => ['wise', 'happy', 'encouraging'].includes(v),
  },
  autoSpeak: { type: Boolean, default: false },
  compact: { type: Boolean, default: false },
  night: { type: Boolean, default: false },
})

const cardClass = computed(() =>
  night
    ? 'bg-indigo-950/90 text-amber-50 border-indigo-400/50'
    : 'bg-valley-parchment text-valley-ink border-[#DFD2B5]',
)

const avatarClass = computed(() =>
  compact ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-28 h-28 sm:w-32 sm:h-32',
)

function readMessage() {
  playSound('pop')
  speak(message)
}

watch(
  () => message,
  (next) => {
    if (autoSpeak && next) speak(next)
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center gap-4">
    <!-- Don Plumas Custom SVG Owl -->
    <div class="relative shrink-0 flex flex-col items-center">
      <div :class="avatarClass" class="relative drop-shadow-lg" aria-hidden="true">
        <svg viewBox="0 0 160 160" class="w-full h-full overflow-visible">
          <!-- Owl body -->
          <ellipse cx="80" cy="100" rx="46" ry="44" fill="#8C5E3C" />
          <ellipse cx="80" cy="108" rx="31" ry="30" fill="#FAF6EC" />
          <!-- Belly feather pattern -->
          <path d="M66 96 Q72 102 78 96 M82 96 Q88 102 94 96 M74 110 Q80 116 86 110" fill="none" stroke="#C7A687" stroke-width="3" stroke-linecap="round" />

          <!-- Wings (flap slightly when speaking) -->
          <ellipse
            cx="34"
            cy="102"
            rx="14"
            ry="26"
            :transform="isSpeaking ? 'rotate(24 34 102)' : 'rotate(10 34 102)'"
            fill="#6F4528"
            class="transition-transform duration-200"
          />
          <ellipse
            cx="126"
            cy="102"
            rx="14"
            ry="26"
            :transform="isSpeaking ? 'rotate(-24 126 102)' : 'rotate(-10 126 102)'"
            fill="#6F4528"
            class="transition-transform duration-200"
          />

          <!-- Owl Ear Tufts -->
          <polygon points="40,42 54,24 64,46" fill="#6F4528" />
          <polygon points="120,42 106,24 96,46" fill="#6F4528" />

          <!-- Owl Face Disc -->
          <circle cx="80" cy="64" r="38" fill="#A6754F" />
          <circle cx="64" cy="64" r="16" fill="#FFFDF7" />
          <circle cx="96" cy="64" r="16" fill="#FFFDF7" />

          <!-- Eyes -->
          <g v-if="mood === 'happy'">
            <path d="M56 64 Q64 56 72 64" fill="none" stroke="#1E1B18" stroke-width="4" stroke-linecap="round" />
            <path d="M88 64 Q96 56 104 64" fill="none" stroke="#1E1B18" stroke-width="4" stroke-linecap="round" />
          </g>
          <g v-else>
            <circle cx="64" cy="64" r="7" fill="#1E1B18" />
            <circle cx="96" cy="64" r="7" fill="#1E1B18" />
            <circle cx="66" cy="62" r="2.5" fill="#FFFFFF" />
            <circle cx="98" cy="62" r="2.5" fill="#FFFFFF" />
          </g>

          <!-- Wise Gold Glasses -->
          <circle cx="64" cy="64" r="14.5" fill="none" stroke="#F59E0B" stroke-width="3" />
          <circle cx="96" cy="64" r="14.5" fill="none" stroke="#F59E0B" stroke-width="3" />
          <line x1="78.5" y1="64" x2="81.5" y2="64" stroke="#F59E0B" stroke-width="3" />

          <!-- Beak -->
          <polygon
            :points="isSpeaking ? '73,72 87,72 80,86' : '74,72 86,72 80,82'"
            fill="#F59E0B"
            stroke="#B45309"
            stroke-width="2"
            stroke-linejoin="round"
          />

          <!-- Ranger Leaf Hat -->
          <path d="M50 38 Q80 20 110 38 Z" fill="#2D6A4F" />
          <ellipse cx="80" cy="38" rx="34" ry="6" fill="#40916C" />
        </svg>
      </div>
    </div>

    <!-- Animal Crossing Style Dialogue Card -->
    <div
      :class="cardClass"
      class="relative flex-1 w-full rounded-[28px] border-4 p-4 sm:p-5 shadow-[0_12px_28px_-10px_rgba(30,27,75,0.22)]"
    >
      <!-- Wooden Nameplate Pill -->
      <span
        class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500 text-amber-950 font-display font-bold text-xs sm:text-sm shadow-sm -mt-8 mb-2 border-2 border-white"
      >
        🦉 Don Plumas
      </span>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p class="text-base sm:text-lg font-bold leading-snug">
          {{ message }}
        </p>

        <button
          type="button"
          @click="readMessage"
          :aria-label="`Escuchar a Don Plumas: ${message}`"
          :class="
            isSpeaking
              ? 'bg-amber-400 text-amber-950 ring-4 ring-amber-200'
              : 'bg-valley-moss hover:bg-valley-leaf text-white'
          "
          class="ac-btn shrink-0 min-h-[52px] px-5 py-2.5 border-b-4 border-emerald-950 flex items-center justify-center gap-2 text-base"
        >
          <span aria-hidden="true">{{ isSpeaking ? '🔉' : '🔊' }}</span>
          <span>{{ isSpeaking ? 'Hablando' : 'Escuchar' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
