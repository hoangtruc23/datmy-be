const { Types } = require('mongoose')
const { logger } = require('../config/loggerConfig')
const MachinePropertiesModel = require('../models/machineProperties')
const constant = require('../utils/constant/constant')

async function machinePropertiesSeeder() {
    await MachinePropertiesModel.deleteMany({})
    await MachinePropertiesModel.insertMany([
        {
            _id: new Types.ObjectId('69081ac30879097d22c84abe'),
            name: 'Loại mực',
            type: 'linked',
            categoryLinkedName: constant.CATEGORY_NAME.MATERIAL_INK,
        },
        {
            _id: new Types.ObjectId('6909cccb681d4e170abadbd2'),
            name: 'Ruy băng',
            type: 'linked',
            categoryLinkedName: constant.CATEGORY_NAME.MATERIAL_RIBBON,
        },
        {
            _id: new Types.ObjectId('69081ac30879097d22c84abf'),
            name: 'Béc Phun',
            type: 'custom',
        },
        {
            _id: new Types.ObjectId('69081ac30879097d22c84ac0'),
            name: 'Cảm biến',
            type: 'custom',
        },
        {
            _id: new Types.ObjectId('69081ac30879097d22c84ac1'),
            name: 'Đồng tốc',
            type: 'custom',
        },
        {
            _id: new Types.ObjectId('69081ac30879097d22c84ac2'),
            name: 'Nhiệt độ mực',
            type: 'normal',
        },
        {
            _id: new Types.ObjectId('69081ac30879097d22c84ac3'),
            name: 'Áp suất mực',
            type: 'normal',
        },
    ])
    logger.info('MachineProperties seeded')
}
module.exports = machinePropertiesSeeder
