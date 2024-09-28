
const lib = require('../lib/base64')
const crypto = require('crypto');

const encodeHmac256 = async (sData, sKey, base64) => {
    
    const encode = base64 ?? false

    // https://www.geeksforgeeks.org/node-js-crypto-createhmac-method/
    const hash = crypto.createHmac('sha256', sKey).update(sData).digest('hex'); 
    if(encode) return await encodeBase64Url(hash)
    else return hash    

}

module.exports = { encodeHmac256 }