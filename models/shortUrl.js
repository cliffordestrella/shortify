const mongoose = require('mongoose')

const shortUrlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    shortId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('ShortUrl', shortUrlSchema)