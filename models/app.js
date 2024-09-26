const mongoose = require('mongoose')
const Schema = mongoose.Schema

const appSchema = new Schema({
    app: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        required: true
    },
    write: {
        type: Boolean,
        required: true
    },    
    delete: {
        type: Boolean,
        required: true
    },    
}, { timestamps: true })

// be ware of the naming convention here. Mongoose will pluralise this and use it as the collection name in de database!! (App -> Apps)
const App = mongoose.model('App', appSchema)

module.exports = App