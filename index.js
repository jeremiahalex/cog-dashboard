const express = require('express')
const app = express()
const request = require('request');
const sampleURL = 'https://cog-connector.herokuapp.com/pipes/5809fb29d8de4a2cfaf454d9'

app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  if (!req.query.name) {
    var err = new Error('Unprocessable')
    err.status = 422
    return res.render('error', { error: err, message: "provide a name kvp in the query string" })
  }

  const props = { props: [ { name: req.query.name }] }
  request.post({url: sampleURL, json: props }, (error, response, body) => {
    if ( error || response.statusCode !== 200) {
      return res.render('error', { message: "Error with Pipe", error: error })
    }
    return res.render('index', body.props[0])
  })
})

// Catch Errors
app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: err
  })
})

app.listen(process.env.PORT || 3001, () => {
  console.log(`Dashboard Ready`)
})
