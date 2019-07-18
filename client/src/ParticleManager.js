//@flow
import { DEFAULT_FORM_VALUES, FORM_FIELDS } from './form'
import { updateNoise, updateOffset, type PointType } from './points'

export default class ParticleManager {
  width: number
  height: number
  noiseSize: number
  noiseDensity: number
  noiseSpeed: number
  noiseJitter: number
  running: boolean
  noiseParticles: PointType[]
  offset: PointType
  target: PointType
  noiseImage: string

  constructor(width: number, height: number) {
    this.width = width
    this.height = height

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
    const frameSize = this.width * this.height
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

    canvas.width = this.width
    canvas.height = this.height

    const ctx = canvas.getContext('2d')

    ctx.fillStyle = 'black'
    this.noiseParticles.forEach(particle => {
      const x = particle.x * this.width
      const y = particle.y * this.height

      ctx.beginPath()
      ctx.arc(x, y, this.noiseSize / 2, 0, 2 * Math.PI)
      ctx.fill()
    })

    this.noiseImage = canvas.toDataURL()
  }
}
