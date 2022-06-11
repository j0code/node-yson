let errors = 0

export async function test(count) {

	for(let i = 0; i < count; i++) {
		await testSingle(i)
	}

	console.log(`${errors ? "Failure" : "Success"}: js tests completed, ${count - errors} passed, ${errors} failed.`)

	return errors

}

export async function testSingle(i) {
	let f = await import(`./js/${i}.mjs`)
	try {
		errors += await f.test()
	} catch(e) {
		errors++
		console.error(`Test ${i} failed:`, e)
	}
	return errors
}
