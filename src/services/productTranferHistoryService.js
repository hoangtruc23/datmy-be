const productTransferHistoryModel = require('../models/productTranferHistory')
const productTransferHistoryDetailModel = require('../models/productTranferHistoryDetail')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')
const { Types, default: mongoose } = require('mongoose')
const WarehouseModel = require('../models/warehouses')
const ProductStorageModel = require('../models/productStorage')
const { CdpPage } = require('puppeteer')

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
                .lean() // trả về plain object

            // Lấy chi tiết chuyển kho cho từng phiếu
            for (let item of items) {
                const details = await productTransferHistoryDetailModel
                    .find({
                        transferId: item._id,
                    })
                    .populate('productId', 'name code unit') // thông tin sản phẩm
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
        } catch (error) {
            throw error
        }
    },
    transferProduct: async (data) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const { fromWarehouseId, toWarehouseId, note, createdBy, details } =
                data

            const [checkFromWarehouse, checkToWarehouse] = await Promise.all([
                WarehouseModel.findById(fromWarehouseId),
                WarehouseModel.findById(toWarehouseId),
            ])

            if (!checkFromWarehouse && !checkToWarehouse) {
                throw new BadReq(errorCode.WAREHOUSE_NOT_FOUND)
            }

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
            for (const item of details) {
                const { productId, quantity, oldStorages, newStorages } = item
                const product = await ProductStorageModel.findOne({
                    productId,
                })
                if (!product) throw new BadReq(errorCode.PRODUCT_NOT_FOUND)

                // Check tồn kho
                const productStorages = await ProductStorageModel.find({
                    warehouseId: fromWarehouseId,
                    productId,
                })
                const totalProduct = productStorages.reduce(
                    (acc, cur) => acc + cur.quantity,
                    0,
                )
                if (quantity > totalProduct) {
                    throw new BadReq(errorCode.ISSUED_TRANSFER_QUANTITY_INVALID)
                }

                let batchQuantityTotal = 0
                for (let oldStorage of item.oldStorages) {
                    const ps = await ProductStorageModel.findOne({
                        warehouseId: fromWarehouseId,
                        productId: productId,
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

                    batchQuantityTotal += oldStorage.quantity
                }
                if (batchQuantityTotal != quantity) {
                    throw new BadReq(
                        errorCode.SERIAL_OR_BATCH_TRANSFER_QUANTITY_TOTAL_INVALID,
                    )
                }
                for (const oldStorage of oldStorages) {
                    await ProductStorageModel.findOneAndUpdate(
                        {
                            warehouseId: fromWarehouseId,
                            productId,
                            trackingCode: oldStorage.trackingCode,
                        },
                        { $inc: { quantity: -oldStorage.quantity } },
                        { session },
                    )
                }
                const totalNewQuantity = newStorages.reduce(
                    (acc, cur) => acc + cur.quantity,
                    0,
                )
                if (totalNewQuantity !== quantity) {
                    throw new BadReq(
                        errorCode.SERIAL_OR_BATCH_TRANSFER_QUANTITY_TOTAL_INVALID,
                    )
                }

                for (const newStorage of newStorages) {
                    const exists = await ProductStorageModel.findOne({
                        warehouseId: toWarehouseId,
                        trackingCode: newStorage.trackingCode,
                    }).session(session)

                    if (exists) {
                        throw new BadReq(errorCode.TRACKING_CODE_EXISTS)
                    }
                    await ProductStorageModel.create(
                        [
                            {
                                warehouseId: toWarehouseId,
                                productId,
                                trackingCode: newStorage.trackingCode,
                                quantity: newStorage.quantity,
                            },
                        ],
                        { session },
                    )
                }
                await productTransferHistoryDetailModel.create(
                    [
                        {
                            transferId,
                            productId,
                            quantity,
                            oldStorages,
                            newStorages,
                        },
                    ],
                    { session },
                )
            }
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
