const { Types } = require('mongoose')
const { logger } = require('../config/loggerConfig')
const ApiModel = require('../models/api')

async function apiSeeder() {
    await ApiModel.deleteMany({})
    await ApiModel.insertMany([
        // User
        {
            _id: new Types.ObjectId('684927c871287f2ae7d812fa'),
            api: '/user/getAll',
            note: 'Xem toàn bộ danh sách user',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d812fb'),
            api: '/user/getById',
            note: 'Xem user theo id',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d812f8'),
            api: '/user/create',
            note: 'Tạo user',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d812f9'),
            api: '/user/update',
            note: 'Cập nhật user',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81318'),
            api: '/user/changePassword',
            note: 'Cập nhật mật khẩu cho 1 user',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81319'),
            api: '/user/changeActiveStatus',
            note: 'Cập nhật trạng thái của user',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d8131a'),
            api: '/user/getAllRole',
            note: 'Lấy danh sách tất cả các quyền',
        },

        // Khách hàng
        // Nhà cung cấp
        // Kho hàng
        // Danh mục
        // Thương hiệu
        // Nhập kho
        // Xuất kho
        // Tạm ứng
    ])
    logger.info('Users seeded')
}

module.exports = apiSeeder
