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
            apiId: '685135a0f2a5cb3fcc6b8ea0', // /customer/create
        },
        {
            permissionId: '6853d1b6fa10ea77cf67990a', // Cập nhật khách hàng
            apiId: '6853d1b6fa10ea77cf679909', // /customer/update
        },
        {
            permissionId: '6853d1b6fa10ea77cf67990b', // Xem khách hàng
            apiId: '6853d1b6fa10ea77cf67990c', // /customer/getById
        },
        {
            permissionId: '6853d1b6fa10ea77cf67990f', // The existing 'Xem khách hàng' permission ID
            apiId: '6853d1b6fa10ea77cf679910', // /customer/getAll
        },
        {
            permissionId: '6853d1b6fa10ea77cf67990d', // khoá mở khoá khách hàng
            apiId: '6853d1b6fa10ea77cf67990e', // /customer/lockUnlock
        },
        {
            permissionId: '6853d1b6fa10ea77cf679911', // xoá khách hàng
            apiId: '6853d1b6fa10ea77cf679912', // /customer/delete
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
            permissionId: '684bd4f6fa59db4b4781d2b0', // Xem
            apiId: '6854111eb04f5d42c7ef5ef2', // /suplier/cities
        },
        {
            permissionId: '684bd4f6fa59db4b4781d2b0', // Xem
            apiId: '6854111eb04f5d42c7ef5ef3', // /supplier/districts
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

        // Tải tệp lên
        {
            permissionId: '6854e30d6b90439ad8c00dbb', // Thêm
            apiId: '6854e30d6b90439ad8c00dbf', // /upload/image
        },
        {
            permissionId: '6854e30d6b90439ad8c00dbb', // Thêm
            apiId: '6854e30d6b90439ad8c00dc0', // /upload/file
        },

        {
            permissionId: '6854e30d6b90439ad8c00dbd', // Cập nhật
            apiId: '6854e30d6b90439ad8c00dbf', // /upload/image
        },
        {
            permissionId: '6854e30d6b90439ad8c00dbd', // Cập nhật
            apiId: '6854e30d6b90439ad8c00dc0', // /upload/file
        },

        // Danh mục
        {
            permissionId: '6854e30d6b90439ad8c00dbb', // Thêm
            apiId: '6854e30d6b90439ad8c00db6', // /productCategory/create
        },
        {
            permissionId: '6854e30d6b90439ad8c00dbc', // Xem
            apiId: '6854e30d6b90439ad8c00db7', // /productCategory/getAll
        },
        {
            permissionId: '6854e30d6b90439ad8c00dbc', // Xem
            apiId: '6854e30d6b90439ad8c00db8', // /productCategory/getById
        },
        {
            permissionId: '6854e30d6b90439ad8c00dbd', // Cập nhật
            apiId: '6854e30d6b90439ad8c00db9', // /productCategory/update
        },
        {
            permissionId: '6854e30d6b90439ad8c00dbe', // Khóa/Mở khóa
            apiId: '6854e30d6b90439ad8c00dba', // /productCategory/lockUnlock
        },

        // Sản phẩm
        {
            permissionId: '685a1b9f9f5d2f68d81a1eb6', // Thêm
            apiId: '685a1b9f9f5d2f68d81a1ead', // /product/create
        },
        {
            permissionId: '685a1b9f9f5d2f68d81a1eb6', // Thêm
            apiId: '685a1b9f9f5d2f68d81a1eaf', // /product/getAllUnit
        },
        {
            permissionId: '685a1b9f9f5d2f68d81a1eb7', // Xem
            apiId: '685a1b9f9f5d2f68d81a1eb1', // /product/getAll
        },
        {
            permissionId: '685a1b9f9f5d2f68d81a1eb7', // Xem
            apiId: '685a1b9f9f5d2f68d81a1eb2', // /product/getById
        },
        {
            permissionId: '685a1b9f9f5d2f68d81a1eb8', // Cập nhật
            apiId: '685a1b9f9f5d2f68d81a1eae', // /product/update
        },
        {
            permissionId: '685a1b9f9f5d2f68d81a1eb9', // Khóa/Mở khóa
            apiId: '685a1b9f9f5d2f68d81a1eb0', // /product/lockUnlock
        },

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
        {
            permissionId: '6856e210a596678c37b505e1', // Xem phiếu nhập kho
            apiId: '685799ea543a1de61aec7329', // /goodsReceipt/getAll
        },
        {
            permissionId: '6856e210a596678c37b505e1', // Xem phiếu nhập kho
            apiId: '6856e210a596678c37b505e2', // /goodsReceipt/getById
        },
        {
            permissionId: '68568d96dd90fa75cb286479', // Tạo phiếu nhập kho
            apiId: '68568d96dd90fa75cb28647a', // /goodsReceipt/createTemporary
        },
        {
            permissionId: '68568d96dd90fa75cb286479', // Tạo phiếu nhập kho
            apiId: '685830dc888ceab12ecb2759', // /goodsReceipt/create
        },
        {
            permissionId: '68568d96dd90fa75cb286479', // Tạo phiếu nhập kho
            apiId: '68592f5521ca74c391267f78', // /goodsReceipt/cancel
        },
        {
            permissionId: '68568d96dd90fa75cb286479', // Tạo phiếu nhập kho
            apiId: '6856a471897b183049a2ef8a', // /goodsReceipt/addProduct
        },
        {
            permissionId: '68568d96dd90fa75cb286479', // Tạo phiếu nhập kho
            apiId: '6856e210a596678c37b505de', // /goodsReceipt/updateProduct
        },
        {
            permissionId: '68568d96dd90fa75cb286479', // Tạo phiếu nhập kho
            apiId: '6856e210a596678c37b505df', // /goodsReceipt/deleteProduct
        },
        {
            permissionId: '6858d5bd26c71e076fdfad83', // Cập nhật phiếu nhập kho
            apiId: '6858d5bd26c71e076fdfad84', // /goodsReceipt/update
        },
        //Cập nhật thì cũng có thể thêm xóa sửa sản phẩm cho phiếu nhập kho
        {
            permissionId: '6858d5bd26c71e076fdfad83', // Tạo phiếu nhập kho
            apiId: '6856a471897b183049a2ef8a', // /goodsReceipt/addProduct
        },
        {
            permissionId: '6858d5bd26c71e076fdfad83', // Tạo phiếu nhập kho
            apiId: '6856e210a596678c37b505de', // /goodsReceipt/updateProduct
        },
        {
            permissionId: '6858d5bd26c71e076fdfad83', // Tạo phiếu nhập kho
            apiId: '6856e210a596678c37b505df', // /goodsReceipt/deleteProduct
        },
        {
            permissionId: '6858d5bd26c71e076fdfad21', // Xác nhận nhập kho
            apiId: '6858d5bd26c71e076fdfad75', // /goodsReceipt/confirmQuantity
        },
        {
            permissionId: '6858d5bd26c71e076fdfad21', // Xác nhận nhập kho
            apiId: '6858d5bd26c71e076fdfad76', // /goodsReceipt/approval
        },

        // Xuất kho

        // Tạm ứng
    ])
    logger.info('PermissionApis seeded')
}

module.exports = permissionApiSeeder
