const { Types } = require('mongoose')

const { logger } = require('../config/loggerConfig')
const UserModel = require('../models/user')

async function userSeeder() {
    await UserModel.deleteMany({})
    await UserModel.insertMany([
        {
            _id: new Types.ObjectId('684bcaeb7cac1b319680bf09'),
            fullname: 'Root',
            username: 'root',
            email: 'root@gmail.com',
            phoneNumber: '',
            password:
                '$2b$10$VbLYkTVZG0gy7gNoaJZCduG4B8OS8670Goz1XjRu6xC71YdJgIJF6',
            isActive: true,
            roleIds: [null],
        },
        {
            _id: new Types.ObjectId('684bcaeb7cac1b319680bf0a'),
            fullname: 'BGĐ',
            username: 'bgd',
            email: 'bgd@gmail.com',
            phoneNumber: '',
            password:
                '$2b$10$VbLYkTVZG0gy7gNoaJZCduG4B8OS8670Goz1XjRu6xC71YdJgIJF6',
            isActive: true,
            roleIds: ['684927c871287f2ae7d8130a'],
        },
        {
            _id: new Types.ObjectId('684bcaeb7cac1b319680bf0b'),
            fullname: 'Quản trị viên',
            username: 'quantrivien',
            email: '',
            phoneNumber: '',
            password:
                '$2b$10$VbLYkTVZG0gy7gNoaJZCduG4B8OS8670Goz1XjRu6xC71YdJgIJF6',
            isActive: true,
            roleIds: ['684927c871287f2ae7d8130b'],
        },
        {
            _id: new Types.ObjectId('684bcaeb7cac1b319680bf0d'),
            fullname: 'Nhân viên kho',
            username: 'nhanvienkho',
            email: '',
            phoneNumber: '',
            password:
                '$2b$10$VbLYkTVZG0gy7gNoaJZCduG4B8OS8670Goz1XjRu6xC71YdJgIJF6',
            isActive: true,
            roleIds: ['684927c871287f2ae7d8130c'],
        },
        {
            _id: new Types.ObjectId('684bcaeb7cac1b319680bf0e'),
            fullname: 'Kế toán kho',
            username: 'ketoankho',
            email: '',
            phoneNumber: '',
            password:
                '$2b$10$VbLYkTVZG0gy7gNoaJZCduG4B8OS8670Goz1XjRu6xC71YdJgIJF6',
            isActive: true,
            roleIds: ['684927c871287f2ae7d8130e'],
        },
        {
            _id: new Types.ObjectId('684bcaeb7cac1b319680bf0f'),
            fullname: 'Kế toán công nợ',
            username: 'ketoancongno',
            email: '',
            phoneNumber: '',
            password:
                '$2b$10$VbLYkTVZG0gy7gNoaJZCduG4B8OS8670Goz1XjRu6xC71YdJgIJF6',
            isActive: true,
            roleIds: ['684927c871287f2ae7d8130f'],
        },
        {
            _id: new Types.ObjectId('684bcaeb7cac1b319680bf10'),
            fullname: 'Kế toán hóa đơn',
            username: 'ketoanhoadon',
            email: '',
            phoneNumber: '',
            password:
                '$2b$10$VbLYkTVZG0gy7gNoaJZCduG4B8OS8670Goz1XjRu6xC71YdJgIJF6',
            isActive: true,
            roleIds: ['684927c871287f2ae7d81310'],
        },
        {
            _id: new Types.ObjectId('684bcaeb7cac1b319680bf11'),
            fullname: 'Bán hàng',
            username: 'banhang',
            email: '',
            phoneNumber: '',
            password:
                '$2b$10$VbLYkTVZG0gy7gNoaJZCduG4B8OS8670Goz1XjRu6xC71YdJgIJF6',
            isActive: true,
            roleIds: ['684927c871287f2ae7d81311'],
        },
    ])
    logger.info('Users seeded')
}

module.exports = userSeeder
