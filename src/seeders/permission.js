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
        {
            _id: new Types.ObjectId('6853d1b6fa10ea77cf67990f'),
            name: 'Xem tất cả khách hàng',
            code: 'khach_hang-xem_all',
            parentPermissionId: '684927c871287f2ae7d81302',
        },
        {
            _id: new Types.ObjectId('6853d1b6fa10ea77cf67990d'),
            name: 'Khóa/Mở khóa',
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
            name: 'Khóa/Mở khóa',
            code: 'nha_cung_cap-khoa-mo_khoa',
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
            name: 'xem',
            code: 'kho_hang-xem',
            parentPermissionId: '684927c871287f2ae7d81304',
        },

        {
            _id: new Types.ObjectId('684c3d35f0e869d0df11fed4'),
            name: 'thêm',
            code: 'kho_hang-them',
            parentPermissionId: '684927c871287f2ae7d81304',
        },

        {
            _id: new Types.ObjectId('684c3d35f0e869d0df11fed5'),
            name: 'cập nhật',
            code: 'kho_hang-cap_nhat',
            parentPermissionId: '684927c871287f2ae7d81304',
        },

        {
            _id: new Types.ObjectId('684c3d35f0e869d0df11fed6'),
            name: 'xóa',
            code: 'kho_hang-xoa',
            parentPermissionId: '684927c871287f2ae7d81304',
        },

        {
            _id: new Types.ObjectId('685247989820dda77e2e7272'),
            name: 'cập nhật trạng thái',
            code: 'kho_hang-cap_nhat_trang_thai',
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
            name: 'Khóa Mở khóa',
            code: 'danh_muc-khoa_mo_khoa',
            parentPermissionId: '684927c871287f2ae7d81305',
        },

        // Sản phẩm

        // Thương hiệu
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81306'),
            name: 'Thương hiệu',
            code: 'thuong_hieu',
            parentPermissionId: null,
        },

        {
            _id: new Types.ObjectId('68525e2d25829b7e6b32a612'),
            name: 'thêm',
            code: 'thuong_hieu-them',
            parentPermissionId: '684927c871287f2ae7d81306',
        },

        {
            _id: new Types.ObjectId('68525e2d25829b7e6b32a613'),
            name: 'xem',
            code: 'thuong_hieu-xem',
            parentPermissionId: '684927c871287f2ae7d81306',
        },

        {
            _id: new Types.ObjectId('68525e2d25829b7e6b32a614'),
            name: 'xoá',
            code: 'thuong_hieu-xoá',
            parentPermissionId: '684927c871287f2ae7d81306',
        },

        {
            _id: new Types.ObjectId('68525e2d25829b7e6b32a615'),
            name: 'cập nhật',
            code: 'thuong_hieu-cap_nhat',
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

        // Xuất kho
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81308'),
            name: 'Xuất kho',
            code: 'xuat_kho',
            parentPermissionId: null,
        },

        // Tạm ứng
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81309'),
            name: 'Tạm ứng',
            code: 'tam_ung',
            parentPermissionId: null,
        },
    ])
    logger.info('Permissions seeded')
}

module.exports = permissionSeeder
