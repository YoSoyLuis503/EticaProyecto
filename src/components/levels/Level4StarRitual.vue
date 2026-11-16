<script setup>
import { computed, ref, shallowRef } from 'vue'
import DonPlumasGuide from '../DonPlumasGuide.vue'
import LumiSpirit from '../LumiSpirit.vue'
import RewardCelebrationModal from '../RewardCelebrationModal.vue'
import { playSound } from '../../utils/sound'

const emit = defineEmits(['complete', 'next-level', 'go-map', 'open-album'])

const lampsOff = ref([false, false, false])
const isTucked = shallowRef(false)
const musicStars = shallowRef(0)
const starSelected = shallowRef(false)
const feedback = ref({ show: false, type: 'win', message: '' })

const TOTAL_STARS = 4

const allLampsOff = computed(() => lampsOff.value.every(Boolean))
const currentStep = computed(() => {
  if (!allLampsOff.value) return 1
  if (!isTucked.value) return 2
  return 3
})

const lumiState = computed(() => {
  if (musicStars.value >= TOTAL_STARS) return 'sleeping'
  if (isTucked.value) return 'sleepy'
  return 'sleepy'
})

const guideText = computed(() => {
  if (currentStep.value === 1) {
    return 'Paso 1: Lumi está agotado después de jugar. Toca las 3 lamparitas de la cabaña para apagarlas.'
  }
  if (currentStep.value === 2) {
    return 'Paso 2: ¡Qué calma! Ahora toca o arrastra la manta de hojas para arropar a Lumi en su camita.'
  }
  return `Paso 3: Toca o arrastra ${TOTAL_STARS - musicStars.value} estrellas hacia la Caja Musical para escuchar una melodía de sueño.`
})

function turnOffLamp(idx) {
  if (lampsOff.value[idx]) return
  const next = [...lampsOff.value]
  next[idx] = true
  lampsOff.value = next
  playSound('pop')
}

function tuckBlanket() {
  if (!allLampsOff.value) {
    feedback.value = {
      show: true,
      type: 'retry',
      message: 'Primero apaguemos las 3 lamparitas para que la cabaña quede oscurita y tranquila.',
    }
    return
  }
  if (isTucked.value) return
  isTucked.value = true
  playSound('shield')
}

function addStarToMusicBox() {
  if (currentStep.value < 3) {
    feedback.value = {
      show: true,
      type: 'retry',
      message: 'Arropa primero a Lumi con su manta de hojas antes de encender la caja musical.',
    }
    return
  }
  if (musicStars.value >= TOTAL_STARS) return

  playSound('music-box', musicStars.value)
  musicStars.value += 1
  starSelected.value = false

  if (musicStars.value >= TOTAL_STARS) {
    emit('complete', { levelId: 4, poseId: 4, stickerId: 4 })
    feedback.value = {
      show: true,
      type: 'win',
      message: '¡Dulces sueños, Lumi! Una rutina tranquila de luz baja, abrigo y música suave cuida nuestro derecho a descansar.',
    }
  }
}
</script>

<template>
  <section class="max-w-5xl mx-auto px-4 py-6 space-y-5 text-white">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl sm:text-4xl font-display font-bold text-amber-200">
          ✨ Nivel 4: El Ritual de las Estrellas
        </h1>
        <p class="text-sm sm:text-base font-bold text-indigo-200">
          Derecho a Descansar · Paso {{ currentStep }} de 3
        </p>
      </div>

      <div class="px-5 py-2.5 rounded-full bg-violet-600/90 border border-violet-300/40 font-display font-bold text-base shadow tabular-nums">
        {{
          currentStep === 1
            ? `💡 Luces: ${lampsOff.filter(Boolean).length}/3`
            : currentStep === 2
              ? '🍃 Falta arropar a Lumi'
              : `🎶 Estrellas: ${musicStars}/${TOTAL_STARS}`
        }}
      </div>
    </div>

    <DonPlumasGuide :message="guideText" night auto-speak compact />

    <!-- Cozy Dusk / Night Cabin Room -->
    <div
      :class="
        allLampsOff
          ? 'from-indigo-950 via-purple-950 to-slate-950 border-indigo-400/40'
          : 'from-amber-900/75 via-indigo-900 to-purple-950 border-amber-300/50'
      "
      class="rounded-[32px] border-4 bg-gradient-to-b p-5 sm:p-7 shadow-2xl space-y-6 transition-colors duration-700"
    >
      <!-- Step 1: 3 Cabin Lamps -->
      <div class="flex items-center justify-around gap-3">
        <button
          v-for="(isOff, idx) in lampsOff"
          :key="idx"
          type="button"
          @click="turnOffLamp(idx)"
          :aria-label="`Lámpara ${idx + 1}: ${isOff ? 'apagada' : 'encendida, tocar para apagar'}`"
          :class="
            isOff
              ? 'bg-indigo-900/60 border-indigo-500/30 text-indigo-300'
              : 'bg-amber-200 border-amber-400 text-amber-950 shadow-[0_0_28px_rgba(251,191,36,0.6)] hover:scale-105'
          "
          class="ac-btn px-5 py-3 min-h-[68px] border-4 flex flex-col items-center justify-center gap-0.5 transition-all"
        >
          <span class="text-3xl" aria-hidden="true">{{ isOff ? '🌙' : '💡' }}</span>
          <span class="text-xs font-display font-bold">
            {{ isOff ? 'Apagada' : 'Apagar' }}
          </span>
        </button>
      </div>

      <!-- Center: Lumi in Cozy Bed + Blanket Drop Zone -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
        <button
          type="button"
          @dragover.prevent
          @drop.prevent="tuckBlanket"
          @click="tuckBlanket"
          :class="
            currentStep === 2
              ? 'ring-4 ring-emerald-300/80 border-emerald-300/60 bg-indigo-900/60'
              : 'border-indigo-400/30 bg-indigo-900/40'
          "
          class="rounded-[28px] border-4 p-5 flex flex-col items-center justify-center gap-2 transition-all"
        >
          <LumiSpirit :state="lumiState" :tucked="isTucked" size="md" />
          <span class="px-4 py-1.5 rounded-full bg-indigo-950/90 text-sky-200 font-display font-bold text-sm">
            {{ isTucked ? '🍃 Lumi bien arropado' : '🛏️ Toca aquí para arropar a Lumi' }}
          </span>
        </button>

        <!-- Step 2 Blanket & Step 3 Music Box -->
        <div class="space-y-4">
          <!-- Blanket Card -->
          <button
            type="button"
            draggable="true"
            @click="tuckBlanket"
            :disabled="isTucked"
            :class="
              isTucked
                ? 'bg-emerald-900/50 border-emerald-400/40 text-emerald-200 opacity-75'
                : currentStep === 2
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 border-emerald-200 animate-pulse'
                  : 'bg-indigo-900/70 border-indigo-400/30 text-indigo-200'
            "
            class="w-full rounded-3xl border-4 p-4 flex items-center justify-between gap-3 shadow-lg transition-all"
          >
            <div class="flex items-center gap-3 text-left">
              <span class="text-4xl" aria-hidden="true">🍃</span>
              <div>
                <h2 class="font-display font-bold text-lg">Manta de Hojas Suave</h2>
                <p class="text-xs font-bold opacity-85">
                  {{ isTucked ? '✓ Ya abriga a Lumi' : 'Arrastra o toca para arropar' }}
                </p>
              </div>
            </div>
            <span class="text-2xl">{{ isTucked ? '✓' : '→' }}</span>
          </button>

          <!-- Music Box Drop Zone + Stars -->
          <div
            @dragover.prevent
            @drop.prevent="addStarToMusicBox"
            :class="currentStep === 3 ? 'border-amber-300/80 ring-4 ring-amber-300/30' : 'border-indigo-400/30'"
            class="rounded-3xl border-4 bg-indigo-950/85 p-4 space-y-3"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-3xl" aria-hidden="true">🎶</span>
                <div>
                  <h2 class="font-display font-bold text-lg text-amber-200">Caja Musical</h2>
                  <p class="text-xs text-indigo-200">Melodía de estrellas ({{ musicStars }}/{{ TOTAL_STARS }})</p>
                </div>
              </div>

              <button
                type="button"
                @click="addStarToMusicBox"
                class="ac-btn px-4 py-2.5 bg-amber-300 hover:bg-amber-200 text-amber-950 border-b-4 border-amber-500 text-sm"
              >
                ⭐ Poner Estrella
              </button>
            </div>

            <!-- Star Tokens to drag or tap -->
            <div class="flex items-center justify-center gap-3 pt-1">
              <button
                v-for="n in TOTAL_STARS"
                :key="n"
                type="button"
                draggable="true"
                @dragstart="starSelected = true"
                @click="addStarToMusicBox"
                :disabled="n <= musicStars"
                :class="
                  n <= musicStars
                    ? 'bg-amber-400 text-amber-950 scale-95 opacity-60'
                    : 'bg-indigo-800 hover:bg-violet-700 text-amber-200 hover:scale-110'
                "
                class="w-14 h-14 rounded-2xl border-2 border-amber-300/60 text-3xl flex items-center justify-center shadow transition-transform cursor-grab"
              >
                {{ n <= musicStars ? '✨' : '⭐' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <RewardCelebrationModal
      :show="feedback.show"
      :type="feedback.type"
      :message="feedback.message"
      :unlocked-pose-id="4"
      :unlocked-sticker-id="4"
      @close="feedback.show = false"
      @next-level="emit('next-level')"
      @go-map="emit('go-map')"
      @open-album="emit('open-album')"
    />
  </section>
</template>
