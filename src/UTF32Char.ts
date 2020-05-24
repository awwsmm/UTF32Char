import { UInt32 } from "./UInt32"

export class UTF32Char {

  private _value: string

  private length(): number {
    return this.toString().length
  }

  constructor (value: string) {
    if (value.length < 1) throw new Error("invalid argument: cannot convert empty string to UTF32Char")
    else if (value.length < 2) this._value = value
    else if (value.length < 3) this._value = value.slice(0, 2)
    else throw new Error("invalid argument: lossy compression of length-3+ string to UTF32Char")
  }

  toString(): string {
    return this._value
  }

  static fromString (value: string) {
    return new this(value)
  }

  toUInt32(): UInt32 {
    if (this.length() < 2) return new UInt32(this.toString().charCodeAt(0))
  
    let hiChar = this.toString().charCodeAt(0)
    let loChar = this.toString().charCodeAt(1)
    
    return new UInt32(hiChar * 65536 + loChar)
  }

  static fromUInt32 (uint: UInt32): UTF32Char {
    return uint.toUTF32Char()
  }

  toNumber(): number {
    return this.toUInt32().toNumber()
  }

  static fromNumber (num: number): UTF32Char {
    return UTF32Char.fromUInt32(new UInt32(num))
  }

}