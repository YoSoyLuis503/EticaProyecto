<script setup>
import { computed, ref, shallowRef, watch } from 'vue'
import TopBar from './components/TopBar.vue'
import WelcomeScreen from './components/WelcomeScreen.vue'
import LevelMap from './components/LevelMap.vue'
import Level1Playtime from './components/levels/Level1Playtime.vue'
import Level2SharePark from './components/levels/Level2SharePark.vue'
import Level3Tiredness from './components/levels/Level3Tiredness.vue'
import Level4PajamaRoute from './components/levels/Level4PajamaRoute.vue'
import Level5StarDream from './components/levels/Level5StarDream.vue'
import { isMuted, playSound, stopSpeaking, toggleMute } from './utils/sound'

const STORAGE_KEY = 'campamento_suenos_v1'

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { levelStars: {}, demoUnlocked: false }
    const parsed = JSON.parse(raw)
    return {
      levelStars: parsed.levelStars || {},
      demoUnlocked: Boolean(parsed.demoUnlocked),
    }
  } catch {
    return { levelStars: {}, demoUnlocked: false }
  }
}

const saved = loadSavedState()
const currentScreen = shallowRef('welcome')
const levelStars = ref(saved.levelStars)
const demoUnlocked = shallowRef(saved.demoUnlocked)

const completedLevels = computed(() =>
  Object.keys(levelStars.value).map(Number),
)

const totalStars = computed(() =>
  Object.values(levelStars.value).reduce((sum, s) => sum + s, 0),
)

const LEVEL_COMPONENTS = {
  level1: Level1Playtime,
  level2: Level2SharePark,
  level3: Level3Tiredness,
  level4: Level4PajamaRoute,
  level5: Level5StarDream,
}

const activeLevelComponent = computed(() => LEVEL_COMPONENTS[currentScreen.value] || null)

const backgroundClass = computed(() => {
  if (currentScreen.value === 'level5') {
    return 'bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950'
  }
  if (currentScreen.value === 'level4') {
    return 'bg-gradient-to-b from-amber-100 via-violet-100 to-sky-100'
  }
  return 'bg-gradient-to-b from-sky-200 via-camp-sky to-amber-100'
})

function persistState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        levelStars: levelStars.value,
        demoUnlocked: demoUnlocked.value,
      }),
    )
  } catch {
    // Storage unavailable in private contexts; continue in memory
  }
}

watch([levelStars, demoUnlocked], persistState, { deep: true })

function goToScreen(screen) {
  stopSpeaking()
  currentScreen.value = screen
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleLevelComplete({ levelId, stars }) {
  const prev = levelStars.value[levelId] || 0
  levelStars.value = {
    ...levelStars.value,
    [levelId]: Math.max(prev, stars),
  }
}

function goToNextLevel() {
  const currentNum = Number(currentScreen.value.replace('level', ''))
  if (currentNum >= 1 && currentNum < 5) {
    goToScreen(`level${currentNum + 1}`)
    return
  }
  goToScreen('map')
}

function toggleDemoMode() {
  playSound('pop')
  demoUnlocked.value = !demoUnlocked.value
}

function resetProgress() {
  playSound('pop')
  levelStars.value = {}
  demoUnlocked.value = false
  goToScreen('map')
}
</script>

<template>
  <div :class="backgroundClass" class="min-h-screen flex flex-col transition-colors duration-700">
    <TopBar
      :current-screen="currentScreen"
      :stars="totalStars"
      :completed-levels="completedLevels"
      :is-muted="isMuted"
      :demo-unlocked="demoUnlocked"
      @go-home="goToScreen('welcome')"
      @go-map="goToScreen('map')"
      @toggle-mute="toggleMute"
      @unlock-all="toggleDemoMode"
      @reset-progress="resetProgress"
    />

    <main class="flex-1 w-full pb-12">
      <WelcomeScreen
        v-if="currentScreen === 'welcome'"
        @start="goToScreen('map')"
      />

      <LevelMap
        v-else-if="currentScreen === 'map'"
        :completed-levels="completedLevels"
        :level-stars="levelStars"
        :demo-unlocked="demoUnlocked"
        @select-level="goToScreen"
      />

      <component
        :is="activeLevelComponent"
        v-else-if="activeLevelComponent"
        :key="currentScreen"
        @complete="handleLevelComplete"
        @next-level="goToNextLevel"
        @go-map="goToScreen('map')"
      />
    </main>
  </div>
</template>
