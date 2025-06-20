const { Types } = require('mongoose')

const { logger } = require('../config/loggerConfig')
const RolePermissionModel = require('../models/rolePermission')

async function rolePermissionSeeder() {
    await RolePermissionModel.deleteMany({})
    await RolePermissionModel.insertMany([
        // role quản trị viên
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684927c871287f2ae7d812fd', // Nhân viên
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684927c871287f2ae7d812fe', // xem
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684927c871287f2ae7d812ff', // thêm
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684927c871287f2ae7d81300', // cập nhật
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684927c871287f2ae7d81301', // xóa
        },

        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684927c871287f2ae7d81302', // Khách hàng
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '685135a0f2a5cb3fcc6b8f03', // The ID for "Thêm khách hàng"
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684927c871287f2ae7d81303', // Nhà cung cấp
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684bd4f6fa59db4b4781d2b2', // Thêm nhà cung cấp
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684bd4f6fa59db4b4781d2ae', // Cập nhật nhà cung cấp
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684bd4f6fa59db4b4781d2af', // Xóa nhà cung cấp
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684bd4f6fa59db4b4781d2b0', // Xem nhà cung cấp
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684bd4f6fa59db4b4781d2b1', //Khóa mở khóa nhà cung cấp
        },

        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684927c871287f2ae7d81304', // Kho hàng
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684c3d35f0e869d0df11fed3', // xem
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684c3d35f0e869d0df11fed4', // thêm
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684c3d35f0e869d0df11fed5', // cập nhật
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684c3d35f0e869d0df11fed6', // xóa
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '685247989820dda77e2e7272', // cập nhật trạng thái
        },
        ////////// Danh mục
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684927c871287f2ae7d81305', // Danh mục
        },

        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '6854e30d6b90439ad8c00dbb', // Thêm
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '6854e30d6b90439ad8c00dbc', // Xem
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '6854e30d6b90439ad8c00dbd', // Cập nhật
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '6854e30d6b90439ad8c00dbe', // Khóa Mở khóa
        },

        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684927c871287f2ae7d81306', // Thương hiệu
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '68525e2d25829b7e6b32a612', // thêm
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '68525e2d25829b7e6b32a613', // xem
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '68525e2d25829b7e6b32a615', // sửa
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '68525e2d25829b7e6b32a614', // xoá
        },

        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684927c871287f2ae7d81307', // Nhập kho
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684927c871287f2ae7d81308', // Xuất kho
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684927c871287f2ae7d81309', // Tạm ứng
        },
    ])
    logger.info('Roles seeded')
}

module.exports = rolePermissionSeeder
