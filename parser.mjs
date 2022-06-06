/*export default function parse(s) {
	for(let i = 0; i < s.length; i++) {
		let kr = captureKey(s, i)
		i = kr.i
		let vr = captureValue(s, i + 1)
		i = vr.i
		console.log({key: kr.key, value: vr.value})
	}
}*/

export default function parse(s, types) {
	let obj = {}
	let index = [createIndex("val", 0)]
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
					index.push(createIndex("val", i))
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
			//console.log(i, c, ci)
			if(c == "," || c == "}" || c == "]") {
				//console.log(index)
				index.pop()
				if(ci.v == null) ci.v = parseValue(ci, types) // TODO: parse
				if(pi) {
					pi.v.push(ci.v)
					pi.i++
				} else {
					//console.log(index)
					//console.log(i, s[i])
					i++ // }
					while(i < s.length && s[i].trim() == "") i++
					if(i < s.length) {
						throw new SyntaxError(`Unexpected token ${c} in JSON at position ${i}`)
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
			//console.log(i, c, ci)
			if(c == "]") {
				index.pop()
				pi.v = ci.v
				pi.done = true
				//i--
				//console.log(s[i], index)
				continue
			}
			index.push(createIndex("val", i))
			if(c != ",") i--
			break
		}
	}

	if(index.length == 1) {
		return parseValue(index[0], types)
	}

	//console.table(index, ["v", "op", "s"])
	//console.dir(index, {depth: 5})
	throw new SyntaxError(`Unexpected end of YSON input`)

}

function createIndex(op, pos) {
	//console.log("+", op)
	if(op == "obj")  return {v: {},   op, i: 0}
	if(op == "prop") return {v: [],   op, i: 0}
	if(op == "key")  return {v: "",   op, i: 0}
	if(op == "val")  return {v: null, op, i: 0, s: "", done: false, pos}
	if(op == "str")  return {v: "",   op, i: 0}
	if(op == "arr")  return {v: [],   op, i: 0}
}

function parseValue(ci, types) {
	//console.log(ci)
	if(ci.v == null) return parseDataValue(ci)

	// Type parsing
	let type = ci.s.trim()
	//console.log({type})
	if(!type) return ci.v

	return ci.v
}

function parseDataValue(ci) {
	let s = ci.s.trim()
	//console.log({s})
	if(s && !isNaN(s)) return Number(s)
	if(s == "null") return null
	if(s == "false") return false
	if(s == "true") return true
	if(s.startsWith("\"") && s.endsWith("\"")) {
		return s.substring(1, s.length -1)
	}
	if(s.startsWith("#")) { // hexadecimal numbers
		s = s.substr(1)
		if(!s.match(/[^a-f0-9]/)) { // check for non-hexadecimal chars
			return parseInt(s, 16)
		}
	}
	throw new SyntaxError(`Invalid YSON value at ${ci.pos}`)
}

// TODO:
// - add Types {}
// - stress-test it (write test cases)
// - add YSON.stringify()
