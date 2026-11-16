<script setup>
const { stickerId, sizeClass = 'w-16 h-16' } = defineProps({
  stickerId: { type: Number, required: true },
  sizeClass: { type: String, default: 'w-16 h-16' },
})
</script>

<template>
  <svg :class="sizeClass" viewBox="0 0 80 80" class="overflow-visible drop-shadow-md" aria-hidden="true">
    <!-- 1: Farolito Seguro -->
    <g v-if="stickerId === 1">
      <path d="M28 18 H52" stroke="#78350F" stroke-width="5" stroke-linecap="round" />
      <rect x="24" y="22" width="32" height="38" rx="10" fill="#FEF3C7" stroke="#92400E" stroke-width="4" />
      <circle cx="40" cy="41" r="10" fill="#FBBF24" />
      <path d="M22 60 H58" stroke="#78350F" stroke-width="5" stroke-linecap="round" />
    </g>

    <!-- 2: Cesta de Frutas -->
    <g v-else-if="stickerId === 2">
      <circle cx="32" cy="30" r="11" fill="#EF4444" />
      <circle cx="48" cy="32" r="10" fill="#F59E0B" />
      <path d="M32 19 Q37 12 42 16" fill="none" stroke="#15803D" stroke-width="3" stroke-linecap="round" />
      <path d="M16 38 H64 L56 64 H24 Z" fill="#D97706" stroke="#78350F" stroke-width="3.5" stroke-linejoin="round" />
      <path d="M22 48 H58" stroke="#92400E" stroke-width="3" />
    </g>

    <!-- 3: Banderín de Juego -->
    <g v-else-if="stickerId === 3">
      <path d="M10 22 Q40 34 70 22" fill="none" stroke="#78350F" stroke-width="3.5" stroke-linecap="round" />
      <polygon points="16,24 30,27 22,46" fill="#38BDF8" stroke="#0369A1" stroke-width="2" />
      <polygon points="34,27 48,27 41,47" fill="#FBBF24" stroke="#B45309" stroke-width="2" />
      <polygon points="52,27 66,24 60,46" fill="#34D399" stroke="#047857" stroke-width="2" />
    </g>

    <!-- 4: Caja Musical -->
    <g v-else-if="stickerId === 4">
      <rect x="18" y="34" width="44" height="30" rx="8" fill="#8B5CF6" stroke="#4C1D95" stroke-width="3.5" />
      <path d="M18 34 L40 16 L62 34 Z" fill="#C4B5FD" stroke="#4C1D95" stroke-width="3.5" stroke-linejoin="round" />
      <path d="M40 40 L42 46 L48 46 L43 50 L45 56 L40 52 L35 56 L37 50 L32 46 L38 46 Z" fill="#FDE68A" />
    </g>

    <!-- 5: Corona Estelar -->
    <g v-else>
      <path
        d="M14 54 L20 26 L33 40 L40 18 L47 40 L60 26 L66 54 Z"
        fill="#FBBF24"
        stroke="#92400E"
        stroke-width="3.5"
        stroke-linejoin="round"
      />
      <circle cx="40" cy="44" r="5" fill="#38BDF8" />
      <circle cx="24" cy="46" r="3.5" fill="#34D399" />
      <circle cx="56" cy="46" r="3.5" fill="#A78BFA" />
    </g>
  </svg>
</template>
