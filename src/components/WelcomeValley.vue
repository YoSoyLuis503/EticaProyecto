<script setup>
import { shallowRef } from 'vue'
import DonPlumasGuide from './DonPlumasGuide.vue'
import LumiSpirit from './LumiSpirit.vue'
import { VALLEY_LEVELS } from '../data/valleyData'
import { playSound } from '../utils/sound'

const emit = defineEmits(['start', 'open-album', 'open-cabin'])

const lumiPreviewState = shallowRef('healthy')

function toggleLumiPreview() {
  playSound('pop')
  lumiPreviewState.value = lumiPreviewState.value === 'healthy' ? 'sleepy' : 'healthy'
}
</script>

<template>
  <section class="max-w-5xl mx-auto px-4 py-5 sm:py-8 space-y-6">
    <!-- Hero Valley Card (Animal Crossing + Pokemon Sleep Blend) -->
    <div
      class="relative overflow-hidden rounded-[36px] border-4 border-[#DFD2B5] bg-gradient-to-b from-indigo-950 via-sky-900 to-emerald-800 text-white p-6 sm:p-10 shadow-2xl"
    >
      <!-- Ambient Stars & Fireflies -->
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="absolute top-6 left-10 w-3 h-3 rounded-full bg-amber-200 animate-pulse" />
        <div class="absolute top-12 right-16 w-4 h-4 rounded-full bg-sky-300 animate-pulse" />
        <div class="absolute bottom-8 left-1/4 w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse" />
        <!-- Rolling forest hills SVG -->
        <svg viewBox="0 0 800 140" class="absolute bottom-0 left-0 w-full h-24 opacity-45" preserveAspectRatio="none">
          <path d="M0 90 Q180 20 380 85 T800 70 L800 140 L0 140 Z" fill="#1B4332" />
          <path d="M0 110 Q250 55 520 105 T800 95 L800 140 L0 140 Z" fill="#2D6A4F" />
        </svg>
      </div>

      <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-3 text-center md:text-left max-w-xl">
          <span
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/20 border border-emerald-300/40 text-emerald-200 font-display font-bold text-sm"
          >
            🌿 Derecho a la Vida, Juego y Descanso
          </span>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight text-amber-100 drop-shadow">
            Guardianes del Valle Dormilón
          </h1>

          <p class="text-base sm:text-lg text-sky-100 font-semibold leading-relaxed">
            Cuida a <strong class="text-sky-300">Lumi</strong>, protege el bosque de los Traviesos del Ruido y ayúdalo a dormir feliz hasta el amanecer.
          </p>

          <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <button
              type="button"
              @click="playSound('correct'); emit('start')"
              class="ac-btn px-9 py-4 min-h-[64px] bg-gradient-to-b from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 text-amber-950 border-b-4 border-amber-600 text-xl sm:text-2xl"
            >
              🌿 Explorar el Valle
            </button>

            <button
              type="button"
              @click="playSound('pop'); emit('open-album')"
              class="ac-btn px-5 py-4 min-h-[60px] bg-indigo-900/80 hover:bg-indigo-800 text-sky-100 border-2 border-sky-300/40 text-base"
            >
              📖 Álbum de Sueños
            </button>

            <button
              type="button"
              @click="playSound('pop'); emit('open-cabin')"
              class="ac-btn px-5 py-4 min-h-[60px] bg-emerald-900/75 hover:bg-emerald-800 text-emerald-100 border-2 border-emerald-300/40 text-base"
            >
              🏡 Cabaña
            </button>
          </div>
        </div>

        <!-- Interactive Lumi State Preview -->
        <button
          type="button"
          @click="toggleLumiPreview"
          class="group flex flex-col items-center gap-2 p-4 rounded-3xl bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-sm transition-colors cursor-pointer"
          :aria-label="`Tocar a Lumi para ver su estado de energía. Estado actual: ${lumiPreviewState === 'healthy' ? 'azul brillante sano' : 'gris apagado con sueño'}`"
        >
          <LumiSpirit :state="lumiPreviewState" size="lg" />
          <span
            :class="lumiPreviewState === 'healthy' ? 'bg-sky-400 text-slate-950' : 'bg-slate-600 text-slate-100'"
            class="px-4 py-1.5 rounded-full font-display font-bold text-xs sm:text-sm shadow transition-colors"
          >
            {{
              lumiPreviewState === 'healthy'
                ? '✨ Lumi Sano y Brillante (Tócame)'
                : '🌫️ Lumi Apagado / Con Sueño (Tócame)'
            }}
          </span>
        </button>
      </div>
    </div>

    <!-- Don Plumas Narrated Welcome -->
    <DonPlumasGuide
      mood="wise"
      message="¡Hoo-hoo! Soy Don Plumas. En este valle los niños aprenden que protegerse, alimentarse, jugar y descansar son derechos mágicos. ¡Toca Explorar el Valle para comenzar!"
    />

    <!-- 5 Missions Preview Strip -->
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div
        v-for="lvl in VALLEY_LEVELS"
        :key="lvl.id"
        class="ac-parchment p-3 text-center flex flex-col items-center gap-1"
      >
        <span
          :class="lvl.badgeBg"
          class="w-9 h-9 rounded-full font-display font-bold text-base flex items-center justify-center"
        >
          {{ lvl.id }}
        </span>
        <h2 class="font-display font-bold text-sm text-valley-ink leading-tight">
          {{ lvl.title }}
        </h2>
        <span class="text-[11px] font-bold text-slate-500">{{ lvl.mechanic }}</span>
      </div>
    </div>
  </section>
</template>
