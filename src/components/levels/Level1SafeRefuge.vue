<script setup>
import { computed, ref } from 'vue'
import DonPlumasGuide from '../DonPlumasGuide.vue'
import LumiSpirit from '../LumiSpirit.vue'
import RewardCelebrationModal from '../RewardCelebrationModal.vue'
import { playSound } from '../../utils/sound'

const emit = defineEmits(['complete', 'next-level', 'go-map', 'open-album'])

const hazards = ref([
  { id: 'plug', label: 'Enchufe sin tapa', icon: '⚡', covered: false, tip: '¡Cuidado! La electricidad lastima a Lumi.' },
  { id: 'puddle', label: 'Charco profundo', icon: '🌊', covered: false, tip: 'Un charco hondo es resbaloso y peligroso.' },
  { id: 'fire', label: 'Fogata abierta', icon: '🔥', covered: false, tip: 'El fuego quema si nos acercamos sin protección.' },
  { id: 'glass', label: 'Vidrios rotos', icon: '🔺', covered: false, tip: 'Las puntas filosas lastiman las patitas de Lumi.' },
])

const shieldArmed = ref(true)
const feedback = ref({ show: false, type: 'win', message: '' })

const protectedCount = computed(() => hazards.value.filter((h) => h.covered).length)
const allProtected = computed(() => protectedCount.value === hazards.value.length)
const lumiState = computed(() => (allProtected.value ? 'healthy' : 'danger'))

const guideText = computed(() => {
  if (allProtected.value) {
    return '¡El jardín ya es un refugio seguro y Lumi volvió a brillar azul! Toca su casita para llevarlo a salvo.'
  }
  return `Los Traviesos dejaron ${hazards.value.length - protectedCount.value} peligros en el camino. Arrastra o toca los Escudos Protectores sobre cada peligro.`
})

function onDragShieldStart(event) {
  shieldArmed.value = true
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', 'shield')
    event.dataTransfer.effectAllowed = 'copy'
  }
}

function protectHazard(hazard) {
  if (hazard.covered) return
  if (!shieldArmed.value) {
    feedback.value = {
      show: true,
      type: 'retry',
      message: `${hazard.tip} Toma primero un Escudo Protector 🛡️ para cubrirlo.`,
    }
    return
  }
  hazard.covered = true
  playSound('shield')
}

function finishLevel() {
  if (!allProtected.value) {
    feedback.value = {
      show: true,
      type: 'retry',
      message: 'Aún quedan peligros en el jardín. Cubre los 4 peligros con escudos antes de que Lumi camine.',
    }
    return
  }

  emit('complete', { levelId: 1, poseId: 1, stickerId: 1 })
  feedback.value = {
    show: true,
    type: 'win',
    message: '¡Protegiste la vida y seguridad de Lumi! Un entorno seguro permite crecer y descansar sin miedo.',
  }
}
</script>

<template>
  <section class="max-w-5xl mx-auto px-4 py-6 space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl sm:text-4xl font-display font-bold text-valley-moss">
          🛡️ Nivel 1: El Refugio Seguro
        </h1>
        <p class="text-sm sm:text-base font-bold text-slate-600">
          Derecho a la Vida (Protección Física) · Cubre los 4 peligros del jardín
        </p>
      </div>

      <div class="px-5 py-2.5 rounded-full bg-emerald-600 text-white font-display font-bold text-base shadow tabular-nums">
        Escudos: {{ protectedCount }} / {{ hazards.length }}
      </div>
    </div>

    <DonPlumasGuide :message="guideText" auto-speak compact />

    <!-- Garden Stage: Lumi + Hazards + Home -->
    <div class="ac-parchment p-5 sm:p-6 bg-gradient-to-b from-emerald-50 via-valley-parchment to-lime-100/70 space-y-5">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 rounded-3xl p-4 border-2 border-emerald-200">
        <div class="flex items-center gap-3">
          <LumiSpirit :state="lumiState" size="sm" />
          <div>
            <p class="font-display font-bold text-lg text-valley-ink">
              {{ allProtected ? '✨ Lumi está seguro y brillante' : '🌫️ Lumi está asustado y gris' }}
            </p>
            <p class="text-xs sm:text-sm font-semibold text-slate-600">
              {{ allProtected ? '¡Camino libre hasta la cabaña!' : 'Quita el peligro cubriéndolo con escudos.' }}
            </p>
          </div>
        </div>

        <!-- Draggable / Toggleable Shield Tool -->
        <button
          type="button"
          draggable="true"
          @dragstart="onDragShieldStart"
          @click="shieldArmed = !shieldArmed; playSound('pop')"
          :class="shieldArmed ? 'bg-sky-500 text-white ring-4 ring-sky-200 border-sky-800' : 'bg-slate-200 text-slate-700 border-slate-400'"
          class="ac-btn px-5 py-3 min-h-[56px] border-b-4 text-base flex items-center gap-2 cursor-grab active:cursor-grabbing"
        >
          <span class="text-2xl" aria-hidden="true">🛡️</span>
          <span>{{ shieldArmed ? 'Escudo Listo (Toca o Arrastra)' : 'Tomar Escudo 🛡️' }}</span>
        </button>
      </div>

      <!-- 4 Hazards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          v-for="hazard in hazards"
          :key="hazard.id"
          type="button"
          @dragover.prevent
          @drop.prevent="protectHazard(hazard)"
          @click="protectHazard(hazard)"
          :class="
            hazard.covered
              ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
              : 'bg-rose-50 hover:bg-rose-100 border-rose-300 text-rose-950 hover:-translate-y-1'
          "
          class="rounded-3xl border-4 border-b-8 p-5 min-h-[155px] flex flex-col items-center justify-center gap-2 text-center shadow-lg transition-all"
        >
          <div class="relative text-5xl" aria-hidden="true">
            <span>{{ hazard.covered ? '🛡️' : hazard.icon }}</span>
          </div>
          <span class="font-display font-bold text-lg leading-tight">
            {{ hazard.covered ? '¡Zona Segura!' : hazard.label }}
          </span>
          <span class="text-xs font-bold opacity-80">
            {{ hazard.covered ? `(${hazard.label} cubierto)` : 'Toca o suelta escudo aquí' }}
          </span>
        </button>
      </div>

      <!-- Safe Home Arrival Action -->
      <div class="flex justify-center pt-1">
        <button
          type="button"
          @click="finishLevel"
          :class="
            allProtected
              ? 'bg-gradient-to-b from-emerald-500 to-valley-moss text-white border-emerald-900 scale-105'
              : 'bg-slate-200 text-slate-500 border-slate-400'
          "
          class="ac-btn px-10 py-4 min-h-[64px] border-b-4 text-xl flex items-center gap-3 transition-all"
        >
          <span class="text-2xl" aria-hidden="true">🏡</span>
          <span>{{ allProtected ? '¡Llevar a Lumi a su Casa!' : 'Primero protege los 4 peligros' }}</span>
        </button>
      </div>
    </div>

    <RewardCelebrationModal
      :show="feedback.show"
      :type="feedback.type"
      :message="feedback.message"
      :unlocked-pose-id="1"
      :unlocked-sticker-id="1"
      @close="feedback.show = false"
      @next-level="emit('next-level')"
      @go-map="emit('go-map')"
      @open-album="emit('open-album')"
    />
  </section>
</template>
