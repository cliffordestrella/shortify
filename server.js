const express = require('express')
const mongoose = require('mongoose')
const shortId = require('shortid')
const createHttpError = require('http-errors')
const ShortUrl = require('./models/shortUrl')
const app = express()
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')))

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true
}).then(() => console.log('mongo connected'))
.catch((error) => console.log('Error connecting db'))


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  res.render('index')
})

app.post('/', async (req, res) => {

    const { url } = req.body
    const urlExists = await ShortUrl.findOne({ url })
    if (urlExists) {
      res.render('index', {
        short_url: urlExists.shortId
      })
      return
    }
    const shortUrl = new ShortUrl({ url: url, shortId: shortId.generate() })
    const result = await shortUrl.save()
    res.render('index', {
      short_url: result.shortId
    })
})


app.get('/:shortId', async (req, res, next) => {
  try {
    const { shortId } = req.params
    const result = await ShortUrl.findOne({ shortId })
    if (!result) {
      throw createHttpError.NotFound('Short url does not exist')
    }
    res.redirect(result.url)
  } catch (error) {
    next(error)
  }
})


// app.post('/', async (req, res) => {
   
//     const { shortId } = req.body
//     const idExists = await ShortUrl.findOne({ shortId })
//     if (idExists) {
//     res.render('index', {
//         searchId: idExists.url
//     })
//     return
//     } else {
//         res.send('Short Url not found')
//     }

// })



app.listen(process.env.PORT || 5000);
