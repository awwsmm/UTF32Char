import { UTF32Char } from "./UTF32Char"

export class UInt32 {

  private _value: number

  static MIN_VALUE: number = 0
  static MAX_VALUE: number = 2**32 - 1

  // As UInt32's constructor truncates floating-point values to integers, there
  // may be undefined behavior around (0 +/- eps) and (2**32 +/- eps) for small eps.

  constructor (value: number) {
    let truncated = Math.floor(value)
    if (truncated < UInt32.MIN_VALUE)
      throw new Error(`range error: UInt32 has MIN_VALUE 0, received ${value}`)
    if (truncated > UInt32.MAX_VALUE)
      throw new Error(`range error: UInt32 has MAX_VALUE 4294967295 (2^32 - 1), received ${value}`)
    this._value = truncated
  }

  toNumber(): number {
    return this._value
  }

  static fromNumber (value: number): UInt32 {
    return new this(value)
  }

  toUTF32Char(): UTF32Char {
    if (this.lt(65536)) return new UTF32Char(String.fromCharCode(this.toNumber()))

    let hiChar = this.toNumber() >> 16
    let loChar = this.toNumber() & 0x0000FFFF

    return new UTF32Char(String.fromCharCode(hiChar, loChar))
  }

  static fromUTF32Char (char: UTF32Char): UInt32 {
    return char.toUInt32()
  }

  toString(): string {
    return this.toUTF32Char().toString()
  }

  static fromString (str: string): UInt32 {
    return UInt32.fromUTF32Char(new UTF32Char(str))
  }

  plus (that: number | UInt32): UInt32 {
    if (typeof that === "number") {
      return UInt32.fromNumber(this.toNumber() + that)
    } else {
      return UInt32.fromNumber(this.toNumber() + that.toNumber())
    }
  }

  minus (that: number | UInt32): UInt32 {
    if (typeof that === "number") {
      return UInt32.fromNumber(this.toNumber() - that)
    } else {
      return UInt32.fromNumber(this.toNumber() - that.toNumber())
    }
  }

  private compare (obj: number | UInt32): number {
    let _this: number = this.toNumber()
    let _that: number

    if (typeof obj === "number") _that = obj
    else                         _that = obj.toNumber()

         if (_this < _that) return -1
    else if (_this > _that) return  1
    else                    return  0
  }

  lt (that: number | UInt32): boolean {
    return this.compare(that) < 0
  }

  lessThan (that: number | UInt32): boolean {
    return this.lt(that)
  }

  gt (that: number | UInt32): boolean {
    return this.compare(that) > 0
  }

  greaterThan (that: number | UInt32): boolean {
    return this.gt(that)
  }

  le (that: number | UInt32): boolean {
    return this.compare(that) < 1
  }

  lessThanOrEqualTo (that: number | UInt32): boolean {
    return this.le(that)
  }

  ge (that: number | UInt32): boolean {
    return this.compare(that) > -1
  }

  greaterThanOrEqualTo (that: number | UInt32): boolean {
    return this.ge(that)
  }

}