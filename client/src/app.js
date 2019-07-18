//@flow
import p5 from 'p5'
import 'p5/lib/addons/p5.dom'

import { createForm, FORM_FIELDS } from './form'
import ParticleManager from './ParticleManager'
import './styles.css'

const WIDTH = 600
const HEIGHT = 400

const UPDATE_RATE_IN_MILLISECONDS = 30

const sketch = p => {
  function renderBackgroundImage() {
    if (!backgroundImage) {
      return
    }

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

  function renderBackgroundText() {
    if (!backgroundText) {
      return
    }

    p.textAlign(p.CENTER, p.CENTER)
    p.textSize(50)
    p.text(backgroundText, WIDTH / 2, HEIGHT / 2)
  }

  function renderNoise() {
    const { offset } = particleManager
    noiseImage && p.image(noiseImage, offset.x - WIDTH, offset.y - HEIGHT)
  }

  function reloadNoiseImage() {
    p.loadImage(particleManager.noiseImage, img => {
      noiseImage = img
    })
  }

  let backgroundImage = null
  let backgroundText = null
  let noiseImage = null

  const particleManager = new ParticleManager(WIDTH, HEIGHT)
  setInterval(
    () => particleManager.updateOffsetInterval(),
    UPDATE_RATE_IN_MILLISECONDS,
  )
  reloadNoiseImage()

  p.setup = function() {
    createForm(p, (field, value) => {
      backgroundImage =
        field === FORM_FIELDS.BACKGROUND_IMAGE ? value : backgroundImage
      backgroundText =
        field === FORM_FIELDS.BACKGROUND_TEXT ? value : backgroundText
      particleManager.formUpdateCalback(field, value)
      reloadNoiseImage()
    })
    p.createCanvas(WIDTH, HEIGHT)
  }

  p.draw = function() {
    p.background(255)

    renderBackgroundImage()
    renderBackgroundText()
    renderNoise()
  }
}

new p5(sketch, document.getElementById('app'))
