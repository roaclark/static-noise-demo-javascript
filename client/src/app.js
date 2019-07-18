//@flow
import p5 from 'p5'
import 'p5/lib/addons/p5.dom'

import { createForm, type FormInputType, DEFAULT_PERCENT } from './form'
import { updateNoise, type PointsType } from './points'
import './styles.css'

const WIDTH = 700
const HEIGHT = 500

const sketch = p => {
  let formData: FormInputType = {}
  let noiseParticles: PointsType = new Set()

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

    const { backgroundImage, backgroundText } = formData

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
  }
}

new p5(sketch, document.getElementById('app'))
