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
            department: null,
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
            department: null,
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
            department: null,
            roleIds: ['684927c871287f2ae7d8130b'],
        },
        //inventory
        {
            _id: new Types.ObjectId('68f6f6d74bc127ec1ab44ed4'),
            fullname: 'Quản lý kho',
            username: 'quanlykho',
            email: '',
            phoneNumber: '',
            password:
                '$2b$10$VbLYkTVZG0gy7gNoaJZCduG4B8OS8670Goz1XjRu6xC71YdJgIJF6',
            isActive: true,
            department: 'warehouse',
            roleIds: ['68f6f623dc799da9305e4347'],
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
            department: 'warehouse',
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
            department: 'warehouse',
            roleIds: ['684927c871287f2ae7d8130e'],
        },
        //finance
        {
            _id: new Types.ObjectId('68f6f6d74bc127ec1ab44ed5'),
            fullname: 'Quản lý công nợ',
            username: 'quanlycongno',
            email: '',
            phoneNumber: '',
            password:
                '$2b$10$VbLYkTVZG0gy7gNoaJZCduG4B8OS8670Goz1XjRu6xC71YdJgIJF6',
            isActive: true,
            department: 'finance',
            roleIds: ['68f6f623dc799da9305e4348'],
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
            department: 'finance',
            roleIds: ['684927c871287f2ae7d8130f'],
        },
        {
            _id: new Types.ObjectId('684bcaeb7cac1b319680bf10'),
            fullname: 'Kế toán hóa đơn',
            username: 'ketoanhoadon',
            email: '',
            phoneNumber: 'finance',
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
            phoneNumber: 'finance',
            password:
                '$2b$10$VbLYkTVZG0gy7gNoaJZCduG4B8OS8670Goz1XjRu6xC71YdJgIJF6',
            isActive: true,
            roleIds: ['684927c871287f2ae7d81311'],
        },
        //technical
        {
            _id: new Types.ObjectId('68f6f6d74bc127ec1ab44ed6'),
            fullname: 'Quản lý kỹ thuật',
            username: 'quanlykythuat',
            email: '',
            phoneNumber: '',
            password:
                '$2b$10$VbLYkTVZG0gy7gNoaJZCduG4B8OS8670Goz1XjRu6xC71YdJgIJF6',
            isActive: true,
            department: 'technical',
            roleIds: ['68f6f623dc799da9305e4349'],
        },
        {
            _id: new Types.ObjectId('68f6f6d74bc127ec1ab44ed7'),
            fullname: 'Kỹ thuật viên',
            username: 'kythuatvien',
            email: '',
            phoneNumber: '',
            password:
                '$2b$10$VbLYkTVZG0gy7gNoaJZCduG4B8OS8670Goz1XjRu6xC71YdJgIJF6',
            isActive: true,
            department: 'technical',
            roleIds: ['68f6f623dc799da9305e434a'],
        },
    ])
    logger.info('Users seeded')
}

module.exports = userSeeder
