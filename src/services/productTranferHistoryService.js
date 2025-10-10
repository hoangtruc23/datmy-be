const productTransferHistoryModel = require('../models/productTranferHistory')
const productTransferHistoryDetailModel = require('../models/productTranferHistoryDetail')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')
const { Types, default: mongoose } = require('mongoose')
const WarehouseModel = require('../models/warehouses')
const ProductModel = require('../models/product')
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
                    .populate('oldProductId', 'name code ')
                    .populate('newProductId', 'name code ')
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
            // Lấy thông tin phiếu chuyển
            const data = await productTransferHistoryModel
                .findById(id)
                .populate('fromWarehouseId', 'name')
                .populate('toWarehouseId', 'name')
                .lean()

            if (!data) {
                throw new BadReq(errorCode.TRANSFER_HISTORY_NOT_FOUND)
            }

            // Lấy chi tiết chuyển kho
            const details = await productTransferHistoryDetailModel
                .find({ transferId: id })
                .populate('oldProductId', 'name code ')
                .populate('newProductId', 'name code ')
                .lean()

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
            if (!checkFromWarehouse || !checkToWarehouse)
                throw new BadReq(errorCode.WAREHOUSE_NOT_FOUND)

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
            for (const detail of details) {
                const { oldProductId, oldStorages, newProductId, newStorages } =
                    detail
                const [checkOldProduct, checkNewProduct] = await Promise.all([
                    ProductModel.findById(oldProductId).session(session),
                    ProductModel.findById(newProductId).session(session),
                ])

                if (!checkOldProduct || !checkNewProduct)
                    throw new BadReq(errorCode.PRODUCT_NOT_FOUND)

                for (const oldStorage of oldStorages) {
                    const ps = await ProductStorageModel.findOne({
                        warehouseId: fromWarehouseId,
                        productId: oldProductId,
                        trackingCode: oldStorage.trackingCode,
                    }).session(session)

                    if (!ps)
                        throw new BadReq(errorCode.PRODUCT_STORAGE_NOT_FOUND)
                    if (oldStorage.quantity <= 0)
                        throw new BadReq(
                            errorCode.NON_POSITIVE_QUANTITY_NOT_ALLOWED,
                        )
                    if (oldStorage.quantity > ps.quantity)
                        throw new BadReq(
                            errorCode.ISSUED_TRANSFER_QUANTITY_INVALID,
                        )
                    ps.quantity -= oldStorage.quantity
                    await ps.save({ session })
                    if (ps.quantity === 0) {
                        await ProductStorageModel.deleteOne({
                            _id: ps._id,
                        }).session(session)
                    }
                }

                for (const newStorage of newStorages) {
                    if (newStorage.quantity <= 0)
                        throw new BadReq(
                            errorCode.NON_POSITIVE_QUANTITY_NOT_ALLOWED,
                        )

                    const exists = await ProductStorageModel.findOne({
                        warehouseId: toWarehouseId,
                        productId: newProductId,
                        trackingCode: newStorage.trackingCode,
                    }).session(session)

                    if (exists) {
                        if (
                            checkNewProduct.managementType ===
                            constant.PRODUCT_MANAGEMENT_TYPE.SERIAL
                        ) {
                            throw new BadReq(
                                errorCode.SERIAL_PRODUCT_MUST_CREATE_NEW_TRACKINGCODE,
                            )
                        }

                        exists.quantity += newStorage.quantity
                        await exists.save({ session })
                    } else {
                        await ProductStorageModel.create(
                            [
                                {
                                    warehouseId: toWarehouseId,
                                    productId: newProductId,
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
                            transferId: transfer[0]._id,
                            oldProductId,
                            oldStorages,
                            newProductId,
                            newStorages,
                        },
                    ],
                    { session },
                )
            }

            await session.commitTransaction()
            session.endSession()

            return null
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            throw error
        }
    },
}
module.exports = productTransferHistoryService
