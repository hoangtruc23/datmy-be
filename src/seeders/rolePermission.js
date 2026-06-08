const { Types } = require('mongoose')

const { logger } = require('../config/loggerConfig')
const RolePermissionModel = require('../models/rolePermission')

async function rolePermissionSeeder() {
    await RolePermissionModel.deleteMany({})
    await RolePermissionModel.insertMany([
        //#region Quản trị viên
        // ==========================================================================================================
        // ====================================================================================== QUẢN TRỊ VIÊN =====

        // ----------------------------------------------------------------------------------------------- user -----
        //#region Nhân viên
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
            permissionId: '685cd0861d476d4f5d40f95e', // Khóa / Mở khóa
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684927c871287f2ae7d81301', // xóa
        },
        //#endregion
        //#region Khách hàng
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
        //#endregion
        //#region Nhà cung cấp
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
        //#endregion

        // ------------------------------------------------------------------------------------------ warehouse -----
        //#region Kho hàng
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
        //#endregion
        //#region Danh mục
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
        //#endregion
        //#region Sản phẩm
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
        //#endregion
        //#region Thương hiệu
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
            permissionId: '685cd0861d476d4f5d40f95f', // mở khóa
        },
        //#endregion
        //#region Nhập kho
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
        // {
        //     roleId: '684927c871287f2ae7d8130b',
        //     permissionId: '6858d5bd26c71e076fdfad21', // Xác nhận phiếu nhập kho
        // },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '685a2a4f4630d293367c288c', // báo cáo nhập kho
        },
        {
            roleId: '684927c871287f2ae7d8130b', //quan tri vien
            permissionId: '6864fd7c1d9ec4d84204b720', // Tải file số hóa đơn/ hợp đồng phiếu nhập kho
        },
        //#endregion
        //#region Xuất kho
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
        // {
        //     roleId: '684927c871287f2ae7d8130b',
        //     permissionId: '685a477d73dd15c087569df1', // Xác nhận phiếu xuất kho
        // },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '6861f2e524fe5c2a802dcaea', // báo cáo xuất kho
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '6861f2e524fe5c2a802dcaea', // báo cáo xuất kho
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '6864fd7c1d9ec4d84204b71e', // Tải file số hóa đơn/hơp đồng phiếu xuất kho
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '6864fd7c1d9ec4d84204b71f', // Tải file PDF phiếu xuất kho
        },
        //#endregion
        //#region Tạm ứng
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '684927c871287f2ae7d81309', // Tạm ứng
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '685cf633e0e45d397c4ca197', // Xem phiếu tạm ứng
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '685cf633e0e45d397c4ca198', // Tạo phiếu tạm ứng
        },
        {
            roleId: '684927c871287f2ae7d8130b',
            permissionId: '685cf633e0e45d397c4ca199', // Cập nhật phiếu tạm ứng
        },
        // {
        //     roleId: '684927c871287f2ae7d8130b',
        //     permissionId: '685cf633e0e45d397c4ca19a', // Xác nhận phiếu tạm ứng
        // },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '687a08ce43d7e6c16ee8b585', // Nhận lại hàng (Tạm ứng)
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '6864e6cd4c3c96b50ff0e104', // Grant 'Xuất báo cáo' permission
        },
        //#endregion
        //#region Chuyển kho
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '688c7f601bb97636f19d6ab2', // chuyển kho
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '688c7f601bb97636f19d6ab3', // xem
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '685a1b9f9f5d2f68d81a1ec9', // cập nhật số lượng sản phẩm
        },
        //#endregion
        //#region Đơn hàng
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '688c7f601bbabc36f19d6ab1', // đơn hàng
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '688c7f601bbabc36f19d6ab2', // đơn hàng
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '688c7f601bbabc36f19d6ab3', // Tạo đơn hàng
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '688c7f601bbabc36f19d6ab4', // chỉnh sửa đơn hàng
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '688c7f601bbabc36f19d6ab5', // xóa đơn hàng
        },
        //#endregion

        // -------------------------------------------------------------------------------------------- finance -----
        //#region dashboard
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '689c01a260903c30215b25c1', // dashboard
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '689c01a260903c30215b25c0', // dashboard - xem
        },

        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '689c01a260903c30215b25c9', // dashboard getBestSellingItems
        },

        //#endregion
        //#region Hóa đơn
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '686dd0b535512a73e076c3a7', // Hóa đơn
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '686dd0b535512a73e076c3a9', // Thêm hóa đơn
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '686dd0b535512a73e076c3a8', // Xem hóa đơn
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '686dd0b535512a73e076c3aa', // Cập nhật hóa đơn
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '686dd0b535512a73e076c3ab', // Xóa hóa đơn
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '6882fdc36f95b8b522848815', // tổng hợp hóa đơn
        },
        //#endregion
        //#region Lịch sử thanh toán
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '687df491fd5669a67e23a295', // lịch sử thanh toán
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '687df491fd5669a67e23a296', // Thêm lịch sử thanh toán
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '687df491fd5669a67e23a297', // Xem lịch sử thanh toán
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '687df491fd5669a67e23a298', // Cập nhật lịch sử thanh toán
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '687df491fd5669a67e23a299', // Xóa lịch sử thanh toán
        },
        //#endregion
        //#region Công nợ
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '6880936c160be16212361ba1', // Công nợ
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '6880936c160be16212361ba2', // Xem công nợ
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '6892ceaeee639479e26a93b3', // Tạo biên bản đối chiếu
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '6892ceaeee639479e26a93b4', // Tạo giấy đề nghị thanh toán
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '6898697b630fdba8a091c0f3', // Tạo giấy đề nghị thanh toán
        },
        //#endregion
        //#region Cài đặt công nợ
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '6882fdc36f95b8b522848805', // cài đặt công nợ
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '6882fdc36f95b8b522848806', // Xem
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '6882fdc36f95b8b522848807', // Thêm
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '6882fdc36f95b8b522848808', // Cập nhật
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '6882fdc36f95b8b522848809', // Xóa
        },

        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '689c01a260903c30215b25d9', // Import số dư đầu kỳ 
        },

        //#endregion
        //#region Nhắc nợ
        {
            roleId: '684927c871287f2ae7d8130b', //Quản trị viên
            permissionId: '68899f050e446ab399609245', // Nhắc nợ
        },
        {
            roleId: '684927c871287f2ae7d8130b', //Quản trị viên
            permissionId: '68899f050e446ab399609246', // Xem
        },
        {
            roleId: '684927c871287f2ae7d8130b', //Quản trị viên
            permissionId: '68899f050e446ab399609247', //  Tạo
        },
        {
            roleId: '684927c871287f2ae7d8130b', //Quản trị viên
            permissionId: '68899f050e446ab399609248', //Cập nhật
        },
        {
            roleId: '684927c871287f2ae7d8130b', //Quản trị viên
            permissionId: '68899f050e446ab399609249', //  Xóa
        },
        //#endregion
        //#region Chiết khấu
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '687165240ac4b7484048357d', // chiết khấu
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '687165e2ee8406ca535d1ba3', // Thêm chiết khấu
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '687165e2ee8406ca535d1ba2', // Xem chiết khấu
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '687165e2ee8406ca535d1ba4', // Cập nhật chiết khấu
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '687165e2ee8406ca535d1ba5', // Xóa chiết khấu
        },
        //#endregion
        //#region Mail
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '68c12543e78783270db36262', // mail
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '68c12543e78783270db36263', // tạo kết nối đến server mail
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '68c12543e78783270db36264', // gửi mail
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '68c78603e435ea91ad31fc57', // cấu hình người nhận mail mặc định
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '68c933a802908cb98dd9004d', // lấy ra cấu hình, người nhận mail mặc định
        },
        //#endregion
        //#region Báo cáo
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '688c7f601bb97636f19d6ac3', // Xem báo cáo
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '688c7f601bb97636f19d6ac4', // Xem báo cáo
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '688c7f601bb97636f19d6ad8', // Xem báo cáo số chi tiết khách hàng
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '688c7f601bb97636f19d6ad9', // Xem báo cáo đối chiếu công nợ
        },
        //#endregion

        // ------------------------------------------------------------------------------------------ technical ----
        //#region Yêu cầu công việc
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '68d1166bba1c480c8180bf6b', // Phiếu yêu cầu công việc
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '68d1166bba1c480c8180bf6c', // Xem phiếu yêu cầu công việc
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '68d1166bba1c480c8180bf6d', // Tạo phiếu yêu cầu công việc
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '68d3750d4828a7c4347ad1bd', // Chỉnh sửa phiếu yêu cầu công việc
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '68d3750d4828a7c4347ad1be', // Xóa phiếu yêu cầu công việc
        },


        //#endregion
        //#region Kỹ thuật viên
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '68db8978cc41fa86439388cc', // Kỹ thuật viên
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '68db8978cc41fa86439388cd', // Xem kỹ thuật viên
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '68db8978cc41fa86439388ce', // Tạo kỹ thuật viên
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '68db8978cc41fa86439388cf', // Chỉnh sửa kỹ thuật viên
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '68ff31af6de21eecbc535ad1', // Khóa/Mở khóa kỹ thuật viên
        },
        //#endregion
        //#region Cấu hình máy in
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '69096eeb66eb1f282bec214b', // Cấu hình máy in
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '69096f66ade3dff4e26b9192', // Xem cấu hình máy in
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '69096f66ade3dff4e26b9193', // Tạo cấu hình máy in
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '69096f66ade3dff4e26b9194', // Chỉnh sửa cấu hình máy in
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '69096f66ade3dff4e26b9195', // Xóa cấu hình máy in
        },
        //#endregion
        //#region Phiếu chi tiết công việc
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '6914e05ccf9e7d1d96f5a0f0', // Phiếu chi tiết công việc
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '6914e05ccf9e7d1d96f5a0f1', // Xem phiếu chi tiết công việc
        },
        {
            roleId: '684927c871287f2ae7d8130b', // Quản trị viên
            permissionId: '6914e05ccf9e7d1d96f5a0f2', // Chỉnh sửa phiếu chi tiết công việc
        },
        //#endregion
        //#endregion

        //#region Quản lý kho
        // ==========================================================================================================
        // ======================================================================================== QUẢN LÝ KHO =====

        // ----------------------------------------------------------------------------------------------- user -----
        //#region Nhân viên
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684927c871287f2ae7d812fd', // Nhân viên
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684927c871287f2ae7d812fe', // xem
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684927c871287f2ae7d812ff', // thêm
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684927c871287f2ae7d81300', // cập nhật
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '685cd0861d476d4f5d40f95e', // Khóa / Mở khóa
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684927c871287f2ae7d81301', // xóa
        },
        //#endregion
        //#region Khách hàng
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684927c871287f2ae7d81302', // Khách hàng
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '685135a0f2a5cb3fcc6b8f03', // Thêm khách hàng
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '6853d1b6fa10ea77cf67990b', // Xem
        },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '6853d1b6fa10ea77cf67990f', // Xem
        // },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '6853d1b6fa10ea77cf67990a', // Cập nhật
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '6853d1b6fa10ea77cf67990d', // khoá hoặc mở khoá
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '6853d1b6fa10ea77cf679911', // Xóa
        },
        //#endregion
        //#region Nhà cung cấp
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684927c871287f2ae7d81303', // Nhà cung cấp
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684bd4f6fa59db4b4781d2b2', // Thêm nhà cung cấp
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684bd4f6fa59db4b4781d2ae', // Cập nhật nhà cung cấp
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684bd4f6fa59db4b4781d2af', // Xóa nhà cung cấp
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684bd4f6fa59db4b4781d2b0', // Xem nhà cung cấp
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684bd4f6fa59db4b4781d2b1', //Khóa mở khóa nhà cung cấp
        },
        //#endregion

        // ------------------------------------------------------------------------------------------ inventory -----
        //#region Kho hàng
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684927c871287f2ae7d81304', // Kho hàng
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684c3d35f0e869d0df11fed3', // xem
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684c3d35f0e869d0df11fed4', // thêm
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684c3d35f0e869d0df11fed5', // cập nhật
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684c3d35f0e869d0df11fed6', // xóa
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '685247989820dda77e2e7272', // cập nhật trạng thái
        },

        //#endregion
        //#region Danh mục
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684927c871287f2ae7d81305', // Danh mục
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '6854e30d6b90439ad8c00dbb', // Thêm
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '6854e30d6b90439ad8c00dbc', // Xem
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '6854e30d6b90439ad8c00dbd', // Cập nhật
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '6854e30d6b90439ad8c00dbe', // Khóa Mở khóa
        },
        //#endregion
        //#region Sản phẩm
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '685a1b9f9f5d2f68d81a1eb4', // Sản phẩm
        },

        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '685a1b9f9f5d2f68d81a1eb6', // Thêm
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '685a1b9f9f5d2f68d81a1eb7', // Xem
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '685a1b9f9f5d2f68d81a1eb8', // Cập nhật
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '685a1b9f9f5d2f68d81a1eb9', // Khóa Mở khóa
        },
        //#endregion
        //#region Thương hiệu
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684927c871287f2ae7d81306', // Thương hiệu
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '68525e2d25829b7e6b32a612', // thêm
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '68525e2d25829b7e6b32a613', // xem
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '68525e2d25829b7e6b32a615', // sửa
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '68525e2d25829b7e6b32a614', // xoá
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '685cd0861d476d4f5d40f95f', // mở khóa
        },
        //#endregion
        //#region Nhập kho
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684927c871287f2ae7d81307', // Nhập kho
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '6856e210a596678c37b505e1', // Xem phiếu nhập kho
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '68568d96dd90fa75cb286479', // Tạo phiếu nhập kho
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '6858d5bd26c71e076fdfad83', // Cập nhật phiếu nhập kho
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '6858d5bd26c71e076fdfad21', // Xác nhận phiếu nhập kho
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '685a2a4f4630d293367c288c', // báo cáo nhập kho
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '6864fd7c1d9ec4d84204b720', // Tải file số hóa đơn/ hợp đồng phiếu nhập kho
        },
        //#endregion
        //#region Xuất kho
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684927c871287f2ae7d81308', // Xuất kho
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '685a477d73dd15c087569dee', // Xem phiếu xuất kho
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '685a477d73dd15c087569def', // Tạo phiếu xuất kho
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '685a477d73dd15c087569df0', // Cập nhật phiếu xuất kho
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '685a477d73dd15c087569df1', // Xác nhận phiếu xuất kho
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '6861f2e524fe5c2a802dcaea', // báo cáo xuất kho
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '6861f2e524fe5c2a802dcaea', // báo cáo xuất kho
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '6864fd7c1d9ec4d84204b71e', // Tải file số hóa đơn/hơp đồng phiếu xuất kho
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '6864fd7c1d9ec4d84204b71f', // Tải file PDF phiếu xuất kho
        },
        //#endregion
        //#region Tạm ứng
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '684927c871287f2ae7d81309', // Tạm ứng
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '685cf633e0e45d397c4ca197', // Xem phiếu tạm ứng
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '685cf633e0e45d397c4ca198', // Tạo phiếu tạm ứng
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '685cf633e0e45d397c4ca199', // Cập nhật phiếu tạm ứng
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '685cf633e0e45d397c4ca19a', // Xác nhận phiếu tạm ứng
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '687a08ce43d7e6c16ee8b585', // Nhận lại hàng (Tạm ứng)
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '6864e6cd4c3c96b50ff0e104', // Grant 'Xuất báo cáo' permission
        },
        //#endregion
        //#region Chuyển kho
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '688c7f601bb97636f19d6ab2', // chuyển kho
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '688c7f601bb97636f19d6ab3', // xem
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '685a1b9f9f5d2f68d81a1ec9', // cập nhật số lượng sản phẩm
        },
        //#endregion
        //#region Đơn hàng
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '688c7f601bbabc36f19d6ab1', // đơn hàng
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '688c7f601bbabc36f19d6ab2', // đơn hàng
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '688c7f601bbabc36f19d6ab3', // Tạo đơn hàng
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '688c7f601bbabc36f19d6ab4', // chỉnh sửa đơn hàng
        },
        {
            roleId: '68f6f623dc799da9305e4347', // Quản lý kho
            permissionId: '688c7f601bbabc36f19d6ab5', // xóa đơn hàng
        },
        //#endregion

        // -------------------------------------------------------------------------------------------- finance -----
        //#region dashboard
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '689c01a260903c30215b25c1', // dashboard
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '689c01a260903c30215b25c0', // dashboard - xem
        // },
        //#endregion
        //#region Hóa đơn
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '686dd0b535512a73e076c3a7', // Hóa đơn
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '686dd0b535512a73e076c3a9', // Thêm hóa đơn
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '686dd0b535512a73e076c3a8', // Xem hóa đơn
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '686dd0b535512a73e076c3aa', // Cập nhật hóa đơn
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '686dd0b535512a73e076c3ab', // Xóa hóa đơn
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '6882fdc36f95b8b522848815', // tổng hợp hóa đơn
        // },
        //#endregion
        //#region Lịch sử thanh toán
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '687df491fd5669a67e23a295', // lịch sử thanh toán
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '687df491fd5669a67e23a296', // Thêm lịch sử thanh toán
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '687df491fd5669a67e23a297', // Xem lịch sử thanh toán
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '687df491fd5669a67e23a298', // Cập nhật lịch sử thanh toán
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '687df491fd5669a67e23a299', // Xóa lịch sử thanh toán
        // },
        //#endregion
        //#region Công nợ
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '6880936c160be16212361ba1', // Công nợ
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '6880936c160be16212361ba2', // Xem công nợ
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '6892ceaeee639479e26a93b3', // Tạo biên bản đối chiếu
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '6892ceaeee639479e26a93b4', // Tạo giấy đề nghị thanh toán
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '6898697b630fdba8a091c0f3', // Tạo giấy đề nghị thanh toán
        // },
        //#endregion
        //#region Cài đặt công nợ
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '6882fdc36f95b8b522848805', // cài đặt công nợ
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '6882fdc36f95b8b522848806', // Xem
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '6882fdc36f95b8b522848807', // Thêm
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '6882fdc36f95b8b522848808', // Cập nhật
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '6882fdc36f95b8b522848809', // Xóa
        // },
        //#endregion
        //#region Nhắc nợ
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68899f050e446ab399609245', // Nhắc nợ
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68899f050e446ab399609246', // Xem
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68899f050e446ab399609247', //  Tạo
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68899f050e446ab399609248', //Cập nhật
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68899f050e446ab399609249', //  Xóa
        // },
        //#endregion
        //#region Chiết khấu
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '687165240ac4b7484048357d', // chiết khấu
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '687165e2ee8406ca535d1ba3', // Thêm chiết khấu
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '687165e2ee8406ca535d1ba2', // Xem chiết khấu
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '687165e2ee8406ca535d1ba4', // Cập nhật chiết khấu
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '687165e2ee8406ca535d1ba5', // Xóa chiết khấu
        // },
        //#endregion
        //#region Mail
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68c12543e78783270db36262', // mail
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68c12543e78783270db36263', // tạo kết nối đến server mail
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68c12543e78783270db36264', // gửi mail
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68c78603e435ea91ad31fc57', // cấu hình người nhận mail mặc định
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68c933a802908cb98dd9004d', // lấy ra cấu hình, người nhận mail mặc định
        // },
        //#endregion
        //#region Báo cáo
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '688c7f601bb97636f19d6ac3', // Xem báo cáo
        // },
        //{
        //    roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //    permissionId: '688c7f601bb97636f19d6ac4', // Xem báo cáo
        //},
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '688c7f601bb97636f19d6ad8', // Xem báo cáo số chi tiết bán hàng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '688c7f601bb97636f19d6ad9', // Xem báo cáo đối chiếu công nợ
        // },
        //#endregion

        // ------------------------------------------------------------------------------------------ technical ----
        //#region Yêu cầu công việc
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68d1166bba1c480c8180bf6b', // Phiếu yêu cầu công việc
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68d1166bba1c480c8180bf6c', // Xem phiếu yêu cầu công việc
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68d1166bba1c480c8180bf6d', // Tạo phiếu yêu cầu công việc
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68d3750d4828a7c4347ad1bd', // Chỉnh sửa phiếu yêu cầu công việc
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68d3750d4828a7c4347ad1be', // Xóa phiếu yêu cầu công việc
        // },
        //#endregion
        //#region Kỹ thuật viên
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68db8978cc41fa86439388cc', // Kỹ thuật viên
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68db8978cc41fa86439388cd', // Xem kỹ thuật viên
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68db8978cc41fa86439388ce', // Tạo kỹ thuật viên
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68db8978cc41fa86439388cf', // Chỉnh sửa kỹ thuật viên
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '68ff31af6de21eecbc535ad1', // Khóa/Mở khóa kỹ thuật viên
        // },
        //#endregion
        //#region Cấu hình máy in
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '69096eeb66eb1f282bec214b', // Cấu hình máy in
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '69096f66ade3dff4e26b9192', // Xem cấu hình máy in
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '69096f66ade3dff4e26b9193', // Tạo cấu hình máy in
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '69096f66ade3dff4e26b9194', // Chỉnh sửa cấu hình máy in
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '69096f66ade3dff4e26b9195', // Xóa cấu hình máy in
        // },
        //#endregion
        //#region Phiếu chi tiết công việc
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '6914e05ccf9e7d1d96f5a0f0', // Phiếu chi tiết công việc
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '6914e05ccf9e7d1d96f5a0f1', // Xem phiếu chi tiết công việc
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4347', // Quản lý kho
        //     permissionId: '6914e05ccf9e7d1d96f5a0f2', // Chỉnh sửa phiếu chi tiết công việc
        // },
        //#endregion
        //#endregion

        //#region Quản lý công nợ
        // ==========================================================================================================
        // ==================================================================================== QUẢN LÝ CÔNG NỢ =====

        // ----------------------------------------------------------------------------------------------- user -----
        //#region Nhân viên
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '684927c871287f2ae7d812fd', // Nhân viên
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '684927c871287f2ae7d812fe', // xem
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '684927c871287f2ae7d812ff', // thêm
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '684927c871287f2ae7d81300', // cập nhật
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '685cd0861d476d4f5d40f95e', // Khóa / Mở khóa
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '684927c871287f2ae7d81301', // xóa
        },
        //#endregion
        //#region Khách hàng
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '684927c871287f2ae7d81302', // Khách hàng
        },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '685135a0f2a5cb3fcc6b8f03', // Thêm khách hàng
        // },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '6853d1b6fa10ea77cf67990b', // Xem
        },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '6853d1b6fa10ea77cf67990f', // Xem
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '6853d1b6fa10ea77cf67990a', // Cập nhật
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '6853d1b6fa10ea77cf67990d', // khoá hoặc mở khoá
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '6853d1b6fa10ea77cf679911', // Xóa
        // },
        //#endregion
        //#region Nhà cung cấp
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '684927c871287f2ae7d81303', // Nhà cung cấp
        },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '684bd4f6fa59db4b4781d2b2', // Thêm nhà cung cấp
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '684bd4f6fa59db4b4781d2ae', // Cập nhật nhà cung cấp
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '684bd4f6fa59db4b4781d2af', // Xóa nhà cung cấp
        // },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '684bd4f6fa59db4b4781d2b0', // Xem nhà cung cấp
        },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '684bd4f6fa59db4b4781d2b1', //Khóa mở khóa nhà cung cấp
        // },
        //#endregion

        // ------------------------------------------------------------------------------------------ inventory -----
        //#region Kho hàng
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '684927c871287f2ae7d81304', // Kho hàng
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '684c3d35f0e869d0df11fed3', // xem
        },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '684c3d35f0e869d0df11fed4', // thêm
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '684c3d35f0e869d0df11fed5', // cập nhật
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '684c3d35f0e869d0df11fed6', // xóa
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '685247989820dda77e2e7272', // cập nhật trạng thái
        // },
        //#endregion
        //#region Danh mục
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '684927c871287f2ae7d81305', // Danh mục
        },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '6854e30d6b90439ad8c00dbb', // Thêm
        // },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '6854e30d6b90439ad8c00dbc', // Xem
        },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '6854e30d6b90439ad8c00dbd', // Cập nhật
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '6854e30d6b90439ad8c00dbe', // Khóa Mở khóa
        // },
        //#endregion
        //#region Sản phẩm
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '685a1b9f9f5d2f68d81a1eb4', // Sản phẩm
        },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '685a1b9f9f5d2f68d81a1eb6', // Thêm
        // },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '685a1b9f9f5d2f68d81a1eb7', // Xem
        },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '685a1b9f9f5d2f68d81a1eb8', // Cập nhật
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '685a1b9f9f5d2f68d81a1eb9', // Khóa Mở khóa
        // },
        //#endregion
        //#region Thương hiệu
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '684927c871287f2ae7d81306', // Thương hiệu
        },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '68525e2d25829b7e6b32a612', // thêm
        // },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '68525e2d25829b7e6b32a613', // xem
        },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '68525e2d25829b7e6b32a615', // sửa
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '68525e2d25829b7e6b32a614', // xoá
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '685cd0861d476d4f5d40f95f', // mở khóa
        // },
        //#endregion
        //#region Nhập kho
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '684927c871287f2ae7d81307', // Nhập kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '6856e210a596678c37b505e1', // Xem phiếu nhập kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '68568d96dd90fa75cb286479', // Tạo phiếu nhập kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '6858d5bd26c71e076fdfad83', // Cập nhật phiếu nhập kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '6858d5bd26c71e076fdfad21', // Xác nhận phiếu nhập kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '685a2a4f4630d293367c288c', // báo cáo nhập kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '6864fd7c1d9ec4d84204b720', // Tải file số hóa đơn/ hợp đồng phiếu nhập kho
        // },
        //#endregion
        //#region Xuất kho
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '684927c871287f2ae7d81308', // Xuất kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '685a477d73dd15c087569dee', // Xem phiếu xuất kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '685a477d73dd15c087569def', // Tạo phiếu xuất kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '685a477d73dd15c087569df0', // Cập nhật phiếu xuất kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '685a477d73dd15c087569df1', // Xác nhận phiếu xuất kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '6861f2e524fe5c2a802dcaea', // báo cáo xuất kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '6861f2e524fe5c2a802dcaea', // báo cáo xuất kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '6864fd7c1d9ec4d84204b71e', // Tải file số hóa đơn/hơp đồng phiếu xuất kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '6864fd7c1d9ec4d84204b71f', // Tải file PDF phiếu xuất kho
        // },
        //#endregion
        //#region Tạm ứng
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '684927c871287f2ae7d81309', // Tạm ứng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '685cf633e0e45d397c4ca197', // Xem phiếu tạm ứng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '685cf633e0e45d397c4ca198', // Tạo phiếu tạm ứng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '685cf633e0e45d397c4ca199', // Cập nhật phiếu tạm ứng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '685cf633e0e45d397c4ca19a', // Xác nhận phiếu tạm ứng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '687a08ce43d7e6c16ee8b585', // Nhận lại hàng (Tạm ứng)
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '6864e6cd4c3c96b50ff0e104', // Grant 'Xuất báo cáo' permission
        // },
        //#endregion
        //#region Chuyển kho
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '688c7f601bb97636f19d6ab2', // chuyển kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '688c7f601bb97636f19d6ab3', // xem
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '685a1b9f9f5d2f68d81a1ec9', // cập nhật số lượng sản phẩm
        // },
        //#endregion
        //#region Đơn hàng
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '688c7f601bbabc36f19d6ab1', // đơn hàng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '688c7f601bbabc36f19d6ab2', // đơn hàng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '688c7f601bbabc36f19d6ab3', // Tạo đơn hàng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '688c7f601bbabc36f19d6ab4', // chỉnh sửa đơn hàng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '688c7f601bbabc36f19d6ab5', // xóa đơn hàng
        // },
        //#endregion

        // -------------------------------------------------------------------------------------------- finance -----
        //#region dashboard
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '689c01a260903c30215b25c1', // dashboard
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '689c01a260903c30215b25c0', // dashboard - xem
        },
        //#endregion
        //#region Hóa đơn
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '686dd0b535512a73e076c3a7', // Hóa đơn
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '686dd0b535512a73e076c3a9', // Thêm hóa đơn
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '686dd0b535512a73e076c3a8', // Xem hóa đơn
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '686dd0b535512a73e076c3aa', // Cập nhật hóa đơn
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '686dd0b535512a73e076c3ab', // Xóa hóa đơn
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '6882fdc36f95b8b522848815', // tổng hợp hóa đơn
        },
        //#endregion
        //#region Lịch sử thanh toán
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '687df491fd5669a67e23a295', // lịch sử thanh toán
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '687df491fd5669a67e23a296', // Thêm lịch sử thanh toán
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '687df491fd5669a67e23a297', // Xem lịch sử thanh toán
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '687df491fd5669a67e23a298', // Cập nhật lịch sử thanh toán
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '687df491fd5669a67e23a299', // Xóa lịch sử thanh toán
        },
        //#endregion
        //#region Công nợ
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '6880936c160be16212361ba1', // Công nợ
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '6880936c160be16212361ba2', // Xem công nợ
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '6892ceaeee639479e26a93b3', // Tạo biên bản đối chiếu
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '6892ceaeee639479e26a93b4', // Tạo giấy đề nghị thanh toán
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '6898697b630fdba8a091c0f3', // Tạo giấy đề nghị thanh toán
        },
        //#endregion
        //#region Cài đặt công nợ
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '6882fdc36f95b8b522848805', // cài đặt công nợ
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '6882fdc36f95b8b522848806', // Xem
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '6882fdc36f95b8b522848807', // Thêm
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '6882fdc36f95b8b522848808', // Cập nhật
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '6882fdc36f95b8b522848809', // Xóa
        },
        //#endregion
        //#region Nhắc nợ
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '68899f050e446ab399609245', // Nhắc nợ
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '68899f050e446ab399609246', // Xem
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '68899f050e446ab399609247', //  Tạo
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '68899f050e446ab399609248', //Cập nhật
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '68899f050e446ab399609249', //  Xóa
        },
        //#endregion
        //#region Chiết khấu
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '687165240ac4b7484048357d', // chiết khấu
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '687165e2ee8406ca535d1ba3', // Thêm chiết khấu
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '687165e2ee8406ca535d1ba2', // Xem chiết khấu
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '687165e2ee8406ca535d1ba4', // Cập nhật chiết khấu
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '687165e2ee8406ca535d1ba5', // Xóa chiết khấu
        },
        //#endregion
        //#region Mail
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '68c12543e78783270db36262', // mail
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '68c12543e78783270db36263', // tạo kết nối đến server mail
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '68c12543e78783270db36264', // gửi mail
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '68c78603e435ea91ad31fc57', // cấu hình người nhận mail mặc định
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '68c933a802908cb98dd9004d', // lấy ra cấu hình, người nhận mail mặc định
        },
        //#endregion
        //#region Báo cáo
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '688c7f601bb97636f19d6ac3', // Xem báo cáo
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '688c7f601bb97636f19d6ac4', // Xem báo cáo
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '688c7f601bb97636f19d6ad8', // Xem báo cáo số chi tiết bán hàng
        },
        {
            roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
            permissionId: '688c7f601bb97636f19d6ad9', // Xem báo cáo đối chiếu công nợ
        },
        //#endregion

        // ------------------------------------------------------------------------------------------ technical ----
        //#region Yêu cầu công việc
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '68d1166bba1c480c8180bf6b', // Phiếu yêu cầu công việc
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '68d1166bba1c480c8180bf6c', // Xem phiếu yêu cầu công việc
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '68d1166bba1c480c8180bf6d', // Tạo phiếu yêu cầu công việc
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '68d3750d4828a7c4347ad1bd', // Chỉnh sửa phiếu yêu cầu công việc
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '68d3750d4828a7c4347ad1be', // Xóa phiếu yêu cầu công việc
        // },
        //#endregion
        //#region Kỹ thuật viên
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '68db8978cc41fa86439388cc', // Kỹ thuật viên
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '68db8978cc41fa86439388cd', // Xem kỹ thuật viên
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '68db8978cc41fa86439388ce', // Tạo kỹ thuật viên
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '68db8978cc41fa86439388cf', // Chỉnh sửa kỹ thuật viên
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '68ff31af6de21eecbc535ad1', // Khóa/Mở khóa kỹ thuật viên
        // },
        //#endregion
        //#region Cấu hình máy in
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '69096eeb66eb1f282bec214b', // Cấu hình máy in
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '69096f66ade3dff4e26b9192', // Xem cấu hình máy in
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '69096f66ade3dff4e26b9193', // Tạo cấu hình máy in
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '69096f66ade3dff4e26b9194', // Chỉnh sửa cấu hình máy in
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '69096f66ade3dff4e26b9195', // Xóa cấu hình máy in
        // },
        //#endregion
        //#region Phiếu chi tiết công việc
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '6914e05ccf9e7d1d96f5a0f0', // Phiếu chi tiết công việc
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '6914e05ccf9e7d1d96f5a0f1', // Xem phiếu chi tiết công việc
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4348', // Quản lý công nợ
        //     permissionId: '6914e05ccf9e7d1d96f5a0f2', // Chỉnh sửa phiếu chi tiết công việc
        // },
        //#endregion
        //#endregion

        //#region Quản lý kỹ thuật
        // ==========================================================================================================
        // =================================================================================== QUẢN LÝ KỸ THUẬT =====

        // ----------------------------------------------------------------------------------------------- user -----

        //#region Nhân viên
        //SIDEBAR NGƯỜI DÙNG -> NHÂN VIÊN
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684927c871287f2ae7d812fd', // Nhân viên
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684927c871287f2ae7d812fe', // xem
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684927c871287f2ae7d812ff', // thêm
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684927c871287f2ae7d81300', // cập nhật
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '685cd0861d476d4f5d40f95e', // Khóa / Mở khóa
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684927c871287f2ae7d81301', // xóa
        // },

        //#endregion
        //#region Khách hàng
        // SIDEBAR NGƯỜI DÙNG -> KHÁCH HÀNG
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684927c871287f2ae7d81302', // Khách hàng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '685135a0f2a5cb3fcc6b8f03', // Thêm khách hàng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6853d1b6fa10ea77cf67990b', // Xem
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6853d1b6fa10ea77cf67990f', // Xem
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6853d1b6fa10ea77cf67990a', // Cập nhật
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6853d1b6fa10ea77cf67990d', // khoá hoặc mở khoá
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6853d1b6fa10ea77cf679911', // Xóa
        // },


        //#endregion
        //#region Nhà cung cấp
        // SIDEBAR NGƯỜI DÙNG -> NHÀ CUNG CẤP
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684927c871287f2ae7d81303', // Nhà cung cấp
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684bd4f6fa59db4b4781d2b2', // Thêm nhà cung cấp
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684bd4f6fa59db4b4781d2ae', // Cập nhật nhà cung cấp
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684bd4f6fa59db4b4781d2af', // Xóa nhà cung cấp
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684bd4f6fa59db4b4781d2b0', // Xem nhà cung cấp
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684bd4f6fa59db4b4781d2b1', //Khóa mở khóa nhà cung cấp
        // },
        //#endregion

        // ------------------------------------------------------------------------------------------ inventory -----
        //#region Kho hàng
        // ---------- SIDEBAR SẢN PHẨM -> KHO HÀNG
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684927c871287f2ae7d81304', // Kho hàng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684c3d35f0e869d0df11fed3', // xem
        // },

        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684c3d35f0e869d0df11fed4', // thêm
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684c3d35f0e869d0df11fed5', // cập nhật
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684c3d35f0e869d0df11fed6', // xóa
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '685247989820dda77e2e7272', // cập nhật trạng thái
        // },
        //#endregion
        //#region Danh mục
        // ------------ SIDEBAR SẢN PHẨM -> DANH MỤC
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684927c871287f2ae7d81305', // Danh mục
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6854e30d6b90439ad8c00dbb', // Thêm
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6854e30d6b90439ad8c00dbc', // Xem
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6854e30d6b90439ad8c00dbd', // Cập nhật
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6854e30d6b90439ad8c00dbe', // Khóa Mở khóa
        // },
        //#endregion
        //#region Sản phẩm
        // ------------ SIDEBAR SẢN PHẨM -> SẢN PHẨM
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '685a1b9f9f5d2f68d81a1eb4', // Sản phẩm
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '685a1b9f9f5d2f68d81a1eb6', // Thêm
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '685a1b9f9f5d2f68d81a1eb7', // Xem
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '685a1b9f9f5d2f68d81a1eb8', // Cập nhật
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '685a1b9f9f5d2f68d81a1eb9', // Khóa Mở khóa
        // },
        //#endregion
        //#region Thương hiệu
        // ------------ SIDEBAR SẢN PHẨM -> THƯƠNG HIỆU
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684927c871287f2ae7d81306', // Thương hiệu
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '68525e2d25829b7e6b32a612', // thêm
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '68525e2d25829b7e6b32a613', // xem
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '68525e2d25829b7e6b32a615', // sửa
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '68525e2d25829b7e6b32a614', // xoá
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '685cd0861d476d4f5d40f95f', // mở khóa
        // },
        //#endregion
        //#region Nhập kho
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684927c871287f2ae7d81307', // Nhập kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6856e210a596678c37b505e1', // Xem phiếu nhập kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '68568d96dd90fa75cb286479', // Tạo phiếu nhập kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6858d5bd26c71e076fdfad83', // Cập nhật phiếu nhập kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6858d5bd26c71e076fdfad21', // Xác nhận phiếu nhập kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '685a2a4f4630d293367c288c', // báo cáo nhập kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6864fd7c1d9ec4d84204b720', // Tải file số hóa đơn/ hợp đồng phiếu nhập kho
        // },
        //#endregion
        //#region Xuất kho
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684927c871287f2ae7d81308', // Xuất kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '685a477d73dd15c087569dee', // Xem phiếu xuất kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '685a477d73dd15c087569def', // Tạo phiếu xuất kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '685a477d73dd15c087569df0', // Cập nhật phiếu xuất kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '685a477d73dd15c087569df1', // Xác nhận phiếu xuất kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6861f2e524fe5c2a802dcaea', // báo cáo xuất kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6861f2e524fe5c2a802dcaea', // báo cáo xuất kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6864fd7c1d9ec4d84204b71e', // Tải file số hóa đơn/hơp đồng phiếu xuất kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6864fd7c1d9ec4d84204b71f', // Tải file PDF phiếu xuất kho
        // },
        //#endregion
        //#region Tạm ứng
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '684927c871287f2ae7d81309', // Tạm ứng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '685cf633e0e45d397c4ca197', // Xem phiếu tạm ứng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '685cf633e0e45d397c4ca198', // Tạo phiếu tạm ứng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '685cf633e0e45d397c4ca199', // Cập nhật phiếu tạm ứng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '685cf633e0e45d397c4ca19a', // Xác nhận phiếu tạm ứng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '687a08ce43d7e6c16ee8b585', // Nhận lại hàng (Tạm ứng)
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6864e6cd4c3c96b50ff0e104', // Grant 'Xuất báo cáo' permission
        // },
        //#endregion
        //#region Chuyển kho
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '688c7f601bb97636f19d6ab2', // chuyển kho
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '688c7f601bb97636f19d6ab3', // xem
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '685a1b9f9f5d2f68d81a1ec9', // cập nhật số lượng sản phẩm
        // },
        //#endregion
        //#region Đơn hàng
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '688c7f601bbabc36f19d6ab1', // đơn hàng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '688c7f601bbabc36f19d6ab2', // đơn hàng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '688c7f601bbabc36f19d6ab3', // Tạo đơn hàng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '688c7f601bbabc36f19d6ab4', // chỉnh sửa đơn hàng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '688c7f601bbabc36f19d6ab5', // xóa đơn hàng
        // },
        //#endregion

        // -------------------------------------------------------------------------------------------- finance -----
        //#region dashboard
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '689c01a260903c30215b25c1', // dashboard
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '689c01a260903c30215b25c0', // dashboard - xem
        // },
        //#endregion
        //#region Hóa đơn
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '686dd0b535512a73e076c3a7', // Hóa đơn
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '686dd0b535512a73e076c3a9', // Thêm hóa đơn
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '686dd0b535512a73e076c3a8', // Xem hóa đơn
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '686dd0b535512a73e076c3aa', // Cập nhật hóa đơn
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '686dd0b535512a73e076c3ab', // Xóa hóa đơn
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6882fdc36f95b8b522848815', // tổng hợp hóa đơn
        // },
        //#endregion
        //#region Lịch sử thanh toán
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '687df491fd5669a67e23a295', // lịch sử thanh toán
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '687df491fd5669a67e23a296', // Thêm lịch sử thanh toán
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '687df491fd5669a67e23a297', // Xem lịch sử thanh toán
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '687df491fd5669a67e23a298', // Cập nhật lịch sử thanh toán
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '687df491fd5669a67e23a299', // Xóa lịch sử thanh toán
        // },
        //#endregion
        //#region Công nợ
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6880936c160be16212361ba1', // Công nợ
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6880936c160be16212361ba2', // Xem công nợ
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6892ceaeee639479e26a93b3', // Tạo biên bản đối chiếu
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6892ceaeee639479e26a93b4', // Tạo giấy đề nghị thanh toán
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6898697b630fdba8a091c0f3', // Tạo giấy đề nghị thanh toán
        // },
        //#endregion
        //#region Cài đặt công nợ
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6882fdc36f95b8b522848805', // cài đặt công nợ
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6882fdc36f95b8b522848806', // Xem
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6882fdc36f95b8b522848807', // Thêm
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6882fdc36f95b8b522848808', // Cập nhật
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '6882fdc36f95b8b522848809', // Xóa
        // },
        //#endregion
        //#region Nhắc nợ
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '68899f050e446ab399609245', // Nhắc nợ
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '68899f050e446ab399609246', // Xem
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '68899f050e446ab399609247', //  Tạo
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '68899f050e446ab399609248', //Cập nhật
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '68899f050e446ab399609249', //  Xóa
        // },
        //#endregion
        //#region Chiết khấu
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '687165240ac4b7484048357d', // chiết khấu
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '687165e2ee8406ca535d1ba3', // Thêm chiết khấu
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '687165e2ee8406ca535d1ba2', // Xem chiết khấu
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '687165e2ee8406ca535d1ba4', // Cập nhật chiết khấu
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '687165e2ee8406ca535d1ba5', // Xóa chiết khấu
        // },
        //#endregion
        //#region Mail
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '68c12543e78783270db36262', // mail
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '68c12543e78783270db36263', // tạo kết nối đến server mail
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '68c12543e78783270db36264', // gửi mail
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '68c78603e435ea91ad31fc57', // cấu hình người nhận mail mặc định
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '68c933a802908cb98dd9004d', // lấy ra cấu hình, người nhận mail mặc định
        // },
        //#endregion
        //#region Báo cáo
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '688c7f601bb97636f19d6ac3', // Xem báo cáo
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '688c7f601bb97636f19d6ac4', // Xem báo cáo
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '688c7f601bb97636f19d6ad8', // Xem báo cáo số chi tiết bán hàng
        // },
        // {
        //     roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
        //     permissionId: '688c7f601bb97636f19d6ad9', // Xem báo cáo đối chiếu công nợ
        // },
        //#endregion

        //getSerialNumber
        {
            roleId: '684927c871287f2ae7d8130b', // Quản Trị Viên
            permissionId: '68db8978cc41fa86439366cd', //getSerialNumber
        },


        // ------------------------------------------------------------------------------------------ technical ----
        //#region Yêu cầu công việc
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '68d1166bba1c480c8180bf6b', // Phiếu yêu cầu công việc
        },
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '68d1166bba1c480c8180bf6c', // Xem phiếu yêu cầu công việc
        },
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '68d1166bba1c480c8180bf6d', // Tạo phiếu yêu cầu công việc
        },
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '68d3750d4828a7c4347ad1bd', // Chỉnh sửa phiếu yêu cầu công việc
        },
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '68d3750d4828a7c4347ad1be', // Xóa phiếu yêu cầu công việc
        },
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '6853d1b6fa10ea77cf67990b', // Xem danh sách customer - inventory/api/customer/getAll
        },

        {//Xóa thiết bị của Khách hàng
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật 
            permissionId: '6914e05ccf9e7d1d96f5a0f8', // contactPerson/deleteAddress 
        },
        //#endregion
        //#region Kỹ thuật viên
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '68db8978cc41fa86439388cc', // Kỹ thuật viên
        },
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '68db8978cc41fa86439388cd', // Xem kỹ thuật viên
        },
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '68db8978cc41fa86439388ce', // Tạo kỹ thuật viên
        },
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '68db8978cc41fa86439388cf', // Chỉnh sửa kỹ thuật viên
        },
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '68ff31af6de21eecbc535ad1', // Khóa/Mở khóa kỹ thuật viên
        },
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '6914e05ccf9e7d1d96f5b0f9', //  contactPerson/addressesByFilter
        },
        //#endregion
        //#region Cấu hình máy in
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '69096eeb66eb1f282bec214b', // Cấu hình máy in
        },
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '69096f66ade3dff4e26b9192', // Xem cấu hình máy in
        },
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '69096f66ade3dff4e26b9193', // Tạo cấu hình máy in
        },
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '69096f66ade3dff4e26b9194', // Chỉnh sửa cấu hình máy in
        },
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '69096f66ade3dff4e26b9195', // Xóa cấu hình máy in
        },
        //#endregion
        //#region Phiếu chi tiết công việc
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '6914e05ccf9e7d1d96f5a0f0', // Phiếu chi tiết công việc
        },
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '6914e05ccf9e7d1d96f5a0f1', // Xem phiếu chi tiết công việc
        },
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '6914e05ccf9e7d1d96f5a0f2', // Chỉnh sửa phiếu chi tiết công việc
        },
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '6914e05ccf9e7d1d96f5a0f3', // Tải PDF phiếu chi tiết công việc
        },
        //#endregion
        {
            roleId: '68f6f623dc799da9305e4349', // Quản lý kỹ thuật
            permissionId: '6914e05ccf9e7d1d96f5b0f8', // reports/reportHistoryMachine
        },
        //#endregion

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
        //     roleId: '684927c871287f2ae7d8130b',
        //     permissionId: '685cd0861d476d4f5d40f95e', // Khóa / Mở khóa
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
        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '685cf633e0e45d397c4ca197', // Xem phiếu tạm ứng
        },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '685cf633e0e45d397c4ca198', // Tạo phiếu tạm ứng
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130c',
        //     permissionId: '685cf633e0e45d397c4ca199', // Cập nhật phiếu tạm ứng
        // },
        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '685cf633e0e45d397c4ca19a', // Xác nhận phiếu tạm ứng
        },
        {
            roleId: '684927c871287f2ae7d8130c',
            permissionId: '687a08ce43d7e6c16ee8b585', // Nhận lại hàng (Tạm ứng)
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
        //     roleId: '684927c871287f2ae7d8130b',
        //     permissionId: '685cd0861d476d4f5d40f95e', // Khóa / Mở khóa
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
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '685cf633e0e45d397c4ca197', // Xem phiếu tạm ứng
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '685cf633e0e45d397c4ca198', // Tạo phiếu tạm ứng
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '685cf633e0e45d397c4ca199', // Cập nhật phiếu tạm ứng
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130e',
        //     permissionId: '685cf633e0e45d397c4ca19a', // Xác nhận phiếu tạm ứng
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
        //     roleId: '684927c871287f2ae7d8130b',
        //     permissionId: '685cd0861d476d4f5d40f95e', // Khóa / Mở khóa
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
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '685cf633e0e45d397c4ca197', // Xem phiếu tạm ứng
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '685cf633e0e45d397c4ca198', // Tạo phiếu tạm ứng
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '685cf633e0e45d397c4ca199', // Cập nhật phiếu tạm ứng
        // },
        // {
        //     roleId: '684927c871287f2ae7d8130f',
        //     permissionId: '685cf633e0e45d397c4ca19a', // Xác nhận phiếu tạm ứng
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
        //     roleId: '684927c871287f2ae7d8130b',
        //     permissionId: '685cd0861d476d4f5d40f95e', // Khóa / Mở khóa
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
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '685cf633e0e45d397c4ca197', // Xem phiếu tạm ứng
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '685cf633e0e45d397c4ca198', // Tạo phiếu tạm ứng
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '685cf633e0e45d397c4ca199', // Cập nhật phiếu tạm ứng
        // },
        // {
        //     roleId: '684927c871287f2ae7d81310',
        //     permissionId: '685cf633e0e45d397c4ca19a', // Xác nhận phiếu tạm ứng
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
        //     roleId: '684927c871287f2ae7d8130b',
        //     permissionId: '685cd0861d476d4f5d40f95e', // Khóa / Mở khóa
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
