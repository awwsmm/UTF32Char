import * as fc from 'fast-check'

export function forAllInRange (minIncl: number, maxExcl: number, expectation: (_: number) => void, round: boolean = false) {
  fc.assert(
    fc.property(
      fc.double().map(x => {
        let delta = x * (maxExcl - minIncl)
        if (round) delta = Math.round(delta)
        return delta + minIncl
      }),
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