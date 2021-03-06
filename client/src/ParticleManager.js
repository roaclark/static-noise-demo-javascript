//@flow
import { DEFAULT_FORM_VALUES, FORM_FIELDS } from './form'

type PointType = { x: number, y: number }

const DENSITY_FACTOR = 0.004
const MAX_JITTER_DISTANCE = 150

function moveToTarget(current, target, speed) {
  const xDiff = target.x - current.x
  const yDiff = target.y - current.y

  if (xDiff || yDiff) {
    const distanceRatio = Math.sqrt(speed ** 2 / (xDiff ** 2 + yDiff ** 2))
    return {
      x: current.x + distanceRatio * xDiff,
      y: current.y + distanceRatio * yDiff,
    }
  }

  return current
}

function withinDistance(current, target, distance) {
  const xDiff = target.x - current.x
  const yDiff = target.y - current.y

  return xDiff ** 2 + yDiff ** 2 < distance ** 2
}

function getNewTarget(current, center, distance) {
  const angle = Math.random() * Math.PI * 2
  return { x: distance * Math.cos(angle), y: distance * Math.sin(angle) }
}

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
      this.offset = moveToTarget(this.offset, this.target, this.noiseSpeed)
      if (withinDistance(this.offset, this.target, this.noiseSpeed)) {
        const center = { x: this.width / 2, y: this.height / 2 }
        this.target = getNewTarget(
          this.offset,
          center,
          MAX_JITTER_DISTANCE - this.noiseJitter,
        )
      }
    }
  }

  updateNoise() {
    const frameSize = this.width * this.height
    const noiseParticles = this.noiseParticles || []

    const noiseFactor = DENSITY_FACTOR * frameSize
    const targetPointCount = (noiseFactor * this.noiseDensity) / this.noiseSize

    const newNoise = noiseParticles.slice(0, targetPointCount)
    while (newNoise.length < targetPointCount) {
      newNoise.push({
        x: Math.random(),
        y: Math.random(),
      })
    }
    this.noiseParticles = newNoise

    this.createNoiseImage()
  }

  createNoiseImage() {
    const canvas = document.createElement('canvas')

    canvas.width = this.width * 3
    canvas.height = this.height * 3

    const ctx = canvas.getContext('2d')

    ctx.fillStyle = 'black'
    this.noiseParticles.forEach(particle => {
      const x = particle.x * this.width
      const y = particle.y * this.height

      ;[0, 1, 2].forEach(i => {
        ;[0, 1, 2].forEach(j => {
          ctx.beginPath()
          ctx.arc(
            x + i * this.width,
            y + j * this.height,
            this.noiseSize / 2,
            0,
            2 * Math.PI,
          )
          ctx.fill()
        })
      })
    })

    this.noiseImage = canvas.toDataURL()
  }
}
