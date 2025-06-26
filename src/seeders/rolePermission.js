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
            permissionId: '685135a0f2a5cb3fcc6b8f03', // Thêm khách hàng
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '6853d1b6fa10ea77cf67990b', // Xem
        },
        // {
        //     roleId: '684927c871287f2ae7d8130b',
        //     permissionId: '6853d1b6fa10ea77cf67990f', // Xem
        // },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '6853d1b6fa10ea77cf67990a', // Cập nhật
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '6853d1b6fa10ea77cf67990d', // khoá hoặc mở khoá
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '6853d1b6fa10ea77cf679911', // Xóa
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
            permissionId: '685a1b9f9f5d2f68d81a1eb4', // Sản phẩm
        },

        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '685a1b9f9f5d2f68d81a1eb6', // Thêm
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '685a1b9f9f5d2f68d81a1eb7', // Xem
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '685a1b9f9f5d2f68d81a1eb8', // Cập nhật
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '685a1b9f9f5d2f68d81a1eb9', // Khóa Mở khóa
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
            permissionId: '6856e210a596678c37b505e1', // Xem phiếu nhập kho
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '68568d96dd90fa75cb286479', // Tạo phiếu nhập kho
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '6858d5bd26c71e076fdfad83', // Cập nhật phiếu nhập kho
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '6858d5bd26c71e076fdfad21', // Xác nhận phiếu nhập kho
        },

        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684927c871287f2ae7d81308', // Xuất kho
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '685a477d73dd15c087569dee', // Xem phiếu xuất kho
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '685a477d73dd15c087569def', // Tạo phiếu xuất kho
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '685a477d73dd15c087569df0', // Cập nhật phiếu xuất kho
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '685a477d73dd15c087569df1', // Xác nhận phiếu xuất kho
        },

        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684927c871287f2ae7d81309', // Tạm ứng
        },

        // Nhân viên kho =======================================================================================
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '684927c871287f2ae7d812fd', // Nhân viên
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '684927c871287f2ae7d812fe', // xem
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '684927c871287f2ae7d812ff', // thêm
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '684927c871287f2ae7d81300', // cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '684927c871287f2ae7d81301', // xóa
        // },

        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '684927c871287f2ae7d81302', // Khách hàng
        },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '685135a0f2a5cb3fcc6b8f03', // Thêm khách hàng
        // },
        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '6853d1b6fa10ea77cf67990b', // Xem
        },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '6853d1b6fa10ea77cf67990f', // Xem
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '6853d1b6fa10ea77cf67990a', // Cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '6853d1b6fa10ea77cf67990d', // khoá hoặc mở khoá
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '6853d1b6fa10ea77cf679911', // Xóa
        // },

        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '684927c871287f2ae7d81303', // Nhà cung cấp
        },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '684bd4f6fa59db4b4781d2b2', // Thêm nhà cung cấp
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '684bd4f6fa59db4b4781d2ae', // Cập nhật nhà cung cấp
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '684bd4f6fa59db4b4781d2af', // Xóa nhà cung cấp
        // },
        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '684bd4f6fa59db4b4781d2b0', // Xem nhà cung cấp
        },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '684bd4f6fa59db4b4781d2b1', //Khóa mở khóa nhà cung cấp
        // },

        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '684927c871287f2ae7d81304', // Kho hàng
        },
        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '684c3d35f0e869d0df11fed3', // xem
        },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '684c3d35f0e869d0df11fed4', // thêm
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '684c3d35f0e869d0df11fed5', // cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '684c3d35f0e869d0df11fed6', // xóa
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '685247989820dda77e2e7272', // cập nhật trạng thái
        // },

        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '684927c871287f2ae7d81305', // Danh mục
        },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '6854e30d6b90439ad8c00dbb', // Thêm
        // },
        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '6854e30d6b90439ad8c00dbc', // Xem
        },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '6854e30d6b90439ad8c00dbd', // Cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '6854e30d6b90439ad8c00dbe', // Khóa Mở khóa
        // },

        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '685a1b9f9f5d2f68d81a1eb4', // Sản phẩm
        },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '685a1b9f9f5d2f68d81a1eb6', // Thêm
        // },
        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '685a1b9f9f5d2f68d81a1eb7', // Xem
        },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '685a1b9f9f5d2f68d81a1eb8', // Cập nhật
        // },
        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '685a1b9f9f5d2f68d81a1eb9', // Khóa Mở khóa
        },

        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '684927c871287f2ae7d81306', // Thương hiệu
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '68525e2d25829b7e6b32a612', // thêm
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '68525e2d25829b7e6b32a613', // xem
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '68525e2d25829b7e6b32a615', // sửa
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '68525e2d25829b7e6b32a614', // xoá
        // },

        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '684927c871287f2ae7d81307', // Nhập kho
        },
        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '6856e210a596678c37b505e1', // Xem phiếu nhập kho
        },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '68568d96dd90fa75cb286479', // Tạo phiếu nhập kho
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '6858d5bd26c71e076fdfad83', // Cập nhật phiếu nhập kho
        // },
        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '6858d5bd26c71e076fdfad21', // Xác nhận phiếu nhập kho
        },

        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '684927c871287f2ae7d81308', // Xuất kho
        },
        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '685a477d73dd15c087569dee', // Xem phiếu xuất kho
        },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '685a477d73dd15c087569def', // Tạo phiếu xuất kho
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '685a477d73dd15c087569df0', // Cập nhật phiếu xuất kho
        // },
        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '685a477d73dd15c087569df1', // Xác nhận phiếu xuất kho
        },

        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '684927c871287f2ae7d81309', // Tạm ứng
        },

        // Kế toán kho =======================================================================================
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '684927c871287f2ae7d812fd', // Nhân viên
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '684927c871287f2ae7d812fe', // xem
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '684927c871287f2ae7d812ff', // thêm
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '684927c871287f2ae7d81300', // cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '684927c871287f2ae7d81301', // xóa
        // },

        {
            roleId: '684927c871287f2ae7d8130e',
            permissionId: '684927c871287f2ae7d81302', // Khách hàng
        },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '685135a0f2a5cb3fcc6b8f03', // Thêm khách hàng
        // },
        {
            roleId: '684927c871287f2ae7d8130e',
            permissionId: '6853d1b6fa10ea77cf67990b', // Xem khách hàng
        },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '6853d1b6fa10ea77cf67990f', // Xem tất cả khách hàng
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '6853d1b6fa10ea77cf67990a', // Cập nhật khách hàng
        // },
        {
            roleId: '684927c871287f2ae7d8130e',
            permissionId: '6853d1b6fa10ea77cf67990d', // khoá hoặc mở khoá khách hàng
        },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '6853d1b6fa10ea77cf679911', // delete bay màu khách hàng
        // },

        {
            roleId: '684927c871287f2ae7d8130e',
            permissionId: '684927c871287f2ae7d81303', // Nhà cung cấp
        },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '684bd4f6fa59db4b4781d2b2', // Thêm nhà cung cấp
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '684bd4f6fa59db4b4781d2ae', // Cập nhật nhà cung cấp
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '684bd4f6fa59db4b4781d2af', // Xóa nhà cung cấp
        // },
        {
            roleId: '684927c871287f2ae7d8130e',
            permissionId: '684bd4f6fa59db4b4781d2b0', // Xem nhà cung cấp
        },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '684bd4f6fa59db4b4781d2b1', //Khóa mở khóa nhà cung cấp
        // },

        {
            roleId: '684927c871287f2ae7d8130e',
            permissionId: '684927c871287f2ae7d81304', // Kho hàng
        },
        {
            roleId: '684927c871287f2ae7d8130e',
            permissionId: '684c3d35f0e869d0df11fed3', // xem
        },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '684c3d35f0e869d0df11fed4', // thêm
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '684c3d35f0e869d0df11fed5', // cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '684c3d35f0e869d0df11fed6', // xóa
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '685247989820dda77e2e7272', // cập nhật trạng thái
        // },

        {
            roleId: '684927c871287f2ae7d8130e',
            permissionId: '684927c871287f2ae7d81305', // Danh mục
        },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '6854e30d6b90439ad8c00dbb', // Thêm
        // },
        {
            roleId: '684927c871287f2ae7d8130e',
            permissionId: '6854e30d6b90439ad8c00dbc', // Xem
        },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '6854e30d6b90439ad8c00dbd', // Cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '6854e30d6b90439ad8c00dbe', // Khóa Mở khóa
        // },

        {
            roleId: '684927c871287f2ae7d8130e',
            permissionId: '685a1b9f9f5d2f68d81a1eb4', // Sản phẩm
        },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '685a1b9f9f5d2f68d81a1eb6', // Thêm
        // },
        {
            roleId: '684927c871287f2ae7d8130e',
            permissionId: '685a1b9f9f5d2f68d81a1eb7', // Xem
        },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '685a1b9f9f5d2f68d81a1eb8', // Cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '685a1b9f9f5d2f68d81a1eb9', // Khóa Mở khóa
        // },

        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '684927c871287f2ae7d81306', // Thương hiệu
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '68525e2d25829b7e6b32a612', // thêm
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '68525e2d25829b7e6b32a613', // xem
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '68525e2d25829b7e6b32a615', // sửa
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '68525e2d25829b7e6b32a614', // xoá
        // },

        {
            roleId: '684927c871287f2ae7d8130e',
            permissionId: '684927c871287f2ae7d81307', // Nhập kho
        },
        {
            roleId: '684927c871287f2ae7d8130e',
            permissionId: '6856e210a596678c37b505e1', // Xem phiếu nhập kho
        },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '68568d96dd90fa75cb286479', // Tạo phiếu nhập kho
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '6858d5bd26c71e076fdfad83', // Cập nhật phiếu nhập kho
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '6858d5bd26c71e076fdfad21', // Xác nhận phiếu nhập kho
        // },

        {
            roleId: '684927c871287f2ae7d8130e',
            permissionId: '684927c871287f2ae7d81308', // Xuất kho
        },
        {
            roleId: '684927c871287f2ae7d8130e',
            permissionId: '685a477d73dd15c087569dee', // Xem phiếu xuất kho
        },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '685a477d73dd15c087569def', // Tạo phiếu xuất kho
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '685a477d73dd15c087569df0', // Cập nhật phiếu xuất kho
        // },
        {
            roleId: '684927c871287f2ae7d8130e',
            permissionId: '685a477d73dd15c087569df1', // Xác nhận phiếu xuất kho
        },

        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '684927c871287f2ae7d81309', // Tạm ứng
        // },

        // Kế toán công nợ =======================================================================================
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '684927c871287f2ae7d812fd', // Nhân viên
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '684927c871287f2ae7d812fe', // xem
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '684927c871287f2ae7d812ff', // thêm
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '684927c871287f2ae7d81300', // cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '684927c871287f2ae7d81301', // xóa
        // },

        {
            roleId: '684927c871287f2ae7d8130f',
            permissionId: '684927c871287f2ae7d81302', // Khách hàng
        },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '685135a0f2a5cb3fcc6b8f03', // Thêm khách hàng
        // },
        {
            roleId: '684927c871287f2ae7d8130f',
            permissionId: '6853d1b6fa10ea77cf67990b', // Xem khách hàng
        },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '6853d1b6fa10ea77cf67990f', // Xem tất cả khách hàng
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '6853d1b6fa10ea77cf67990a', // Cập nhật khách hàng
        // },
        {
            roleId: '684927c871287f2ae7d8130f',
            permissionId: '6853d1b6fa10ea77cf67990d', // khoá hoặc mở khoá khách hàng
        },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '6853d1b6fa10ea77cf679911', // delete bay màu khách hàng
        // },

        {
            roleId: '684927c871287f2ae7d8130f',
            permissionId: '684927c871287f2ae7d81303', // Nhà cung cấp
        },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '684bd4f6fa59db4b4781d2b2', // Thêm nhà cung cấp
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '684bd4f6fa59db4b4781d2ae', // Cập nhật nhà cung cấp
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '684bd4f6fa59db4b4781d2af', // Xóa nhà cung cấp
        // },
        {
            roleId: '684927c871287f2ae7d8130f',
            permissionId: '684bd4f6fa59db4b4781d2b0', // Xem nhà cung cấp
        },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '684bd4f6fa59db4b4781d2b1', //Khóa mở khóa nhà cung cấp
        // },

        {
            roleId: '684927c871287f2ae7d8130f',
            permissionId: '684927c871287f2ae7d81304', // Kho hàng
        },
        {
            roleId: '684927c871287f2ae7d8130f',
            permissionId: '684c3d35f0e869d0df11fed3', // xem
        },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '684c3d35f0e869d0df11fed4', // thêm
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '684c3d35f0e869d0df11fed5', // cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '684c3d35f0e869d0df11fed6', // xóa
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '685247989820dda77e2e7272', // cập nhật trạng thái
        // },

        {
            roleId: '684927c871287f2ae7d8130f',
            permissionId: '684927c871287f2ae7d81305', // Danh mục
        },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '6854e30d6b90439ad8c00dbb', // Thêm
        // },
        {
            roleId: '684927c871287f2ae7d8130f',
            permissionId: '6854e30d6b90439ad8c00dbc', // Xem
        },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '6854e30d6b90439ad8c00dbd', // Cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '6854e30d6b90439ad8c00dbe', // Khóa Mở khóa
        // },

        {
            roleId: '684927c871287f2ae7d8130f',
            permissionId: '685a1b9f9f5d2f68d81a1eb4', // Sản phẩm
        },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '685a1b9f9f5d2f68d81a1eb6', // Thêm
        // },
        {
            roleId: '684927c871287f2ae7d8130f',
            permissionId: '685a1b9f9f5d2f68d81a1eb7', // Xem
        },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '685a1b9f9f5d2f68d81a1eb8', // Cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '685a1b9f9f5d2f68d81a1eb9', // Khóa Mở khóa
        // },

        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '684927c871287f2ae7d81306', // Thương hiệu
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '68525e2d25829b7e6b32a612', // thêm
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '68525e2d25829b7e6b32a613', // xem
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '68525e2d25829b7e6b32a615', // sửa
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '68525e2d25829b7e6b32a614', // xoá
        // },

        {
            roleId: '684927c871287f2ae7d8130f',
            permissionId: '684927c871287f2ae7d81307', // Nhập kho
        },
        {
            roleId: '684927c871287f2ae7d8130f',
            permissionId: '6856e210a596678c37b505e1', // Xem phiếu nhập kho
        },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '68568d96dd90fa75cb286479', // Tạo phiếu nhập kho
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '6858d5bd26c71e076fdfad83', // Cập nhật phiếu nhập kho
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '6858d5bd26c71e076fdfad21', // Xác nhận phiếu nhập kho
        // },

        {
            roleId: '684927c871287f2ae7d8130f',
            permissionId: '684927c871287f2ae7d81308', // Xuất kho
        },
        {
            roleId: '684927c871287f2ae7d8130f',
            permissionId: '685a477d73dd15c087569dee', // Xem phiếu xuất kho
        },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '685a477d73dd15c087569def', // Tạo phiếu xuất kho
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '685a477d73dd15c087569df0', // Cập nhật phiếu xuất kho
        // },
        {
            roleId: '684927c871287f2ae7d8130f',
            permissionId: '685a477d73dd15c087569df1', // Xác nhận phiếu xuất kho
        },

        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '684927c871287f2ae7d81309', // Tạm ứng
        // },

        // Kế toán hóa đơn =======================================================================================
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '684927c871287f2ae7d812fd', // Nhân viên
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '684927c871287f2ae7d812fe', // xem
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '684927c871287f2ae7d812ff', // thêm
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '684927c871287f2ae7d81300', // cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '684927c871287f2ae7d81301', // xóa
        // },

        {
            roleId: '684927c871287f2ae7d81310',
            permissionId: '684927c871287f2ae7d81302', // Khách hàng
        },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '685135a0f2a5cb3fcc6b8f03', // Thêm khách hàng
        // },
        {
            roleId: '684927c871287f2ae7d81310',
            permissionId: '6853d1b6fa10ea77cf67990b', // Xem khách hàng
        },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '6853d1b6fa10ea77cf67990f', // Xem tất cả khách hàng
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '6853d1b6fa10ea77cf67990a', // Cập nhật khách hàng
        // },
        {
            roleId: '684927c871287f2ae7d81310',
            permissionId: '6853d1b6fa10ea77cf67990d', // khoá hoặc mở khoá khách hàng
        },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '6853d1b6fa10ea77cf679911', // delete bay màu khách hàng
        // },

        {
            roleId: '684927c871287f2ae7d81310',
            permissionId: '684927c871287f2ae7d81303', // Nhà cung cấp
        },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '684bd4f6fa59db4b4781d2b2', // Thêm nhà cung cấp
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '684bd4f6fa59db4b4781d2ae', // Cập nhật nhà cung cấp
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '684bd4f6fa59db4b4781d2af', // Xóa nhà cung cấp
        // },
        {
            roleId: '684927c871287f2ae7d81310',
            permissionId: '684bd4f6fa59db4b4781d2b0', // Xem nhà cung cấp
        },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '684bd4f6fa59db4b4781d2b1', //Khóa mở khóa nhà cung cấp
        // },

        {
            roleId: '684927c871287f2ae7d81310',
            permissionId: '684927c871287f2ae7d81304', // Kho hàng
        },
        {
            roleId: '684927c871287f2ae7d81310',
            permissionId: '684c3d35f0e869d0df11fed3', // xem
        },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '684c3d35f0e869d0df11fed4', // thêm
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '684c3d35f0e869d0df11fed5', // cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '684c3d35f0e869d0df11fed6', // xóa
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '685247989820dda77e2e7272', // cập nhật trạng thái
        // },

        {
            roleId: '684927c871287f2ae7d81310',
            permissionId: '684927c871287f2ae7d81305', // Danh mục
        },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '6854e30d6b90439ad8c00dbb', // Thêm
        // },
        {
            roleId: '684927c871287f2ae7d81310',
            permissionId: '6854e30d6b90439ad8c00dbc', // Xem
        },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '6854e30d6b90439ad8c00dbd', // Cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '6854e30d6b90439ad8c00dbe', // Khóa Mở khóa
        // },

        {
            roleId: '684927c871287f2ae7d81310',
            permissionId: '685a1b9f9f5d2f68d81a1eb4', // Sản phẩm
        },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '685a1b9f9f5d2f68d81a1eb6', // Thêm
        // },
        {
            roleId: '684927c871287f2ae7d81310',
            permissionId: '685a1b9f9f5d2f68d81a1eb7', // Xem
        },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '685a1b9f9f5d2f68d81a1eb8', // Cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '685a1b9f9f5d2f68d81a1eb9', // Khóa Mở khóa
        // },

        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '684927c871287f2ae7d81306', // Thương hiệu
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '68525e2d25829b7e6b32a612', // thêm
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '68525e2d25829b7e6b32a613', // xem
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '68525e2d25829b7e6b32a615', // sửa
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '68525e2d25829b7e6b32a614', // xoá
        // },

        {
            roleId: '684927c871287f2ae7d81310',
            permissionId: '684927c871287f2ae7d81307', // Nhập kho
        },
        {
            roleId: '684927c871287f2ae7d81310',
            permissionId: '6856e210a596678c37b505e1', // Xem phiếu nhập kho
        },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '68568d96dd90fa75cb286479', // Tạo phiếu nhập kho
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '6858d5bd26c71e076fdfad83', // Cập nhật phiếu nhập kho
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '6858d5bd26c71e076fdfad21', // Xác nhận phiếu nhập kho
        // },

        {
            roleId: '684927c871287f2ae7d81310',
            permissionId: '684927c871287f2ae7d81308', // Xuất kho
        },
        {
            roleId: '684927c871287f2ae7d81310',
            permissionId: '685a477d73dd15c087569dee', // Xem phiếu xuất kho
        },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '685a477d73dd15c087569def', // Tạo phiếu xuất kho
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '685a477d73dd15c087569df0', // Cập nhật phiếu xuất kho
        // },
        {
            roleId: '684927c871287f2ae7d81310',
            permissionId: '685a477d73dd15c087569df1', // Xác nhận phiếu xuất kho
        },

        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '684927c871287f2ae7d81309', // Tạm ứng
        // },

        // Bán hàng =======================================================================================
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '684927c871287f2ae7d812fd', // Nhân viên
        // },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '684927c871287f2ae7d812fe', // xem
        // },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '684927c871287f2ae7d812ff', // thêm
        // },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '684927c871287f2ae7d81300', // cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '684927c871287f2ae7d81301', // xóa
        // },

        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '684927c871287f2ae7d81302', // Khách hàng
        },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '685135a0f2a5cb3fcc6b8f03', // Thêm khách hàng
        // },
        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '6853d1b6fa10ea77cf67990b', // Xem khách hàng
        },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '6853d1b6fa10ea77cf67990f', // Xem tất cả khách hàng
        // },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '6853d1b6fa10ea77cf67990a', // Cập nhật khách hàng
        // },
        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '6853d1b6fa10ea77cf67990d', // khoá hoặc mở khoá khách hàng
        },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '6853d1b6fa10ea77cf679911', // delete bay màu khách hàng
        // },

        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '684927c871287f2ae7d81303', // Nhà cung cấp
        },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '684bd4f6fa59db4b4781d2b2', // Thêm nhà cung cấp
        // },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '684bd4f6fa59db4b4781d2ae', // Cập nhật nhà cung cấp
        // },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '684bd4f6fa59db4b4781d2af', // Xóa nhà cung cấp
        // },
        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '684bd4f6fa59db4b4781d2b0', // Xem nhà cung cấp
        },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '684bd4f6fa59db4b4781d2b1', //Khóa mở khóa nhà cung cấp
        // },

        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '684927c871287f2ae7d81304', // Kho hàng
        },
        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '684c3d35f0e869d0df11fed3', // xem
        },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '684c3d35f0e869d0df11fed4', // thêm
        // },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '684c3d35f0e869d0df11fed5', // cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '684c3d35f0e869d0df11fed6', // xóa
        // },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '685247989820dda77e2e7272', // cập nhật trạng thái
        // },

        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '684927c871287f2ae7d81305', // Danh mục
        },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '6854e30d6b90439ad8c00dbb', // Thêm
        // },
        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '6854e30d6b90439ad8c00dbc', // Xem
        },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '6854e30d6b90439ad8c00dbd', // Cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '6854e30d6b90439ad8c00dbe', // Khóa Mở khóa
        // },

        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '685a1b9f9f5d2f68d81a1eb4', // Sản phẩm
        },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '685a1b9f9f5d2f68d81a1eb6', // Thêm
        // },
        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '685a1b9f9f5d2f68d81a1eb7', // Xem
        },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '685a1b9f9f5d2f68d81a1eb8', // Cập nhật
        // },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '685a1b9f9f5d2f68d81a1eb9', // Khóa Mở khóa
        // },

        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '684927c871287f2ae7d81306', // Thương hiệu
        // },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '68525e2d25829b7e6b32a612', // thêm
        // },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '68525e2d25829b7e6b32a613', // xem
        // },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '68525e2d25829b7e6b32a615', // sửa
        // },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '68525e2d25829b7e6b32a614', // xoá
        // },

        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '684927c871287f2ae7d81307', // Nhập kho
        },
        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '6856e210a596678c37b505e1', // Xem phiếu nhập kho
        },
        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '68568d96dd90fa75cb286479', // Tạo phiếu nhập kho
        },
        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '6858d5bd26c71e076fdfad83', // Cập nhật phiếu nhập kho
        },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '6858d5bd26c71e076fdfad21', // Xác nhận phiếu nhập kho
        // },

        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '684927c871287f2ae7d81308', // Xuất kho
        },
        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '685a477d73dd15c087569dee', // Xem phiếu xuất kho
        },
        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '685a477d73dd15c087569def', // Tạo phiếu xuất kho
        },
        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '685a477d73dd15c087569df0', // Cập nhật phiếu xuất kho
        },
        // {
        //     roleId: '684927c871287f2ae7d81311',
        //     permissionId: '685a477d73dd15c087569df1', // Xác nhận phiếu xuất kho
        // },

        {
            roleId: '684927c871287f2ae7d81311',
            permissionId: '684927c871287f2ae7d81309', // Tạm ứng
        },
    ])
    logger.info('RolePermission seeded')
}

module.exports = rolePermissionSeeder
