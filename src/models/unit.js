const { Schema, model } = require('mongoose')

const unitSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    note: {
        type: String,
    },
})

const UnitModel = model('units', unitSchema)

module.exports = UnitModel
