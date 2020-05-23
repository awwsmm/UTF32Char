import { UTF32Char } from "./UTF32Char"

export class UInt32 {

  private _value: number

  constructor (value: number) {
    let rounded = Math.round(value)
    if (rounded < 0) throw new Error("range error: UInt32 has minimum 0")
    if (rounded > 4294967295) throw new Error("range error: UInt32 has maximum 4294967295 (2^32 - 1)")
    this._value = rounded
  }

  toNumber(): number {
    return this._value
  }

  static fromNumber (value: number): UInt32 {
    return new this(value)
  }

  toUTF32Char(): UTF32Char {
    if (this.toNumber() < 65536) return new UTF32Char(String.fromCharCode(this.toNumber()))

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

}