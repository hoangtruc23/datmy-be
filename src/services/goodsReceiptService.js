const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')
const GoodsReceiptModel = require('../models/goodsReceipt')
const ProductModel = require('../models/product')
const GoodsReceiptDetaileModel = require('../models/goodsReceiptDetail')
const WarehouseModel = require('../models/warehouses')
const { Types } = require('mongoose')
const constant = require('../utils/constant/constant')
const ProductStorageModel = require('../models/productStorage')
const GoodsReceiptApprovalModel = require('../models/goodsReceiptApproval')
const UserModel = require('../models/user')

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
                    $or: [{ supplier: search }],
                    isTemporary: false,
                })
                    .skip((page - 1) * limit)
                    .limit(limit),
                GoodsReceiptModel.countDocuments({
                    status: { $in: statuses },
                    $or: [{ supplier: search }, { invoiceNumber: search }],
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
            if (!goodsReceipt) {
                throw new BadReq(errorCode.GOODS_RECEIPT_NOT_FOUND)
            }
            return goodsReceipt
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
        try {
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
            await GoodsReceiptModel.findByIdAndUpdate(goodsReceiptId, {
                supplierId,
                invoiceFile,
                invoiceOrContractNumber,
                estimatedDeliveryDate,
                supplier,
                deliveryAddresses,
                note,
                isTemporary: false,
                status: constant.GOODS_RECEIPT_STATUS.WAREHOUSE_STAFF_APPROVAL,
                createdBy: currentUserId,
            })

            const user = await UserModel.findById(currentUserId)
            await GoodsReceiptApprovalModel.create({
                goodsReceiptId,
                createdBy: {
                    approvedBy: user.fullname,
                    status: constant.APPROVAL_STATUS.APPROVED,
                    content: 'Tạo',
                },
            })
            return null
        } catch (error) {
            throw error
        }
    },
    update: async (goodsReceiptId, goodsReceipt, currentUserId) => {
        try {
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
            await GoodsReceiptModel.findByIdAndUpdate(goodsReceiptId, {
                supplierId,
                invoiceFile,
                invoiceOrContractNumber,
                estimatedDeliveryDate,
                supplier,
                deliveryAddresses,
                note,
                // isTemporary: false,
                // status: constant.GOODS_RECEIPT_STATUS.WAREHOUSE_STAFF_APPROVAL,
                // createdBy: currentUserId,
                updatedBy: currentUserId,
            })
            return null
        } catch (error) {
            throw error
        }
    },
    cancel: async (goodsReceiptId, currentUserId) => {
        try {
            const checkGoodsReceipt =
                await GoodsReceiptModel.findById(goodsReceiptId)
            if (!checkGoodsReceipt) {
                throw new BadReq(errorCode.GOODS_RECEIPT_NOT_FOUND)
            }
            if (checkGoodsReceipt.createdBy != currentUserId) {
                throw new BadReq(errorCode.DO_NOT_CANCEL_GOODS_RECEIPT)
            }
            await GoodsReceiptModel.findByIdAndUpdate(goodsReceiptId, {
                status: constant.GOODS_RECEIPT_STATUS.CANCEL,
                updatedBy: currentUserId,
            })
            await GoodsReceiptApprovalModel.findOneAndUpdate(
                { goodsReceiptId },
                {
                    createdBy: {
                        status: constant.APPROVAL_STATUS.CANCEL,
                    },
                },
            )
            return null
        } catch (error) {
            throw error
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
            // if(!checkProduct) {
            //     throw new BadReq(errorCode.PRODUCT_NOT_FOUND)
            // }
            await GoodsReceiptDetaileModel.create({
                goodsReceiptId,
                productId,
                warehouseId,
                productCode: checkProduct?.productCode,
                productName: checkProduct?.productName,
                managementType: checkProduct?.managementType,
                unit: checkProduct?.checkProduct,
                origin,
                orderedQuantity,
                price,
                totalAmount,
                warehouseName: checkWarehouse.warehouseName,
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

            if (!checkReceipt) {
                throw new BadReq(errorCode.GOODS_RECEIPT_NOT_FOUND)
            }

            if (!checkWarehouse) {
                throw new BadReq(errorCode.WAREHOUSE_NOT_FOUND)
            }
            // Do chưa có api product nên chưa check được
            // if(!checkProduct) {
            //     throw new BadReq(errorCode.PRODUCT_NOT_FOUND)
            // }
            await GoodsReceiptDetaileModel.findByIdAndUpdate(
                goodsReceiptDetailId,
                {
                    goodsReceiptId,
                    productId,
                    warehouseId,
                    productCode: checkProduct?.productCode,
                    productName: checkProduct?.productName,
                    managementType: checkProduct?.managementType,
                    unit: checkProduct?.checkProduct,
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
        try {
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
            // if (!checkProduct) {
            //     throw new BadReq(errorCode.PRODUCT_NOT_FOUND)
            // }

            // kiểm tra số lượng thực tế không được lớn hơn số lượng đặt hàng
            if (actualQuantity > checkGoodsReceiptDetail.orderedQuantity) {
                throw new BadReq(errorCode.ACTUAL_QUANTITY_INVALID)
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
            )

            await GoodsReceiptModel.findByIdAndUpdate(
                checkGoodsReceiptDetail.goodsReceiptId,
                { updatedBy: currentUserId },
            )
            return null
        } catch (error) {
            throw error
        }
    },
    approval: async (input, currentUserId) => {
        try {
            const { goodsReceiptApprovalId, status, content } = input
            const checkGoodsReceiptApproval =
                await GoodsReceiptApprovalModel.findById(goodsReceiptApprovalId)
            if (!checkGoodsReceiptApproval) {
                throw new BadReq(errorCode.GOODS_RECEIPT_APPROVAL_NOT_FOUND)
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
                    await ProductStorageModel.insertMany(productInsertDatas)
                }
            }
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
            )
            return null
        } catch (error) {
            throw error
        }
    },
}

module.exports = goodsReceiptService
