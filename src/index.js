const express = require('express'),
      mongoose = require('mongoose'),
      os = require('os'),
      bodyParser = require('body-parser')

const app = express()

// Middlewares
app.use(bodyParser.json())

// Mongoose connection
mongoose.connect('mongodb://mongodb:27017/chirper', { useNewUrlParser: true })

// Models
require('./models')

// Routes
app.use('/user', require('./routes'))

// Start
app.listen(process.env.PORT, () => console.log(`Listening on port ${ process.env.PORT }`))