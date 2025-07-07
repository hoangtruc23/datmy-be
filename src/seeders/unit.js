const { Types } = require('mongoose')
const { logger } = require('../config/loggerConfig')
const UnitModel = require('../models/unit')

async function unitSeeder() {
    await UnitModel.deleteMany({})
    await UnitModel.insertMany([
        //unit
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d106'),
            name: 'miếng',
            note: 'miếng',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d107'),
            name: 'kg',
            note: 'kilogram',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d108'),
            name: 'lít',
            note: 'lít',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d109'),
            name: 'hộp',
            note: 'hộp',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d10a'),
            name: 'm',
            note: 'mét',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d10b'),
            name: 'bộ',
            note: 'bộ',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d10c'),
            name: 'đôi',
            note: 'đôi',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d10d'),
            name: 'cuộn',
            note: 'cuộn',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d10e'),
            name: 'gói',
            note: 'gói',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d10f'),
            name: 'tấm',
            note: 'tấm',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d110'),
            name: 'chai',
            note: 'chai',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d111'),
            name: 'lon',
            note: 'lon',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d112'),
            name: 'ống',
            note: 'ống',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d114'),
            name: 'món',
            note: 'món',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d115'),
            name: 'lần',
            note: 'lần',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d118'),
            name: 'máy',
            note: 'máy',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d120'),
            name: 'lọ',
            note: 'lọ',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d121'),
            name: 'sợi',
            note: 'sợi',
        },
        {
            _id: new Types.ObjectId('6858ba9390e28f169336d122'),
            name: 'con',
            note: 'con',
        },
    ])
    logger.info('Unit seeded')
}

module.exports = unitSeeder
