//@flow
import p5 from 'p5'
import 'p5/lib/addons/p5.dom'

import { createForm, DEFAULT_FORM_VALUES, FORM_FIELDS } from './form'
import { updateNoise, updateOffset, type PointType } from './points'
import './styles.css'

const WIDTH = 600
const HEIGHT = 400

const UPDATE_RATE_IN_MILLISECONDS = 30

class ParticleManager {
  noiseSize: number
  noiseDensity: number
  noiseSpeed: number
  noiseJitter: number
  running: boolean
  noiseParticles: PointType[]
  offset: PointType
  target: PointType
  noiseImage: string

  constructor() {
    this.offset = { x: 0, y: 0 }
    this.target = { x: 0, y: 0 }

    const {
      noiseSize,
      noiseDensity,
      noiseSpeed,
      noiseJitter,
      running,
    } = DEFAULT_FORM_VALUES
    this.noiseSize = noiseSize
    this.noiseDensity = noiseDensity
    this.noiseSpeed = noiseSpeed
    this.noiseJitter = noiseJitter
    this.running = running

    this.updateNoise()
  }

  formUpdateCalback(field: string, value: *) {
    this.noiseSize = field === FORM_FIELDS.NOISE_SIZE ? value : this.noiseSize
    this.noiseDensity =
      field === FORM_FIELDS.NOISE_DENSITY ? value : this.noiseDensity
    this.noiseSpeed =
      field === FORM_FIELDS.NOISE_SPEED ? value : this.noiseSpeed
    this.noiseJitter =
      field === FORM_FIELDS.NOISE_JITTER ? value : this.noiseJitter
    this.running = field === FORM_FIELDS.RUNNING ? value : this.running

    if (field === FORM_FIELDS.NOISE_DENSITY || FORM_FIELDS.NOISE_SIZE) {
      this.updateNoise()
    }
  }

  updateOffsetInterval() {
    if (this.running) {
      const { offset, target } = updateOffset(
        this.offset,
        this.target,
        this.noiseSpeed,
        this.noiseJitter,
      )

      this.offset = offset
      this.target = target
    }
  }

  updateNoise() {
    const frameSize = WIDTH * HEIGHT
    this.noiseParticles = updateNoise(
      this.noiseParticles || [],
      this.noiseDensity,
      this.noiseSize,
      frameSize,
    )

    this.createNoiseImage()
  }

  createNoiseImage() {
    const canvas = document.createElement('canvas')

    canvas.width = WIDTH
    canvas.height = HEIGHT

    const ctx = canvas.getContext('2d')

    ctx.fillStyle = 'black'
    this.noiseParticles.forEach(particle => {
      const x = particle.x * WIDTH
      const y = particle.y * HEIGHT

      ctx.beginPath()
      ctx.arc(x, y, this.noiseSize / 2, 0, 2 * Math.PI)
      ctx.fill()
    })

    this.noiseImage = canvas.toDataURL()
  }
}

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
    noiseImage && p.image(noiseImage, offset.x, offset.y)
  }

  function reloadNoiseImage() {
    p.loadImage(particleManager.noiseImage, img => {
      noiseImage = img
    })
  }

  let backgroundImage = null
  let backgroundText = null
  let noiseImage = null

  const particleManager = new ParticleManager()
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
        field === FORM_FIELDS.BACKGROUND_IMAGE ? value : backgroundText
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
