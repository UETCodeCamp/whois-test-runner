const u = require('./util')

async function start() {
	try {
		// for testing only
		console.log('process.env', JSON.stringify(process.env))

		const out = await u._runBash('cd /mentor-repo && npm start')
		console.log('run test out:', out)
		console.log('-------- run tests done --------')
	} catch (err){
		console.log(err)
	} 
}

start()
