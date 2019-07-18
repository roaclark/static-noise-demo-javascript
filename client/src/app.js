//@flow
import p5 from 'p5'
import 'p5/lib/addons/p5.dom'

import { createForm, DEFAULT_FORM_VALUES, type FormInputType } from './form'
import { updateNoise, updateOffset, type PointType } from './points'
import './styles.css'

const WIDTH = 600
const HEIGHT = 400

const UPDATE_RATE_IN_MILLISECONDS = 30

class ParticleManager {
  formData: FormInputType
  noiseParticles: PointType[]
  offset: PointType
  target: PointType

  constructor() {
    this.offset = { x: 0, y: 0 }
    this.target = { x: 0, y: 0 }

    const frameSize = WIDTH * HEIGHT
    this.formData = DEFAULT_FORM_VALUES

    this.noiseParticles = updateNoise(
      [],
      this.formData.noiseDensity,
      this.formData.noiseSize,
      frameSize,
    )
  }

  formUpdateCalback(newData) {
    this.formData = Object.assign(this.formData, newData)
    if (newData.noiseDensity || newData.noiseSize) {
      const frameSize = WIDTH * HEIGHT
      this.noiseParticles = updateNoise(
        this.noiseParticles,
        this.formData.noiseDensity,
        this.formData.noiseSize,
        frameSize,
      )
    }
  }

  updateOffsetInterval() {
    const { noiseSpeed, noiseJitter, running } = this.formData

    if (running) {
      const { offset, target } = updateOffset(
        this.offset,
        this.target,
        noiseSpeed,
        noiseJitter,
      )

      this.offset = offset
      this.target = target
    }
  }
}

const sketch = p => {
  const particleManager = new ParticleManager()
  setInterval(
    () => particleManager.updateOffsetInterval(),
    UPDATE_RATE_IN_MILLISECONDS,
  )

  p.setup = function() {
    createForm(p, newData => particleManager.formUpdateCalback(newData))
    p.createCanvas(WIDTH, HEIGHT)
  }

  p.draw = function() {
    p.background(255)

    const {
      noiseSize,
      backgroundImage,
      backgroundText,
    } = particleManager.formData

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

    p.fill(0)
    particleManager.noiseParticles.forEach(point => {
      const x = (point.x * WIDTH + particleManager.offset.x) % WIDTH
      const y = (point.y * HEIGHT + particleManager.offset.y) % HEIGHT
      p.circle(x, y, noiseSize)
    })
  }
}

new p5(sketch, document.getElementById('app'))
