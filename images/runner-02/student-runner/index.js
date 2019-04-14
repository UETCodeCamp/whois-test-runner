const fs = require('fs')
const u = require('./util')

const compiler = require('./compiler')

async function start() {
	try {
		// for testing only
		console.log(JSON.stringify(process.env))

		const text = await compiler.compile(process.env.STUDENT_REPO_PATH)
		const ot = fs.createWriteStream(process.env.STUDENT_STD_OUT_FILE)
		ot.write(text, 'utf8')
	} catch (err){
		console.log(err)
	} 
}

start()
