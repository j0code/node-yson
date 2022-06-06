import fs from "fs/promises"
import YSON from "../main.mjs"

let errors = 0

export async function test(count) {

	for(let i = 0; i < count; i++) {
		await testSingle(i)
	}

	console.log(`${errors ? "Failure" : "Success"}: simple tests completed, ${count - errors} passed, ${errors} failed.`)

	return errors

}

export async function testSingle(i) {

	let refdata = await fs.readFile(`./tests/simple/${i}.json`, { encoding: "utf-8" })
	refdata = refdata.trimEnd()

	let data
	try {
		data = await YSON.load(`./tests/simple/${i}.yson`)
	} catch(e) {
		console.error(`Test ${i} failed:`, e)
		errors++
		return
	}

	if(refdata != JSON.stringify(data)) {
		errors++
		console.error(`Test ${i} failed: data mismatch`)
	}
	return data

}
