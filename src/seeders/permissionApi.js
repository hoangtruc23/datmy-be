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
            permissionId: '685135a0f2a5cb3fcc6b8f03', // The ID for "Thêm khách hàng"
            apiId: '685135a0f2a5cb3fcc6b8ea0', // The ID for the /customer/create API
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
        {
            permissionId: '684c3d35f0e869d0df11fed3', // Xem kho hàng
            apiId: '684c41f3ae24ff427ec487ea', // warehouse/getAll
        },
        {
            permissionId: '684c3d35f0e869d0df11fed4', // Tạo kho hàng
            apiId: '6850f580343ebe406db9af51', // warehouse/create
        },
        {
            permissionId: '684c3d35f0e869d0df11fed3', // Xem kho hàng
            apiId: '68511d6d55dd137821188fdb', // warehouse/getById/{id}
        },
        {
            permissionId: '684c3d35f0e869d0df11fed5', // Chỉnh sửa kho hàng
            apiId: '685139e2ca1de719c6e17706', // warehouse/update/{id}
        },
        {
            permissionId: '684c3d35f0e869d0df11fed6', // Xoá kho hàng
            apiId: '68523eb5400185858c2a19d3', // warehouse/delete/{id}
        },
        {
            permissionId: '685247989820dda77e2e7272', // Cập nhật trạng thái kho hàng
            apiId: '685246a87a7937ce073f6d51', // warehouse/changeActive/{id}
        },

        // Danh mục

        // Thương hiệu
        {
            permissionId: '68525e2d25829b7e6b32a612', // tạo thương hiệu
            apiId: '68525e2d25829b7e6b32a5e8', // brand/create
        },
        {
            permissionId: '68525e2d25829b7e6b32a613', // lấy tất cả thương hiệu
            apiId: '68525e2d25829b7e6b32a5e9', // brand/getAll
        },
        {
            permissionId: '68525e2d25829b7e6b32a613', // lấy một thương hiệu theo id
            apiId: '68525e2d25829b7e6b32a5ea', // brand/getById/{id}
        },
        {
            permissionId: '68525e2d25829b7e6b32a615', // chỉnh sửa thương hiệu
            apiId: '68525e2d25829b7e6b32a5eb', // brand/update/{id}
        },
        {
            permissionId: '68525e2d25829b7e6b32a614', // xoá thương hiệu
            apiId: '68525e2d25829b7e6b32a5ec', // brand/delete/{id}
        },
        {
            permissionId: '68525e2d25829b7e6b32a615', // thay đổi trạng thái thương hiệu
            apiId: '68525e2d25829b7e6b32a5ed', // brand/changeActive/{id}
        },

        // Nhập kho

        // Xuất kho

        // Tạm ứng
    ])
    logger.info('PermissionApis seeded')
}

module.exports = permissionApiSeeder
