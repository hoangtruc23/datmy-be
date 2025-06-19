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
        {
            _id: new Types.ObjectId('685135a0f2a5cb3fcc6b8ea0'), // Use a unique ID for this API
            api: '/customer/create',
            note: 'Tạo khách hàng',
        },
        // Nhà cung cấp
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81320'),
            api: '/supplier/create',
            note: 'Tạo nhà cung cấp',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81321'),
            api: '/supplier/update',
            note: 'Cập nhật thông tin nhà cung cấp',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81322'),
            api: '/supplier/delete',
            note: 'Xóa nhà cung cấp',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81323'),
            api: '/supplier/getById',
            note: 'Lấy thông tin nhà cung cấp theo ID',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81324'),
            api: '/supplier/getAll',
            note: 'Lấy danh sách tất cả nhà cung cấp',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81325'),
            api: '/supplier/lockUnlock',
            note: 'Khóa hoặc mở khóa nhà cung cấp',
        },

        // Kho hàng
        {
            _id: new Types.ObjectId('684c41f3ae24ff427ec487ea'),
            api: '/warehouse/getAll',
            note: 'Lấy danh sách các kho',
        },
        {
            _id: new Types.ObjectId('6850f580343ebe406db9af51'),
            api: '/warehouse/create',
            note: 'Tạo kho mới',
        },
        {
            _id: new Types.ObjectId('68511d6d55dd137821188fdb'),
            api: 'warehouse/getById',
            note: 'Lấy một kho theo ID',
        },
        {
            _id: new Types.ObjectId('685139e2ca1de719c6e17706'),
            api: '/warehouse/update',
            note: 'Chỉnh sửa kho',
        },
        {
            _id: new Types.ObjectId('68523eb5400185858c2a19d3'),
            api: '/warehouse/delete',
            note: 'Xoá kho hàng',
        },
        {
            _id: new Types.ObjectId('685246a87a7937ce073f6d51'),
            api: '/warehouse/changeActive',
            note: 'Thay đổi trạng thái của kho',
        },

        // Danh mục
        // Thương hiệu
        {
            _id: new Types.ObjectId('68525e2d25829b7e6b32a5e8'),
            api: '/brand/create',
            note: 'Tạo thương hiệu mới',
        },
        {
            _id: new Types.ObjectId('68525e2d25829b7e6b32a5e9'),
            api: '/brand/getAll',
            note: 'Lấy tất cả thương hiệu',
        },
        {
            _id: new Types.ObjectId('68525e2d25829b7e6b32a5ea'),
            api: '/brand/getById',
            note: 'Lấy thương hiệu theo id',
        },
        {
            _id: new Types.ObjectId('68525e2d25829b7e6b32a5eb'),
            api: '/brand/update',
            note: 'Chỉnh sửa thương hiệu',
        },
        {
            _id: new Types.ObjectId('68525e2d25829b7e6b32a5ec'),
            api: '/brand/delete',
            note: 'Xoá thương hiệu',
        },
        {
            _id: new Types.ObjectId('68525e2d25829b7e6b32a5ed'),
            api: '/brand/changeActive',
            note: 'Thay đổi trạng thái của thương hiệu',
        },
        // Nhập kho
        // Xuất kho
        // Tạm ứng
    ])
    logger.info('Users seeded')
}

module.exports = apiSeeder
