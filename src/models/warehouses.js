const mongoose = require('mongoose')
const Schema = mongoose.Schema

const wareHouses = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
})

module.exports = mongoose.model('WareHouses', wareHouses)
