const { Schema, model, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

const userSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
        },
        department: {
            type: String,
            enum: Object.values(constant.DEPARTMENT),
        },
        roleIds: [
            {
                type: Types.ObjectId,
                ref: 'roles',
                validate: {
                    validator: function (v) {
                        return v === null || Types.ObjectId.isValid(v)
                    },
                    message: 'Invalid roleId',
                },
            },
        ],
    },
    { timestamps: true },
)

const UserModel = model('users', userSchema)

module.exports = UserModel
