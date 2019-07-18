//@flow
const DENSITY_FACTOR = 0.004

export type PointType = { x: number, y: number }

export function updateNoise(
  noise: PointType[],
  noiseDensity: number,
  noiseSize: number,
  frameSize: number,
): PointType[] {
  const noiseFactor = DENSITY_FACTOR * frameSize
  const targetPointCount = (noiseFactor * noiseDensity) / noiseSize
  const resultNoise = noise.slice(0, targetPointCount)
  while (resultNoise.length < targetPointCount) {
    resultNoise.push({
      x: Math.random(),
      y: Math.random(),
    })
  }
  return resultNoise
}

export function updateOffset(
  offset: PointType,
  target: PointType,
  noiseSpeed: number,
  noiseJitter: number,
) {
  const newOffset = { x: offset.x + 1, y: offset.y + 1 }
  return { offset: newOffset, target }
}
