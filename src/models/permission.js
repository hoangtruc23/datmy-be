const { Schema, model, Types } = require('mongoose')

const permissionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    parentPermissionId: {
        type: Types.ObjectId,
        ref: 'permissions',
        validate: {
            validator: function (v) {
                return v === null || Types.ObjectId.isValid(v)
            },
            message: 'Invalid parentPermissionId',
        },
    },
})

const PermissionModel = model('permissions', permissionSchema)

module.exports = PermissionModel
