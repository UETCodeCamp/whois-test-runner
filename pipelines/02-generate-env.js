const fs = require('fs')
const path = require('path')

const de = fs.readFileSync(path.join(__dirname, '../docker.env'), 'utf8')

function run(env) {
	const inlineDE = de.split('\n').filter(l => l.indexOf('#') === -1).join(' ')
	const es = Object.keys(env).map(k => `${k}=${env[k]}`).join(' ')
	return inlineDE + ' ' + es
}

//console.log(run({OK_MEN: 'ererwer', OK_2: "slkdfjksdjk"}))

exports.run = run
