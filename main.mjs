import fs from "fs/promises"
import parse from "./parser.mjs"

export default class YSON {

	static parse(s) {
		return parse(s)
	}

	static async load(path) {
		let data = await fs.readFile(path, { encoding: "utf-8" })
		return YSON.parse(data)
	}

}
