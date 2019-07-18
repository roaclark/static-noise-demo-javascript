//@flow
import p5 from 'p5'
import 'p5/lib/addons/p5.dom'

import { createForm, type FormInputType } from './form'
import './styles.css'

const sketch = p => {
  let formData: FormInputType = {}

  p.setup = function() {
    createForm(p, {}, newData => {
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
