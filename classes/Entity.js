const mongoose = require('mongoose')
const Log = require('../classes/Log')
const Player = require('../models/player')
const Score = require('../models/score')
const App = require('../models/app')

const lib = require('../lib/base64')
const { response } = require('express')

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

    async upsertPlayer(player) {
        const filter = { deviceId: player.deviceId } // find by device id
        const update = { displayName: player.displayName, callSign: player.callSign, email: player.email, language: player.language} // update the fields
        const response = await Player.findOneAndUpdate(filter, update, { new: true, upsert: true }) // new sends back the updated 'record'
        return response
    }


    async upsertScores(req) {
        try{
            req.body.forEach(async (x) => {
                x.deviceId = req.headers.device
                await this.upsertScore(x)
            })
        } catch(error){
            // res.status(error.type).json({ type: error.type, message: error.message })
            throw error
        }
    }

    async upsertScore(score) {
        const filter = { id: score.id } // find by unique score id
        const update = { ...score } // update the fields
        try{
            await Score.findOneAndUpdate(filter, update, { upsert: true }) // we do not need the updated record here                    
        } catch (error) {
            throw error
        }
    }

    async setRanking() {
        
        // Ranking is determined by -->
        // 1. score = number of points (higher is better)
        // 2. time = time used to get the correct answers (lower is better)
        // 3. streaks = number of times the user answered 10 consecutive questions correctly (higher is better)
        // 4. name = user name; in case of equal score this is used to determine ranking in alphabetical order
        // 5. id = GUID; in case of equal score and equal name this is used to determine ranking in alphabetical order
        
        // https://thecodebarbarian.com/whats-new-in-mongoose-53-async-iterators.html

        // if you use lean() you get a stripped object that does not have the save method, great for performance but do not use here

        let rank = 1;
        for await (const score of Score.find().sort({ score: -1, time: 1, streaks: -1, name: 1, id: 1 })) {
            score.gl_rank = rank            
            await score.save({ validateBeforeSave: false })
            rank+=1                        
        }        
    }

    async getRanking(deviceId) {
                
        // if you use lean after you just made an update you get the old document version. Do not use this after an update

        const response = []
        for await (const score of Score.find({deviceId: deviceId})) {
            const object = {
                gl_rank: score.gl_rank,
                id: score.id
            }
            response.push(object)
        }
        return response
    }    

}

module.exports = Entity