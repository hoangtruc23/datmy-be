const ExcelJS = require('exceljs')
const { generateGoodsReport } = require('../utils/helper/excelReportHelper')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')
const GoodsReceiptModel = require('../models/goodsReceipt')
const ProductModel = require('../models/product')
const GoodsReceiptDetaileModel = require('../models/goodsReceiptDetail')
const WarehouseModel = require('../models/warehouses')
const { Types, default: mongoose } = require('mongoose')
const constant = require('../utils/constant/constant')
const ProductStorageModel = require('../models/productStorage')
const GoodsReceiptApprovalModel = require('../models/goodsReceiptApproval')
const UserModel = require('../models/user')
const SupplierModel = require('../models/supplier')
const { findDuplicateTrackingCode } = require('../utils/helper/helper')
const downloadService = require('./downloadService')
const goodsReceiptService = {
    getAll: async (query) => {
        try {
            let {
                search,
                page = 1,
                limit = 10,
                statuses = Object.values(constant.GOODS_RECEIPT_STATUS),
            } = query
            page = Number(page)
            limit = Number(limit)
            search = new RegExp(search, 'i')
            const [items, totalItem] = await Promise.all([
                GoodsReceiptModel.find({
                    status: { $in: statuses },
                    $or: [
                        { supplier: search },
                        { invoiceOrContractNumber: search },
                    ],
                    isTemporary: false,
                })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('createdBy', 'fullname')
                    .sort({ createdAt: -1 }),
                GoodsReceiptModel.countDocuments({
                    status: { $in: statuses },
                    $or: [{ supplier: search }],
                }),
            ])
            return {
                items,
                page,
                totalItem,
                totalPage: Math.ceil(totalItem / limit),
            }
        } catch (error) {
            throw error
        }
    },
    getById: async (goodsReceiptId) => {
        try {
            const goodsReceipt = await GoodsReceiptModel.aggregate([
                {
                    $match: {
                        _id: new Types.ObjectId(String(goodsReceiptId)),
                    },
                },
                {
                    $lookup: {
                        from: 'goodsreceiptdetails',
                        as: 'products',
                        localField: '_id',
                        foreignField: 'goodsReceiptId',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'units',
                                    localField: 'unit',
                                    foreignField: '_id',
                                    as: 'unitInfo',
                                },
                            },
                            {
                                $set: {
                                    unit: {
                                        $arrayElemAt: ['$unitInfo.name', 0],
                                    },
                                },
                            },
                            {
                                $unset: 'unitInfo',
                            },
                        ],
                    },
                },
                {
                    $lookup: {
                        from: 'goodsreceiptapprovals',
                        as: 'approvals',
                        localField: '_id',
                        foreignField: 'goodsReceiptId',
                    },
                },
            ])
            if (!goodsReceipt[0]) {
                throw new BadReq(errorCode.GOODS_RECEIPT_NOT_FOUND)
            }
            return goodsReceipt[0]
        } catch (error) {
            throw error
        }
    },
    createTemporary: async (currentUserId) => {
        try {
            const goodsReceipt = await GoodsReceiptModel.create({
                createdBy: currentUserId,
            })
            return goodsReceipt
        } catch (error) {
            throw error
        }
    },
    create: async (goodsReceiptId, goodsReceipt, currentUserId) => {
        const session = await mongoose.startSession()
        try {
            session.startTransaction()
            const {
                supplierId,
                invoiceFile,
                invoiceOrContractNumber,
                estimatedDeliveryDate,
                // warehouseId,
                supplier,
                deliveryAddresses,
                note,
                createdAt = new Date(),
            } = goodsReceipt
            const checkGoodsReceipt =
                await GoodsReceiptModel.findById(goodsReceiptId)
            if (!checkGoodsReceipt) {
                throw new BadReq(errorCode.GOODS_RECEIPT_NOT_FOUND)
            }
            const checkSupplier = await SupplierModel.findById(supplierId)
            if (!checkSupplier) {
                throw new BadReq(errorCode.SUPPLIER_NOT_FOUND)
            }

            const checkGoodsReceiptDetail =
                await GoodsReceiptDetaileModel.findOne({
                    goodsReceiptId,
                })
            if (!checkGoodsReceiptDetail) {
                throw new BadReq(errorCode.GOODS_RECEIPT_DETAIL_NOT_FOUND)
            }

            await GoodsReceiptModel.findByIdAndUpdate(
                goodsReceiptId,
                {
                    supplierId,
                    invoiceFile,
                    invoiceOrContractNumber,
                    estimatedDeliveryDate,
                    supplier,
                    billingAddress: checkSupplier.billingAddress,
                    deliveryAddresses,
                    note,
                    isTemporary: false,
                    status: constant.GOODS_RECEIPT_STATUS
                        .WAREHOUSE_STAFF_APPROVAL,
                    createdBy: currentUserId,
                    createdAt,
                },
                { session },
            )

            const user = await UserModel.findById(currentUserId)
            await GoodsReceiptApprovalModel.create(
                [
                    {
                        goodsReceiptId,
                        createdBy: {
                            approvedBy: user.fullname,
                            status: constant.APPROVAL_STATUS.APPROVED,
                            content: 'Tạo',
                        },
                    },
                ],
                { session },
            )
            await session.commitTransaction()
            return null
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    },
    update: async (goodsReceiptId, goodsReceipt, currentUserId) => {
        const session = await mongoose.startSession()
        try {
            session.startTransaction()
            const {
                supplierId,
                invoiceFile,
                invoiceOrContractNumber,
                estimatedDeliveryDate,
                // warehouseId,
                supplier,
                deliveryAddresses,
                note,
            } = goodsReceipt
            const checkGoodsReceipt =
                await GoodsReceiptModel.findById(goodsReceiptId)
            if (!checkGoodsReceipt) {
                throw new BadReq(errorCode.GOODS_RECEIPT_NOT_FOUND)
            }
            if (
                checkGoodsReceipt.status == constant.GOODS_RECEIPT_STATUS.CANCEL
            ) {
                throw new BadReq(errorCode.DO_NOT_UPDATE_STATUS_CANCEL)
            }
            const checkSupplier = await SupplierModel.findById(supplierId)
            if (!checkSupplier) {
                throw new BadReq(errorCode.SUPPLIER_NOT_FOUND)
            }
            await GoodsReceiptModel.findByIdAndUpdate(
                goodsReceiptId,
                {
                    supplierId,
                    invoiceFile,
                    invoiceOrContractNumber,
                    estimatedDeliveryDate,
                    supplier,
                    billingAddress: checkSupplier.billingAddress,
                    deliveryAddresses,
                    note,
                    // isTemporary: false,
                    // status: constant.GOODS_RECEIPT_STATUS.WAREHOUSE_STAFF_APPROVAL,
                    // createdBy: currentUserId,
                    updatedBy: currentUserId,
                },
                { session },
            )
            await session.commitTransaction()
            return null
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    },
    cancel: async (goodsReceiptId, currentUserId) => {
        const session = await mongoose.startSession()
        try {
            session.startTransaction()
            const checkGoodsReceipt =
                await GoodsReceiptModel.findById(goodsReceiptId)
            if (!checkGoodsReceipt) {
                throw new BadReq(errorCode.GOODS_RECEIPT_NOT_FOUND)
            }
            if (checkGoodsReceipt.createdBy != currentUserId) {
                throw new BadReq(errorCode.DO_NOT_CANCEL_GOODS_RECEIPT)
            }
            await GoodsReceiptModel.findByIdAndUpdate(
                goodsReceiptId,
                {
                    status: constant.GOODS_RECEIPT_STATUS.CANCEL,
                    updatedBy: currentUserId,
                },
                { session },
            )
            await GoodsReceiptApprovalModel.findOneAndUpdate(
                { goodsReceiptId },
                {
                    createdBy: {
                        status: constant.APPROVAL_STATUS.CANCEL,
                    },
                },
                { session },
            )
            await session.commitTransaction()
            return null
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    },
    addProduct: async (product) => {
        try {
            const {
                goodsReceiptId,
                productId,
                warehouseId,
                origin,
                orderedQuantity,
                price,
                totalAmount,
                note,
            } = product

            const checkGoodsReceiptDetailExist =
                await GoodsReceiptDetaileModel.findOne({
                    goodsReceiptId,
                    productId,
                    warehouseId,
                })
            if (checkGoodsReceiptDetailExist) {
                throw new BadReq(errorCode.GOODS_RECEIPT_DETAIL_EXISTED)
            }
            const [checkReceipt, checkWarehouse, checkProduct] =
                await Promise.all([
                    GoodsReceiptModel.findById(goodsReceiptId),
                    WarehouseModel.findById(warehouseId),
                    ProductModel.findById(productId),
                ])

            if (!checkReceipt) {
                throw new BadReq(errorCode.GOODS_RECEIPT_NOT_FOUND)
            }

            if (!checkWarehouse) {
                throw new BadReq(errorCode.WAREHOUSE_NOT_FOUND)
            }
            // Do chưa có api product nên chưa check được
            if (!checkProduct) {
                throw new BadReq(errorCode.PRODUCT_NOT_FOUND)
            }
            await GoodsReceiptDetaileModel.create({
                goodsReceiptId,
                productId,
                warehouseId,
                productCode: checkProduct?.code,
                productName: checkProduct?.name,
                managementType: checkProduct?.managementType,
                unit: checkProduct?.unit,
                origin,
                orderedQuantity,
                price,
                totalAmount,
                warehouseName: checkWarehouse.name,
                note,
            })
            return null
        } catch (error) {
            throw error
        }
    },
    updateProduct: async (goodsReceiptDetailId, product) => {
        try {
            const {
                goodsReceiptId,
                productId,
                warehouseId,
                origin,
                orderedQuantity,
                price,
                totalAmount,
                note,
            } = product
            const checkGoodsReceiptDetailExist =
                await GoodsReceiptDetaileModel.findOne({
                    _id: { $ne: goodsReceiptDetailId },
                    goodsReceiptId,
                    productId,
                    warehouseId,
                })
            if (checkGoodsReceiptDetailExist) {
                throw new BadReq(errorCode.GOODS_RECEIPT_DETAIL_EXISTED)
            }
            const [
                checkGoodsReceiptDetail,
                checkReceipt,
                checkWarehouse,
                checkProduct,
            ] = await Promise.all([
                GoodsReceiptDetaileModel.findById(goodsReceiptDetailId),
                GoodsReceiptModel.findById(goodsReceiptId),
                WarehouseModel.findById(warehouseId),
                ProductModel.findById(productId),
            ])

            if (!checkGoodsReceiptDetail) {
                throw new BadReq(errorCode.GOODS_RECEIPT_DETAIL_NOT_FOUND)
            }

            // if (checkGoodsReceiptDetail.storages.length > 0) {
            //     throw new BadReq(errorCode.DO_NOT_UPDATE_PRODUCT_CREATED)
            // }

            if (!checkReceipt) {
                throw new BadReq(errorCode.GOODS_RECEIPT_NOT_FOUND)
            }

            if (!checkWarehouse) {
                throw new BadReq(errorCode.WAREHOUSE_NOT_FOUND)
            }

            if (!checkProduct) {
                throw new BadReq(errorCode.PRODUCT_NOT_FOUND)
            }
            await GoodsReceiptDetaileModel.findByIdAndUpdate(
                goodsReceiptDetailId,
                {
                    goodsReceiptId,
                    productId,
                    warehouseId,
                    productCode: checkProduct?.code,
                    productName: checkProduct?.name,
                    managementType: checkProduct?.managementType,
                    unit: checkProduct?.unit,
                    origin,
                    orderedQuantity,
                    price,
                    totalAmount,
                    warehouseName: checkWarehouse.warehouseName,
                    note,
                },
            )
            return null
        } catch (error) {
            throw error
        }
    },
    deleteProduct: async (goodsReceiptDetailId) => {
        try {
            const checkGoodsReceiptDetail =
                await GoodsReceiptDetaileModel.findById(goodsReceiptDetailId)
            if (!checkGoodsReceiptDetail) {
                throw new BadReq(errorCode.GOODS_RECEIPT_DETAIL_NOT_FOUND)
            }
            await GoodsReceiptDetaileModel.findByIdAndDelete(
                goodsReceiptDetailId,
            )
            return null
        } catch (error) {
            throw error
        }
    },
    confirmQuantity: async (goodsReceiptDetailId, input, currentUserId) => {
        const session = await mongoose.startSession()
        try {
            session.startTransaction()
            const { actualQuantity, warehouseId, productId, storages } = input
            const [checkGoodsReceiptDetail, checkWarehouse, checkProduct] =
                await Promise.all([
                    GoodsReceiptDetaileModel.findById(goodsReceiptDetailId),
                    WarehouseModel.findById(warehouseId),
                    ProductModel.findById(productId),
                ])
            if (!checkGoodsReceiptDetail) {
                throw new BadReq(errorCode.GOODS_RECEIPT_DETAIL_NOT_FOUND)
            }
            if (!checkWarehouse) {
                throw new BadReq(errorCode.WAREHOUSE_NOT_FOUND)
            }
            if (!checkProduct) {
                throw new BadReq(errorCode.PRODUCT_NOT_FOUND)
            }

            // kiểm tra số lượng thực tế không được lớn hơn số lượng đặt hàng
            if (actualQuantity > checkGoodsReceiptDetail.orderedQuantity) {
                throw new BadReq(errorCode.ACTUAL_QUANTITY_INVALID)
            }

            // managementType là none
            if (
                checkProduct.managementType ===
                constant.PRODUCT_MANAGEMENT_TYPE.NONE
            ) {
                if (storages && storages.length > 0) {
                    throw new BadReq(errorCode.SERIAL_NOT_ALLOWED_FOR_PRODUCT)
                }
                await GoodsReceiptDetaileModel.findByIdAndUpdate(
                    goodsReceiptDetailId,
                    {
                        actualQuantity,
                        storages: [], // type none thì luôn luôn empty
                    },
                    { session },
                )
            } else {
                //code block khi managementType khác none
                if (!storages || storages.length === 0) {
                    throw new BadReq(errorCode.SERIAL_OR_BATCH_REQUIRED)
                }
                const duplicatesKey = findDuplicateTrackingCode(storages)
                if (duplicatesKey.length > 0) {
                    throw new BadReq(errorCode.SERIAL_OR_BATCH_DUPLICATED)
                }

                let checkTotalProductStorage = 0
                // Kiểm tra các số serial/số lô có tồn tại chưa
                for (let storage of storages) {
                    const checkStorage = await ProductStorageModel.findOne({
                        warehouseId,
                        productId,
                        trackingCode: storage.trackingCode,
                    })
                    if (checkStorage) {
                        throw new BadReq(
                            errorCode.GOODS_RECEIPT_SERIAL_OR_BATCH_EXISTED,
                        )
                    }
                    // serial thì quantity phải là 1
                    if (
                        checkProduct.managementType ===
                            constant.PRODUCT_MANAGEMENT_TYPE.SERIAL &&
                        storage.quantity !== 1
                    ) {
                        const error = {
                            ...errorCode.SERIAL_QUANTITY_MUST_BE_ONE,
                        }
                        error.message = `${error.message} Lỗi tại serial: ${storage.trackingCode}`
                        throw new BadReq(error)
                    }
                    checkTotalProductStorage += storage.quantity
                }
                // Kiểm tra tổng số lượng của các số serial/ số lô có khớp với số lượng thực tế nhập hay không
                if (checkTotalProductStorage != actualQuantity) {
                    throw new BadReq(errorCode.SERIAL_OR_BATCH_QUANTITY_INVALID)
                }

                await GoodsReceiptDetaileModel.findByIdAndUpdate(
                    goodsReceiptDetailId,
                    {
                        actualQuantity,
                        storages,
                    },
                    { session },
                )
            }

            await GoodsReceiptModel.findByIdAndUpdate(
                checkGoodsReceiptDetail.goodsReceiptId,
                { updatedBy: currentUserId },
                { session },
            )
            await session.commitTransaction()
            return null
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    },
    approval: async (input, currentUserId) => {
        const session = await mongoose.startSession()
        try {
            session.startTransaction()
            const { goodsReceiptApprovalId, status, content } = input
            const checkGoodsReceiptApproval =
                await GoodsReceiptApprovalModel.findById(goodsReceiptApprovalId)
            if (!checkGoodsReceiptApproval) {
                throw new BadReq(errorCode.GOODS_RECEIPT_APPROVAL_NOT_FOUND)
            }
            if (!checkGoodsReceiptApproval.nextApprovalRoleId) {
                throw new BadReq(errorCode.GOODS_RECEIPT_APPROVAL_APPROVED)
            }
            if (status == constant.APPROVAL_STATUS.APPROVED) {
                const checkGoodsReceipt = await GoodsReceiptModel.findById(
                    checkGoodsReceiptApproval.goodsReceiptId,
                )
                const checkGoodsReceiptDetails =
                    await GoodsReceiptDetaileModel.find({
                        goodsReceiptId: checkGoodsReceipt._id,
                    })
                for (let checkGoodsReceiptDetail of checkGoodsReceiptDetails) {
                    if (checkGoodsReceiptDetail.storages.length <= 0) {
                        throw new BadReq(errorCode.APPROVAL_QUANTITY_NOT_YET)
                    }
                }
                const checkUser = await UserModel.findById(currentUserId)
                if (
                    !checkUser.roleIds.includes(
                        checkGoodsReceiptApproval.nextApprovalRoleId,
                    )
                ) {
                    throw new BadReq(errorCode.NOT_PERMISSION_APPROVAL)
                }

                // Cập nhật lại số lượng sản phẩm sau khi đã chấp nhận phiếu nhập kho
                for (let goodsReceiptDetail of checkGoodsReceiptDetails) {
                    const productInsertDatas = goodsReceiptDetail.storages.map(
                        (storage) => ({
                            warehouseId: goodsReceiptDetail.warehouseId,
                            productId: goodsReceiptDetail.productId,
                            trackingCode: storage.trackingCode,
                            quantity: storage.quantity,
                        }),
                    )
                    await ProductStorageModel.insertMany(productInsertDatas, {
                        session,
                    })
                }
            }
            if (
                status == constant.APPROVAL_STATUS.APPROVED ||
                status == constant.APPROVAL_STATUS.REJECTED ||
                status == constant.APPROVAL_STATUS.CANCEL
            ) {
                const user = await UserModel.findById(currentUserId)
                await GoodsReceiptApprovalModel.findByIdAndUpdate(
                    goodsReceiptApprovalId,
                    {
                        warehouseStaffApproval: {
                            approvedBy: user.fullname,
                            status,
                            content,
                        },
                        nextApprovalRoleId: null,
                    },
                    { session },
                )

                await GoodsReceiptModel.findByIdAndUpdate(
                    checkGoodsReceiptApproval.goodsReceiptId,
                    {
                        status,
                    },
                    { session },
                )
            }
            await session.commitTransaction()
            return null
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    },
    exportReport: async (filters) => {
        try {
            const { startDate, endDate, warehouseIds, statuses } = filters
            // console.log(statuses)

            // Step 1: Fetch and Prepare Data
            const matchConditions = { 'goodsReceipt.isTemporary': false }
            if (statuses && statuses.length > 0) {
                matchConditions['goodsReceipt.status'] = { $in: statuses }
            }
            if (warehouseIds && warehouseIds.length > 0) {
                matchConditions.warehouseId = {
                    $in: warehouseIds.map(
                        (id) => new Types.ObjectId(String(id)),
                    ),
                }
            }
            if (startDate || endDate) {
                matchConditions['goodsReceipt.createdAt'] = {}
                if (startDate) {
                    matchConditions['goodsReceipt.createdAt'].$gte = new Date(
                        startDate,
                    )
                }
                if (endDate) {
                    const end = new Date(endDate)
                    end.setHours(23, 59, 59, 999)
                    matchConditions['goodsReceipt.createdAt'].$lte = end
                }
            }
            const results = await GoodsReceiptDetaileModel.aggregate([
                {
                    $lookup: {
                        from: 'goodsreceipts',
                        localField: 'goodsReceiptId',
                        foreignField: '_id',
                        as: 'goodsReceipt',
                    },
                },
                { $unwind: '$goodsReceipt' },
                { $match: matchConditions },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'productInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$productInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'brands',
                        localField: 'productInfo.brand',
                        foreignField: '_id',
                        as: 'brandInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$brandInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $sort: {
                        'goodsReceipt.createdAt': -1,
                        'goodsReceipt.receiptNumber': 1,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        date: '$goodsReceipt.createdAt',
                        receiptNumber: '$goodsReceipt.receiptNumber',
                        status: '$goodsReceipt.status',
                        deliveryAddress: {
                            $ifNull: ['$goodsReceipt.deliveryAddresses', 'N/A'],
                        },
                        supplier: '$goodsReceipt.supplier',
                        productCode: '$productInfo.code',
                        specification: '$productInfo.specification',
                        brandName: '$brandInfo.name',
                        warehouseName: '$warehouseName',
                        totalAmount: '$totalAmount',
                    },
                },
            ])
            const groupedByDate = new Map()
            for (const item of results) {
                const dateKey = new Date(item.date).toLocaleDateString('vi-VN')
                if (!groupedByDate.has(dateKey)) {
                    groupedByDate.set(dateKey, {
                        receipts: new Map(),
                        dailyTotal: 0,
                    })
                }
                const dayData = groupedByDate.get(dateKey)
                const receiptKey = item.receiptNumber
                if (!dayData.receipts.has(receiptKey)) {
                    dayData.receipts.set(receiptKey, {
                        header: item,
                        lineItems: [],
                    })
                }
                const receiptData = dayData.receipts.get(receiptKey)
                receiptData.lineItems.push(item)
                dayData.dailyTotal += item.totalAmount || 0
            }

            // Step 2: Define Report Configuration
            const leftAlignment = {
                vertical: 'middle',
                horizontal: 'left',
                wrapText: true,
            }
            const centerAlignmentForColumn = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true,
            }

            const finalStartDate = startDate
                ? new Date(startDate).toLocaleDateString('vi-VN')
                : results.length > 0
                  ? new Date(
                        results[results.length - 1].date,
                    ).toLocaleDateString('vi-VN')
                  : '...'
            const finalEndDate = endDate
                ? new Date(endDate).toLocaleDateString('vi-VN')
                : results.length > 0
                  ? new Date(results[0].date).toLocaleDateString('vi-VN')
                  : '...'

            const reportConfig = {
                worksheetName: 'Bảng kê chi tiết nhập hàng',
                reportTitle: 'BẢNG KÊ CHI TIẾT NHẬP HÀNG THEO NGÀY',
                dateRange: { startDate: finalStartDate, endDate: finalEndDate },
                headers: [
                    'NGÀY',
                    'SỐ PNK',
                    'TRẠNG THÁI',
                    'ĐỊA CHỈ (XHĐ)',
                    'KHÁCH HÀNG',
                    'MÃ HÀNG',
                    'QUY CÁCH',
                    'NHÃN HIỆU',
                    'KHO',
                    'TỔNG CỘNG',
                ],
                columnKeys: [
                    'date',
                    'receiptNumber',
                    'status',
                    'deliveryAddress',
                    'supplier',
                    'productCode',
                    'specification',
                    'brandName',
                    'warehouseName',
                    'totalAmount',
                ],
                mergeableColumnKeys: [
                    'date',
                    'receiptNumber',
                    'status',
                    'deliveryAddress',
                    'supplier',
                ],
                statusMap: {
                    approved: 'Thành công',
                    warehouseStaffApproval: 'Chờ duyệt',
                    reject: 'Từ chối',
                    cancel: 'Đã hủy',
                },
                summaryRowText: 'TỔNG CỘNG:',
                grandTotalText: 'TỔNG CỘNG:',
                columnConfigs: [
                    {
                        key: 'date',
                        width: 15,
                        style: { alignment: centerAlignmentForColumn },
                    },
                    {
                        key: 'receiptNumber',
                        width: 12,
                        style: { alignment: leftAlignment },
                    },
                    {
                        key: 'status',
                        width: 20,
                        style: { alignment: leftAlignment },
                    },
                    {
                        key: 'deliveryAddress',
                        width: 45,
                        style: { alignment: leftAlignment },
                    },
                    {
                        key: 'supplier',
                        width: 45,
                        style: { alignment: leftAlignment },
                    },
                    {
                        key: 'productCode',
                        width: 18,
                        style: { alignment: leftAlignment },
                    },
                    {
                        key: 'specification',
                        width: 15,
                        style: { alignment: leftAlignment },
                    },
                    {
                        key: 'brandName',
                        width: 15,
                        style: { alignment: leftAlignment },
                    },
                    {
                        key: 'warehouseName',
                        width: 20,
                        style: { alignment: leftAlignment },
                    },
                    {
                        key: 'totalAmount',
                        width: 20,
                        style: {
                            numFmt: '#,##0',
                            alignment: centerAlignmentForColumn,
                        },
                    },
                ],
            }

            // 3. Call the generic helper
            return generateGoodsReport(groupedByDate, reportConfig)
        } catch (error) {
            throw error
        }
    },
    downloadInvoiceFile: async (goodsReceiptId, res) => {
        try {
            const goodsReceipt =
                await GoodsReceiptModel.findById(goodsReceiptId)
            if (!goodsReceipt) {
                throw new BadReq(errorCode.GOODS_RECEIPT_NOT_FOUND)
            }

            const invoiceFile = goodsReceipt.invoiceFile

            await downloadService.downloadFile(invoiceFile, res)
        } catch (error) {
            throw error
        }
    },
}

module.exports = goodsReceiptService
