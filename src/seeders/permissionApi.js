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
            permissionId: '685cd0861d476d4f5d40f95e', // Khóa / Mở khóa nhân viên
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
            permissionId: '6853d1b6fa10ea77cf67990b', // Xem khách hàng
            apiId: '6853d1b6fa10ea77cf679910', // /customer/getAll
        },
        {
            permissionId: '6853d1b6fa10ea77cf67990b', // Xem khách hàng
            apiId: '689973596c78b8d2879bb340', // /customer/cities
        },
        {
            permissionId: '6853d1b6fa10ea77cf67990b', // Xem khách hàng
            apiId: '689973596c78b8d2879bb341', // /customer/districts
        },
        // {
        //     permissionId: '6853d1b6fa10ea77cf67990f', // The existing 'Xem khách hàng' permission ID
        //     apiId: '6853d1b6fa10ea77cf679910', // /customer/getAll
        // },
        {
            permissionId: '6853d1b6fa10ea77cf67990d', // khoá mở khoá khách hàng
            apiId: '6853d1b6fa10ea77cf67990e', // /customer/lockUnlock
        },
        {
            permissionId: '6853d1b6fa10ea77cf679911', // xoá khách hàng
            apiId: '6853d1b6fa10ea77cf679912', // /customer/delete
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
            permissionId: '685a1b9f9f5d2f68d81a1eb7', // Xem
            apiId: '685e0db179ac9c1b83c0f4ae', // /product/getTotalQuantityByProductI
        },
        {
            permissionId: '685a1b9f9f5d2f68d81a1eb7', // Xem
            apiId: '685e0db179ac9c1b83c0f4af', // /product/getAllWithQuantity
        },

        {
            permissionId: '685a1b9f9f5d2f68d81a1eb8', // Cập nhật
            apiId: '685a1b9f9f5d2f68d81a1eae', // /product/update
        },
        {
            permissionId: '685a1b9f9f5d2f68d81a1eb8', // Cập nhật
            apiId: '685e0db179ac9c1b83c0f4b0', // /product/getProductStorages
        },
        {
            permissionId: '685a1b9f9f5d2f68d81a1eb8', // Cập nhật
            apiId: '685e0db179ac9c1b83c0f4b1', // /product/getReceiptByTrackingCode
        },
        {
            permissionId: '685a1b9f9f5d2f68d81a1eb8', // Cập nhật
            apiId: '6867a1e973162d4001f57c90', // /product/getIssueByTrackingCode
        },
        {
            permissionId: '685a1b9f9f5d2f68d81a1eb8', // Cập nhật
            apiId: '6868e75fcebe446e4c78bbb6', // /product/getAdvanceByTrackingCode
        },
        {
            permissionId: '685a1b9f9f5d2f68d81a1eb9', // Khóa/Mở khóa
            apiId: '685a1b9f9f5d2f68d81a1eb0', // /product/lockUnlock
        },
        {
            permissionId: '685a1b9f9f5d2f68d81a1ec9', // cập nhật số lượng tồn kho
            apiId: '6868e75fcebe446e4c78bbb7', // /product/updateQuantityProductStorage
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
            permissionId: '685cd0861d476d4f5d40f95f', // thay đổi trạng thái thương hiệu
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
            permissionId: '6856e210a596678c37b505e1', // Xem phiếu nhập kho
            apiId: '6864fd7c1d9ec4d84204b71a', // /goodsReceipt/downloadInvoice
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
            permissionId: '6858d5bd26c71e076fdfad83', // Cập nhật phiếu nhập kho
            apiId: '6856a471897b183049a2ef8a', // /goodsReceipt/addProduct
        },
        {
            permissionId: '6858d5bd26c71e076fdfad83', // Cập nhật phiếu nhập kho
            apiId: '6856e210a596678c37b505de', // /goodsReceipt/updateProduct
        },
        {
            permissionId: '6858d5bd26c71e076fdfad83', // Cập nhật phiếu nhập kho
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
        {
            permissionId: '685a2a4f4630d293367c288c',
            apiId: '685a2a4f4630d293367c288b', // /goodsReceipt/export
        },
        {
            permissionId: '6864fd7c1d9ec4d84204b720', // Tải file số hóa đơn/ hợp đồng phiếu nhập kho
            apiId: '6864fd7c1d9ec4d84204b71a', // /goodsReceipt/downloadInvoice
        },

        // Xuất kho
        {
            permissionId: '685a477d73dd15c087569dee', // Xem phiếu xuất kho
            apiId: '685a477d73dd15c087569de3', // /goodsIssue/getAll
        },
        {
            permissionId: '685a477d73dd15c087569dee', // Xem phiếu xuất kho
            apiId: '685a477d73dd15c087569de4', // /goodsIssue/getById
        },
        {
            permissionId: '685a477d73dd15c087569dee', // Xem phiếu xuất kho
            apiId: '6864fd7c1d9ec4d84204b71c', // /goodsIssue/downloadInvoice
        },
        {
            permissionId: '685a477d73dd15c087569dee', // Xem phiếu xuất kho
            apiId: '6864fd7c1d9ec4d84204b71d', // /goodsIssue/generatePdf
        },

        {
            permissionId: '685a477d73dd15c087569def', // Tạo phiếu xuất kho
            apiId: '685a477d73dd15c087569de5', // /goodsIssue/createTemporary
        },
        {
            permissionId: '685a477d73dd15c087569def', // Tạo phiếu xuất kho
            apiId: '685a477d73dd15c087569de6', // /goodsIssue/create
        },
        {
            permissionId: '685a477d73dd15c087569def', // Tạo phiếu xuất kho
            apiId: '685a477d73dd15c087569de8', // /goodsIssue/cancel
        },
        {
            permissionId: '685a477d73dd15c087569def', // Tạo phiếu xuất kho
            apiId: '685a477d73dd15c087569de9', // /goodsIssue/addProduct
        },
        {
            permissionId: '685a477d73dd15c087569def', // Tạo phiếu xuất kho
            apiId: '685a477d73dd15c087569dea', // /goodsIssue/updateProduct
        },
        {
            permissionId: '685a477d73dd15c087569def', // Tạo phiếu xuất kho
            apiId: '685a477d73dd15c087569deb', // /goodsIssue/deleteProduct
        },
        {
            permissionId: '685a477d73dd15c087569df0', // Cập nhật phiếu xuất kho
            apiId: '685a477d73dd15c087569de7', // /goodsIssue/update
        },
        // chuyển kho
        {
            permissionId: '688c7f601bb97636f19d6ab2', // tạo phiếu chuyển kho
            apiId: '68a44835a3d2cdd989be0632', // /productTransferHistory/transferProduct
        },
        {
            permissionId: '688c7f601bb97636f19d6ab3', // xem phiếu chuyển kho
            apiId: '68a44835a3d2cdd989be0631', // /productTransferHistory/getAll
        },
        {
            permissionId: '688c7f601bb97636f19d6ab3', // xem phiếu chuyển kho chi tiết
            apiId: '68a44835a3d2cdd989be0633', // /productTransferHistory/getById
        },
        //Cập nhật thì cũng có thể thêm xóa sửa sản phẩm cho phiếu xuất kho
        {
            permissionId: '685a477d73dd15c087569df0', // Cập nhật phiếu xuất kho
            apiId: '685a477d73dd15c087569de9', // /goodsIssue/addProduct
        },
        {
            permissionId: '685a477d73dd15c087569df0', // Cập nhật phiếu xuất kho
            apiId: '685a477d73dd15c087569dea', // /goodsIssue/updateProduct
        },
        {
            permissionId: '685a477d73dd15c087569df0', // Cập nhật phiếu xuất kho
            apiId: '685a477d73dd15c087569deb', // /goodsIssue/deleteProduct
        },
        {
            permissionId: '685a477d73dd15c087569df1', // Xác nhận nhập kho
            apiId: '685a477d73dd15c087569dec', // /goodsIssue/confirmQuantity
        },
        {
            permissionId: '685a477d73dd15c087569df1', // Xác nhận nhập kho
            apiId: '685a477d73dd15c087569ded', // /goodsIssue/approval
        },
        {
            permissionId: '6861f2e524fe5c2a802dcaea',
            apiId: '6861f2e524fe5c2a802dcae9', // /goodsIssue/export
        },
        {
            permissionId: '6864fd7c1d9ec4d84204b71e', // Tải file số hóa đơn/ hợp đồng phiếu xuất kho
            apiId: '6864fd7c1d9ec4d84204b71c', // /goodsIssue/downloadInvoice
        },
        {
            permissionId: '6864fd7c1d9ec4d84204b71f', // Tải file PDF phiếu xuất kho
            apiId: '6864fd7c1d9ec4d84204b71d', // /goodsIssue/generatePdf
        },

        // Tạm ứng
        {
            permissionId: '685cf633e0e45d397c4ca197', // Xem phiếu tạm ứng
            apiId: '685cf633e0e45d397c4ca18b', // /goodsAdvance/getAll
        },
        {
            permissionId: '685cf633e0e45d397c4ca197', // Xem phiếu tạm ứng
            apiId: '685cf633e0e45d397c4ca18c', // /goodsAdvance/getById
        },
        {
            permissionId: '685cf633e0e45d397c4ca198', // Tạo phiếu tạm ứng
            apiId: '685cf633e0e45d397c4ca18d', // /goodsAdvance/createTemporary
        },
        {
            permissionId: '685cf633e0e45d397c4ca198', // Tạo phiếu tạm ứng
            apiId: '685cf633e0e45d397c4ca18e', // /goodsAdvance/create
        },
        {
            permissionId: '685cf633e0e45d397c4ca198', // Tạo phiếu tạm ứng
            apiId: '685cf633e0e45d397c4ca190', // /goodsAdvance/cancel
        },
        {
            permissionId: '685cf633e0e45d397c4ca198', // Tạo phiếu tạm ứng
            apiId: '686499029ae62f462152a6d4', // /goodsAdvance/extend
        },
        {
            permissionId: '685cf633e0e45d397c4ca198', // Tạo phiếu tạm ứng
            apiId: '685cf633e0e45d397c4ca191', // /goodsAdvance/addProduct
        },
        {
            permissionId: '685cf633e0e45d397c4ca198', // Tạo phiếu tạm ứng
            apiId: '685cf633e0e45d397c4ca192', // /goodsAdvance/updateProduct
        },
        {
            permissionId: '685cf633e0e45d397c4ca198', // Tạo phiếu tạm ứng
            apiId: '685cf633e0e45d397c4ca193', // /goodsAdvance/deleteProduct
        },
        // {
        //     permissionId: '685cf633e0e45d397c4ca199', // Cập nhật phiếu tạm ứng
        //     apiId: '685a477d73dd15c087569de7', // /goodsAdvance/update
        // },
        // //Cập nhật thì cũng có thể thêm xóa sửa sản phẩm cho phiếu tạm ứng
        // {
        //     permissionId: '685cf633e0e45d397c4ca199', // Cập nhật phiếu tạm ứng
        //     apiId: '685a477d73dd15c087569de9', // /goodsAdvance/addProduct
        // },
        // {
        //     permissionId: '685cf633e0e45d397c4ca199', // Cập nhật phiếu tạm ứng
        //     apiId: '685a477d73dd15c087569dea', // /goodsAdvance/updateProduct
        // },
        // {
        //     permissionId: '685cf633e0e45d397c4ca199', // Cập nhật phiếu tạm ứng
        //     apiId: '685a477d73dd15c087569deb', // /goodsAdvance/deleteProduct
        // },
        {
            permissionId: '685cf633e0e45d397c4ca19a', // Xác nhận nhập kho
            apiId: '685cf633e0e45d397c4ca195', // /goodsAdvance/approval
        },
        {
            permissionId: '687a08ce43d7e6c16ee8b585', // Nhận lại hàng (Tạm ứng)
            apiId: '687a08ce43d7e6c16ee8b586', // /goodsAdvance/receiveBack
        },
        {
            permissionId: '6864e6cd4c3c96b50ff0e104', // Permission: Xuất báo cáo (Tạm ứng)
            apiId: '6864e6cd4c3c96b50ff0e105', // API: /goodsAdvance/export
        },

        // Dashboard công nợ
        {
            permissionId: '689c01a260903c30215b25c0', // Xem top khách hàng có công nợ cao nhất
            apiId: '689c01a260903c30215b25c2', // /dashboard/getTopCustomersDebt
        },
        {
            permissionId: '689c01a260903c30215b25c0', // Xem tóm tắt dashboard
            apiId: '689c01a260903c30215b25c3', // /dashboard/summary
        },
        {
            permissionId: '689c01a260903c30215b25c0', // Xuất báo cáo doanh thu và công nợ theo tháng
            apiId: '689c01a260903c30215b25c4', // /dashboard/getRevenueMonthly
        },
        {
            permissionId: '689c01a260903c30215b25c0', // Xem các hóa đơn gần đây
            apiId: '689c01a260903c30215b25c5', // /dashboard/getInvoiceRecent
        },
        {
            permissionId: '689c01a260903c30215b25c0', //Xem Top khách hàng có doanh thu cao nhất
            apiId: '689c01a260903c30215b25c6', // /dashboard/getTopCustomerRevenue
        },
        {
            permissionId: '689c01a260903c30215b25c9', //Xem mặt hàng bán chạy nhất 
            apiId: '689c01a260903c30215b25c7', // /dashboard/getTopCustomerRevenue
        },

        // Hóa đơn
        {
            permissionId: '686dd0b535512a73e076c3a8', // Xem hóa đơn
            apiId: '686dd0b535512a73e076c3a5', // /invoice/getAll
        },
        {
            permissionId: '686dd0b535512a73e076c3a8', // Xem hóa đơn
            apiId: '686dd0b535512a73e076c3a4', // /invoice/getById
        },
        {
            permissionId: '686dd0b535512a73e076c3a9', // Thêm hóa đơn
            apiId: '686dd0b535512a73e076c3a2', // /invoice/create
        },
        {
            permissionId: '686dd0b535512a73e076c3a9', // Thêm hóa đơn
            apiId: '68ad5f9a4af5468fb2b7d815', // /invoice/import
        },
        {
            permissionId: '686dd0b535512a73e076c3aa', // Cập nhật hóa đơn
            apiId: '686dd0b535512a73e076c3a3', // /invoice/update
        },
        {
            permissionId: '686dd0b535512a73e076c3ab', // Xoá hóa đơn
            apiId: '686dd0b535512a73e076c3a6', // /invoice/delete
        },
        {
            permissionId: '6882fdc36f95b8b522848815', // Tổng hợp hóa đơn
            apiId: '6882fdc36f95b8b522848816', // /invoice/summary
        },

        // Lịch sử thanh toán
        {
            permissionId: '687df491fd5669a67e23a296', // Xem lịch sử thanh toán
            apiId: '687df491fd5669a67e23a293', // /paymentHistory/getAll
        },
        {
            permissionId: '687df491fd5669a67e23a296', // Xem lịch sử thanh toán
            apiId: '687df491fd5669a67e23a292', // /paymentHistory/getById
        },
        {
            permissionId: '687df491fd5669a67e23a296', // Xem lịch sử thanh toán
            apiId: '687df491fd5669a67e23a695', // /paymentHistory/getAllPaymentMethod
        },
        {
            permissionId: '687df491fd5669a67e23a297', // Thêm lịch sử thanh toán
            apiId: '687df491fd5669a67e23a290', // /paymentHistory/create
        },
        {
            permissionId: '687df491fd5669a67e23a297', // Thêm lịch sử thanh toán
            apiId: '687df491fd5669a67e23a695', // /paymentHistory/getAllPaymentMethod
        },
        {
            permissionId: '687df491fd5669a67e23a298', // Cập nhật lịch sử thanh toán
            apiId: '687df491fd5669a67e23a291', // /paymentHistory/update
        },
        {
            permissionId: '687df491fd5669a67e23a298', // Cập nhật lịch sử thanh toán
            apiId: '687df491fd5669a67e23a695', // /paymentHistory/getAllPaymentMethod
        },
        {
            permissionId: '687df491fd5669a67e23a299', // Xoá lịch sử thanh toán
            apiId: '687df491fd5669a67e23a294', // /paymentHistory/delete
        },
        //Công nợ
        {
            permissionId: '6880936c160be16212361ba2', // xem công nợ
            apiId: '6880936c160be16212361ba0', // /debt/getAll
        },
        {
            permissionId: '6880936c160be16212361ba2', // xem công nợ
            apiId: '68871438cb1a5fd3aadc0570', // /debt/getSummary
        },
        {
            permissionId: '6892ceaeee639479e26a93b4', // Tạo giấy đề nghị thanh toán
            apiId: '6892ceaeee639479e26a93b2', // /debt/generatePaymentRequest
        },
        // Đơn hàng
        {
            permissionId: '688c7f601bbabc36f19d6ab2', // Xem đơn hàng
            apiId: '68b1f0e4d1f5c4e4f8b5e8c1', // /order/getAll
        },
        {
            permissionId: '688c7f601bbabc36f19d6ab2', // Xem đơn hàng
            apiId: '68b1f0e4d1f5c4e4f8b5e8c2', // /order/getById
        },
        {
            permissionId: '688c7f601bbabc36f19d6ab2', // Xem đơn hàng
            apiId: '68b1f0e4d1f5c4e4f8b5e8c5', // /order/getByIdForIssue
        },
        {
            permissionId: '688c7f601bbabc36f19d6ab3', // Tạo đơn hàng
            apiId: '68b1f0e4d1f5c4e4f8b5e8c4', // /order/create
        },
        {
            permissionId: '688c7f601bbabc36f19d6ab4', // chỉnh sửa đơn hàng
            apiId: '68d1153524419859fede4ebd', // /order/update
        },
        {
            permissionId: '688c7f601bbabc36f19d6ab5', // xóa đơn hàng
            apiId: '68b1f0e4d1f5c4e4f8b5e8c3', // /order/delete
        },

        //Cài đặt công nợ
        {
            permissionId: '6882fdc36f95b8b522848806', // Xem
            apiId: '6882fdc36f95b8b522848802', // /configDebt/getAll
        },
        {
            permissionId: '6882fdc36f95b8b522848807', // Thêm
            apiId: '6882fdc36f95b8b522848800', // /configDebt/create
        },
        {
            permissionId: '6882fdc36f95b8b522848808', // Cập nhật
            apiId: '6882fdc36f95b8b522848801', // /configDebt/update/:id
        },
        {
            permissionId: '6882fdc36f95b8b522848806', // Xem
            apiId: '6882fdc36f95b8b522848803', // /configDebt/getById/:id
        },
        {
            permissionId: '6882fdc36f95b8b522848809', // Xóa
            apiId: '6882fdc36f95b8b522848804', // /configDebt/delete/:id
        },

        {
            permissionId: '689c01a260903c30215b25d9', // import số dư đầu kỳ
            apiId: '6882fdc36f95b8b522848888', // previousDebt/importFile
        },
        // nhắc nợ
        {
            permissionId: '68899f050e446ab399609247', // Tạo
            apiId: '68899f050e446ab39960923a', // /debtReminder/create
        },
        {
            permissionId: '68899f050e446ab399609248', // Cập nhật
            apiId: '68899f050e446ab39960923b', // /debtReminder/update
        },
        {
            permissionId: '68899f050e446ab399609246', // Xem
            apiId: '68899f050e446ab39960923c', // /debtReminder/getAll
        },
        {
            permissionId: '68899f050e446ab399609246', // Xem
            apiId: '68899f050e446ab39960923d', // /debtReminder/getAllHistory
        },
        {
            permissionId: '68899f050e446ab399609246', // Xem
            apiId: '68899f050e446ab39960923e', // /debtReminder/getById
        },
        {
            permissionId: '68899f050e446ab399609249', // Xóa
            apiId: '68899f050e446ab39960923f', // /debtReminder/delete
        },
        {
            permissionId: '68899f050e446ab399609246',
            apiId: '68899f050e446ab399609240', // getDebtReminderPriority
        },
        {
            permissionId: '68899f050e446ab399609246',
            apiId: '68899f050e446ab399609241', // getDebtResult
        },
        {
            permissionId: '68899f050e446ab399609246',
            apiId: '68899f050e446ab399609242', // getDebtReminderMethod
        },
        {
            permissionId: '68899f050e446ab399609246',
            apiId: '68899f050e446ab399609243', // checkCompleted
        },
        {
            permissionId: '68899f050e446ab399609246',
            apiId: '68899f050e446ab399609244', // getSumHistory
        },
        {
            permissionId: '68899f050e446ab399609246',
            apiId: '6898697b630fdba8a091c0eb', // getSumHistory
        },
        //Chiết khấu
        {
            permissionId: '687165e2ee8406ca535d1ba3', // Tạo phiếu chiết khấu
            apiId: '687165240ac4b74840483515', // /discount/create
        },
        {
            permissionId: '687165e2ee8406ca535d1ba2', // Xem phiếu chiết khấu
            apiId: '6871864935925a3d24f17a15', // /discount/getAll
        },
        {
            permissionId: '687165e2ee8406ca535d1ba2', // Xem phiếu chiết khấu
            apiId: '6871899346e790eda9a08c04', // /discount/getById
        },
        {
            permissionId: '687165e2ee8406ca535d1ba2', // Xem phiếu chiết khấu
            apiId: '68e6d2593a5ce22f2582b284', // /discount/getById
        },
        {
            permissionId: '687165e2ee8406ca535d1ba2', // Xem lịch sử tất cả phiếu chiết khấu
            apiId: '6871899346e790eda9a08c05', // /discount/getHistory
        },
        {
            permissionId: '687165e2ee8406ca535d1ba4', // Sửa phiếu chiết khấu
            apiId: '6871899346e790eda9a08c07', // /discount/update
        },
        {
            permissionId: '687165e2ee8406ca535d1ba4', // Sửa phiếu chiết khấu
            apiId: '687415049898805f0639a2f4', // /discount/setRefund
        },
        {
            permissionId: '687165e2ee8406ca535d1ba5', // Xóa phiếu chiết khấu
            apiId: '6871899346e790eda9a08c08', // /discount/delete
        },

        // Báo cáo
        {
            permissionId: '688c7f601bb97636f19d6ac4', // Xem Báo cáo
            apiId: '688c7f601bb97636f19d6ac5', // /reports/debt-comparison/summary
        },
        {
            permissionId: '688c7f601bb97636f19d6ac4', // Xem Báo cáo
            apiId: '688c7f601bb97636f19d6ac6', // /reports/debt-comparison/detail
        },
        {
            permissionId: '688c7f601bb97636f19d6ac4', // Xem Báo cáo
            apiId: '689d8f1028227ebb51e520e6', // /reports/sales
        },
        {
            permissionId: '688c7f601bb97636f19d6ac4', // Sinh báo cáo chi tiết khách hàng
            apiId: '689d8f1028227ebb51e520e7', // /reports/generateCustomerDetailReport
        },
        {
            permissionId: '688c7f601bb97636f19d6ad9', // Sinh báo cáo chi tiết khách hàng
            apiId: '689d8f1028227ebb51e520e8', // /reports/generateCustomerDetailReport
        },
        {
            permissionId: '688c7f601bb97636f19d6ad9', // Sinh báo cáo chi tiết khách hàng
            apiId: '68a935b682615e9f79697ca6', // /reports/getDebtConfigDetailByInvoice',
        },
        {
            permissionId: '688c7f601bb97636f19d6ad9', // Sinh báo cáo chi tiết khách hàng
            apiId: '68abdbf15ef4fc475dd0992e', // /reports/generateDebtConfigDetailByInvoice
        },
        {
            permissionId: '688c7f601bb97636f19d6ad9', // Sinh báo cáo chi tiết khách hàng
            apiId: '68ad58dfa053aa8a7b8dafd5', // /reports/getCustomerReceivableDetail
        },
        {
            permissionId: '688c7f601bb97636f19d6ad9', // Sinh báo cáo chi tiết khách hàng
            apiId: '68ad58dfa053aa8a7b8dafd6', // /reports/generateCustomerReceivableDetail
        },

        //mail
        {
            permissionId: '68c12543e78783270db36263', // Tạo kết nối đến mail server
            apiId: '68c1243d15ae994f437fa626', // /mail/configMailServer
        },
        {
            permissionId: '68c12543e78783270db36264', // Gửi mail
            apiId: '68c1243d15ae994f437fa627', // /mail/sendMail
        },
        {
            permissionId: '68c78603e435ea91ad31fc57', // Cấu hình người nhận mail mặc định
            apiId: '68c785b3f8bf800b6fd2ccaa', // /mail/configMailReceiver
        },
        {
            permissionId: '68c933a802908cb98dd9004d', // Lấy ra cấu hình, người nhận mail mặc định
            apiId: '68c93361d12a27f099ce27ad', // /mail/getAll
        },

        // Yêu cầu công việc
        {
            permissionId: '68d1166bba1c480c8180bf6c', // Xem phiếu yêu cầu công việc
            apiId: '68d1153524419859fede4ebe', // /workOrder/getAll
        },
        {
            permissionId: '68d1166bba1c480c8180bf6c', // Xem phiếu yêu cầu công việc
            apiId: '68d37503136efac69b7bcad1', // /workOrder/getById
        },
        {
            permissionId: '68d1166bba1c480c8180bf6c', // Xem phiếu yêu cầu công việc
            apiId: '68d37503136efac69b7bcad2', // /workOrder/getOverall
        },
        {
            permissionId: '68d1166bba1c480c8180bf6c', // Xem phiếu yêu cầu công việc
            apiId: '68f89736d0014bb79a3e081c', // /workOrder/getAllState
        },
        {
            permissionId: '68d1166bba1c480c8180bf6c', // Xem phiếu yêu cầu công việc
            apiId: '68f89736d0014bb79a3e081d', // /workOrder/getAllPriority
        },
        {
            permissionId: '68d1166bba1c480c8180bf6c', // Xem phiếu yêu cầu công việc
            apiId: '68fee754df90864cd0ba5306', // /workOrder/getAllWorkType
        },
        {
            permissionId: '68d1166bba1c480c8180bf6c', // Xem phiếu yêu cầu công việc
            apiId: '68fee754df90864cd0ba5307', // /workOrder/getAllType
        },
        {
            permissionId: '68d1166bba1c480c8180bf6c', // Xem phiếu yêu cầu công việc
            apiId: '68fee754df90864cd0ba5308', // /workOrder/getAllWorkRequestSource
        },
        {
            permissionId: '68d1166bba1c480c8180bf6d', // Tạo phiếu yêu cầu công việc
            apiId: '68d1153524419859fede4ebf', // /workOrder/create
        },
        {
            permissionId: '68d1166bba1c480c8180bf6d', // Tạo phiếu yêu cầu công việc
            apiId: '691c2c10cc14068cd86a1bf7', // /contactPerson/getAllPerson
        },
        {
            permissionId: '68d1166bba1c480c8180bf6d', // Tạo phiếu yêu cầu công việc
            apiId: '691c2c10cc14068cd86a1bf8', // /contactPerson/deletePerson
        },
        {
            permissionId: '68d3750d4828a7c4347ad1bd', // Tạo phiếu yêu cầu công việc
            apiId: '691ebf6e7cd69b4b32fa3b5f', // /contactPerson/getAllAddress
        },

        {
            permissionId: '68d3750d4828a7c4347ad1bd', // Tạo phiếu yêu cầu công việc
            apiId: '691ebf6e7cd69b4b32fa3b60', // /contactPerson/deleteAddress
        },
        {
            permissionId: '68d3750d4828a7c4347ad1bd', // Chỉnh sửa phiếu yêu cầu công việc
            apiId: '68d37503136efac69b7bcad3', // /workOrder/update
        },
        {
            permissionId: '68d3750d4828a7c4347ad1bd', // Tạo phiếu yêu cầu công việc
            apiId: '691c2c10cc14068cd86a1bf7', // /contactPerson/getAllPerson
        },
        {
            permissionId: '68d3750d4828a7c4347ad1bd', // Tạo phiếu yêu cầu công việc
            apiId: '691c2c10cc14068cd86a1bf8', // /contactPerson/deletePerson
        },
        {
            permissionId: '68d3750d4828a7c4347ad1bd', // Tạo phiếu yêu cầu công việc
            apiId: '691ebf6e7cd69b4b32fa3b5f', // /contactPerson/getAllAddress
        },
        {
            permissionId: '68d3750d4828a7c4347ad1bd', // Tạo phiếu yêu cầu công việc
            apiId: '691ebf6e7cd69b4b32fa3b60', // /contactPerson/deleteAddress
        },
        {
            permissionId: '68d3750d4828a7c4347ad1bd', // Tạo phiếu yêu cầu công việc
            apiId: '691ebf6e7cd69b4b32fa3b12', // contactPerson/getSerialNumber
        },
        {
            permissionId: '68d3750d4828a7c4347ad1be', // Xóa phiếu yêu cầu công việc
            apiId: '68d37503136efac69b7bcad4', // /workOrder/delete
        },

        {
            permissionId: '6914e05ccf9e7d1d96f5a0f8', // Xóa thiết bị của khách hàng
            apiId: '691ebf6e7cd69b4b32fa3b13', // /contactPerson/deleteAddress
        },

        // Kỹ thuật viên
        {
            permissionId: '68db8978cc41fa86439388cd', // Xem kỹ thuật viên
            apiId: '68db886658aa745a165f0c07', // /technician/getAll
        },
        {
            permissionId: '68db8978cc41fa86439388cd', // Xem kỹ thuật viên
            apiId: '68db886658aa745a165f0c08', // /technician/getById
        },
        {
            permissionId: '68db8978cc41fa86439388cd', // Xem kỹ thuật viên
            apiId: '68db886658aa745a165f0c09', // /technician/getOverall
        },
        {
            permissionId: '68db8978cc41fa86439388ce', // Tạo kỹ thuật viên
            apiId: '68db886658aa745a165f0c0a', // /technician/create
        },
        {
            permissionId: '68db8978cc41fa86439388cf', // Chỉnh sửa kỹ thuật viên
            apiId: '68db886658aa745a165f0c0b', // /technician/update
        },
        {
            permissionId: '68ff31af6de21eecbc535ad1', // Khóa/Mở khóa kỹ thuật viên
            apiId: '68ff312d7c0247493f1d5065', // /technician/changeActive
        },
        {
            permissionId: '68db8978cc41fa86439388cd', // Xem kỹ thuật viên
            apiId: '68fee754df90864cd0ba5309', // /workOrder/getAllTechnicianStatus
        },

        //cấu hình máy in
        {
            permissionId: '69096f66ade3dff4e26b9192', // Xem cấu hình máy in
            apiId: '69096d1afbb88e9e19560634', //machineSetting/getAll
        },
        {
            permissionId: '69096f66ade3dff4e26b9192', // Xem cấu hình máy in
            apiId: '69096d1afbb88e9e19560635', //machineSetting/getById
        },
        {
            permissionId: '69096f66ade3dff4e26b9193', // Tạo cấu hình máy in
            apiId: '69096d1afbb88e9e19560630', //machineSetting/getMachine
        },
        {
            permissionId: '69096f66ade3dff4e26b9193', // Tạo cấu hình máy in
            apiId: '69096d1afbb88e9e19560631', //machineSetting/getAllProperties
        },
        {
            permissionId: '69096f66ade3dff4e26b9193', // Tạo cấu hình máy in
            apiId: '69096d1afbb88e9e19560632', //machineSetting/getDefaultValue
        },
        {
            permissionId: '69096f66ade3dff4e26b9193', // Tạo cấu hình máy in
            apiId: '69096d1afbb88e9e19560633', //machineSetting/create
        },
        {
            permissionId: '69096f66ade3dff4e26b9194', // Chỉnh sửa cấu hình máy in
            apiId: '69096d1afbb88e9e19560636', //machineSetting/update
        },
        {
            permissionId: '69096f66ade3dff4e26b9195', // Xóa cấu hình máy in
            apiId: '69096d1afbb88e9e19560637', //machineSetting/delete
        },

        //phiếu chi tiết công việc
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f1', // Xem phiếu chi tiết công việc
            apiId: '6914dec9b7188d8c5152cfb9', //workOrderDetail/getByWorkOrderId
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2', // Chỉnh sửa phiếu chi tiết công việc
            apiId: '6914dec9b7188d8c5152cfba', //workOrderDetail/updateMachineTypeId
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2', // Chỉnh sửa phiếu chi tiết công việc
            apiId: '69152a3afee7e8134a27909d', //workOrderDetail/updateMachineTypeId
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '69159156a239d04f043f1868', //workOrderDetail/getAllRepairFault
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '69159156a239d04f043f1869', //workOrderDetail/getAllPrintHeaderFault
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '69159156a239d04f043f186a', //workOrderDetail/getAllInkSystemFault
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '69159156a239d04f043f186b', //workOrderDetail/getAllElectricalSystemFault
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '69159156a239d04f043f186c', //workOrderDetail/getAllResolution
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '69159156a239d04f043f186d', //workOrderDetail/getAllMaintainOperations
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '69159156a239d04f043f186e', //workOrderDetail/getAllPowerControl
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '69159156a239d04f043f186f', //workOrderDetail/getAllPrintProgramming
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '69159156a239d04f043f1870', //workOrderDetail/getAllPrintSetting
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '69159156a239d04f043f1871', //workOrderDetail/getAllSaveProgram
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '69159156a239d04f043f1872', //workOrderDetail/getAllViewSpecifications
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '69159156a239d04f043f1873', //workOrderDetail/getAllInkReplace
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '69159156a239d04f043f1874', //workOrderDetail/getAllErrorMessage
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '69159156a239d04f043f1875', //workOrderDetail/getAllTechnicianFeedback
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '69159156a239d04f043f1876', //workOrderDetail/getAllCustomerFeedback
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '69159156a239d04f043f1877', //workOrderDetail/getAllSamplePrintingMethodName
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '69159156a239d04f043f1878', //workOrderDetail/getAllSamplePrintingInformationFrom
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '69159156a239d04f043f1879', //workOrderDetail/getAllRepairAResolutionState
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '6915a3aee5ce5d3507ee3acb', //workOrderDetail/getMachineByWorkOrderId
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '6926c0fa284e72cfe4ed6a4f',
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '6926c0fa284e72cfe4ed6a50',
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '6926c0fa284e72cfe4ed6a51',
        },
        {
            permissionId: '6914e05ccf9e7d1d96f5a0f2',
            apiId: '6926c0fa284e72cfe4ed6a52',
        },
    ])
    logger.info('PermissionApis seeded')
}

module.exports = permissionApiSeeder
