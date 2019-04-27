const fs = require('fs')
const path = require('path')
const {exec} = require('child_process')
const uuid = require('uuid/v4')

const _readFile = async (file = '') => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (error, data) => {
            if (error) return reject(error)

            return resolve(data)
        })
    })
}

const _isExist = async (file) => {
    return new Promise((resolve, reject) => {
        fs.access(file, fs.constants.F_OK, (err) => {
            const exist = !err

            return resolve(exist)
        })
    })
}

const _parseJSON = async (content = '') => {
    if (!content) {
        throw new Error('Content is empty.')
    }

    try {
        return JSON.parse(content)
    } catch (e) {
        throw new Error('Parse JSON failed. Error: ' + e.message)
    }
}

const _runBash = async (command = '') => {
    return new Promise((resolve, reject) => {
        exec(command,
            (error, stdout, stderr) => {
                if (error) {
                    console.error(error)

                    return reject(error)
                }

                if (stderr) {
                    const {code} = stderr
                    const err = new Error(`Run failed with code: ${code}`)

                    return reject(err)
                }

                return resolve(stdout)
            })
    })
}

const _writeFile = async (file, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, content, {encoding: 'utf8', flag: 'w'}, (err) => {
            if (err) return reject(err)

            return resolve(file)
        })
    })
}

const _beforeRunFile = async (dir, input = {}) => {
	//await _runBash(`cd ${dir} && npm install`)
	//await _runBash(`cd ${dir} && npm install dotenv`)

    const envFile = uuid() + '.env'
    const envPath = path.join(dir, envFile)

    const vInput = Object.assign({}, input)
    let text = ''
    for (let key in vInput) {
        if (vInput.hasOwnProperty(key)) {
            const value = vInput[key]

            text += `${key}=${value}\n`
        }
    }

    await _writeFile(envPath, text)

    return envFile
}

const _runJSFile = async (file) => {
    return new Promise((resolve, reject) => {
        exec(`node ${file}`,
            (error, stdout, stderr) => {
                if (error) {
                    console.error(error)

                    return reject(error)
                }

                if (stderr) {
                    const {code} = stderr
                    const err = new Error(`Run failed with code: ${code}`)

                    return reject(err)
                }

                return resolve(stdout)
            })
    })
}

const _parseStdOut = (content = '') => {
    const trimmed = content ? (content + '').trim() : ''
    if (!trimmed) return {text: ''}

    const arr = content.split('\n')
    const texts = arr.map(text => text ? (text + '').trim() : '')
        .filter(text => text)

    return {
        texts
    }
}

exports.compile = async (dir, input = {}) => {
    const packageJson = path.join(dir, 'package.json')
    const isExistPackage = await _isExist(packageJson)
    if (!isExistPackage) {
        throw new Error('package.json not found.')
    }

    const packageContent = await _readFile(packageJson)
    const json = await _parseJSON(packageContent)
    const {main} = json
    if (!main) {
        throw new Error(`package.json doesn't have 'main' property.`)
    }

    const mainFile = path.join(dir, main)
    const isExistMain = await _isExist(mainFile)
    if (!isExistMain) {
        throw new Error(`File ${main} not found.`)
    }

    const ext = path.extname(main)
    if (ext !== '.js') {
        throw new Error('Main file is not Javascript file.')
    }

	//const configFile = await _beforeRunFile(dir, input)
	//const configPath = path.join(dir, configFile)
    const out = await _runJSFile(mainFile)

    return out 
}
