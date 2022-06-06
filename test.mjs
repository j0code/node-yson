import fs from "fs/promises"
import * as simple from "./tests/simple.mjs"
import * as js from "./tests/js.mjs"

let errors = 0

if(process.argv.length > 2) {

	let id = process.argv[2]
	id = id.split("/")

	if(id.length != 2) {
		console.log("Invalid test id")
		process.kill(0)
	}

	try {
		if(id[0] == "simple") {
			let raw = await fs.readFile(`./tests/simple/${id[1]}.yson`, { encoding: "utf-8" })
			console.log(raw)
			let data = await simple.testSingle(id[1])
			console.log(data)
		} else if(id[0] == "js") {
			await js.testSingle(id[1])
		} else {
			console.log("Invalid test id")
			process.kill(0)
		}
	} catch(e) {
		console.error(e)
		process.kill(1)
	}

	if(!errors) {
		console.log("\nSuccess: Test completed successfully.")
	}

} else {

	let count = await fs.readFile("./tests/count.json", { encoding: "utf-8" })
	count = JSON.parse(count)
	let total = count.simple + count.js

	console.log(`Performing tests (${count.simple} simple, ${count.js} js, ${total}) ...`)

	errors += await simple.test(count.simple)
	errors += await js.test(count.js)

	console.log(`${errors ? "Failure" : "Success"}: tests completed, ${total - errors} passed, ${errors} failed.`)

}
