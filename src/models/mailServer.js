const { Schema, model, Types } = require('mongoose')

const mailServerSchema = new Schema({
    host: {
        type: String,
        required: true,
    },
    port: {
        type: Number,
        required: true,
    },
    secure: {
        type: Boolean,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    pass: {
        type: String,
        required: true,
    },
    receiverIds: {
        type: [
            {
                type: Types.ObjectId,
                ref: 'users',
            },
        ],
        default: [],
    },
})

const MailServerModel = model('mailservers', mailServerSchema)
module.exports = MailServerModel
