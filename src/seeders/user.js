const { logger } = require('../config/loggerConfig')
const UserModel = require('../models/user')

async function userSeeder() {
    await UserModel.deleteMany({})
    await UserModel.insertMany([
        {
            fullname: 'Nguyễn Văn Tài',
            username: 'admin',
            email: '',
            phoneNumber: '',
            password:
                '$2b$10$VbLYkTVZG0gy7gNoaJZCduG4B8OS8670Goz1XjRu6xC71YdJgIJF6',
            isActive: true,
            roleIds: [],
        },
        {
            fullname: 'Quản trị viên',
            username: 'quantrivien',
            email: '',
            phoneNumber: '',
            password:
                '$2b$10$VbLYkTVZG0gy7gNoaJZCduG4B8OS8670Goz1XjRu6xC71YdJgIJF6',
            isActive: true,
            roleIds: ['684927c871287f2ae7d8130b'],
        },
    ])
    logger.info('Users seeded')
}

module.exports = userSeeder
