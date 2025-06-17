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
        {
            permissionId: '684927c871287f2ae7d81302', // Thêm khách hàng
            apiId: '684fd10b82aec8d414ba544d', //
        },

        // Nhà cung cấp
        {
            permissionId: '684bd4f6fa59db4b4781d2b2', // Thêm
            apiId: '684927c871287f2ae7d81320', // /supplier/create
        },

        {
            permissionId: '684bd4f6fa59db4b4781d2ae', // Cập nhật
            apiId: '684927c871287f2ae7d81321', // /supplier/update
        },

        {
            permissionId: '684bd4f6fa59db4b4781d2af', // Xóa
            apiId: '684927c871287f2ae7d81322', // /supplier/delete
        },

        {
            permissionId: '684bd4f6fa59db4b4781d2b0', // Xem
            apiId: '684927c871287f2ae7d81323', // /supplier/getById
        },

        {
            permissionId: '684bd4f6fa59db4b4781d2b0', // Xem
            apiId: '684927c871287f2ae7d81324', // /supplier/getAll
        },

        {
            permissionId: '684bd4f6fa59db4b4781d2b1', // Khóa/Mở khóa
            apiId: '684927c871287f2ae7d81325', // /supplier/lock-unlock
        },

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
