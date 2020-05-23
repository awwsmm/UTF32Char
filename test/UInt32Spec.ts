import { expect } from 'chai'
import { UInt32 } from '../src'
import { forAllInRange } from './TestTools'

describe('UInt32', () => {

  it ("doesn't alter valid integer values on construction", () => {
    forAllInRange(0, 2**32, (value: number) => {
      expect(new UInt32(value).toNumber()).to.equal(value)
    }, true)
  })

  it ("rounds floating-point values on construction", () => {
    forAllInRange(0, 2**32, (value: number) => {
      expect(new UInt32(value).toNumber()).to.equal(Math.round(value))
    })
  })

  it ("throws an error with negative values on construction", () => {
    forAllInRange(Number.MIN_SAFE_INTEGER, 0, (value: number) => {
      expect(() => new UInt32(value)).to.throw()
    })
  })

  it ("throws an error with values larger than (2^32 - 1) on construction", () => {
    forAllInRange(2**32, Number.MAX_SAFE_INTEGER, (value: number) => {
      expect(() => new UInt32(value)).to.throw()
    })
  })

  it ("properly converts to and from a Number", () => {
    forAllInRange(0, 2**32, (value: number) => {
      expect(UInt32.fromNumber(value).toNumber()).to.equal(value)
    }, true)
  })

  it ("properly converts to and from a UTF32Char", () => {
    forAllInRange(0, 2**32, (value: number) => {
      expect(new UInt32(value).toUTF32Char().toUInt32().toNumber()).to.equal(value)
    }, true)
  })

  it ("properly converts to and from a String", () => {
    forAllInRange(0, 2**32, (value: number) => {
      let str = String.fromCharCode(value)
      expect(UInt32.fromString(str).toString()).to.equal(str)
    }, true)
  })

})