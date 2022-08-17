export default function parse(s, types) {
	let list = types || []
	types = new Map()
	for(let t of list) {
		if(!types.has(t.name)) {
			types.set(t.name, t)
		}
	}

	let obj = {}
	let index = [createIndex("val", 0)]
	for(let i = 0; i < s.length; i++) {
		let ci = index[index.length - 1] // current index
		let pi = index[index.length - 2] // parent index
		let c = s[i]

		switch(ci.op) {
			case "obj":
			if(c == "}" || s[i+1] == "}") {
				//console.log(index)
				index.pop()
				pi.v = ci.v
				pi.done = true
				if(c != "}") i++
				continue
			}
			index.push(createIndex("prop"))
			i--
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
				ci.v = parseValue(ci, types) // TODO: parse
				if(pi) {
					pi.v.push(ci.v)
					pi.i++
				} else {
					//console.log(index)
					//console.log(i, s[i])
					i++ // }
					while(i < s.length && s[i].trim() == "") i++
					if(i < s.length) {
						throw new SyntaxError(`Unexpected token ${s[i]} in YSON at position ${i}`)
					} else {
						return ci.v
					}
				}
				i--
				continue
			}
			if(ci.done && c.trim() != "") {
				throw new SyntaxError(`Unexpected token ${c} in YSON at position ${i}`)
			}
			if(c == "{") {
				index.push(createIndex("obj"))
				i--
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
	if(ci.v == null) return parseDataValue(ci)

	// Type parsing
	let type = ci.s.trim()
	//console.log({type})
	if(!type) return ci.v

	// select type, call fromYSON...
	if(["Map","Set","ArrayBuffer"].includes(type)) {
		return parseNativeType(type, ci.v)
	} else if(types.has(type)) {
		let t = types.get(type)
		if(t.fromYSON && t.fromYSON instanceof Function) {
			let v = t.fromYSON(ci.v)
			if(!(v instanceof t)) return ci.v
			return v
		}
		return ci.v
	}

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

function parseNativeType(type, v) {
	//console.log("e", type, v)
	//console.log(v instanceof Object)
	//console.log(v instanceof Array)
	if(type == "Map" && v instanceof Object) {

		let m = new Map()
		for(let k of Object.keys(v)) {
			m.set(k, v[k])
		}
		return m

	} else if(type == "Set" && v instanceof Array) {

		let s = new Set()
		for(let i of v) {
			s.add(i)
		}
		return s

	} else if(type == "ArrayBuffer" && v instanceof Array) {

		return new Uint8Array(v).buffer

	}
	return v
}

// TODO:
// - un-stringify strings
// - parse Maps stored as Array
// - add more native types (Date etc.)
