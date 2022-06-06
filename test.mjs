import fs from "fs/promises"
import YSON from "./main.mjs"

let files = await fs.readdir("./tests/")
console.log(`Performing tests (${files.length}) ...`)
let errors = 0
for(let i in files) {
	let f = files[i]
	try {
		let data = await YSON.load("./tests/" + f)
	} catch(e) {
		console.error(`Test ${i} failed:`, e)
		errors++
	}
}

if(errors == 0) {
	console.log(`Success: ${files.length}/${files.length} tests completed successfully.`)
} else {
	console.log(`Failure: ${errors}/${files.length} tests errored.`)
}
