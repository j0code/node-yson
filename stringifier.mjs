export default function stringify(o) {
	/*let t = o.constructor.name
	let isarr = v instanceof Array

	let s = stringifyObject(o)

	if(typeof o == "object") {
		if(isarr) return `[${s}]`
		return `{${s}}`
	} else {

	}*/
	return stringifyValue(o)
}

function stringifyObject(o) {
	if(!o) return null

	let s = []

	for(let k of Object.keys(o)) {
		let v = o[k]
		v = stringifyValue(v)
		//console.log({k, v, c: o[k]})
		s.push(`${k}:${v}`)
	}

	return s.join(",")

}

function stringifyValue(v) {
	switch(typeof v) {
		case "object":
		if(v == null) {
			v = "null"
			break
		}
		v = stringifyType(v)
		break

		case "string":
		case "number":
		case "boolean":
		v = JSON.stringify(v)
		break

		default:
		v = "null"

	}

	return v
}

function stringifyType(v) {
	let t = v.constructor.name
	let isarr = v instanceof Array
	let s = null

	switch(t) {
		case "Object":
		case "Array":
		s = stringifyObject(v)
		break

		case "Map":
		v = Object.fromEntries(v)
		s = `{${stringifyObject(v)}}`
		break

		case "Set":
		s = `[${Array.from(v)}]`
		break

		default:
		// Custom Type
		if(v.toYSON && v.toYSON instanceof Function) {
			v = v.toYSON()
		} else if(v.toJSON && v.toJSON instanceof Function) {
			v = v.toJSON()
		}
		s = stringifyValue(v)
		break
	}

	//console.log(v, t, isarr, s)

	if(["Object","Array"].includes(t)) {
		if(isarr) return `[${s}]`
		return `{${s}}`
	}
	return t + s
}

// TODO:
// - distinguish Objects, Arrays, Strings, Numbers, Booleans, Null
// - Types
// - Options (e.g. space, use hex nums, store Maps as Arrays)
// - add more native types (Date etc.)
