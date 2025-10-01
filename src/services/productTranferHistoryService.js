const productTransferHistoryModel = require('../models/productTranferHistory')
const productTransferHistoryDetailModel = require('../models/productTranferHistoryDetail')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')
const { Types, default: mongoose } = require('mongoose')
const WarehouseModel = require('../models/warehouses')
const ProductStorageModel = require('../models/productStorage')
const { CdpPage } = require('puppeteer')
const constant = require('../utils/constant/constant')

const productTransferHistoryService = {
    getAll: async (query) => {
        try {
            let { search = '', page = 1, limit = 10 } = query
            page = parseInt(page)
            limit = parseInt(limit)

            const filter = {}
            if (search) {
                filter.note = { $regex: search, $options: 'i' }
            }

            const totalItem =
                await productTransferHistoryModel.countDocuments(filter)

            const items = await productTransferHistoryModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('fromWarehouseId', 'name')
                .populate('toWarehouseId', 'name')
                .lean()

            // Lấy chi tiết chuyển kho cho từng phiếu
            for (let item of items) {
                const details = await productTransferHistoryDetailModel
                    .find({ transferId: item._id })
                    .populate('oldStorages.productId', 'name code unit')
                    .populate('newStorages.productId', 'name code unit')
                    .lean()

                item.details = details
            }

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

    create: async (data) => {
        try {
            const history = await productTransferHistoryModel.create(data)
            return history
        } catch (error) {
            throw error
        }
    },
    getById: async (id) => {
        try {
            const data = await productTransferHistoryModel
                .findById(id)
                .populate('fromWarehouseId', 'name')
                .populate('toWarehouseId', 'name')
                .lean()
            if (!data) {
                throw new BadReq(errorCode.TRANSFER_HISTORY_NOT_FOUND)
            }
            const details = await productTransferHistoryDetailModel
                .find({ transferId: id })
                .populate('oldStorages.productId')
                .populate('newStorages.productId')
            return { ...data, details }
        } catch (error) {
            throw error
        }
    },
    transferProduct: async (data) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const { fromWarehouseId, toWarehouseId, note, details } = data

            const [checkFromWarehouse, checkToWarehouse] = await Promise.all([
                WarehouseModel.findById(fromWarehouseId),
                WarehouseModel.findById(toWarehouseId),
            ])
            if (!checkFromWarehouse || !checkToWarehouse) {
                throw new BadReq(errorCode.WAREHOUSE_NOT_FOUND)
            }
            // Tạo lịch sử transfer
            const transfer = await productTransferHistoryModel.create(
                [
                    {
                        fromWarehouseId,
                        toWarehouseId,
                        note,
                        createdAt: new Date(),
                    },
                ],
                { session },
            )
            const transferId = transfer[0]._id

            // Xử lý từng sản phẩm trong chi tiết
            for (const item of details) {
                const { oldStorages, newStorages } = item
                for (const oldStorage of oldStorages) {
                    const checkProduct = await ProductModel.findById(
                        oldStorage.productId,
                    ).session(session)
                    if (!checkProduct) {
                        throw new BadReq(errorCode.PRODUCT_NOT_FOUND)
                    }
                    const ps = await ProductStorageModel.findOne({
                        warehouseId: fromWarehouseId,
                        productId: oldStorage.productId,
                        trackingCode: oldStorage.trackingCode,
                    }).session(session)

                    if (!ps)
                        throw new BadReq(errorCode.PRODUCT_STORAGE_NOT_FOUND)

                    if (oldStorage.quantity <= 0) {
                        throw new BadReq(
                            errorCode.NON_POSITIVE_QUANTITY_NOT_ALLOWED,
                        )
                    }
                    if (oldStorage.quantity > ps.quantity) {
                        throw new BadReq(
                            errorCode.ISSUED_TRANSFER_QUANTITY_INVALID,
                        )
                    }
                    // Giảm số lượng
                    ps.quantity -= oldStorage.quantity
                    await ps.save({ session })
                    if (ps.quantity === 0) {
                        await ProductStorageModel.deleteOne({
                            _id: ps._id,
                        }).session(session)
                    }
                }
                for (const newStorage of newStorages) {
                    if (newStorage.quantity <= 0) {
                        throw new BadReq(
                            errorCode.NON_POSITIVE_QUANTITY_NOT_ALLOWED,
                        )
                    }
                    const checkProduct = await ProductModel.findById(
                        newStorage.productId,
                    ).session(session)
                    if (!checkProduct) {
                        throw new BadReq(errorCode.PRODUCT_NOT_FOUND)
                    }
                    const exists = await ProductStorageModel.findOne({
                        warehouseId: toWarehouseId,
                        productId: newStorage.productId,
                        trackingCode: newStorage.trackingCode,
                    }).session(session)
                    if (exists) {
                        if (
                            checkProduct.managementType ===
                            constant.PRODUCT_MANAGEMENT_TYPE.SERIAL
                        ) {
                            throw new BadReq(
                                errorCode.SERIAL_PRODUCT_MUST_CREATE_NEW_TRACKINGCODE,
                            )
                        }
                        // Nếu lô đã tồn tại thì cộng dồn
                        exists.quantity += newStorage.quantity
                        await exists.save({ session })
                    } else {
                        // Nếu lô chưa tồn tại thì tạo mới
                        await ProductStorageModel.create(
                            [
                                {
                                    warehouseId: toWarehouseId,
                                    productId: newStorage.productId,
                                    trackingCode: newStorage.trackingCode,
                                    quantity: newStorage.quantity,
                                },
                            ],
                            { session },
                        )
                    }
                }
                await productTransferHistoryDetailModel.create(
                    [
                        {
                            transferId,
                            oldStorages,
                            newStorages,
                        },
                    ],
                    { session },
                )
            }
            // Commit transaction
            await session.commitTransaction()
            session.endSession()
            return { success: true }
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            throw error
        }
    },
}
module.exports = productTransferHistoryService
