const u = require('./util')

async function start() {
	try {
		await u._runBash('PORT=3000 MONGO_PATH=mongodb MONGO_PORT=27017')
		console.log('-------- set env variables done --------')

		await u._runBash('cd /student-repo && npm start')
		console.log('-------- start server done --------')
	} catch (err){
		console.log(err)
	} 
}

start()
