const mongoose = require('mongoose')
const Schema = mongoose.Schema

const scoreSchema = new Schema({
    deviceId: {
        type: String,
        required: false,
        default: ''
    },
    callSign: {
        type: String,
        required: true
    },    
    created: {
        type: String,
        required: true
    },
    gl_loaded: {
        type: Boolean,
        required: true
    },
    gl_rank: {
        type: Number,
        required: true
    },
    gl_sync: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    rank: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },        
    score: {
        type: Number,
        required: false
    },
    streaks: {
        type: Number,
        required: false
    },    
    time: {
        type: Number,
        required: false
    },    
}, { timestamps: true, versionKey: false })

// be ware of the naming convention here. Mongoose will pluralise this and use it as the collection name in de database!! (Player -> Players)
const Score = mongoose.model('Score', scoreSchema)

module.exports = Score