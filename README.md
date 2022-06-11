# YScript Object Notation
YSON implementation for JavaScript

YSON is similar to JSON.
Main benefits:
- smaller filesize
- no "" around keys
- Types

## Install
### NPM
```sh
> npm i @j0code/yson
```

## Usage

### Module (ECMAScript 2015)
```js
import YSON from "@j0code/yson"

// same as JSON
let s = YSON.stringify(someObject) // does not support reviver
let o = YSON.parse(s) // currently does not support replacer and space

// additional
let f = await YSON.load("./file.yson") // load file with fs/promises ad YSON.parse() it
let t = YSON.parse(s, [YourClass1, YourClass2]) // allows parsing your own classes back (see Types)
```

### CommonJS
```js
const YSON = require("@j0code/yson")
```

## Specification
YSON knows different datatypes

### Number, Boolean, Null, String, Hexadecimal Integer
```js
5
6.5
.33
1.5e-2
true
false
null
"Hello World"
#abcdef
```

### Object
The difference to JSON is that you don't need "" around keys
```js
{
  a: 3,
  s: "a string",
  b: false
  this works: true
}
```

### Array
```js
[1, 2, 3, 4, "Hello World", false, 42]
```

### Types
Note: this is in development in therefore is subject to change
```js
{
  a: Date {
    date: "2022-06-06T11:59:41.108Z"
  },
  b: URL {
    href: 'https://github.com/j0code/node-yson/'
  },
  c: Map {
    key1: value1,
    key2: value2
  },
  d: Set [value1, value2],
  e: YourClass {
    x: 5
    y: 3
  },
	f: YourClass [ // Note: if you don't want this to work, return null on static .fromYSON()
		1, 2, 3
	]
}
```

### Custom Types
Note: this is in development in therefore is subject to change

#### parse
You can read your own classes back
```js
let t = YSON.parse(s, [YourClass1, YourClass2])
```
The YSON parser takes the first class with the name specified before {} (e.g. YourClass1 {})

If your class declares a static function fromYSON(),
the parser will feed the object into the first parameter and will go on with the return value.

If not, it will use the constructor instead

#### stringify
YSON will automatically include the class name derived from obj.constructor.name

If you want to customize the behavior of stringify, you can define either `toYSON()` or `toJSON()`.
(`toYSON()` is prioritized)

This is useful if you have private fields that you want to save.

#### Note
Native Types (like Map) take priority, so any classes names Map, Set, Date,... are ignored.
