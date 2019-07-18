//@flow
const POINTS_PER_DENSITY_PERCENT = 10

export type PointsType = { x: number, y: number }[]

export function updateNoise(noise: PointsType, density: number): PointsType {
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
