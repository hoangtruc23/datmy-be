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

        // Danh mục
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81305'),
            name: 'Danh mục',
            code: 'danh_muc',
            parentPermissionId: null,
        },

        // Thương hiệu
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81306'),
            name: 'Thương hiệu',
            code: 'thuong_hieu',
            parentPermissionId: null,
        },

        // Nhập kho
        {
            _id: new Types.ObjectId('684927c871287f2ae7d81307'),
            name: 'Nhập kho',
            code: 'nhap_kho',
            parentPermissionId: null,
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
