//@flow
const POINTS_PER_DENSITY_PERCENT = 10

export type PointType = { x: number, y: number }

export function updateNoise(noise: PointType[], density: number): PointType[] {
  const targetPointCount = POINTS_PER_DENSITY_PERCENT * density
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
  return offset
}
