# UTF32Char

A minimalist, dependency-free implementation of **immutable** [4-byte-width (UTF-32)](https://en.wikipedia.org/wiki/UTF-32) characters for easy manipulation of characters and glyphs, including simple emoji.

Also includes an **immutable** unsigned 4-byte-width integer data type, `UInt32` and easy conversions from and to `UTF32Char`.

## Motivation

If you want to allow a single "character" of input, but consider emoji to be single characters, you'll have some difficulty using basic JavaScript `string`s, which use UTF-16 encoding by default. While ASCII characters all have length-1...

```ts
console.log("?".length) // 1
```

...many emoji have length > 1

```ts
console.log("💩".length) // 2
```

...and with modifiers and accents, that number can get much larger

```ts
console.log("!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞".length) // 17
```

As all Unicode characters can be expressed with [a fixed-length UTF-32 encoding](https://en.wikipedia.org/wiki/UTF-32), this package mitigates the problem a bit, [though it doesn't completely solve it](https://blog.jonnew.com/posts/poo-dot-length-equals-two). **Note that I do not claim to have solved this issue**, and this package accepts any group of one to four bytes as a "single UTF-32 character", [whether or not they are rendered as a single grapheme](https://news.ycombinator.com/item?id=13830177). See [this package](https://github.com/orling/grapheme-splitter) if you want to split text into graphemes, regardless of the number of bytes required to render each grapheme.

If you just want a simple, dependency-free API to deal with 4-byte strings, then this package is for you.

This package provides an implementation of 4-byte, UTF-32 "characters" `UTF32Char` and corresponding unsigned integers `UInt32`. The unsigned integers have an added benefit of being usable as safe array indices.

## Installation

Install from [npm](https://www.npmjs.com/package/utf32char) with

`$ npm i utf32char`

## Use

Create new `UTF32Char`s and `UInt32`s like so

```ts
let index: UInt32 = new UInt32(42)
let char: UTF32Char = new UTF32Char("😮")
```

You can convert to basic JavaScript types

```ts
console.log(index.toNumber()) // 42
console.log(char.toString())  // 😮
```

Easily convert between characters and integers

```ts
let indexAsChar: UTF32Char = index.toUTF32Char()
let charAsUInt: UInt32 = char.toUInt32()

console.log(indexAsChar.toString()) // *
console.log(charAsUInt.toNumber())  // 3627933230
```

...or skip the middleman and convert integers directly to strings, or strings directly to integers:

```ts
console.log(index.toString()) // *
console.log(char.toNumber())  // 3627933230
```

## Edge Cases

`UInt32` and `UTF32Char` ranges are enforced upon object creation, so you never have to worry about bounds checking:

```ts
let tooLow: UInt32 = UInt32.fromNumber(-1)
// range error: UInt32 has MIN_VALUE 0, received -1

let tooHigh: UInt32 = UInt32.fromNumber(2**32)
// range error: UInt32 has MAX_VALUE 4294967295 (2^32 - 1), received 4294967296

let tooShort: UTF32Char = UTF32Char.fromString("")
// invalid argument: cannot convert empty string to UTF32Char

let tooLong: UTF32Char = UTF32Char.fromString("hey!")
// invalid argument: lossy compression of length-3+ string to UTF32Char
```

Because the implementation accepts any 4-byte `string` as a "character", the following are allowed

```ts
let char: UTF32Char = UTF32Char.fromString("hi")
let num: number = char.toNumber()

console.log(num) // 6815849
console.log(char.toString()) // hi
console.log(UTF32Char.fromNumber(num).toString()) // hi
```

Floating-point values are truncated to integers when creating `UInt32`s, like in many other languages:

```ts
let pi: UInt32 = UInt32.fromNumber(3.141592654)
console.log(pi.toNumber()) // 3

let squeeze: UInt32 = UInt32.fromNumber(UInt32.MAX_VALUE + 0.9)
console.log(squeeze.toNumber()) // 4294967295
```

Compound emoji -- [created using variation selectors and joiners](https://blog.jonnew.com/posts/poo-dot-length-equals-two) -- are often larger than 4 bytes wide and will therefore throw errors when used to construct `UTF32Char`s:

```ts
let smooch: UTF32Char = UTF32Char.fromString("👩‍❤️‍💋‍👩")
// invalid argument: lossy compression of length-3+ string to UTF32Char

console.log("👩‍❤️‍💋‍👩".length) // 11
```

...but many basic emoji are fine:

```ts
// emojiTest.ts
let emoji: Array<string> = [ "😂", "😭", "🥺", "🤣", "❤️", "✨", "😍", "🙏", "😊", "🥰", "👍", "💕", "🤔", "👩‍❤️‍💋‍👩" ]

for (const e of emoji) {
  try {
    UTF32Char.fromString(e)
    console.log(`✅: ${e}`)
  } catch (_) {
    console.log(`❌: ${e}`)
  }
}
```

```ts
$ npx ts-node emojiTest.ts
✅: 😂
✅: 😭
✅: 🥺
✅: 🤣
✅: ❤️
✅: ✨
✅: 😍
✅: 🙏
✅: 😊
✅: 🥰
✅: 👍
✅: 💕
✅: 🤔
❌: 👩‍❤️‍💋‍👩
```

## Arithmetic, Comparison, and Immutability

`UInt32` provides basic arithmetic and comparison operators

```ts
let increased: UInt32 = index.plus(19)
console.log(increased.toNumber()) // 61

let comp: boolean = increased.greaterThan(index)
console.log(comp) // true
```

Verbose versions and shortened aliases of comparison functions are available

- `lt` and `lessThan`
- `gt` and `greaterThan`
- `le` and `lessThanOrEqualTo`
- `ge` and `greaterThanOrEqualTo`

Since `UInt32`s are immutable, `plus()` and `minus()` return _new objects_, which are of course bounds-checked upon creation:

```ts
let whoops: UInt32 = increased.minus(100)
// range error: UInt32 has MIN_VALUE 0, received -39
```

## Contact

Feel free to open an issue with any `bug fixes` or a PR with any `performance improvements`.

Support me @ [Ko-fi](https://ko-fi.com/awwsmm)!

Check out [my DEV.to blog](https://dev.to/awwsmm)!