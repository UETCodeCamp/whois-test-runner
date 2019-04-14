const simpleGit = require('simple-git')
const path = require('path')
const request = require('request-promise-native')

const _isExistLink = async (link = '') => {
    try {
        await request.get({
            uri: link,
            resolveWithFullResponse: true
        })

        return true
    } catch (e) {
        const {statusCode} = e

        return statusCode < 300
    }

    return false
}


const clone = async (source = '', into) => {
    if (!source) {
        throw new Error('Source not found.')
    }

    const isExist = await _isExistLink(source)
    if (!isExist) {
        throw new Error('Link source not found.')
    }

    const git = simpleGit(into)

    try {
        console.log('Cloning project', source)
        await git.silent(true).clone(source, into)
        const gitFolder = path.join(into, '.git')

        return into
    } catch (e) {
        console.error('Clone error', e)

        throw e
    }
}

exports.clone = clone
