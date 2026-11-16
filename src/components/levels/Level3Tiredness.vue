<script setup>
import { computed, ref, shallowRef } from 'vue'
import DormiMascot from '../DormiMascot.vue'
import FeedbackOverlay from '../FeedbackOverlay.vue'
import { playSound } from '../../utils/sound'

const emit = defineEmits(['complete', 'next-level', 'go-map'])

const ITEMS = [
  { id: 'water', label: 'Vaso de Agua', emoji: '🥛', calming: true, hint: '¡Qué fresca! Tomar agua hidrata nuestro cuerpo.' },
  { id: 'drum', label: 'Tambor Ruidoso', emoji: '🥁', calming: false, hint: 'El tambor hace mucho ruido cuando necesitamos calma.' },
  { id: 'pillow', label: 'Almohada Suave', emoji: '🛏️', calming: true, hint: '¡Súper suavecita para descansar la cabeza!' },
  { id: 'megaphone', label: 'Megáfono Gritón', emoji: '📢', calming: false, hint: '¡Bum, bum! Los gritos fuertes no dejan descansar a Dormi.' },
  { id: 'plush', label: 'Peluche Abrazable', emoji: '🧸', calming: true, hint: 'Un abrazo suave da mucha paz.' },
  { id: 'speaker', label: 'Bocina Gigante', emoji: '🎸', calming: false, hint: 'La música muy fuerte despierta mucho el cuerpo.' },
  { id: 'lullaby', label: 'Música Suave', emoji: '🎵', calming: true, hint: '¡Una melodía tranquila relaja el corazón!' },
]

const selectedCalmingIds = ref([])
const shakingId = shallowRef('')
const feedback = ref({ show: false, type: 'win', message: '' })

const totalCalming = ITEMS.filter((item) => item.calming).length
const calmPercent = computed(() => Math.round((selectedCalmingIds.value.length / totalCalming) * 100))

const dormiMessage = computed(() => {
  if (selectedCalmingIds.value.length === 0) {
    return 'Uf, corrí muchísimo y tengo las patitas cansadas. Toca las cosas que me ayudan a calmarme y descansar.'
  }
  if (selectedCalmingIds.value.length < totalCalming) {
    return `¡Mmm, qué rico se siente! Faltan ${totalCalming - selectedCalmingIds.value.length} cositas tranquilas más.`
  }
  return '¡Aaah! Ya me siento tranquilo y listo para dormir.'
})

function pickItem(item) {
  if (selectedCalmingIds.value.includes(item.id)) return

  if (item.calming) {
    playSound('correct')
    selectedCalmingIds.value = [...selectedCalmingIds.value, item.id]

    if (selectedCalmingIds.value.length === totalCalming) {
      emit('complete', { levelId: 3, stars: 3 })
      feedback.value = {
        show: true,
        type: 'win',
        message: '¡Excelente! Escuchar cuando nuestro cuerpo está cansado nos ayuda a cuidarnos y descansar bien.',
      }
    }
    return
  }

  shakingId.value = item.id
  setTimeout(() => {
    shakingId.value = ''
  }, 450)
  feedback.value = {
    show: true,
    type: 'retry',
    message: item.hint,
  }
}
</script>

<template>
  <section class="max-w-4xl mx-auto px-4 py-6 space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl sm:text-4xl font-display font-bold text-sky-900">
          🥛 Nivel 3: Reconociendo el Cansancio
        </h1>
        <p class="text-sm sm:text-base font-bold text-slate-700">
          Elige los {{ totalCalming }} objetos que ayudan a Dormi a calmarse
        </p>
      </div>

      <!-- Termómetro de Calma -->
      <div class="w-full sm:w-64 rounded-3xl bg-white/95 border-4 border-sky-200 p-3 shadow-lg">
        <div class="flex justify-between text-sm font-display font-bold text-sky-900 mb-1">
          <span>😌 Calma de Dormi</span>
          <span>{{ selectedCalmingIds.length }} / {{ totalCalming }}</span>
        </div>
        <div class="w-full h-4 bg-sky-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-500"
            :style="{ width: `${calmPercent}%` }"
          />
        </div>
      </div>
    </div>

    <DormiMascot
      :mood="selectedCalmingIds.length >= 2 ? 'happy' : 'tired'"
      :message="dormiMessage"
      auto-speak
    />

    <!-- Objects Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <button
        v-for="item in ITEMS"
        :key="item.id"
        type="button"
        @click="pickItem(item)"
        :class="[
          selectedCalmingIds.includes(item.id)
            ? 'bg-emerald-200 border-emerald-500 ring-4 ring-emerald-300 scale-[0.98]'
            : 'bg-white/95 hover:bg-sky-50 border-sky-200 hover:-translate-y-1',
          shakingId === item.id ? 'animate-shake-gentle border-rose-400 bg-rose-50' : '',
        ]"
        class="btn-tactile min-h-[150px] p-4 border-4 border-b-8 flex flex-col items-center justify-center gap-2 text-center relative"
      >
        <span
          v-if="selectedCalmingIds.includes(item.id)"
          class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shadow"
          aria-label="Seleccionado"
        >
          ✓
        </span>
        <span class="text-5xl sm:text-6xl" aria-hidden="true">{{ item.emoji }}</span>
        <span class="font-display font-bold text-base sm:text-lg text-slate-900 leading-tight">
          {{ item.label }}
        </span>
      </button>
    </div>

    <FeedbackOverlay
      :show="feedback.show"
      :type="feedback.type"
      :message="feedback.message"
      @close="feedback.show = false"
      @next-level="emit('next-level')"
      @go-map="emit('go-map')"
    />
  </section>
</template>
