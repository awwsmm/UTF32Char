import * as fc from 'fast-check'

function checkRange (value: number, minIncl: number, maxExcl: number, truncate: boolean, eps: number): number {
  if (Math.abs(minIncl - maxExcl) < eps)
    throw new Error(`min (${minIncl}) and max (${maxExcl}) are too close, this may result in undefined behavior`)

  let result = value * (maxExcl - minIncl) + minIncl
  if (truncate) result = Math.floor(result)
  return result
}

export function forAllInRange (
  minIncl: number, maxExcl: number,
  expectation: (x: number) => void,
  truncate: boolean = true, eps: number = 0.00001) {

  fc.assert(
    fc.property(
      fc.double().map(x => checkRange(x, minIncl, maxExcl, truncate, eps)),
      value => { expectation(value) }
    )
  )
}

export function forAllStrings (expectation: (_: string) => void, minLength: number = 0, maxLength: number = 100) {
  fc.assert(
    fc.property(
      fc.unicodeString(Math.max(0, Math.round(minLength)), Math.round(maxLength)),
      str => { expectation(str) }
    )
  )
}