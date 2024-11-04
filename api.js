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

app.get('/player', async (req, res) => {
    try{
        const player = await entity.getPlayer(req.headers.device)
        res.status(200).json(player)
    } catch(error) {
        res.status(error.type).json({ type: error.type, message: error.message })
    }
    return
})

app.delete('/player', async (req, res) => {
    try{
        const result = await entity.deletePlayer(req.headers.device)
        res.status(200).json(result)        
    } catch(error){
        res.status(error.type).json({ type: error.type, message: error.message })
    }
    return
})

app.post('/player', async (req, res) => {
    try{
        const result = await entity.upsertPlayer(req.body)
        res.status(200).json(result)
    } catch(error){
        res.status(error.type).json({ type: error.type, message: error.message })
    }
    return
})

app.post('/score', async (req, res) => {
    try {
        await entity.upsertScores(req)
        await entity.setRanking()
        const result = await entity.getRanking(req.headers.device)        
        res.status(200).json({result: result})
    } catch (error) {
        res.status(error.type).json({ type: error.type, message: error.message })
    }
    return
})

app.use(async (req, res) => {
    res.status(500).json({type: '500', message: 'unknown or erroneous request' })
})