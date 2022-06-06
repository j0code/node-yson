import fs from "fs/promises"
import parse from "./parser.mjs"

export default class YSON {

	static parse(s) {
		console.log(s)
		return parse(s)
	}

	static async load(path) {
		let data = await fs.readFile(path, { encoding: "utf-8" })
		return YSON.parse(data)
	}

}

let test = await YSON.load("./test.yson")
console.group("result:")
console.dir(test, {depth: 10})
console.groupEnd()
