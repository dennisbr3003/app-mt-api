const express = require('express')
const Entity = require('./classes/Entity.js')

require('dotenv').config()

const initApp = async () => {
    await entity.init() 
}

const app = express()

const entity = new Entity(__dirname)

// needed to handle axios post body objects
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(require('./middlewares.js'))

app.listen(process.env.PORT) 

// convenient to start the app from the terminal
console.log('ready to receive requests on ', `http://localhost:${process.env.PORT}`)

initApp()

app.get('/player/:deviceId?', async (req, res) => {
    const execute = !!req.params.deviceId ?? false
    if(execute) {
        const player = await entity.getPlayer(req.params.deviceId)
        if(player!==null){
            res.status(200).json(player)
            return
        } 
    }    
    res.status(404).json({type: '404', message: 'resource could not be found' })
})

app.delete('/player/:deviceId?', async (req, res) => {
    const execute = !!req.params.deviceId ?? false
    if(execute) {
        try{
            const result = await entity.deletePlayer(req.params.deviceId)
            res.status(200).json(result)
            return
        } catch(error){
            res.status(error.type).json({ type: error.type, message: error.message })
            return
        }
    }    
    res.status(404).json({type: '404', message: 'resource could not be found' })
})

app.post('/player', async (req, res) => {
    try{
        const result = await entity.upsertPlayer(req.body)
        res.status(200).json(result)
        return
    } catch(error){
        res.status(error.type).json({ type: error.type, message: error.message })
        return
    }
})

app.use(async (req, res) => {
    res.status(500).json({type: '500', message: 'unknown or erroneous request' })
})