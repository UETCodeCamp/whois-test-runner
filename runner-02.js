// node-stdout
const rp = require('request-promise')
const path = require('path')
const pusher = require('@uet/pusher')

const u = require('./helper/util')
const git = require('./helper/git')
const source = require('./source')

const p1 = require('./pipelines/01-prepare-repo')

async function start(jobId, secret, studentRepo, mentorRepo) {
	try {
		// clone projects
		await p1.run(studentRepo, mentorRepo)

		await startStudentServer(studentRepo)
		await runMentorTests(mentorRepo, jobId, secret)
		await cleanStack()

		console.log('--------- exit with success 🎉 -------')
	} catch (err){
		console.log('--------- exit with error 🙊 -------')
		console.log(err.message)

		pusher.settings({secret})

		pusher.submit({
			id: jobId, 
			is_pass: false,
			message: err.message,
			std_out: '',
		})
	}
}

async function startStudentServer(studentRepo) {
	const env = 'PORT=3000 HOST=0.0.0.0 MONGO_PATH=mongodb MONGO_PORT=27018 '
	// make sure old stack is removed
	await u._runBash(env + 'docker-compose -f docker-compose/runner-01/student-server-runner.yml rm -sf')
	console.log('-------- clean student\'s server stack done --------')

	// install node_modules
	await u._runBash('cd tmp/student-repo && npm install')	
	
	// start test-server stack: nodejs + mongodb
	await u._runBash(env + 'docker-compose -f docker-compose/runner-01/student-server-runner.yml up -d')
	console.log('-------- start test-server done --------')

	// checking test-server ready
	await u._try(30, 1000, 'test-server is unhealthy', checkHealth, null)
	console.log('test-server is ready')
}

async function runMentorTests(mentorRepo, jobId, secret) {
	// make sure old stack is removed
	await u._runBash(`docker-compose -f docker-compose/runner-01/mentor-test-runner.yml rm -sf`)
	console.log('-------- clean mentor\'s server stack done --------')

	// install node_modules
	await u._runBash('cd tmp/mentor-repo && npm install')	
	
	// start stack: nodejs
	const text = await u._runBash(`STUDENT_HOST=http://student_server:3000 SUBMIT_HOST=https://api-fame.hackermind.dev JOB_ID=${jobId} SUBMIT_SECRET=${secret} docker-compose -f docker-compose/runner-01/mentor-test-runner.yml up`)
	console.log('text mentor bash', text)
	console.log('-------- start run tests done --------')
}

async function cleanStack() {
	const env = 'PORT=3000 HOST=0.0.0.0 MONGO_PATH=mongodb MONGO_PORT=27018 '

	await u._runBash(env + 'docker-compose -f docker-compose/runner-01/student-server-runner.yml rm -sf')
	console.log('-------- clean student\'s server stack done --------')

	await u._runBash('docker-compose -f docker-compose/runner-01/mentor-test-runner.yml rm -sf')
	console.log('-------- clean mentor\'s server stack done --------')
}

async function checkHealth() {
	const response = await rp('http://localhost:3000')
}

exports.start = start
