/*export default function parse(s) {
	for(let i = 0; i < s.length; i++) {
		let kr = captureKey(s, i)
		i = kr.i
		let vr = captureValue(s, i + 1)
		i = vr.i
		console.log({key: kr.key, value: vr.value})
	}
}*/

export default function parse(s) {
	let obj = {}
	let index = [createIndex("val")]
	for(let i = 0; i < s.length; i++) {
		let ci = index[index.length - 1] // current index
		let pi = index[index.length - 2] // parent index
		let c = s[i]

		switch(ci.op) {
			case "obj":
			if(c == "}") {
				//console.log(index)
				index.pop()
				pi.v = ci.v
				pi.done = true
				if(index.length < 3) i--
				continue
			}
			index.push(createIndex("prop"))
			break

			case "prop":
				if(ci.i == 0) {
					index.push(createIndex("key"))
				} else if(ci.i == 1) {
					index.push(createIndex("val"))
				} else {
					//console.log(index)
					index.pop()
					pi.v[ci.v[0]] = ci.v[1]
					pi.i++
					i--
					continue
				}
				continue
			break

			case "key":
			if(c == ":") {
				//console.log(index)
				index.pop()
				pi.v.push(ci.v.trim())
				pi.i++
				i--
				continue
			}
			ci.v += c
			break

			case "val":
			if(c == "," || c == "}" || c == "]") {
				//console.log(index)
				index.pop()
				if(ci.v == null) ci.v = parseValue(ci.s.trim()) // TODO: parse
				if(pi) {
					pi.v.push(ci.v)
					pi.i++
				} else {
					//console.log(index)
					//console.log(i, s[i])
					i++ // }
					while(i < s.length && s[i].trim() == "") i++
					if(i < s.length) {
						new SyntaxError(`Unexpected token ${c} in JSON at position ${i}`)
					} else {
						return ci.v
					}
				}
				i--
				continue
			}
			if(ci.done && c.trim() != "") {
				throw new SyntaxError(`Unexpected token ${c} in JSON at position ${i}`)
			}
			if(c == "{") {
				index.push(createIndex("obj"))
				continue
			}
			if(c == "[") {
				index.push(createIndex("arr"))
				i--
				continue
			}
			if(c == "\"") {
				index.push(createIndex("str"))
				continue
			}
			ci.s += c
			break

			case "str":
			if(c == "\"") {
				index.pop()
				pi.s += "\"" + ci.v + "\""
				pi.done = true
				continue
			}
			ci.v += c
			break

			case "arr":
			if(c == "]") {
				index.pop()
				pi.v = ci.v
				pi.done = true
				continue
			}
			index.push(createIndex("val"))
			break
		}
	}

	new SyntaxError(`Unexpected end of YSON input`)

}

function createIndex(op) {
	//console.log("+", op)
	if(op == "obj")  return {v: {},   op, i: 0}
	if(op == "prop") return {v: [],   op, i: 0}
	if(op == "key")  return {v: "",   op, i: 0}
	if(op == "val")  return {v: null, op, i: 0, s: "", done: false}
	if(op == "str")  return {v: "",   op, i: 0}
	if(op == "arr")  return {v: [],   op, i: 0}
}

function parseValue(s) {
	//console.log({s})
	if(!isNaN(s)) return Number(s)
	if(s == "null") return null
	if(s == "false") return false
	if(s == "true") return true
	if(s.startsWith("\"") && s.endsWith("\"")) {
		return s.substring(1, s.length -1)
	}
}

// TODO:
// - mark values done after obj, arr or str to avoid overriding
// - fix arr issues
//    - first elem is 0 for test.yson key1.what
//    - first elem is undefined
// - add SyntaxErrors
// - add colors (#123456)
// - add Types {}
// - stress-test it (write test cases)
// - fix lone values not working (see test3.yson)
// - add YSON.stringify()
