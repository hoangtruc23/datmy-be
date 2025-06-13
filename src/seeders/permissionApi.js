const { logger } = require('../config/loggerConfig')
const PermissionApiModel = require('../models/permissionApi')

async function permissionApiSeeder() {
    await PermissionApiModel.deleteMany({})
    await PermissionApiModel.insertMany([
        // user
        {
            permissionId: '684927c871287f2ae7d812fe', // Xem nhân viên
            apiId: '684927c871287f2ae7d812fa', // user/getAll
        },
        {
            permissionId: '684927c871287f2ae7d812fe', // Xem nhân viên
            apiId: '684927c871287f2ae7d812fb', // user/getById
        },
        {
            permissionId: '684927c871287f2ae7d812ff', // Thêm nhân viên
            apiId: '684927c871287f2ae7d812f8', // user/create
        },
        {
            permissionId: '684927c871287f2ae7d812ff', // Thêm nhân viên
            apiId: '684927c871287f2ae7d8131a', // user/getAllRole
        },
        {
            permissionId: '684927c871287f2ae7d81300', // Cập nhật nhân viên
            apiId: '684927c871287f2ae7d812f9', // user/update
        },
        {
            permissionId: '684927c871287f2ae7d81300', // Cập nhật nhân viên
            apiId: '684927c871287f2ae7d8131a', // user/getAllRole
        },
        {
            permissionId: '684927c871287f2ae7d81300', // Cập nhật nhân viên
            apiId: '684927c871287f2ae7d81318', // user/changePassword
        },
        {
            permissionId: '684927c871287f2ae7d81300', // Cập nhật nhân viên
            apiId: '684927c871287f2ae7d81319', // user/changeActiveStatus
        },
        {
            permissionId: '684927c871287f2ae7d81301', // Xóa nhân viên
            apiId: '684927c871287f2ae7d812fc', //
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
    logger.info('PermissionApis seeded')
}

module.exports = permissionApiSeeder
