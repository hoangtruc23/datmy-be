const { Types } = require('mongoose')
const { logger } = require('../config/loggerConfig')
const PermissionModel = require('../models/permission')

async function permissionSeeder() {
    await PermissionModel.deleteMany({})
    await PermissionModel.insertMany([
        // Nhân viên
        {
            _id: new Types.ObjectId('684927c871287f2ae7d812fd'),
            name: 'Nhân viên',
            code: 'nhan_vien',
            parentPermissionId: null,
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d812fe'),
            name: 'Xem',
            code: 'nhan_vien-xem',
            parentPermissionId: '684927c871287f2ae7d812fd',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d812ff'),
            name: 'Thêm',
            code: 'nhan_vien-them',
            parentPermissionId: '684927c871287f2ae7d812fd',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81300'),
            name: 'Cập nhật',
            code: 'nhan_vien-cap_nhat',
            parentPermissionId: '684927c871287f2ae7d812fd',
        },
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81301'),
            name: 'Xóa',
            code: 'nhan_vien-xoa',
            parentPermissionId: '684927c871287f2ae7d812fd',
        },
        {
            _id: new Types.ObjectId('685cd0861d476d4f5d40f95e'),
            name: 'Khóa / Mở khóa',
            code: 'nhan_vien-khoa_mo_khoa',
            parentPermissionId: '684927c871287f2ae7d812fd',
        },

        // Khách hàng
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81302'),
            name: 'Khách hàng',
            code: 'khach_hang',
            parentPermissionId: null,
        },
        {
            _id: new Types.ObjectId('685135a0f2a5cb3fcc6b8f03'),
            name: 'Thêm',
            code: 'khach_hang-them',
            parentPermissionId: '684927c871287f2ae7d81302',
        },
        {
            _id: new Types.ObjectId('6853d1b6fa10ea77cf67990a'),
            name: 'Cập nhật',
            code: 'khach_hang-cap_nhat',
            parentPermissionId: '684927c871287f2ae7d81302',
        },
        {
            _id: new Types.ObjectId('6853d1b6fa10ea77cf67990b'),
            name: 'Xem 1 khách hàng',
            code: 'khach_hang-xem',
            parentPermissionId: '684927c871287f2ae7d81302',
        },
        // {
        //     _id: new Types.ObjectId('6853d1b6fa10ea77cf67990f'),
        //     name: 'Xem tất cả khách hàng',
        //     code: 'khach_hang-xem_all',
        //     parentPermissionId: '684927c871287f2ae7d81302',
        // },
        {
            _id: new Types.ObjectId('6853d1b6fa10ea77cf67990d'),
            name: 'Khóa / Mở khóa',
            code: 'khach_hang-khoa_mo_khoa',
            parentPermissionId: '684927c871287f2ae7d81302',
        },
        {
            _id: new Types.ObjectId('6853d1b6fa10ea77cf679911'),
            name: 'Xoá',
            code: 'khach_hang-xoa',
            parentPermissionId: '684927c871287f2ae7d81302',
        },
        // Nhà cung cấp
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81303'),
            name: 'Nhà cung cấp',
            code: 'nha_cung_cap',
            parentPermissionId: null,
        },
        {
            _id: new Types.ObjectId('684bd4f6fa59db4b4781d2b2'),
            name: 'Thêm',
            code: 'nha_cung_cap-them',
            parentPermissionId: '684927c871287f2ae7d81303',
        },
        {
            _id: new Types.ObjectId('684bd4f6fa59db4b4781d2ae'),
            name: 'Cập nhật',
            code: 'nha_cung_cap-cap_nhat',
            parentPermissionId: '684927c871287f2ae7d81303',
        },
        {
            _id: new Types.ObjectId('684bd4f6fa59db4b4781d2af'),
            name: 'Xóa',
            code: 'nha_cung_cap-xoa',
            parentPermissionId: '684927c871287f2ae7d81303',
        },
        {
            _id: new Types.ObjectId('684bd4f6fa59db4b4781d2b0'),
            name: 'Xem',
            code: 'nha_cung_cap-xem',
            parentPermissionId: '684927c871287f2ae7d81303',
        },
        {
            _id: new Types.ObjectId('684bd4f6fa59db4b4781d2b1'),
            name: 'Khóa / Mở khóa',
            code: 'nha_cung_cap-khoa_mo_khoa',
            parentPermissionId: '684927c871287f2ae7d81303',
        },

        // Kho hàng
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81304'),
            name: 'Kho hàng',
            code: 'kho_hang',
            parentPermissionId: null,
        },
        {
            _id: new Types.ObjectId('684c3d35f0e869d0df11fed3'),
            name: 'Xem',
            code: 'kho_hang-xem',
            parentPermissionId: '684927c871287f2ae7d81304',
        },

        {
            _id: new Types.ObjectId('684c3d35f0e869d0df11fed4'),
            name: 'Thêm',
            code: 'kho_hang-them',
            parentPermissionId: '684927c871287f2ae7d81304',
        },

        {
            _id: new Types.ObjectId('684c3d35f0e869d0df11fed5'),
            name: 'Cập nhật',
            code: 'kho_hang-cap_nhat',
            parentPermissionId: '684927c871287f2ae7d81304',
        },

        {
            _id: new Types.ObjectId('684c3d35f0e869d0df11fed6'),
            name: 'Xóa',
            code: 'kho_hang-xoa',
            parentPermissionId: '684927c871287f2ae7d81304',
        },

        {
            _id: new Types.ObjectId('685247989820dda77e2e7272'),
            name: 'Khóa / Mở khóa',
            code: 'kho_hang-khoa_mo_khoa',
            parentPermissionId: '684927c871287f2ae7d81304',
        },

        // Danh mục
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81305'),
            name: 'Danh mục',
            code: 'danh_muc',
            parentPermissionId: null,
        },
        {
            _id: new Types.ObjectId('6854e30d6b90439ad8c00dbb'),
            name: 'Thêm',
            code: 'danh_muc-them',
            parentPermissionId: '684927c871287f2ae7d81305',
        },

        {
            _id: new Types.ObjectId('6854e30d6b90439ad8c00dbc'),
            name: 'Xem',
            code: 'danh_muc-xem',
            parentPermissionId: '684927c871287f2ae7d81305',
        },

        {
            _id: new Types.ObjectId('6854e30d6b90439ad8c00dbd'),
            name: 'Cập nhật',
            code: 'danh_muc-cap_nhat',
            parentPermissionId: '684927c871287f2ae7d81305',
        },

        {
            _id: new Types.ObjectId('6854e30d6b90439ad8c00dbe'),
            name: 'Khóa / Mở khóa',
            code: 'danh_muc-khoa_mo_khoa',
            parentPermissionId: '684927c871287f2ae7d81305',
        },

        // Sản phẩm
        {
            _id: new Types.ObjectId('685a1b9f9f5d2f68d81a1eb4'),
            name: 'Sản phẩm',
            code: 'san_pham',
            parentPermissionId: null,
        },
        {
            _id: new Types.ObjectId('685a1b9f9f5d2f68d81a1eb6'),
            name: 'Thêm',
            code: 'san_pham-them',
            parentPermissionId: '685a1b9f9f5d2f68d81a1eb4',
        },

        {
            _id: new Types.ObjectId('685a1b9f9f5d2f68d81a1eb7'),
            name: 'Xem',
            code: 'san_pham-xem',
            parentPermissionId: '685a1b9f9f5d2f68d81a1eb4',
        },

        {
            _id: new Types.ObjectId('685a1b9f9f5d2f68d81a1eb8'),
            name: 'Cập nhật',
            code: 'san_pham-cap_nhat',
            parentPermissionId: '685a1b9f9f5d2f68d81a1eb4',
        },

        {
            _id: new Types.ObjectId('685a1b9f9f5d2f68d81a1eb9'),
            name: 'Khóa / Mở khóa',
            code: 'san_pham-khoa_mo_khoa',
            parentPermissionId: '685a1b9f9f5d2f68d81a1eb4',
        },

        {
            _id: new Types.ObjectId('685a1b9f9f5d2f68d81a1ec9'),
            name: 'Cập nhật số lượng tồn kho',
            code: 'san_pham-cap_nhat_so_luong_ton_kho',
            parentPermissionId: '685a1b9f9f5d2f68d81a1eb4',
        },

        // Thương hiệu
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81306'),
            name: 'Thương hiệu',
            code: 'thuong_hieu',
            parentPermissionId: null,
        },
        {
            _id: new Types.ObjectId('68525e2d25829b7e6b32a612'),
            name: 'Thêm',
            code: 'thuong_hieu-them',
            parentPermissionId: '684927c871287f2ae7d81306',
        },
        {
            _id: new Types.ObjectId('68525e2d25829b7e6b32a613'),
            name: 'Xem',
            code: 'thuong_hieu-xem',
            parentPermissionId: '684927c871287f2ae7d81306',
        },
        {
            _id: new Types.ObjectId('68525e2d25829b7e6b32a614'),
            name: 'Xoá',
            code: 'thuong_hieu-xoa',
            parentPermissionId: '684927c871287f2ae7d81306',
        },
        {
            _id: new Types.ObjectId('68525e2d25829b7e6b32a615'),
            name: 'Cập nhật',
            code: 'thuong_hieu-cap_nhat',
            parentPermissionId: '684927c871287f2ae7d81306',
        },
        {
            _id: new Types.ObjectId('685cd0861d476d4f5d40f95f'),
            name: 'Khóa / Mở khóa',
            code: 'thuong_hieu-khoa_mo_khoa',
            parentPermissionId: '684927c871287f2ae7d81306',
        },

        // Nhập kho
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81307'),
            name: 'Nhập kho',
            code: 'nhap_kho',
            parentPermissionId: null,
        },
        {
            _id: new Types.ObjectId('6856e210a596678c37b505e1'),
            name: 'Xem',
            code: 'nhap_kho-xem',
            parentPermissionId: '684927c871287f2ae7d81307',
        },
        {
            _id: new Types.ObjectId('68568d96dd90fa75cb286479'),
            name: 'Thêm',
            code: 'nhap_kho-them',
            parentPermissionId: '684927c871287f2ae7d81307',
        },
        {
            _id: new Types.ObjectId('6858d5bd26c71e076fdfad83'),
            name: 'Cập nhật',
            code: 'nhap_kho-cap_nhat',
            parentPermissionId: '684927c871287f2ae7d81307',
        },
        {
            _id: new Types.ObjectId('6858d5bd26c71e076fdfad21'),
            name: 'Xác nhận nhập kho',
            code: 'nhap_kho-xac_nhan_nhap_kho',
            parentPermissionId: '684927c871287f2ae7d81307',
        },
        {
            _id: new Types.ObjectId('685a2a4f4630d293367c288c'),
            name: 'Xuất báo cáo',
            code: 'nhap_kho-xuat_bao_cao',
            parentPermissionId: '684927c871287f2ae7d81307',
        },
        {
            _id: new Types.ObjectId('6864fd7c1d9ec4d84204b720'),
            name: 'Tải file số hóa đơn/ hợp đồng phiếu nhập kho',
            code: 'nhap_kho-tai_file_so_hoa_don',
            parentPermissionId: '684927c871287f2ae7d81307',
        },

        // Xuất kho
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81308'),
            name: 'Xuất kho',
            code: 'xuat_kho',
            parentPermissionId: null,
        },
        {
            _id: new Types.ObjectId('685a477d73dd15c087569dee'),
            name: 'Xem',
            code: 'xuat_kho-xem',
            parentPermissionId: '684927c871287f2ae7d81308',
        },
        {
            _id: new Types.ObjectId('685a477d73dd15c087569def'),
            name: 'Thêm',
            code: 'xuat_kho-them',
            parentPermissionId: '684927c871287f2ae7d81308',
        },
        {
            _id: new Types.ObjectId('685a477d73dd15c087569df0'),
            name: 'Cập nhật',
            code: 'xuat_kho-cap_nhat',
            parentPermissionId: '684927c871287f2ae7d81308',
        },
        {
            _id: new Types.ObjectId('685a477d73dd15c087569df1'),
            name: 'Xác nhận nhập kho',
            code: 'xuat_kho-xac_nhan_xuat_kho',
            parentPermissionId: '684927c871287f2ae7d81308',
        },
        {
            _id: new Types.ObjectId('6861f2e524fe5c2a802dcaea'),
            name: 'Xuất báo cáo',
            code: 'xuat_kho-xuat_bao_cao',
            parentPermissionId: '684927c871287f2ae7d81308',
        },
        {
            _id: new Types.ObjectId('6864fd7c1d9ec4d84204b71e'),
            name: 'Tải file số hóa đơn/ hợp đồng phiếu xuất kho',
            code: 'xuat_kho-tai_file_so_hoa_don',
            parentPermissionId: '684927c871287f2ae7d81308',
        },
        {
            _id: new Types.ObjectId('6864fd7c1d9ec4d84204b71f'),
            name: 'Tải file PDF phiếu xuất kho',
            code: 'xuat_kho-tai_file_pdf_phieu_xuat_kho',
            parentPermissionId: '684927c871287f2ae7d81308',
        },

        // Tạm ứng
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81309'),
            name: 'Tạm ứng',
            code: 'tam_ung',
            parentPermissionId: null,
        },
        {
            _id: new Types.ObjectId('685cf633e0e45d397c4ca197'),
            name: 'Xem',
            code: 'tam_ung-xem',
            parentPermissionId: '684927c871287f2ae7d81309',
        },
        {
            _id: new Types.ObjectId('685cf633e0e45d397c4ca198'),
            name: 'Thêm',
            code: 'tam_ung-them',
            parentPermissionId: '684927c871287f2ae7d81309',
        },
        {
            _id: new Types.ObjectId('685cf633e0e45d397c4ca199'),
            name: 'Cập nhật',
            code: 'tam_ung-cap_nhat',
            parentPermissionId: '684927c871287f2ae7d81309',
        },
        {
            _id: new Types.ObjectId('685cf633e0e45d397c4ca19a'),
            name: 'Xác nhận tạm ứng',
            code: 'tam_ung-xac_nhan_tam_ung',
            parentPermissionId: '684927c871287f2ae7d81309',
        },
        {
            _id: new Types.ObjectId('687a08ce43d7e6c16ee8b585'),
            name: 'Nhận lại hàng',
            code: 'tam_ung-nhan_lai_hang',
            parentPermissionId: '684927c871287f2ae7d81309',
        },
        {
            _id: new Types.ObjectId('6864e6cd4c3c96b50ff0e104'),
            name: 'Xuất báo cáo',
            code: 'tam_ung-xuat_bao_cao',
            parentPermissionId: '684927c871287f2ae7d81309', // Parent is 'Tạm ứng'
        },

        //dashboard công nợ
        {
            _id: new Types.ObjectId('689c01a260903c30215b25c1'),
            name: 'Dashboar công nợ',
            code: 'dashboard_cong_no',
            parentPermissionId: null,
        },

        {
            _id: new Types.ObjectId('689c01a260903c30215b25c0'),
            name: 'Xem',
            code: 'dashboard_cong_no-xem',
            parentPermissionId: '689c01a260903c30215b25c1',
        },

        //hóa đơn
        {
            _id: new Types.ObjectId('686dd0b535512a73e076c3a7'),
            name: 'Hóa đơn',
            code: 'hoa_don',
            parentPermissionId: null,
        },

        {
            _id: new Types.ObjectId('686dd0b535512a73e076c3a8'),
            name: 'Xem',
            code: 'hoa_don-xem',
            parentPermissionId: '686dd0b535512a73e076c3a7',
        },
        {
            _id: new Types.ObjectId('686dd0b535512a73e076c3a9'),
            name: 'Thêm',
            code: 'hoa_don-them',
            parentPermissionId: '686dd0b535512a73e076c3a7',
        },
        {
            _id: new Types.ObjectId('686dd0b535512a73e076c3aa'),
            name: 'Cập nhật',
            code: 'hoa_don-cap_nhat',
            parentPermissionId: '686dd0b535512a73e076c3a7',
        },
        {
            _id: new Types.ObjectId('686dd0b535512a73e076c3ab'),
            name: 'Xóa',
            code: 'hoa_don-xoa',
            parentPermissionId: '686dd0b535512a73e076c3a7',
        },
        {
            _id: new Types.ObjectId('6882fdc36f95b8b522848815'),
            name: 'tổng hợp',
            code: 'hoa_don-tong_hop',
            parentPermissionId: '686dd0b535512a73e076c3a7',
        },

        // Lịch sử thanh toán
        {
            _id: new Types.ObjectId('687df491fd5669a67e23a295'),
            name: 'Lịch sử thanh toán',
            code: 'payment_history',
            parentPermissionId: null,
        },
        {
            _id: new Types.ObjectId('687df491fd5669a67e23a296'),
            name: 'Xem',
            code: 'payment_history-xem',
            parentPermissionId: '687df491fd5669a67e23a295',
        },
        {
            _id: new Types.ObjectId('687df491fd5669a67e23a297'),
            name: 'Thêm',
            code: 'payment_history-them',
            parentPermissionId: '687df491fd5669a67e23a295',
        },
        {
            _id: new Types.ObjectId('687df491fd5669a67e23a298'),
            name: 'Cập nhật',
            code: 'payment_history-cap_nhat',
            parentPermissionId: '687df491fd5669a67e23a295',
        },
        {
            _id: new Types.ObjectId('687df491fd5669a67e23a299'),
            name: 'Xóa',
            code: 'payment_history-xoa',
            parentPermissionId: '687df491fd5669a67e23a295',
        },

        // Công nợ
        {
            _id: new Types.ObjectId('6880936c160be16212361ba1'),
            name: 'Công nợ',
            code: 'cong_no',
            parentPermissionId: null,
        },
        {
            _id: new Types.ObjectId('6880936c160be16212361ba2'),
            name: 'Xem',
            code: 'cong_no-xem',
            parentPermissionId: '6880936c160be16212361ba1',
        },
        {
            _id: new Types.ObjectId('6892ceaeee639479e26a93b3'),
            name: 'Tạo báo cáo',
            code: 'cong_no-tao_bao_cao',
            parentPermissionId: '6880936c160be16212361ba1',
        },
        {
            _id: new Types.ObjectId('6892ceaeee639479e26a93b4'),
            name: 'Tạo giấy thanh toán',
            code: 'cong_no-tao_giay_thanh_toan',
            parentPermissionId: '6880936c160be16212361ba1',
        },
        //cài đặt công nợ
        {
            _id: new Types.ObjectId('6882fdc36f95b8b522848805'),
            name: 'Cài đặt công nợ',
            code: 'cai_dat_cong_no',
            parentPermissionId: null,
        },
        {
            _id: new Types.ObjectId('6882fdc36f95b8b522848806'),
            name: 'Xem',
            code: 'cai_dat_cong_no-xem',
            parentPermissionId: '6882fdc36f95b8b522848805',
        },
        {
            _id: new Types.ObjectId('6882fdc36f95b8b522848807'),
            name: 'Thêm',
            code: 'cai_dat_cong_no-them',
            parentPermissionId: '6882fdc36f95b8b522848805',
        },
        {
            _id: new Types.ObjectId('6882fdc36f95b8b522848808'),
            name: 'Cập nhật',
            code: 'cai_dat_cong_no-cap_nhat',
            parentPermissionId: '6882fdc36f95b8b522848805',
        },
        {
            _id: new Types.ObjectId('6882fdc36f95b8b522848809'),
            name: 'Xóa',
            code: 'cai_dat_cong_no-xoa',
            parentPermissionId: '6882fdc36f95b8b522848805',
        },

        // nhắc nợ
        {
            _id: new Types.ObjectId('68899f050e446ab399609245'),
            name: 'Nhắc nợ',
            code: 'debt_reminder',
            parentPermissionId: null,
        },
        {
            _id: new Types.ObjectId('68899f050e446ab399609247'),
            name: 'Tạo',
            code: 'debt_reminder-tao',
            parentPermissionId: '68899f050e446ab399609245',
        },
        {
            _id: new Types.ObjectId('68899f050e446ab399609248'),
            name: 'Cập nhật',
            code: 'debt_reminder-cap_nhat',
            parentPermissionId: '68899f050e446ab399609245',
        },
        {
            _id: new Types.ObjectId('68899f050e446ab399609246'),
            name: 'Xem',
            code: 'debt_reminder-xem',
            parentPermissionId: '68899f050e446ab399609245',
        },
        {
            _id: new Types.ObjectId('68899f050e446ab399609249'),
            name: 'Xóa',
            code: 'debt_reminder-xoa',
            parentPermissionId: '68899f050e446ab399609245',
        },

        //chiết khấu
        {
            _id: new Types.ObjectId('687165240ac4b7484048357d'),
            name: 'Chiết khấu',
            code: 'chiet_khau',
            parentPermissionId: null,
        },

        {
            _id: new Types.ObjectId('687165e2ee8406ca535d1ba2'),
            name: 'Xem',
            code: 'chiet_khau-xem',
            parentPermissionId: '687165240ac4b7484048357d',
        },
        {
            _id: new Types.ObjectId('687165e2ee8406ca535d1ba3'),
            name: 'Thêm',
            code: 'chiet_khau-them',
            parentPermissionId: '687165240ac4b7484048357d',
        },
        {
            _id: new Types.ObjectId('687165e2ee8406ca535d1ba4'),
            name: 'Cập nhật',
            code: 'chiet_khau-cap_nhat',
            parentPermissionId: '687165240ac4b7484048357d',
        },
        {
            _id: new Types.ObjectId('687165e2ee8406ca535d1ba5'),
            name: 'Xóa',
            code: 'chiet_khau-xoa',
            parentPermissionId: '687165240ac4b7484048357d',
        },

        // Báo cáo
        {
            _id: new Types.ObjectId('688c7f601bb97636f19d6ac3'),
            name: 'Báo cáo',
            code: 'bao_cao',
            parentPermissionId: null,
        },
        {
            _id: new Types.ObjectId('688c7f601bb97636f19d6ac4'),
            name: 'Xem',
            code: 'bao_cao-xem',
            parentPermissionId: '688c7f601bb97636f19d6ac3',
        },
        {
            _id: new Types.ObjectId('688c7f601bb97636f19d6ad8'),
            name: 'Sinh báo cáo chi tiết khách hàng',
            code: 'bao_cao-sinh_bao_cao_chi_tiet_khach_hang',
            parentPermissionId: '688c7f601bb97636f19d6ac3',
        },

        {
            _id: new Types.ObjectId('688c7f601bb97636f19d6ad9'),
            name: 'Sinh báo cáo đối chiếu công nợ',
            code: 'bao_cao-sinh_bao_cao_doi_chieu_cong_no',
            parentPermissionId: '688c7f601bb97636f19d6ac3',
        },

        //mail
        {
            _id: new Types.ObjectId('68c12543e78783270db36262'),
            name: 'Mail',
            code: 'mail',
            parentPermissionId: null,
        },
        {
            _id: new Types.ObjectId('68c12543e78783270db36263'),
            name: 'Tạo kết nối đến mail server',
            code: 'tao_ket_noi_den_mail_server',
            parentPermissionId: '68c12543e78783270db36262',
        },
        {
            _id: new Types.ObjectId('68c12543e78783270db36264'),
            name: 'Gửi mail',
            code: 'gui_mail',
            parentPermissionId: '68c12543e78783270db36262',
        },
        {
            _id: new Types.ObjectId('68c78603e435ea91ad31fc57'),
            name: 'Cấu hình người nhận mail mặc định',
            code: 'cau_hinh_nguoi_nhan_mail_mac_dinh',
            parentPermissionId: '68c12543e78783270db36262',
        },
        {
            _id: new Types.ObjectId('68c933a802908cb98dd9004d'),
            name: 'Lấy ra cấu hình, người nhận mail mặc định',
            code: 'lay_ra_cau_hinh_va_nguoi_nhan_mail_mac_dinh',
            parentPermissionId: '68c12543e78783270db36262',
        },
        // chuyển kho
        {
            _id: new Types.ObjectId('688c7f601bb97636f19d6ab1'),
            name: 'Chuyển kho',
            code: 'chuyen_kho',
            parentPermissionId: null,
        },
        {
            _id: new Types.ObjectId('688c7f601bb97636f19d6ab2'),
            name: 'Danh sách phiếu chuyển kho',
            code: 'chuyen_kho_them',
            parentPermissionId: '688c7f601bb97636f19d6ab1',
        },
        {
            _id: new Types.ObjectId('688c7f601bb97636f19d6ab3'),
            name: 'Tạo chuyển kho',
            code: 'chuyen_kho_xem',
            parentPermissionId: '688c7f601bb97636f19d6ab1',
        },
        //phiếu yêu cầu công việc
        {
            _id: new Types.ObjectId('68d1166bba1c480c8180bf6b'),
            name: 'Phiếu yêu cầu công việc',
            code: 'phieu_yeu_cau_cong_viec',
            parentPermissionId: null,
        },
        {
            _id: new Types.ObjectId('68d1166bba1c480c8180bf6c'),
            name: 'Xem phiếu yêu cầu công việc',
            code: 'xem_phieu_yeu_cau_cong_viec',
            parentPermissionId: '68d1166bba1c480c8180bf6b',
        },
        {
            _id: new Types.ObjectId('68d1166bba1c480c8180bf6d'),
            name: 'Tạo phiếu yêu cầu công việc',
            code: 'tao_phieu_yeu_cau_cong_viec',
            parentPermissionId: '68d1166bba1c480c8180bf6b',
        },
        {
            _id: new Types.ObjectId('68d3750d4828a7c4347ad1bd'),
            name: 'Chỉnh sửa phiếu yêu cầu công việc',
            code: 'chinh_sua_phieu_yeu_cau_cong_viec',
            parentPermissionId: '68d1166bba1c480c8180bf6b',
        },
        {
            _id: new Types.ObjectId('68d3750d4828a7c4347ad1be'),
            name: 'Xóa phiếu yêu cầu công việc',
            code: 'xoa_phieu_yeu_cau_cong_viec',
            parentPermissionId: '68d1166bba1c480c8180bf6b',
        },
    ])
    logger.info('Permissions seeded')
}

module.exports = permissionSeeder
