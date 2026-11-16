import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { CAMP_LEVELS } from '../src/data/levels.js'

assert.equal(CAMP_LEVELS.length, 5, 'Debe haber exactamente 5 niveles en el campamento')

CAMP_LEVELS.forEach((level, idx) => {
  assert.equal(level.id, idx + 1, `Nivel ${idx + 1} debe tener id secuencial`)
  assert.equal(level.screen, `level${idx + 1}`, `Pantalla esperada: level${idx + 1}`)
  assert.ok(level.title.length > 0, `Nivel ${level.id} requiere título`)
  assert.ok(level.badge.length > 0, `Nivel ${level.id} requiere emoji o insignia`)
})

const requiredFiles = [
  'src/App.vue',
  'src/utils/sound.js',
  'src/components/DormiMascot.vue',
  'src/components/TopBar.vue',
  'src/components/FeedbackOverlay.vue',
  'src/components/WelcomeScreen.vue',
  'src/components/LevelMap.vue',
  'src/components/levels/Level1Playtime.vue',
  'src/components/levels/Level2SharePark.vue',
  'src/components/levels/Level3Tiredness.vue',
  'src/components/levels/Level4PajamaRoute.vue',
  'src/components/levels/Level5StarDream.vue',
]

for (const file of requiredFiles) {
  assert.ok(fs.existsSync(path.resolve(file)), `Falta el archivo requerido: ${file}`)
}

const viteCfg = fs.readFileSync(path.resolve('vite.config.js'), 'utf8')
assert.ok(viteCfg.includes("'/EticaProyecto/'"), 'vite.config.js debe configurar base /EticaProyecto/')

console.log('✓ Self-check passed: 5 niveles y todos los componentes verificados.')
