import { expect } from 'chai'
import { UInt32 } from '../src'
import { forAllInRange } from './TestTools'

describe('UInt32', () => {

  // DON'T TEST JavaScript's rounding functionality. There may be undefined behavior
  // around (-0.000000001) and (2**32 - 1 + 0.000000001), but that's not our purview.

  const maxInvalid = -1
  const minValid   = 0
  const aboveMin   = 2
  const belowMax   = 2**32 - 3
  const maxValid   = 2**32 - 1
  const minInvalid = 2**32

  it ("doesn't alter valid integer values on construction", () => {
    forAllInRange(minValid, maxValid, (num: number) => {
      expect(new UInt32(num).toNumber()).to.equal(num)
    })
  })

  it ("truncates floating-point values on construction", () => {
    forAllInRange(minValid, maxValid, (num: number) => {
      expect(new UInt32(num).toNumber()).to.equal(Math.floor(num))
    }, false) // `num` will NOT be truncated to an integer by forAllInRange()
  })

  it ("throws an error with negative values on construction", () => {
    forAllInRange(Number.MIN_SAFE_INTEGER, maxInvalid, (num: number) => {
      expect(() => new UInt32(num)).to.throw()
    })
  })

  it ("throws an error with values larger than (2^32 - 1) on construction", () => {
    forAllInRange(minInvalid, Number.MAX_SAFE_INTEGER, (num: number) => {
      expect(() => new UInt32(num)).to.throw()
    })
  })

  it ("properly converts to and from a Number", () => {
    forAllInRange(minValid, maxValid, (num: number) => {
      expect(UInt32.fromNumber(num).toNumber()).to.equal(num)
    })
  })

  it ("properly converts to and from a UTF32Char", () => {
    forAllInRange(minValid, maxValid, (num: number) => {
      expect(new UInt32(num).toUTF32Char().toUInt32().toNumber()).to.equal(num)
    })
  })

  it ("properly converts to and from a String", () => {
    forAllInRange(minValid, maxValid, (num: number) => {
      let str = String.fromCharCode(num)
      expect(UInt32.fromString(str).toString()).to.equal(str)
    })
  })

  it ("can add or be added to any other number or UInt32, provided the sum is in range", () => {
    forAllInRange(minValid, belowMax, (num1: number) => {
      forAllInRange(minValid, maxValid - num1, (num2: number) => {

        let valueSum = num1 + num2
        expect(valueSum >= minValid)
        expect(valueSum <= maxValid)

        let uint1 = new UInt32(num1)
        let uint2 = new UInt32(num2)

        expect(uint1.plus(uint2).toNumber()).to.equal(valueSum)
        expect(uint1.plus(num2).toNumber()).to.equal(valueSum)
        expect(num1 + uint2.toNumber()).to.equal(valueSum)
      })
    })
  })

  it ("throws an error when plus() would yield a sum out of range", () => {
    forAllInRange(aboveMin, maxValid, (num1: number) => {
      forAllInRange(minInvalid - num1, maxValid, (num2: number) => {

        let valueSum = num1 + num2
        expect(valueSum > maxValid)

        let uint1 = new UInt32(num1)
        let uint2 = new UInt32(num2)

        expect(() => uint1.plus(uint2)).to.throw()
        expect(() => uint1.plus(num2)).to.throw()
      })
    })
  }).timeout(5000)

  it ("can subtract or be subtracted from any other number or UInt32, provided the difference is in range", () => {
    forAllInRange(minValid, maxValid, (num1: number) => {
      forAllInRange(minValid, maxValid, (num2: number) => {
        let v1 = Math.max(num1, num2)
        let v2 = Math.min(num1, num2)

        let valueDiff = v1 - v2
        expect(valueDiff >= minValid)
        expect(valueDiff <= maxValid)

        let uint1 = new UInt32(v1)
        let uint2 = new UInt32(v2)

        expect(uint1.minus(uint2).toNumber()).to.equal(valueDiff)
        expect(uint1.minus(v2).toNumber()).to.equal(valueDiff)
        expect(v1 - uint2.toNumber()).to.equal(valueDiff)
      })
    })
  })

  it ("throws an error when minus() would yield a difference out of range", () => {
    forAllInRange(minValid, belowMax, (num1: number) => {
      forAllInRange(minValid, belowMax, (num2: number) => {
        let v1 = Math.max(num1, num2) + 1
        let v2 = Math.min(num1, num2)

        let valueDiff = v2 - v1
        expect(valueDiff < minValid)

        let uint1 = new UInt32(v1)
        let uint2 = new UInt32(v2)

        expect(() => uint2.minus(uint1)).to.throw()
        expect(() => uint2.minus(v1)).to.throw()
      })
    })
  }).timeout(5000)

})