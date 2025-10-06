const { model, Types, Schema } = require('mongoose')

const workOrderTestA = new Schema({
    workOrderId: {
        type: new Types.ObjectId(),
        required: true,
    },
    maintenanceContract: {
        type: Boolean,
        required: true,
    },
    

})
