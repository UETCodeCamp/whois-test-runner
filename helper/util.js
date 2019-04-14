const {exec} = require('child_process');
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')

const _runBash = async (command = '') => {
    return new Promise((resolve, reject) => {
        exec(command,
            (error, stdout, stderr) => {
                if (error) {
                    console.error(error)

                    return reject(error)
                }

                if (stderr && stderr.code !== undefined) {
                    const {code} = stderr
                    const err = new Error(`Run failed with code: ${code}`)

                    return reject(err)
                }

                return resolve(stdout)
			}
		)
    })
}

function _delay(after) {
	return new Promise(resolve => {
		setTimeout(resolve, after)	
	})
}

async function _try(time, delay, errMsg, func, ...args) {
	if (time === 0)	throw new Error(errMsg)
	else {
		try {
			await _delay(delay)
			await func.call(null, ...args)	
		} 
		catch (err) {
			console.log('try', time, err.message)	
			await _try(time - 1, delay, errMsg, func, ...args)
		}
	}
}

const _makeDir = async (path) => {
    return new Promise((resolve, reject) => {
        mkdirp(path, (err) => {
            if (err) return reject(err)

            return resolve(path)
        })
    })
}

const _removeDir = (path) => {
    return new Promise((resolve, reject) => {
        rimraf(path, (error) => {
            if (error) {
                return reject(error)
            }

            return resolve(true)
        })
    })
}


module.exports = {
	_runBash,
	_delay,
	_try,
	_makeDir,
	_removeDir
}
