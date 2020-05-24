import { UTF32Char } from "./UTF32Char"

export class UInt32 {

  private _value: number

  // As UInt32's constructor truncates floating-point values to integers, there
  // may be undefined behavior around (-eps) and (2**32 - 1 + eps) for small eps.

  constructor (value: number) {
    let truncated = Math.floor(value)
    if (truncated < 0) throw new Error(`range error: UInt32 has minimum 0, received ${value}`)
    if (truncated > 4294967295) throw new Error(`range error: UInt32 has maximum 4294967295 (2^32 - 1), received ${value}`)
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

  lessThan = this.lt

  gt (that: number | UInt32): boolean {
    return this.compare(that) > 0
  }

  greaterThan = this.gt

  le (that: number | UInt32): boolean {
    return this.compare(that) < 1
  }

  lessThanOrEqualTo = this.lt

  ge (that: number | UInt32): boolean {
    return this.compare(that) > -1
  }

  greaterThanOrEqualTo = this.gt

}