const mongoose = require('mongoose')
const Schema = mongoose.Schema

const playerSchema = new Schema({
    deviceId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: false
    },
    callSign: {
        type: String,
        required: false
    },    
    email: {
        type: String,
        required: false
    },    
    language: {
        type: String,
        required: false,
        default: "EN"
    }
}, { timestamps: true })

// be ware of the naming convention here. Mongoose will pluralise this and use it as the collection name in de database!! (Player -> Players)
const Player = mongoose.model('Player', playerSchema)

module.exports = Player