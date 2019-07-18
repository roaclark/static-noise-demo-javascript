//@flow
import p5 from 'p5'
import 'p5/lib/addons/p5.dom'

import { createForm, type FormInputType } from './form'
import { updateNoise, updateOffset, type PointType } from './points'
import './styles.css'

const WIDTH = 600
const HEIGHT = 400

const UPDATE_RATE_IN_MILLISECONDS = 30

const sketch = p => {
  let formData: FormInputType
  let noiseParticles: PointType[] = []
  let offset: PointType = { x: 0, y: 0 }
  let target: PointType = { x: 0, y: 0 }

  function updateOffsetInterval() {
    const { noiseSpeed, noiseJitter, running } = formData

    if (running) {
      ;({ offset, target } = updateOffset(
        offset,
        target,
        noiseSpeed,
        noiseJitter,
      ))
    }
  }

  p.setup = function() {
    const frameSize = WIDTH * HEIGHT
    formData = createForm(p, newData => {
      formData = Object.assign(formData, newData)
      if (newData.noiseDensity || newData.noiseSize) {
        noiseParticles = updateNoise(
          noiseParticles,
          formData.noiseDensity,
          formData.noiseSize,
          frameSize,
        )
      }
      setInterval(updateOffsetInterval, UPDATE_RATE_IN_MILLISECONDS)
      return formData
    })
    noiseParticles = updateNoise(
      noiseParticles,
      formData.noiseDensity,
      formData.noiseSize,
      frameSize,
    )
    p.createCanvas(
      WIDTH,
      HEIGHT,
      window.WebGLRenderingContext ? 'WEBGL' : 'P2D',
    )
  }

  p.draw = function() {
    p.background(255)

    const { noiseSize, backgroundImage, backgroundText } = formData

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
    noiseParticles.forEach(point => {
      const x = (point.x * WIDTH + offset.x) % WIDTH
      const y = (point.y * HEIGHT + offset.y) % HEIGHT
      p.circle(x, y, noiseSize)
    })
  }
}

new p5(sketch, document.getElementById('app'))
