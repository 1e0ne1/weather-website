const request = require('request')

const forecast = (lat, lon, callback) => {
    const url = 'https://api.darksky.net/forecast/95eaae37601555c998e4ecf91581aff0/' + lat + ',' + lon + '?units=us&lang=es'
    request({url: url, json: true}, (error, response) => {
        if(error){
            callback('Unable to connecto to weather service', undefined)
        } else if(response.body.error){
            callback('Unable to find Location', undefined)
        } else {
            callback(undefined, "It is currently " + response.body.currently.temperature + " degrees out. There is a " + (response.body.currently.precipProbability * 100) + "% chance of " + response.body.currently.precipType)
        }
    })
}

module.exports = forecast