//@flow
import p5 from 'p5'
import 'p5/lib/addons/p5.dom'

import { createForm, type FormInputType, DEFAULT_PERCENT } from './form'
import { updateNoise, type PointsType } from './points'
import './styles.css'

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
    p.createCanvas(700, 410)
  }

  p.draw = function() {
    p.background(255)
    const { backgroundImage } = formData
    if (backgroundImage) {
      p.image(backgroundImage, 0, 0)
    }
  }
}

new p5(sketch, document.getElementById('app'))
