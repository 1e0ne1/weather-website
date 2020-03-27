const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')

const app = express()
const port = process.env.PORT || 3000 //for heroku

//define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views') //views folder
const partialPaths = path.join(__dirname, '../templates/partials') //partialtemplates

//Setup hindelbars engine and views location
app.set('view engine', 'hbs') //enable npm module hbs for express
app.set('views', viewsPath) //indicate hbs to use this path instead of views
hbs.registerPartials(partialPaths);

//setup static directory to serve
app.use(express.static(publicDirectoryPath)) //load static pages


//++++++++++++++++++++++routes begin++++++++++++++++++++++++++++++++
app.get('', (req, res) => {
    res.render('index', { //request views/index.hbs
        title: 'Weather App',
        name: 'Leonel'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Leonel'
    });
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        name: 'Leonel',
        helpText: 'This is the help text that is going to be displayed'
    });
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide a valid address'
        })
    }

    //call geocode

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error){
            return res.send({ error })
        }
    
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({ error })
            }
    
            res.send({
                forecast: forecastData,
                address: req.query.address,
                location: location
            })
        })
    })
})


//use requests
app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'you must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send ({
        products: []
    })
})

//404 pages added at last. This match with www.page/help/x
app.get('/help/*', (req, res) => {
    res.render('notFound', {
        title: 'Page not found',
        errorMsg: 'help article not found',
        name: 'Leo'
    })
})

//404 page ad at last, * -> means everything that has not matched before
app.get('*', (req, res) => {
    res.render('notFound', {
        title: 'Page not found',
        errorMsg: 'Page not found',
        name: 'Leo'
    })
})
//++++++++++++++++++++++routes end++++++++++++++++++++++++++++++++
//app.com
//app.com/help
//app.com/about

//start the server on port 3000. When uploading to heroku define const port
app.listen(port, () => {
    console.log('server started on port ' + port)
})