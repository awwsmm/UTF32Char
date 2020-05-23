import { expect } from 'chai'
import { UTF32Char } from '../src'
import { forAllStrings } from './TestTools'

describe('UTF32Char', () => {

  it ("rejects empty strings on construction", () => {
    expect(() => new UTF32Char("")).to.throw()
  })

  it ("accepts one or two UTF-16 characters on construction", () => {
    forAllStrings((value: string) => {
      expect(() => new UTF32Char(value)).to.not.throw()
    }, 1, 2)
  })

  it ("rejects 3+ UTF-16 characters on construction", () => {
    forAllStrings((value: string) => {
      expect(() => new UTF32Char(value)).to.throw()
    }, 3)
  })

  it ("properly converts to and from a String", () => {
    forAllStrings((value: string) => {
      expect(UTF32Char.fromString(value).toString()).to.equal(value)
    }, 1, 2)
  })

  it ("properly converts to and from a UInt32", () => {
    forAllStrings((value: string) => {
      expect(new UTF32Char(value).toUInt32().toUTF32Char().toString()).to.equal(value)
    }, 1, 2)
  })

  it ("properly converts to and from a Number", () => {
    forAllStrings((value: string) => {
      let num: number = 0
      if (value.length === 1) num = value.charCodeAt(0)
      else num = value.charCodeAt(0) * 65536 + value.charCodeAt(1)
      expect(UTF32Char.fromNumber(num).toNumber()).to.equal(num)
    }, 1, 2)
  })

})