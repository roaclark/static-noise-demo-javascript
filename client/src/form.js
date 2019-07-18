//@flow

export type FormInputType = {
  noiseDensity?: number,
  noiseSize?: number,
  noiseSpeed?: number,
  noiseJitter?: number,
  backgroundImage?: ?{ width: number, height: number },
  backgroundText?: ?string,
  running?: boolean,
}

export const DEFAULT_PERCENT = 25
const MIN_PERCENT = 0
const MAX_PERCENT = 100
const START_TEXT = 'Start'
const STOP_TEXT = 'Stop'

export function createForm(
  p: *,
  defaultValues: FormInputType,
  callback: FormInputType => mixed,
) {
  function handleFileUpload(file) {
    if (file.type === 'image') {
      const img = p.loadImage(file.data)
      callback({ backgroundImage: img })
    } else {
      callback({ backgroundImage: null })
    }
  }

  function attachValueCallback(slider, fieldName, isNumber) {
    let sliderVal = slider.value

    function updateValue(e) {
      const rawVal = e.target.value
      const newVal = isNumber ? parseInt(rawVal, 10) : rawVal
      if (newVal !== sliderVal) callback({ [fieldName]: newVal })
      sliderVal = newVal
    }

    slider.elt.addEventListener('input', updateValue)
    slider.elt.addEventListener('change', updateValue)
  }

  function withLabel(fieldName, label, createElement) {
    const labelElement = p.createElement('label', label)
    const inputElement = createElement()
    inputElement.id(fieldName)
    labelElement.attribute('for', fieldName)
  }

  function createSlider(fieldName: string, label: string) {
    withLabel(fieldName, label, () => {
      const slider = p.createSlider(
        MIN_PERCENT,
        MAX_PERCENT,
        defaultValues[fieldName] || DEFAULT_PERCENT,
      )
      attachValueCallback(slider, fieldName, true)
      return slider
    })
  }

  function createTextInput(fieldName: string, label: string) {
    withLabel(fieldName, label, () => {
      const input = p.createInput('')
      attachValueCallback(input, fieldName)
      return input
    })
  }

  function createFileInput(fieldName: string, label: string) {
    withLabel(fieldName, label, () => {
      return p.createFileInput(handleFileUpload)
    })
  }

  function createStartButton() {
    let running = defaultValues.running || false
    const button = p.createButton(running ? STOP_TEXT : START_TEXT)
    button.mousePressed(() => {
      running = !running
      button.html(running ? STOP_TEXT : START_TEXT)
      callback({ running })
    })
  }

  createSlider('noiseDensity', 'Noise Density')
  p.createElement('br')
  createSlider('noiseSpeed', 'Noise Speed')
  p.createElement('br')
  createSlider('noiseSize', 'Noise Size')
  p.createElement('br')
  createSlider('noiseJitter', 'Noise Jitter')
  p.createElement('br')
  createTextInput('backgroundText', 'Background text')
  p.createElement('br')
  createFileInput('backgroundImg', 'Background image')
  p.createElement('br')
  createStartButton()
  p.createElement('br')
}
