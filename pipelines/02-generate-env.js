const fs = require('fs')
const path = require('path')

const de = fs.readFileSync(path.join(__dirname, '../docker.env'), 'utf8')

function run(env) {
	const es = Object.keys(env).map(k => `${k}=${env[k]}`).join(' ')
	return de + ' ' + es
}

exports.run = run
