const u = require('../helper/util')
const git = require('../helper/git')
const source = require('../source')

async function prepareTempDir(...dirs) {
	await dirs.forEach(async d => {
		await u._removeDir(d)	
		await u._makeDir(d)
	})
}

async function cloneProjects(studentRepo, mentorRepo) {
	// clone project into student-repo
	await git.clone(studentRepo, source.STUDENT_REPO_PATH)

	// clone project into mentor-repo
	await git.clone(mentorRepo, source.MENTOR_REPO_PATH)
}

async function run(sr, mr) {
	await prepareTempDir(source.STUDENT_REPO_PATH, source.MENTOR_REPO_PATH)
	await cloneProjects(sr, mr)
}

exports.run = run
