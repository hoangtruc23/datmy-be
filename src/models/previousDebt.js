
const { Schema, model, Types } = require('mongoose')

const previousDebtSchema = new Schema({
    customerId: {
        type: Types.ObjectId,
        ref: 'customers',
        required: true,
    },
    previousDebitBalance: {  //Dư nợ trước đó
        type: Number,
        required: true,
    },
    previousCreditBalance: {  //Dư có trước đó
        type: Number,
        required: true,
    },
    preMonth: {
        type: String,
        required: true
    }
})

const PreviousDebtModel = model('previousDebts', previousDebtSchema)

module.exports = PreviousDebtModel
