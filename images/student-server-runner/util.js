const {exec} = require('child_process');

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

function delay(after) {
	return new Promise(resolve => {
		setTimeout(resolve, after)	
	})
}

module.exports = {
	_runBash,
	delay
}
