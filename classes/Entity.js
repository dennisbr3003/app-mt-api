const mongoose = require('mongoose')
const Log = require('../classes/Log')
const Player = require('../models/player')
const App = require('../models/app')

const lib = require('../lib/uuid')

require('dotenv').config()

class Entity {
    
    constructor(root){
        this.dbURI = `mongodb+srv://${process.env.USER}:${process.env.PWD}@math-thingy.hcmbohg.mongodb.net/maththingy?retryWrites=true&w=majority&appName=math-thingy`
        this.root = root
        this.log = new Log(this.root)
        this.log.prepare() // quick init
    }

    async init(){
        await this.#connectToMongo()
    }   

    #connectToMongo = async () => {
        try{  
            if(mongoose.connection.readyState===0) {
                await mongoose.connect(this.dbURI)
                this.log.write('', 'Entity: Connected to remote MongoDB')
            } 
        } catch(err) {
            this.log.write('', `Entity: Not connected to remote MongoDB ${err.message}`)
        }
    }

    async getPlayer(deviceId) {
        const query = Player.where({ deviceId: decodeBase64Url(deviceId) }).select("_id deviceId displayName email")
        return await query.findOne() // player object is returned
    }

    async deletePlayer(deviceId) {
        try{
            const response = await Player.deleteOne({ deviceId: decodeBase64Url(deviceId) })
            if(response.deletedCount!==0) return {deleted: decodeBase64Url(deviceId)} 
            else return {deleted: 'none'}            
        } catch (error) { throw error }
    }

    async getApp(appId) {
        const query = App.where({ app: appId })
        return await query.findOne() // app object is returned
    }    

    async updatePlayer(msg) {
        const filter = { deviceId: msg.deviceId } // find by device id
        const update = { displayName: msg.name, email: msg.email, language: msg.language} // update the fields
        const player = await Player.findOneAndUpdate(filter, update)
        return player
    }

}

module.exports = Entity