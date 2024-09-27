const compression = require('compression')
const helmet = require('helmet')
const Log = require('./classes/Log')
const Entity = require('./classes/Entity')

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

    console.log('middleware', token)

    // try{        
    //     let params = []
    //     const cryptr = new Cryptr(process.env.CPWD)
    //     params = cryptr.decrypt(token).split('.')
        
    //     if(params.length!==2) throw {type: 500, message: 'Corrupted token'}
    //     if(params[0]==='') throw {type: 500, message: 'Corrupted token'}
    //     if(params[1]==='') throw {type: 500, message: 'Corrupted token'}
    //     if(+params[1] < +Date.now()) throw {type: 500, message: 'Expired token'}    
        
    //     let app = await entity.getApp(params[0])    
    //     if(app===null) {
    //         throw {type: 401, message: 'Unknown caller - Unauthorized'}
    //     } else {    
    //         if(req.method==='GET'&&!app.read) throw {type: 401, message: 'Read not allowed - Unauthorized'}    
    //         if(req.method==='POST'&&!app.write) throw {type: 401, message: 'Write not allowed - Unauthorized'}       
    //         if(req.method==='DELETE'&&!app.delete) throw {type: 401, message: 'Delete not allowed - Unauthorized'}      
    //     }
    // } catch(error){
    //     throw error
    // }
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