// Based upon https://gist.github.com/tatsuyasusukida/ce71456081748242a0bd4cbfcfe44eb7
encodeBase64Url = (value) => {
    buffer = Buffer.from(value)
    return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}
  
// Based upon https://gist.github.com/tatsuyasusukida/ce71456081748242a0bd4cbfcfe44eb7
decodeBase64Url = (value) => {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
    return Buffer.from(base64, 'base64').toString()
}

module.exports = { encodeBase64Url, decodeBase64Url }