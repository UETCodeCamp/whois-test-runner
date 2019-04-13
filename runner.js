const rp = require('request-promise')
const path = require('path')

const u = require('./util')
const git = require('./git')

//const studentRepo = 'https://github.com/minhnt95/student-repo-nodejs-mongo'
//const mentorRepo = 'https://github.com/minhnt95/mentor-repo-nodejs'
const studentRepoPath = path.join(__dirname, './tmp/student-repo')
const mentorRepoPath = path.join(__dirname, './tmp/mentor-repo')

async function start(studentRepo, mentorRepo) {
	try {
		await prepareTempDir(studentRepoPath, mentorRepoPath)
		await startStudentServer(studentRepo);
		await runMentorTests(mentorRepo)
	} catch (err){
		console.log(err.message)
	}
}

async function prepareTempDir(...dirs) {
	await dirs.forEach(async d => {
		await u._removeDir(d)	
		await u._makeDir(d)
	})
}

async function startStudentServer(studentRepo) {
	// make sure old stack is removed
	await u._runBash('docker-compose -f docker-compose/student-server-runner.yml rm -sf')
	console.log('-------- clean student\'s server stack done --------')

	// clone project into student-repo
	await git.clone(studentRepo, studentRepoPath)

	// install node_modules
	await u._runBash('cd tmp/student-repo && npm install')	
	
	// start test-server stack: nodejs + mongodb
	await u._runBash('docker-compose -f docker-compose/student-server-runner.yml up -d')
	console.log('-------- start test-server done --------')

	// checking test-server ready
	await u._try(90, 1000, 'test-server is unhealthy', checkHealth, null)
	console.log('test-server is ready')
}

async function runMentorTests(mentorRepo) {
	// make sure old stack is removed
	await u._runBash('docker-compose -f docker-compose/mentor-test-runner.yml rm -sf')
	console.log('-------- clean mentor\'s server stack done --------')

	// clone project into mentor-repo
	await git.clone(mentorRepo, mentorRepoPath)

	// install node_modules
	await u._runBash('cd tmp/mentor-repo && npm install')	
	
	// start stack: nodejs
	await u._runBash('docker-compose -f docker-compose/mentor-test-runner.yml up')
	console.log('-------- start run tests done --------')
}

async function checkHealth() {
	const response = await rp('http://localhost:3000')
}

exports.start = start
