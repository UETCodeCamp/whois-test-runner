const fs = require('fs')
const u = require('./util')

const compiler = require('./compiler')

async function start() {
	try {
		const text = await compiler.compile(process.env.STUDENT_REPO_PATH)
		const ot = fs.createWriteStream(process.env.STUDENT_STD_OUT_FILE)
		ot.write(text)
	} catch (err){
		console.log(err)
	} 
}

start()
