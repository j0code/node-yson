import fs from "fs/promises"
import parse from "./parser.mjs"

export default class YSON {

	static parse(s, types) {
		return parse(s, types)
	}

	static async load(path, types) {
		let data = await fs.readFile(path, { encoding: "utf-8" })
		return YSON.parse(data, types)
	}

}
