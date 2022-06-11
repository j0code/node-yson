import YSON from "../../main.mjs"

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

	let data = await YSON.load("./tests/js/data/0.yson", [Test])

	console.log(data)

	return false

}
