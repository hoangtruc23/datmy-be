const { Schema, model } = require('mongoose')

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
            require: true,
            default: true,
        },
        roleIds: [
            {
                type: Schema.Types.ObjectId,
                ref: 'roles',
            },
        ],
    },
    { timestamps: true },
)

const UserModel = model('users', userSchema)

module.exports = UserModel
