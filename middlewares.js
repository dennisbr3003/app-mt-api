const compression = require('compression')
const helmet = require('helmet')
const Log = require('./classes/Log')
const Entity = require('./classes/Entity')
const { encodeHmac256 } = require('./lib/hmac')

require('dotenv').config()

const log = new Log(__dirname)
const entity = new Entity(__dirname)

const initMiddleWares = async () => {
    await log.init()
    await entity.init() 
}

initMiddleWares()

// decrypt token
const decryptToken = async(token, req) => {
    try{        
        let hash = await encodeHmac256(process.env.CAPP, process.env.CPWD, true)
        if(hash!==token) {
            throw {type: 401, message: 'Token does not match - Unauthorized'}       
        }    
        let app = await entity.getApp(process.env.CAPP)    
        if(app===null) {
            throw {type: 401, message: 'Unknown caller - Unauthorized'}
        } else {    
            if(req.method==='GET'&&!app.read) throw {type: 401, message: 'Read not allowed - Unauthorized'}    
            if(req.method==='POST'&&!app.write) throw {type: 401, message: 'Write not allowed - Unauthorized'}       
            if(req.method==='DELETE'&&!app.delete) throw {type: 401, message: 'Delete not allowed - Unauthorized'}      
        }
    } catch(error){
        throw error
    }
}

module.exports = [
    compression(),
    helmet(),
    async (req, res, next) => {
        try{
            await decryptToken(req.headers.token, req)
        } catch (error) {
            res.status(error.type).json({type: error.type, message: error.message })
            return
        }
        log.write('', '', req)
        next()  
    },    
]