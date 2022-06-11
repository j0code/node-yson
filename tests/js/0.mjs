import YSON from "../../main.mjs"
import fs from "fs/promises"

class Test {

	constructor(x, y) {
		this.x = x || 0
		this.y = y || 0
	}

	static fromYSON(obj) {
		return new Test(obj.x, obj.y)
	}

	toYSON() {
		return { x: this.x, y: this.y }
	}

}

export async function test() {

	let data = await fs.readFile("./tests/js/data/0.yson", { encoding: "utf-8" })
	//console.log(data)

	let o = await YSON.parse(data, [Test])
	//console.log(o)
	if(!o.a instanceof Test) throw "a not instanceof Test"

	let back = YSON.stringify(o)
	//console.log(back)
	//console.log(data.replaceAll(/\s/g,""))
	if(data.replaceAll(/\s/g,"") != back) throw "input and output don't match"

	return false

}
