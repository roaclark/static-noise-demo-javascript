//@flow
import p5 from 'p5'
import 'p5/lib/addons/p5.dom'

import { createForm, type FormInputType, DEFAULT_PERCENT } from './form'
import { updateNoise, updateOffset, type PointType } from './points'
import './styles.css'

const WIDTH = 700
const HEIGHT = 500

const sketch = p => {
  let formData: FormInputType = {}
  let noiseParticles: PointType[] = []
  let offset: PointType = { x: 0, y: 0 }
  let target: PointType = { x: 0, y: 0 }

  p.setup = function() {
    noiseParticles = updateNoise(noiseParticles, DEFAULT_PERCENT)
    createForm(p, {}, newData => {
      if (newData.noiseDensity) {
        noiseParticles = updateNoise(noiseParticles, newData.noiseDensity)
      }
      return Object.assign(formData, newData)
    })
    p.createCanvas(WIDTH, HEIGHT)
  }

  p.draw = function() {
    p.background(255)

    const {
      noiseSize,
      noiseSpeed,
      noiseJitter,
      backgroundImage,
      backgroundText,
      running,
    } = formData

    if (backgroundImage) {
      const ratio = Math.max(
        backgroundImage.width / WIDTH,
        backgroundImage.height / HEIGHT,
        1,
      )
      const renderWidth = backgroundImage.width / ratio
      const renderHeight = backgroundImage.height / ratio
      p.image(
        backgroundImage,
        (WIDTH - renderWidth) / 2,
        (HEIGHT - renderHeight) / 2,
        renderWidth,
        renderHeight,
      )
    }

    if (backgroundText) {
      p.textAlign(p.CENTER, p.CENTER)
      p.textSize(50)
      p.text(backgroundText, WIDTH / 2, HEIGHT / 2)
    }

    const radius = noiseSize || DEFAULT_PERCENT
    p.fill(0)
    noiseParticles.forEach(point => {
      const x = (point.x * WIDTH + offset.x) % WIDTH
      const y = (point.y * HEIGHT + offset.y) % HEIGHT
      p.circle(x, y, radius)
    })

    if (running) {
      ;({ offset, target } = updateOffset(
        offset,
        target,
        noiseSpeed || DEFAULT_PERCENT,
        noiseJitter || DEFAULT_PERCENT,
      ))
    }
  }
}

new p5(sketch, document.getElementById('app'))
