// src/seeders/goodsReceiptReportSeeder.js
const { Types } = require('mongoose');
const { logger } = require('../config/loggerConfig');
const GoodsReceipt = require('../models/goodsReceipt');
const GoodsReceiptDetail = require('../models/goodsReceiptDetail');
const Product = require('../models/product');
const Supplier = require('../models/supplier');
const Brand = require('../models/brand');
const Warehouse = require('../models/warehouses');
const Unit = require('../models/unit');
const ProductCategory = require('../models/productCategory');
const constant = require('../utils/constant/constant');

async function seedGoodsReceiptReportData() {
    try {

        // 1. Define static ObjectIDs
        const WAREHOUSE_TANBINH_ID = new Types.ObjectId();
        const WAREHOUSE_LONGAN_ID = new Types.ObjectId();
        const BRAND_DOMINO_ID = new Types.ObjectId();
        const BRAND_JINGYU_ID = new Types.ObjectId();
        const BRAND_EDM_ID = new Types.ObjectId();
        const UNIT_SERIES_ID = new Types.ObjectId();
        const UNIT_ML_ID = new Types.ObjectId();
        const CATEGORY_DEFAULT_ID = new Types.ObjectId();
        const SUPPLIER_EDM_ID = new Types.ObjectId();
        const SUPPLIER_JINGYU_ID = new Types.ObjectId();
        const SUPPLIER_DOMINO_ID = new Types.ObjectId();
        const SUPPLIER_SHIKE_ID = new Types.ObjectId();
        const PRODUCT_D200_ID = new Types.ObjectId();
        const PRODUCT_MC355WT_ID = new Types.ObjectId();
        const PRODUCT_37727_ID = new Types.ObjectId();
        const PRODUCT_15003_ID = new Types.ObjectId();
        const PRODUCT_67728_ID = new Types.ObjectId();
        const ADMIN_USER_ID = new Types.ObjectId('684bcaeb7cac1b319680bf0b');

        // 2. Clean up old report data
        const productCodesToDelete = ['D-200', 'MC-355WT', '37727', '15003', '67728'];
        const supplierNamesToDelete = [
            'GUANZHOU JINGYU ELECTROMECHANICAL',
            'EDM CORPORATION',
            'DOMINO UK LTD',
            'Shanghai Shike Electrical Appliance Manufa'
        ];
        const receiptsToDelete = await GoodsReceipt.find({ supplier: { $in: supplierNamesToDelete } }).select('_id');
        const receiptIdsToDelete = receiptsToDelete.map(r => r._id);
        if (receiptIdsToDelete.length > 0) {
            await GoodsReceiptDetail.deleteMany({ goodsReceiptId: { $in: receiptIdsToDelete } });
            await GoodsReceipt.deleteMany({ _id: { $in: receiptIdsToDelete } });
        }
        const supplierCodesToDelete = [201, 202, 203, 204];
        await Product.deleteMany({ code: { $in: productCodesToDelete } });
        await Supplier.deleteMany({ code: { $in: supplierCodesToDelete } });
        await Brand.deleteMany({ _id: { $in: [BRAND_DOMINO_ID, BRAND_JINGYU_ID, BRAND_EDM_ID] } });
        await Warehouse.deleteMany({ _id: { $in: [WAREHOUSE_TANBINH_ID, WAREHOUSE_LONGAN_ID] } });
        await Unit.deleteMany({ _id: { $in: [UNIT_SERIES_ID, UNIT_ML_ID] } });
        await ProductCategory.deleteOne({ _id: CATEGORY_DEFAULT_ID });

        // 3. Seed dependencies
        await Warehouse.insertMany([ { _id: WAREHOUSE_TANBINH_ID, name: 'Kho Tân Bình new' }, { _id: WAREHOUSE_LONGAN_ID, name: 'Kho Long An' } ]);
        await Brand.insertMany([ { _id: BRAND_DOMINO_ID, name: 'DOMINO' }, { _id: BRAND_JINGYU_ID, name: 'JINGYU' }, { _id: BRAND_EDM_ID, name: 'EDM' } ]);
        await Unit.insertMany([ { _id: UNIT_SERIES_ID, name: 'Series' }, { _id: UNIT_ML_ID, name: 'ml' } ]);
        await ProductCategory.create({ _id: CATEGORY_DEFAULT_ID, name: 'Phụ tùng báo cáo' });
        await Supplier.insertMany([
            { _id: SUPPLIER_JINGYU_ID, code: 201, taxCode: '201201201', name: 'GUANZHOU JINGYU ELECTROMECHANICAL', officialName: '...', billingAddress: '...' },
            { _id: SUPPLIER_EDM_ID, code: 202, taxCode: '202202202', name: 'EDM CORPORATION', officialName: '...', billingAddress: '...' },
            { _id: SUPPLIER_DOMINO_ID, code: 203, taxCode: '203203203', name: 'DOMINO UK LTD', officialName: '...', billingAddress: '...' },
            { _id: SUPPLIER_SHIKE_ID, code: 204, taxCode: '204204204', name: 'Shanghai Shike Electrical Appliance Manufa', officialName: '...', billingAddress: '...' },
        ]);
        await Product.insertMany([
            { _id: PRODUCT_D200_ID, name: 'Product D-200', shortName: 'D-200', code: 'D-200', specification: '1200ml', brand: BRAND_JINGYU_ID, categoryId: CATEGORY_DEFAULT_ID, unit: UNIT_ML_ID, safetyQuantity: 10, managementType: 'none' },
            { _id: PRODUCT_MC355WT_ID, name: 'Product MC-355WT', shortName: 'MC-355WT', code: 'MC-355WT', specification: '825ml', brand: BRAND_JINGYU_ID, categoryId: CATEGORY_DEFAULT_ID, unit: UNIT_ML_ID, safetyQuantity: 10, managementType: 'none' },
            { _id: PRODUCT_37727_ID, name: 'Part 37727', shortName: '37727', code: '37727', specification: 'A-Series', brand: BRAND_DOMINO_ID, categoryId: CATEGORY_DEFAULT_ID, unit: UNIT_SERIES_ID, safetyQuantity: 10, managementType: 'none' },
            { _id: PRODUCT_15003_ID, name: 'Part 15003', shortName: '15003', code: '15003', specification: 'A-Series', brand: BRAND_DOMINO_ID, categoryId: CATEGORY_DEFAULT_ID, unit: UNIT_SERIES_ID, safetyQuantity: 10, managementType: 'none' },
            { _id: PRODUCT_67728_ID, name: 'Part 67728', shortName: '67728', code: '67728', specification: 'A-Series', brand: BRAND_DOMINO_ID, categoryId: CATEGORY_DEFAULT_ID, unit: UNIT_SERIES_ID, safetyQuantity: 10, managementType: 'none' },
        ]);

        // 4. Seed transaction data
        const createReceiptWithDetail = async (receiptData, detailData) => {
            const receipt = await GoodsReceipt.create({ ...receiptData, isTemporary: false, createdBy: ADMIN_USER_ID });
            const addRequiredFields = (d) => ({ 
                ...d, 
                orderedQuantity: d.orderedQuantity || 1,
                price: d.price || d.totalAmount || 0,
            });
            if (Array.isArray(detailData)) {
                const details = detailData.map(d => ({ ...addRequiredFields(d), goodsReceiptId: receipt._id, isTemporary: false }));
                await GoodsReceiptDetail.insertMany(details);
            } else {
                await GoodsReceiptDetail.create({ ...addRequiredFields(detailData), goodsReceiptId: receipt._id, isTemporary: false });
            }
        };

        await createReceiptWithDetail(
            { receiptNumber: 1021, supplierId: SUPPLIER_JINGYU_ID, status: constant.GOODS_RECEIPT_STATUS.APPROVED, supplier: 'GUANZHOU JINGYU ELECTROMECHANICAL', createdAt: new Date('2025-06-20T10:00:00Z'), deliveryAddresses: 'Lô D-3A-CN, Khu công nghiệp Mỹ Phước 2' },
            { productId: PRODUCT_D200_ID, warehouseId: WAREHOUSE_TANBINH_ID, warehouseName: 'Kho Tân Bình new', totalAmount: 12 }
        );
        await createReceiptWithDetail(
            { receiptNumber: 1015, supplierId: SUPPLIER_SHIKE_ID, status: constant.GOODS_RECEIPT_STATUS.APPROVED, supplier: 'Shanghai Shike Electrical Appliance Manufa', createdAt: new Date('2025-06-13T10:00:00Z') },
            [
                { productId: PRODUCT_D200_ID, warehouseId: WAREHOUSE_TANBINH_ID, warehouseName: 'Kho Tân Bình new', totalAmount: 3 },
                { productId: PRODUCT_MC355WT_ID, warehouseId: WAREHOUSE_LONGAN_ID, warehouseName: 'Kho Long An', totalAmount: 200 }
            ]
        );
        
        // Day with multiple statuses
        await createReceiptWithDetail(
            { receiptNumber: 1016, supplierId: SUPPLIER_EDM_ID, status: constant.GOODS_RECEIPT_STATUS.WAREHOUSE_STAFF_APPROVAL, supplier: 'EDM CORPORATION', createdAt: new Date('2025-06-16T10:00:00Z'), deliveryAddresses: 'tp.hcm' },
            { productId: PRODUCT_D200_ID, warehouseId: WAREHOUSE_TANBINH_ID, warehouseName: 'Kho Tân Bình new', totalAmount: 50 }
        );
        await createReceiptWithDetail(
            { receiptNumber: 1017, supplierId: SUPPLIER_EDM_ID, status: constant.GOODS_RECEIPT_STATUS.REJECT, supplier: 'EDM CORPORATION', createdAt: new Date('2025-06-16T11:00:00Z') },
            { productId: PRODUCT_D200_ID, warehouseId: WAREHOUSE_TANBINH_ID, warehouseName: 'Kho Tân Bình new', totalAmount: 40 }
        );
        await createReceiptWithDetail(
            { receiptNumber: 1018, supplierId: SUPPLIER_EDM_ID, status: constant.GOODS_RECEIPT_STATUS.APPROVED, supplier: 'EDM CORPORATION', createdAt: new Date('2025-06-16T12:00:00Z') },
            { productId: PRODUCT_67728_ID, warehouseId: WAREHOUSE_TANBINH_ID, warehouseName: 'Kho Tân Bình new', totalAmount: 50 }
        );

        await createReceiptWithDetail(
            { receiptNumber: 1019, supplierId: SUPPLIER_DOMINO_ID, status: constant.GOODS_RECEIPT_STATUS.APPROVED, supplier: 'DOMINO UK LTD', createdAt: new Date('2025-06-17T10:00:00Z'), deliveryAddresses: 'khu đô thị tương lai metrocity' },
            { productId: PRODUCT_15003_ID, warehouseId: WAREHOUSE_TANBINH_ID, warehouseName: 'Kho Tân Bình new', totalAmount: 50 }
        );

        await createReceiptWithDetail(
            { receiptNumber: 1020, supplierId: SUPPLIER_EDM_ID, status: constant.GOODS_RECEIPT_STATUS.APPROVED, supplier: 'EDM CORPORATION', createdAt: new Date('2025-06-19T10:00:00Z'), deliveryAddresses: 'khu đô thị quá khứ' },
            { productId: PRODUCT_37727_ID, warehouseId: WAREHOUSE_TANBINH_ID, warehouseName: 'Kho Tân Bình new', totalAmount: 35 }
        );
        
        await createReceiptWithDetail(
            { receiptNumber: 1021, supplierId: SUPPLIER_JINGYU_ID, status: constant.GOODS_RECEIPT_STATUS.APPROVED, supplier: 'GUANZHOU JINGYU ELECTROMECHANICAL', createdAt: new Date('2025-06-20T10:00:00Z'), deliveryAddresses: 'Lô D-3A-CN, Khu công nghiệp Mỹ Phước 2' },
            { productId: PRODUCT_D200_ID, warehouseId: WAREHOUSE_TANBINH_ID, warehouseName: 'Kho Tân Bình new', totalAmount: 12 }
        );

        logger.info('Excel seeded')
    } catch (error) {
        logger.error('Error seeding goods receipt report data:', error)
    }
}

module.exports = seedGoodsReceiptReportData;