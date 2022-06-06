import YSON from "../../main.mjs"

export async function test() {

	let data = await YSON.load("./tests/js/data/0.yson")

	console.log(data)

	return false

}
