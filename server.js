const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const r1 = require('./runner-01')

const port = 6969
const app = express()

// middlwares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

// routes
app.get('/', (req, res) => res.send('OKAY!'))
app.post('/run/:name', async (req, res) => {
	const {id, student_repo, tester_repo: mentor_repo} = req.body
	const secret = req.headers['x-secret'];

	console.log('id', id)
	console.log('student_repo', student_repo)
	console.log('mentor_repo', mentor_repo)
	console.log('secret', secret)

	try {
		r1.start(id, secret, student_repo, mentor_repo)	

		return res.json({success: true})
	} catch(err) {
		res.json({success: false, reason: err.message})
	}
}) 

// server start
app.listen(port, (err) => {
	if (!err) console.log('Server is listening on', port)
})
