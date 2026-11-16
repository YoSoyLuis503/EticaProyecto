<script setup>
import { computed, watch } from 'vue'
import { isSpeaking, playSound, speak } from '../utils/sound'

const {
  message,
  mood = 'happy',
  title = 'Dormi dice:',
  autoSpeak = false,
  compact = false,
  dark = false,
} = defineProps({
  message: { type: String, required: true },
  mood: {
    type: String,
    default: 'happy',
    validator: (v) => ['happy', 'excited', 'encouraging', 'tired', 'sleeping'].includes(v),
  },
  title: { type: String, default: 'Dormi dice:' },
  autoSpeak: { type: Boolean, default: false },
  compact: { type: Boolean, default: false },
  dark: { type: Boolean, default: false },
})

const moodTag = computed(() => {
  const tags = {
    happy: '✨ ¡Hola!',
    excited: '🎉 ¡Genial!',
    encouraging: '💛 ¡Tú puedes!',
    tired: '🥱 ¡Uf, qué cansancio!',
    sleeping: '💤 Zzz...',
  }
  return tags[mood]
})

const bubbleClass = computed(() =>
  dark
    ? 'bg-indigo-950/90 text-amber-50 border-indigo-400/60'
    : 'bg-white/95 text-slate-800 border-amber-300',
)

const avatarSizeClass = computed(() =>
  compact ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-32 h-32 sm:w-40 sm:h-40',
)

function readAloud() {
  playSound('pop')
  speak(message)
}

watch(
  () => message,
  (nextMsg) => {
    if (autoSpeak && nextMsg) speak(nextMsg)
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
    <!-- Dormi SVG Mascot: Osito Perezoso -->
    <div class="relative shrink-0 flex flex-col items-center">
      <div
        :class="[
          avatarSizeClass,
          mood === 'sleeping' ? 'animate-float' : 'animate-float',
        ]"
        class="relative select-none drop-shadow-xl"
        aria-hidden="true"
      >
        <svg viewBox="0 0 180 180" class="w-full h-full overflow-visible">
          <!-- Soft warm aura -->
          <circle cx="90" cy="94" r="76" fill="#FDE68A" opacity="0.35" />

          <!-- Ears -->
          <circle cx="42" cy="52" r="21" fill="#8D6E63" />
          <circle cx="42" cy="52" r="12" fill="#D7CCC8" />
          <circle cx="138" cy="52" r="21" fill="#8D6E63" />
          <circle cx="138" cy="52" r="12" fill="#D7CCC8" />

          <!-- Plump body -->
          <ellipse cx="90" cy="136" rx="52" ry="38" fill="#8D6E63" />
          <ellipse cx="90" cy="140" rx="34" ry="26" fill="#EFEBE9" />

          <!-- Camp Scarf / Bandana -->
          <path
            d="M50 112 Q90 132 130 112 L118 128 Q90 142 62 128 Z"
            fill="#F97316"
          />
          <circle cx="90" cy="127" r="7" fill="#FBBF24" />

          <!-- Paws -->
          <ellipse cx="44" cy="132" rx="14" ry="20" transform="rotate(-20 44 132)" fill="#795548" />
          <ellipse cx="136" cy="132" rx="14" ry="20" transform="rotate(20 136 132)" fill="#795548" />

          <!-- Head -->
          <ellipse cx="90" cy="78" rx="54" ry="46" fill="#A1887F" />
          <!-- Sloth creamy face mask -->
          <ellipse cx="90" cy="83" rx="44" ry="36" fill="#FFF8E7" />

          <!-- Sloth eye patches -->
          <ellipse cx="68" cy="76" rx="16" ry="13" transform="rotate(-14 68 76)" fill="#8D6E63" />
          <ellipse cx="112" cy="76" rx="16" ry="13" transform="rotate(14 112 76)" fill="#8D6E63" />

          <!-- Eyes by mood -->
          <g v-if="mood === 'sleeping' || mood === 'tired'">
            <path
              d="M58 77 Q68 84 78 77"
              fill="none"
              stroke="#2D1E18"
              stroke-width="4.5"
              stroke-linecap="round"
            />
            <path
              d="M102 77 Q112 84 122 77"
              fill="none"
              stroke="#2D1E18"
              stroke-width="4.5"
              stroke-linecap="round"
            />
          </g>
          <g v-else-if="mood === 'excited'">
            <path
              d="M59 78 Q68 68 77 78"
              fill="none"
              stroke="#2D1E18"
              stroke-width="4.5"
              stroke-linecap="round"
            />
            <path
              d="M103 78 Q112 68 121 78"
              fill="none"
              stroke="#2D1E18"
              stroke-width="4.5"
              stroke-linecap="round"
            />
          </g>
          <g v-else>
            <circle cx="68" cy="75" r="7.5" fill="#1E1B18" />
            <circle cx="112" cy="75" r="7.5" fill="#1E1B18" />
            <circle cx="70.5" cy="72" r="2.8" fill="#FFFFFF" />
            <circle cx="114.5" cy="72" r="2.8" fill="#FFFFFF" />
          </g>

          <!-- Rosy cheeks -->
          <ellipse cx="52" cy="91" rx="8" ry="5" fill="#FDA4AF" opacity="0.85" />
          <ellipse cx="128" cy="91" rx="8" ry="5" fill="#FDA4AF" opacity="0.85" />

          <!-- Cute button nose -->
          <ellipse cx="90" cy="87" rx="9" ry="6.5" fill="#4E342E" />
          <ellipse cx="88" cy="85" rx="3" ry="1.8" fill="#8D6E63" />

          <!-- Mouth by mood -->
          <path
            v-if="mood === 'excited'"
            d="M78 97 Q90 112 102 97 Z"
            fill="#F43F5E"
            stroke="#4E342E"
            stroke-width="3"
          />
          <ellipse
            v-else-if="mood === 'tired'"
            cx="90"
            cy="101"
            rx="6"
            ry="7"
            fill="#4E342E"
          />
          <path
            v-else-if="mood === 'sleeping'"
            d="M83 98 Q90 103 97 98"
            fill="none"
            stroke="#4E342E"
            stroke-width="3.5"
            stroke-linecap="round"
          />
          <path
            v-else
            d="M77 96 Q90 108 103 96"
            fill="none"
            stroke="#4E342E"
            stroke-width="4"
            stroke-linecap="round"
          />

          <!-- Cozy Nightcap when sleeping or tired -->
          <g v-if="mood === 'sleeping' || mood === 'tired'">
            <path d="M52 46 Q90 5 135 44 L128 54 Q90 42 52 54 Z" fill="#7C3AED" />
            <rect x="48" y="45" width="84" height="12" rx="6" fill="#FDE68A" />
            <circle cx="137" cy="44" r="9" fill="#FDE68A" />
          </g>
        </svg>
      </div>

      <span
        class="mt-1 px-3 py-1 rounded-full text-xs sm:text-sm font-display font-bold shadow-md bg-amber-200 text-amber-950 border-2 border-white"
      >
        {{ moodTag }}
      </span>
    </div>

    <!-- Speech Bubble + Tactile Speaker Button -->
    <div
      :class="bubbleClass"
      class="relative flex-1 w-full rounded-3xl border-4 p-4 sm:p-5 shadow-xl"
    >
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="space-y-1">
          <p
            :class="dark ? 'text-amber-300' : 'text-violet-700'"
            class="text-sm sm:text-base font-display font-bold"
          >
            {{ title }}
          </p>
          <p class="text-base sm:text-xl font-bold leading-snug">
            {{ message }}
          </p>
        </div>

        <button
          type="button"
          @click="readAloud"
          :aria-label="`Escuchar mensaje de Dormi: ${message}`"
          :class="
            isSpeaking
              ? 'bg-amber-400 text-purple-950 ring-4 ring-amber-200 scale-105'
              : 'bg-violet-600 hover:bg-violet-500 text-white'
          "
          class="btn-tactile shrink-0 min-h-[56px] px-5 py-3 flex items-center justify-center gap-2 text-base sm:text-lg border-b-4 border-violet-800"
        >
          <span class="text-2xl" aria-hidden="true">{{ isSpeaking ? '🔉' : '🔊' }}</span>
          <span>{{ isSpeaking ? 'Hablando...' : 'Escuchar' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
