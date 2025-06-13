const { Types } = require('mongoose')

const { logger } = require('../config/loggerConfig')
const RoleModel = require('../models/role')

async function roleSeeder() {
    await RoleModel.deleteMany({})
    await RoleModel.insertMany([
        {
            _id: new Types.ObjectId('684927c871287f2ae7d8130a'),
            name: 'BGĐ',
            note: 'Ban giám đốc',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d8130b'),
            name: 'Quản trị viên',
            note: 'Quản trị viên',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d8130c'),
            name: 'Nhân viên kho',
            note: 'Nhân viên kho',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d8130e'),
            name: 'Kế toán kho',
            note: 'Kế toán kho',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d8130f'),
            name: 'Kế toán công nợ',
            note: 'Kế toán công nợ',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81310'),
            name: 'Kế toán hóa đơn',
            note: 'Kế toán hóa đơn',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81311'),
            name: 'Bán hàng',
            note: 'Bán hàng',
        },
    ])
    logger.info('Roles seeded')
}

module.exports = roleSeeder
