import fs from "fs/promises"
import YSON from "./main.mjs"

let errors = 0

if(process.argv.length > 2) {

	let f = await fs.readFile("./tests/" + process.argv[2] + ".yson", { encoding: "utf-8" })
	console.log(f)
	let data = await test(process.argv[2])
	console.log()
	console.log(data)

	if(!errors) {
		console.log("Success: Test completed successfully.")
	}

} else {

	let count = await fs.readFile("./tests/count.json", { encoding: "utf-8" })
	count = JSON.parse(count)

	console.log(`Performing tests (${count}) ...`)
	for(let i = 0; i < count; i++) {
		await test(i)
	}

	if(errors == 0) {
		console.log(`Success: ${count}/${count} tests completed successfully.`)
	} else {
		console.log(`Failure: ${errors}/${count} tests errored.`)
	}

}

async function test(i) {
	let refdata = await fs.readFile(`./tests/${i}.json`, { encoding: "utf-8" })
	refdata = refdata.trimEnd()

	let data
	try {
		data = await YSON.load(`./tests/${i}.yson`)
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
