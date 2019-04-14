// node-stdout
const rp = require('request-promise')
const path = require('path')
const pusher = require('@uet/pusher')

const u = require('./helper/util')
const git = require('./helper/git')
const source = require('./source')

const p1 = require('./pipelines/01-prepare-repo')
const p2 = require('./pipelines/02-generate-env')

async function start(jobId, secret, studentRepo, mentorRepo) {
	try {
		// clone projects
		await p1.run(studentRepo, mentorRepo)

		// generate env variables
		const env = p2.run({JOB_ID: jobId, SUBMIT_SECRET: secret})

		await startStudentRunner(studentRepo, env)
		await startMentorRunner(mentorRepo, env)
		await cleanStack(env)

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

async function startStudentRunner(studentRepo, env) {
	// make sure old stack is removed
	await u._runBash(env + ' docker-compose -f docker-compose/runner-02/student-runner.yml rm -sf')
	console.log('-------- clean student\'s server stack done --------')
	
	// start test-server stack: nodejs + mongodb
	await u._runBash(env + ' docker-compose -f docker-compose/runner-02/student-runner.yml up')
	console.log('-------- start test-server done --------')
}

async function startMentorRunner(mentorRepo, env) {
	// make sure old stack is removed
	await u._runBash(env + ` docker-compose -f docker-compose/runner-02/mentor-runner.yml rm -sf`)
	console.log('-------- clean mentor\'s server stack done --------')

	// install node_modules
	await u._runBash('cd tmp/mentor-repo && npm install')	
	
	// start stack: nodejs
	const text = await u._runBash(env + ` docker-compose -f docker-compose/runner-02/mentor-runner.yml up`)
	console.log('text mentor bash', text)
	console.log('-------- start run tests done --------')
}

async function cleanStack(env) {
	await u._runBash(env + ' docker-compose -f docker-compose/runner-02/student-runner.yml rm -sf')
	console.log('-------- clean student\'s server stack done --------')

	await u._runBash(env + ' docker-compose -f docker-compose/runner-02/mentor-runner.yml rm -sf')
	console.log('-------- clean mentor\'s server stack done --------')
}

exports.start = start
