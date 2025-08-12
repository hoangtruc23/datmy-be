const { Types } = require('mongoose')
const { logger } = require('../config/loggerConfig')
const UnitModel = require('../models/unit')

async function unitSeeder() {
    await UnitModel.deleteMany({})
    await UnitModel.insertMany([
        //unit
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d106'),
            name: 'Miếng',
            note: 'miếng',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d107'),
            name: 'Kilogram',
            note: 'kilogram',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d108'),
            name: 'Lít',
            note: 'lít',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d109'),
            name: 'Hộp',
            note: 'hộp',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d10a'),
            name: 'Mét',
            note: 'mét',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d10b'),
            name: 'Bộ',
            note: 'bộ',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d10c'),
            name: 'Đôi',
            note: 'đôi',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d10d'),
            name: 'Cuộn',
            note: 'cuộn',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d10e'),
            name: 'Gói',
            note: 'gói',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d10f'),
            name: 'Tấm',
            note: 'tấm',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d110'),
            name: 'Chai',
            note: 'chai',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d111'),
            name: 'Lon',
            note: 'lon',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d112'),
            name: 'Ống',
            note: 'ống',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d114'),
            name: 'Món',
            note: 'món',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d115'),
            name: 'Lần',
            note: 'lần',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d118'),
            name: 'Máy',
            note: 'máy',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d120'),
            name: 'Lọ',
            note: 'lọ',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d121'),
            name: 'Sợi',
            note: 'sợi',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d122'),
            name: 'Con',
            note: 'con',
        },
        {
            _id: new Types.ObjectId('687080ca818f89182bcf122c'),
            name: 'Cái',
            note: 'cái',
        },
        {
            _id: new Types.ObjectId('687080ca818f89182bcf122b'),
            name: 'Thùng',
            note: 'thùng',
        },
        {
            _id: new Types.ObjectId('687080ca818f89182bcf122a'),
            name: 'Túi',
            note: 'túi',
        },
        {
            _id: new Types.ObjectId('687080ca818f89182bcf1229'),
            name: 'Bình',
            note: 'bình',
        },
        {
            _id: new Types.ObjectId('687080ca818f89182bcf1228'),
            name: 'Thẻ',
            note: 'thẻ',
        },
        {
            _id: new Types.ObjectId('687080ca818f89182bcf1227'),
            name: 'Cây',
            note: 'cây',
        },
        {
            _id: new Types.ObjectId('687080ca818f89182bcf1226'),
            name: 'Viên',
            note: 'viên',
        },
    ])
    logger.info('Unit seeded')
}

module.exports = unitSeeder
