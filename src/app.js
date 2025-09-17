const express = require('express')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const compression = require('compression')
const app = express()


//init middlewares
app.use(morgan('dev'))  //dev combined common short tiny
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//init db
require('./models/init.mongodb')
const {checkOverload} = require('./helpers/check.connect')
//checkOverload()

//init router
app.use(require('./routes/index'))

module.exports = app