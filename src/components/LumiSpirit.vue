<script setup>
import { computed } from 'vue'

const {
  state = 'healthy',
  poseId = 0,
  size = 'md',
  tucked = false,
} = defineProps({
  state: {
    type: String,
    default: 'healthy',
    validator: (v) => ['healthy', 'joyful', 'sleepy', 'danger', 'sleeping'].includes(v),
  },
  poseId: { type: Number, default: 0 },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['xs', 'sm', 'md', 'lg'].includes(v),
  },
  tucked: { type: Boolean, default: false },
})

const isLow = computed(() => state === 'sleepy' || state === 'danger')
const isSleeping = computed(() => state === 'sleeping' || poseId > 0)

const sizeClass = computed(() => {
  const sizes = {
    xs: 'w-14 h-14',
    sm: 'w-24 h-24',
    md: 'w-32 h-32 sm:w-40 sm:h-40',
    lg: 'w-44 h-44 sm:w-52 sm:h-52',
  }
  return sizes[size]
})

const bodyGradientId = computed(() => (isLow.value ? 'lumi-dim' : 'lumi-glow'))

const bodyTransform = computed(() => {
  if (poseId === 1) return 'rotate(180 100 102)'
  if (poseId === 4) return 'rotate(-16 100 102) translate(0 -10)'
  return ''
})
</script>

<template>
  <div :class="[sizeClass, isSleeping ? 'animate-float' : 'animate-float']" class="relative select-none">
    <svg viewBox="0 0 200 200" class="w-full h-full overflow-visible drop-shadow-xl" aria-hidden="true">
      <defs>
        <radialGradient id="lumi-glow" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#E0F2FE" />
          <stop offset="45%" stop-color="#38BDF8" />
          <stop offset="100%" stop-color="#6366F1" />
        </radialGradient>
        <radialGradient id="lumi-dim" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#E2E8F0" />
          <stop offset="55%" stop-color="#94A3B8" />
          <stop offset="100%" stop-color="#475569" />
        </radialGradient>
        <linearGradient id="aurora-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#34D399" stop-opacity="0.7" />
          <stop offset="50%" stop-color="#38BDF8" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#C084FC" stop-opacity="0.7" />
        </linearGradient>
      </defs>

      <!-- Aura Ring -->
      <circle
        cx="100"
        cy="104"
        r="74"
        :fill="isLow ? '#94A3B8' : '#38BDF8'"
        :opacity="isLow ? 0.16 : 0.28"
        class="transition-all duration-500"
      />

      <!-- Pose 5 Aurora Ribbon -->
      <path
        v-if="poseId === 5"
        d="M24 58 Q68 20 104 44 T176 42"
        fill="none"
        stroke="url(#aurora-grad)"
        stroke-width="14"
        stroke-linecap="round"
        class="animate-aurora"
      />

      <!-- Floating Sparkles when healthy/joyful -->
      <g v-if="!isLow">
        <path d="M36 48 l4 9 l9 4 l-9 4 l-4 9 l-4-9 l-9-4 l9-4 z" fill="#FDE68A" />
        <circle cx="164" cy="54" r="5" fill="#BAE6FD" />
        <circle cx="152" cy="152" r="4" fill="#FDE68A" />
      </g>

      <!-- Cloud Spirit Body Group -->
      <g :transform="bodyTransform" class="transition-transform duration-500">
        <!-- Soft cloud tail puffs -->
        <circle cx="52" cy="118" r="28" :fill="`url(#${bodyGradientId})`" />
        <circle cx="148" cy="118" r="28" :fill="`url(#${bodyGradientId})`" />
        <circle cx="68" cy="78" r="34" :fill="`url(#${bodyGradientId})`" />
        <circle cx="132" cy="78" r="34" :fill="`url(#${bodyGradientId})`" />
        <ellipse cx="100" cy="108" rx="60" ry="48" :fill="`url(#${bodyGradientId})`" />

        <!-- Little leaf sprout on Lumi's head (Animal Crossing touch) -->
        <path d="M100 58 Q102 36 118 32 Q118 52 100 58 Z" fill="#34D399" stroke="#065F46" stroke-width="2.5" />
        <path d="M100 58 Q88 40 78 44 Q82 58 100 58 Z" fill="#6EE7B7" stroke="#065F46" stroke-width="2.5" />

        <!-- Little feet -->
        <ellipse cx="76" cy="154" rx="11" ry="8" :fill="isLow ? '#64748B' : '#BAE6FD'" />
        <ellipse cx="124" cy="154" rx="11" ry="8" :fill="isLow ? '#64748B' : '#BAE6FD'" />

        <!-- Face Expressions -->
        <g v-if="isSleeping">
          <path d="M72 102 Q80 109 88 102" fill="none" stroke="#0F172A" stroke-width="4" stroke-linecap="round" />
          <path d="M112 102 Q120 109 128 102" fill="none" stroke="#0F172A" stroke-width="4" stroke-linecap="round" />
          <circle cx="100" cy="118" r="4.5" fill="#0F172A" />
        </g>
        <g v-else-if="state === 'joyful'">
          <path d="M72 103 Q80 93 88 103" fill="none" stroke="#0F172A" stroke-width="4.5" stroke-linecap="round" />
          <path d="M112 103 Q120 93 128 103" fill="none" stroke="#0F172A" stroke-width="4.5" stroke-linecap="round" />
          <path d="M90 114 Q100 128 110 114 Z" fill="#FB7185" stroke="#0F172A" stroke-width="2.5" />
        </g>
        <g v-else-if="state === 'danger'">
          <circle cx="80" cy="100" r="6.5" fill="#0F172A" />
          <circle cx="120" cy="100" r="6.5" fill="#0F172A" />
          <path d="M70 89 L88 94" stroke="#0F172A" stroke-width="3.5" stroke-linecap="round" />
          <path d="M130 89 L112 94" stroke="#0F172A" stroke-width="3.5" stroke-linecap="round" />
          <path d="M91 121 Q100 113 109 121" fill="none" stroke="#0F172A" stroke-width="3.5" stroke-linecap="round" />
        </g>
        <g v-else-if="state === 'sleepy'">
          <path d="M72 100 H88" stroke="#0F172A" stroke-width="4" stroke-linecap="round" />
          <path d="M112 100 H128" stroke="#0F172A" stroke-width="4" stroke-linecap="round" />
          <ellipse cx="100" cy="117" rx="5" ry="6" fill="#0F172A" />
        </g>
        <g v-else>
          <circle cx="80" cy="100" r="7" fill="#0F172A" />
          <circle cx="120" cy="100" r="7" fill="#0F172A" />
          <circle cx="82.5" cy="97.5" r="2.5" fill="#FFFFFF" />
          <circle cx="122.5" cy="97.5" r="2.5" fill="#FFFFFF" />
          <path d="M91 114 Q100 123 109 114" fill="none" stroke="#0F172A" stroke-width="3.8" stroke-linecap="round" />
        </g>

        <!-- Rosy cheeks -->
        <ellipse cx="64" cy="110" rx="7" ry="4.5" :fill="isLow ? '#94A3B8' : '#FDA4AF'" opacity="0.85" />
        <ellipse cx="136" cy="110" rx="7" ry="4.5" :fill="isLow ? '#94A3B8' : '#FDA4AF'" opacity="0.85" />
      </g>

      <!-- Pose 2: Dream bubble of golden apple -->
      <g v-if="poseId === 2">
        <circle cx="152" cy="48" r="22" fill="#FFFDF7" stroke="#BAE6FD" stroke-width="3" />
        <circle cx="130" cy="70" r="6" fill="#FFFDF7" />
        <circle cx="152" cy="50" r="10" fill="#EF4444" />
        <path d="M152 40 Q157 34 162 37" fill="none" stroke="#15803D" stroke-width="3" stroke-linecap="round" />
      </g>

      <!-- Pose 3: Hugging cute acorn plushie -->
      <g v-if="poseId === 3">
        <ellipse cx="126" cy="128" rx="16" ry="18" fill="#D97706" stroke="#78350F" stroke-width="2.5" />
        <path d="M110 120 Q126 104 142 120 Z" fill="#78350F" />
        <circle cx="121" cy="128" r="2" fill="#1E1B18" />
        <circle cx="131" cy="128" r="2" fill="#1E1B18" />
      </g>

      <!-- Cozy Leaf Blanket (for Level 4 tuck-in) -->
      <g v-if="tucked">
        <path
          d="M36 122 Q100 108 164 122 L156 164 Q100 174 44 164 Z"
          fill="#52B788"
          stroke="#1B4332"
          stroke-width="3.5"
        />
        <path d="M52 132 Q100 124 148 132" fill="none" stroke="#D8F3DC" stroke-width="4" stroke-linecap="round" />
        <circle cx="76" cy="148" r="4" fill="#FDE68A" />
        <circle cx="124" cy="146" r="4" fill="#FDE68A" />
      </g>

      <!-- Sleeping Zzz badge -->
      <text
        v-if="isSleeping"
        x="148"
        y="46"
        font-family="Fredoka, sans-serif"
        font-weight="700"
        font-size="22"
        fill="#FDE68A"
      >
        Zzz
      </text>
    </svg>
  </div>
</template>
