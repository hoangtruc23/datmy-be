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
            _id: new Types.ObjectId('685135a0f2a5cb3fcc6b8ea0'),
            api: '/customer/create',
            note: 'Tạo khách hàng',
        },
        {
            _id: new Types.ObjectId('6853d1b6fa10ea77cf679909'),
            api: '/customer/update',
            note: 'Cập nhật khách hàng',
        },
        {
            _id: new Types.ObjectId('6853d1b6fa10ea77cf67990c'),
            api: '/customer/getById',
            note: 'Xem khách hàng theo ID',
        },
        {
            _id: new Types.ObjectId('6853d1b6fa10ea77cf679910'),
            api: '/customer/getAll',
            note: 'Xem khách hàng',
        },
        {
            _id: new Types.ObjectId('6853d1b6fa10ea77cf67990e'),
            api: '/customer/lockUnlock',
            note: 'Khóa hoặc mở khóa khách hàng',
        },
        {
            _id: new Types.ObjectId('6853d1b6fa10ea77cf679912'),
            api: '/customer/delete',
            note: 'Xoá khách hàng',
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
            _id: new Types.ObjectId('6854111eb04f5d42c7ef5ef2'),
            api: '/supplier/cities',
            note: 'Lấy danh sách tất cả thành phố, quận huyện',
        },
        {
            _id: new Types.ObjectId('6854111eb04f5d42c7ef5ef3'),
            api: '/supplier/districts',
            note: 'Lấy danh sách tất cả tỉnh thành',
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

        // Tải tệp lên
        {
            _id: new Types.ObjectId('6854e30d6b90439ad8c00dbf'),
            api: '/upload/image',
            note: 'Tải lên hình ảnh',
        },
        {
            _id: new Types.ObjectId('6854e30d6b90439ad8c00dc0'),
            api: '/upload/file',
            note: 'Tải lên tệp tài liệu',
        },

        // Danh mục
        {
            _id: new Types.ObjectId('6854e30d6b90439ad8c00db6'),
            api: '/productCategory/create',
            note: 'Tạo danh mục sản phẩm mới',
        },
        {
            _id: new Types.ObjectId('6854e30d6b90439ad8c00db7'),
            api: '/productCategory/getAll',
            note: 'Lấy tất cả danh mục sản phẩm',
        },
        {
            _id: new Types.ObjectId('6854e30d6b90439ad8c00db8'),
            api: '/productCategory/getById',
            note: 'Lấy danh mục sản phẩm theo id',
        },
        {
            _id: new Types.ObjectId('6854e30d6b90439ad8c00db9'),
            api: '/productCategory/update',
            note: 'Chỉnh sửa danh mục sản phẩm',
        },

        {
            _id: new Types.ObjectId('6854e30d6b90439ad8c00dba'),
            api: '/productCategory/lockUnlock',
            note: 'Khóa hoặc mở khóa danh mục sản phẩm',
        },

        //Sản phẩm
        {
            _id: new Types.ObjectId('685a1b9f9f5d2f68d81a1ead'),
            api: '/product/create',
            note: 'Tạo sản phẩm mới',
        },
        {
            _id: new Types.ObjectId('685a1b9f9f5d2f68d81a1eae'),
            api: '/product/update',
            note: 'Chỉnh sửa sản phẩm',
        },
        {
            _id: new Types.ObjectId('685a1b9f9f5d2f68d81a1eaf'),
            api: '/product/getAllUnit',
            note: 'Lấy tất cả sản phẩm',
        },
        {
            _id: new Types.ObjectId('685a1b9f9f5d2f68d81a1eb0'),
            api: '/product/lockUnlock',
            note: 'Khóa hoặc mở khóa sản phẩm',
        },
        {
            _id: new Types.ObjectId('685a1b9f9f5d2f68d81a1eb1'),
            api: '/product/getAll',
            note: 'Lấy tất cả sản phẩm',
        },
        {
            _id: new Types.ObjectId('685a1b9f9f5d2f68d81a1eb2'),
            api: '/product/getById',
            note: 'Lấy sản phẩm theo id',
        },
        {
            _id: new Types.ObjectId('685e0db179ac9c1b83c0f4ae'),
            api: '/product/getTotalQuantityByProductId',
            note: 'Trả về tồn kho theo productId',
        },
        {
            _id: new Types.ObjectId('685e0db179ac9c1b83c0f4af'),
            api: '/product/getAllWithQuantity',
            note: 'Trả về danh sách sản phẩm kèm theo tồn kho',
        },
        {
            _id: new Types.ObjectId('685e0db179ac9c1b83c0f4b0'),
            api: '/product/getProductStorages',
            note: 'Trả về danh sách các ProductStorages của sản phẩm',
        },
        {
            _id: new Types.ObjectId('685e0db179ac9c1b83c0f4b1'),
            api: '/product/getReceiptByTrackingCode',
            note: 'Trả về goodsReceiptId theo trackingCode',
        },
        {
            _id: new Types.ObjectId('6867a1e973162d4001f57c90'),
            api: '/product/getIssueByTrackingCode',
            note: 'Trả về danh sách các phiếu xuất tương ứng theo trackingCode',
        },
        {
            _id: new Types.ObjectId('6868e75fcebe446e4c78bbb6'),
            api: '/product/getAdvanceByTrackingCode',
            note: 'Trả về danh sách các phiếu tạm ứng tương ứng theo trackingCode',
        },

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
        {
            _id: new Types.ObjectId('685799ea543a1de61aec7329'),
            api: '/goodsReceipt/getAll',
            note: 'Lấy danh sách các phiếu nhập kho',
        },
        {
            _id: new Types.ObjectId('6856e210a596678c37b505e2'),
            api: '/goodsReceipt/getById',
            note: 'Xem chi tiết phiếu nhập kho',
        },
        {
            _id: new Types.ObjectId('68568d96dd90fa75cb28647a'),
            api: '/goodsReceipt/createTemporary',
            note: 'Tạo phiếu nhập kho tạm (chưa có giá trị)',
        },
        {
            _id: new Types.ObjectId('685830dc888ceab12ecb2759'),
            api: '/goodsReceipt/create',
            note: 'Tạo phiếu nhập kho chính thức',
        },
        {
            _id: new Types.ObjectId('6858d5bd26c71e076fdfad84'),
            api: '/goodsReceipt/update',
            note: 'Cập nhật thông tin phiếu nhập kho',
        },
        {
            _id: new Types.ObjectId('68592f5521ca74c391267f78'),
            api: '/goodsReceipt/cancel',
            note: 'Hủy phiếu nhập kho',
        },
        {
            _id: new Types.ObjectId('6856a471897b183049a2ef8a'),
            api: '/goodsReceipt/addProduct',
            note: 'Thêm sản phẩm cho phiếu nhập kho',
        },
        {
            _id: new Types.ObjectId('6856e210a596678c37b505de'),
            api: '/goodsReceipt/updateProduct',
            note: 'Cập nhật sản phẩm cho phiếu nhập kho',
        },
        {
            _id: new Types.ObjectId('6856e210a596678c37b505df'),
            api: '/goodsReceipt/deleteProduct',
            note: 'Xóa sản phẩm khỏi phiếu nhập kho',
        },
        {
            _id: new Types.ObjectId('6858d5bd26c71e076fdfad75'),
            api: '/goodsReceipt/confirmQuantity',
            note: 'Xác nhận số lượng sản phẩm của phiếu nhập kho',
        },
        {
            _id: new Types.ObjectId('6858d5bd26c71e076fdfad76'),
            api: '/goodsReceipt/approval',
            note: 'Xác nhận phiếu nhập kho',
        },
        {
            _id: new Types.ObjectId('685a2a4f4630d293367c288b'),
            api: '/goodsReceipt/export',
            note: 'Xuất báo cáo nhập kho ra excel',
        },
        {
            _id: new Types.ObjectId('6864fd7c1d9ec4d84204b71a'),
            api: '/goodsReceipt/downloadInvoice',
            note: 'Tải file số hóa đơn/ hợp đồng phiếu nhập kho',
        },

        // Xuất kho
        {
            _id: new Types.ObjectId('685a477d73dd15c087569de3'),
            api: '/goodsIssue/getAll',
            note: 'Lấy danh sách các phiếu xuất kho',
        },
        {
            _id: new Types.ObjectId('685a477d73dd15c087569de4'),
            api: '/goodsIssue/getById',
            note: 'Xem chi tiết phiếu xuất kho',
        },
        {
            _id: new Types.ObjectId('685a477d73dd15c087569de5'),
            api: '/goodsIssue/createTemporary',
            note: 'Tạo phiếu xuất kho tạm (chưa có giá trị)',
        },
        {
            _id: new Types.ObjectId('685a477d73dd15c087569de6'),
            api: '/goodsIssue/create',
            note: 'Tạo phiếu xuất kho chính thức',
        },
        {
            _id: new Types.ObjectId('685a477d73dd15c087569de7'),
            api: '/goodsIssue/update',
            note: 'Cập nhật thông tin phiếu xuất kho',
        },
        {
            _id: new Types.ObjectId('685a477d73dd15c087569de8'),
            api: '/goodsIssue/cancel',
            note: 'Hủy phiếu xuất kho',
        },
        {
            _id: new Types.ObjectId('685a477d73dd15c087569de9'),
            api: '/goodsIssue/addProduct',
            note: 'Thêm sản phẩm cho phiếu xuất kho',
        },
        {
            _id: new Types.ObjectId('685a477d73dd15c087569dea'),
            api: '/goodsIssue/updateProduct',
            note: 'Cập nhật sản phẩm cho phiếu xuất kho',
        },
        {
            _id: new Types.ObjectId('685a477d73dd15c087569deb'),
            api: '/goodsIssue/deleteProduct',
            note: 'Xóa sản phẩm khỏi phiếu xuất kho',
        },
        {
            _id: new Types.ObjectId('685a477d73dd15c087569dec'),
            api: '/goodsIssue/confirmQuantity',
            note: 'Xác nhận số lượng sản phẩm của phiếu xuất kho',
        },
        {
            _id: new Types.ObjectId('685a477d73dd15c087569ded'),
            api: '/goodsIssue/approval',
            note: 'Xác nhận phiếu xuất kho',
        },
        {
            _id: new Types.ObjectId('6861f2e524fe5c2a802dcae9'),
            api: '/goodsIssue/export',
            note: 'Xuất báo cáo xuất kho ra excel',
        },
        {
            _id: new Types.ObjectId('6864fd7c1d9ec4d84204b71c'),
            api: '/goodsIssue/downloadInvoice',
            note: 'Tải file số hóa đơn/ hợp đồng phiếu xuất kho',
        },
        {
            _id: new Types.ObjectId('6864fd7c1d9ec4d84204b71d'),
            api: '/goodsIssue/generatePdf',
            note: 'Tải file PDF phiếu xuất kho',
        },
        // Tạm ứng
        {
            _id: new Types.ObjectId('685cf633e0e45d397c4ca18b'),
            api: '/goodsAdvance/getAll',
            note: 'Lấy danh sách các phiếu tạm ứng',
        },
        {
            _id: new Types.ObjectId('685cf633e0e45d397c4ca18c'),
            api: '/goodsAdvance/getById',
            note: 'Xem chi tiết phiếu tạm ứng',
        },
        {
            _id: new Types.ObjectId('685cf633e0e45d397c4ca18d'),
            api: '/goodsAdvance/createTemporary',
            note: 'Tạo phiếu tạm ứng tạm (chưa có giá trị)',
        },
        {
            _id: new Types.ObjectId('685cf633e0e45d397c4ca18e'),
            api: '/goodsAdvance/create',
            note: 'Tạo phiếu tạm ứng chính thức',
        },
        {
            _id: new Types.ObjectId('685cf633e0e45d397c4ca18f'),
            api: '/goodsAdvance/update',
            note: 'Cập nhật thông tin phiếu tạm ứng',
        },
        {
            _id: new Types.ObjectId('685cf633e0e45d397c4ca190'),
            api: '/goodsAdvance/cancel',
            note: 'Hủy phiếu tạm ứng',
        },
        {
            _id: new Types.ObjectId('686499029ae62f462152a6d4'),
            api: '/goodsAdvance/extend',
            note: 'Gia hạn phiếu tạm ứng',
        },
        {
            _id: new Types.ObjectId('685cf633e0e45d397c4ca191'),
            api: '/goodsAdvance/addProduct',
            note: 'Thêm sản phẩm cho phiếu tạm ứng',
        },
        {
            _id: new Types.ObjectId('685cf633e0e45d397c4ca192'),
            api: '/goodsAdvance/updateProduct',
            note: 'Cập nhật sản phẩm cho phiếu tạm ứng',
        },
        {
            _id: new Types.ObjectId('685cf633e0e45d397c4ca193'),
            api: '/goodsAdvance/deleteProduct',
            note: 'Xóa sản phẩm khỏi phiếu tạm ứng',
        },
        {
            _id: new Types.ObjectId('685cf633e0e45d397c4ca195'),
            api: '/goodsAdvance/approval',
            note: 'Xác nhận phiếu tạm ứng',
        },
        {
            _id: new Types.ObjectId('687a08ce43d7e6c16ee8b586'),
            api: '/goodsAdvance/receiveBack',
            note: 'Nhận lại hàng tạm ứng',
        },
        {
            _id: new Types.ObjectId('6864e6cd4c3c96b50ff0e105'),
            api: '/goodsAdvance/export',
            note: 'Xuất báo cáo tạm ứng ra excel',
        },

        //hóa đơn
        {
            _id: new Types.ObjectId('686dd0b535512a73e076c3a2'),
            api: '/invoice/create',
            note: 'Tạo hóa đơn',
        },
        {
            _id: new Types.ObjectId('686dd0b535512a73e076c3a3'),
            api: '/invoice/update',
            note: 'Cập nhật hóa đơn',
        },
        {
            _id: new Types.ObjectId('686dd0b535512a73e076c3a4'),
            api: '/invoice/getById',
            note: 'Xem chi tiết hóa đơn theo ID',
        },
        {
            _id: new Types.ObjectId('686dd0b535512a73e076c3a5'),
            api: '/invoice/getAll',
            note: 'Lấy danh sách tất cả hóa đơn',
        },
        {
            _id: new Types.ObjectId('686dd0b535512a73e076c3a6'),
            api: '/invoice/delete',
            note: 'Xoá hóa đơn',
        },
        {
            _id: new Types.ObjectId('6882fdc36f95b8b522848816'),
            api: '/invoice/summary',
            note: 'Lấy tổng hợp hóa đơn',
        },

        // Lịch sử thanh toán
        {
            _id: new Types.ObjectId('687df491fd5669a67e23a290'),
            api: '/paymentHistory/create',
            note: 'Tạo lịch sử thanh toán',
        },
        {
            _id: new Types.ObjectId('687df491fd5669a67e23a291'),
            api: '/paymentHistory/update',
            note: 'Cập nhật lịch sử thanh toán',
        },
        {
            _id: new Types.ObjectId('687df491fd5669a67e23a292'),
            api: '/paymentHistory/getById',
            note: 'Xem chi tiết lịch sử thanh toán theo ID',
        },
        {
            _id: new Types.ObjectId('687df491fd5669a67e23a293'),
            api: '/paymentHistory/getAll',
            note: 'Lấy danh sách tất cả lịch sử thanh toán',
        },
        {
            _id: new Types.ObjectId('687df491fd5669a67e23a294'),
            api: '/paymentHistory/delete',
            note: 'Xóa lịch sử thanh toán',
        },

        // Công nợ
        {
            _id: new Types.ObjectId('6880936c160be16212361ba0'),
            api: '/debt/getAll',
            note: 'Lấy danh sách tất cả công nợ',
        },

        //Cài đặt công nợ
        {
            _id: new Types.ObjectId('6882fdc36f95b8b522848800'),
            api: '/configDebt/create',
            note: 'Tạo cài đặt công nợ',
        },
        {
            _id: new Types.ObjectId('6882fdc36f95b8b522848801'),
            api: '/configDebt/update/:id',
            note: 'Cập nhật cài đặt công nợ',
        },
        {
            _id: new Types.ObjectId('6882fdc36f95b8b522848802'),
            api: '/configDebt/getAll',
            note: 'Xem danh sách tất cả cài đặt công nợ',
        },
        {
            _id: new Types.ObjectId('6882fdc36f95b8b522848803'),
            api: '/configDebt/getById/:id',
            note: 'Xem chi tiết cài đặt công nợ',
        },
        {
            _id: new Types.ObjectId('6882fdc36f95b8b522848804'),
            api: '/configDebt/delete/:id',
            note: 'Xóa cài đặt công nợ',
        },

        //chiết khấu
        {
            _id: new Types.ObjectId('687165240ac4b74840483515'),
            api: '/discount/create',
            note: 'Tạo phiếu chiết khấu',
        },
        {
            _id: new Types.ObjectId('6871864935925a3d24f17a15'),
            api: '/discount/getAll',
            note: 'Xem tất cả phiếu chiết khấu',
        },
        {
            _id: new Types.ObjectId('6871899346e790eda9a08c04'),
            api: '/discount/getById',
            note: 'Xem một phiếu chiết khấu',
        },
        {
            _id: new Types.ObjectId('6871899346e790eda9a08c05'),
            api: '/discount/getHistory',
            note: 'Xem lịch sử tất cả phiếu chiết khấu',
        },
        {
            _id: new Types.ObjectId('6871899346e790eda9a08c06'),
            api: '/discount/getOverview',
            note: 'Xem các thông tin thống kê',
        },
        {
            _id: new Types.ObjectId('6871899346e790eda9a08c07'),
            api: '/discount/update',
            note: 'Sửa phiếu chiết khấu',
        },
        {
            _id: new Types.ObjectId('6871899346e790eda9a08c08'),
            api: '/discount/delete',
            note: 'Xóa phiếu chiết khấu',
        },
        {
            _id: new Types.ObjectId('68734efbffa7cc41b2858838'),
            api: '/discount/approved',
            note: 'Chấp nhận phiếu chiết khấu',
        },
        {
            _id: new Types.ObjectId('68734efbffa7cc41b2858839'),
            api: '/discount/rejected',
            note: 'Từ chối phiếu chiết khấu',
        },
        {
            _id: new Types.ObjectId('687415049898805f0639a2f4'),
            api: '/discount/setRefund',
            note: 'Cập nhật trạng thái đã hoàn tiền cho phiếu chiết khấu',
        },
    ])

    logger.info('apis seeded')
}

module.exports = apiSeeder
