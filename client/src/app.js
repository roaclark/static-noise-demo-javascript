import p5 from 'p5'
import 'p5/lib/addons/p5.dom'

import './styles.css'

const sketch = p => {
  let img = null

  function handleFileUpload(file) {
    if (file.type === 'image') {
      img = p.loadImage(file.data)
    } else {
      img = null
    }
  }

  p.setup = function() {
    p.createFileInput(handleFileUpload)
    p.createCanvas(700, 410)
  }

  p.draw = function() {
    p.background(255)
    if (img) {
      p.image(img, 100, 100)
    }
  }
}

new p5(sketch, document.getElementById('app'))
