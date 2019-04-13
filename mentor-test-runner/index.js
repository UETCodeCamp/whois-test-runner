const u = require('./util')

async function start() {
	try {
		await u._runBash('STUDENT_HOST=localhost:3000')
		console.log('-------- set env variables done --------')

		await u._runBash('cd /mentor-repo && npm start')
		console.log('-------- run tests done --------')
	} catch (err){
		console.log(err)
	} 
}

start()
