<script setup>
import DormiMascot from './DormiMascot.vue'
import { CAMP_LEVELS } from '../data/levels'
import { playSound } from '../utils/sound'

const emit = defineEmits(['start'])

function handleStart() {
  playSound('correct')
  emit('start')
}
</script>

<template>
  <section class="relative max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center gap-4 sm:gap-5">
    <!-- Decorative Camp Sky Elements -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden="true">
      <div class="absolute top-20 left-8 w-24 h-24 rounded-full bg-amber-200/80 blur-sm animate-float" />
      <div class="absolute top-28 right-10 text-6xl opacity-75 animate-float">☁️</div>
      <div class="absolute bottom-12 left-6 text-5xl opacity-70">🌲</div>
      <div class="absolute bottom-10 right-8 text-5xl opacity-70">🏕️</div>
    </div>

    <!-- Animated Stellar Emblem & Game Title -->
    <div class="text-center space-y-3">
      <div
        class="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-orange-500 text-white shadow-xl border-4 border-white animate-pop"
      >
        <span class="text-3xl sm:text-4xl animate-wiggle" aria-hidden="true">🌟</span>
        <span class="font-display font-bold text-base sm:text-lg tracking-wide">
          Derecho a Jugar y Descansar
        </span>
        <span class="text-3xl sm:text-4xl animate-wiggle" aria-hidden="true">⛺</span>
      </div>

      <h1
        class="text-4xl sm:text-6xl font-display font-bold text-violet-900 leading-tight drop-shadow-sm"
      >
        El Campamento de los Sueños
      </h1>
    </div>

    <!-- Dormi Welcome Guide -->
    <div class="w-full card-kid p-5 sm:p-7 bg-gradient-to-br from-amber-50 via-white to-sky-50">
      <DormiMascot
        mood="happy"
        title="¡Bienvenido al campamento!"
        message="¡Hola! Soy Dormi. Hoy vamos a jugar, compartir con amigos y aprender a descansar felices. ¿Listo para la aventura?"
      />
    </div>

    <!-- Giant Tactile Play Button -->
    <button
      type="button"
      @click="handleStart"
      class="btn-tactile w-full sm:w-auto min-w-[280px] min-h-[82px] px-12 py-5 bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-white border-b-8 border-orange-700 text-3xl sm:text-4xl flex items-center justify-center gap-4 shadow-2xl"
    >
      <span class="text-4xl sm:text-5xl" aria-hidden="true">▶️</span>
      <span>¡JUGAR!</span>
    </button>

    <!-- Visual Route Preview Pills -->
    <div class="w-full grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
      <div
        v-for="lvl in CAMP_LEVELS"
        :key="lvl.id"
        class="rounded-3xl bg-white/85 border-2 border-white shadow-md p-3 flex flex-col items-center text-center gap-1"
      >
        <span class="text-3xl" aria-hidden="true">{{ lvl.badge }}</span>
        <span class="font-display font-bold text-xs sm:text-sm text-slate-800">
          {{ lvl.id }}. {{ lvl.shortTitle }}
        </span>
      </div>
    </div>
  </section>
</template>
