const mongoose = require('mongoose')
const { Types } = mongoose
const OrderModel = require('../models/order')
const ProductModel = require('../models/product')
const OrderDetailModel = require('../models/orderDetail')

const constant = require('../utils/constant/constant')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')
const CustomerModel = require('../models/customer')

const orderService = {
    create: async (reqData) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const { customerId, items, createdAt = new Date() } = reqData

            const checkCustomer = await CustomerModel.findById(customerId)
            if (!checkCustomer) throw new BadReq(errorCode.USER_NOT_FOUND)
            if (!items || !Array.isArray(items) || items.length === 0) {
                throw new BadReq(errorCode.ORDER_ITEMS_REQUIRED)
            }

            for (const item of items) {
                if (!item.productId) {
                    throw new BadReq(errorCode.PRODUCT_ID_REQUIRED)
                }
                const checkProduct = await ProductModel.findById(item.productId)
                if (!checkProduct) {
                    throw new BadReq(errorCode.PRODUCT_NOT_FOUND)
                }
                if (!item.quantity || item.quantity <= 0) {
                    throw new BadReq(errorCode.INVALID_QUANTITY)
                }
            }

            const order = new OrderModel({
                customerId,
                createdAt,
            })
            await order.save({ session })
            const orderDetails = items.map((item) => ({
                orderId: order._id,
                productId: item.productId,
                quantity: item.quantity,
            }))

            await OrderDetailModel.insertMany(orderDetails, { session })

            await session.commitTransaction()

            return null
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    },

    getAll: async (query) => {
        try {
            let { customerId, search = '', page = 1, limit = 10 } = query
            page = Number(page)
            limit = Number(limit)
            let matchConditions = {}
            if (customerId) {
                const checkUser = await CustomerModel.findById(customerId)
                if (!checkUser) throw new BadReq(errorCode.USER_NOT_FOUND)
                matchConditions.customerId = new Types.ObjectId(customerId)
            }

            const [orders, totalItems] = await Promise.all([
                OrderModel.find(matchConditions)
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('customerId', 'name officialName code')
                    .sort({ createdAt: -1 }),
                OrderModel.countDocuments(matchConditions),
            ])

            const orderIds = orders.map((o) => o._id)
            const details = await OrderDetailModel.find({
                orderId: { $in: orderIds },
            }).populate('productId', 'name code')

            const ordersWithItems = orders.map((order) => {
                const items = details.filter(
                    (d) => d.orderId.toString() === order._id.toString(),
                )
                return {
                    ...order.toObject(),
                    items,
                }
            })

            return {
                orders: ordersWithItems,
                page,
                totalItems,
                totalPage: Math.ceil(totalItems / limit),
            }
        } catch (error) {
            throw error
        }
    },
    getByIdForIssue: async (orderIds) => {
        try {
            const orders = await OrderModel.find({
                _id: { $in: orderIds },
            }).populate({
                path: 'customerId',
                populate: {
                    path: 'productsInUse',
                    select: 'name code',
                },
            })
            console.log('orders', orders)
            if (orders.length === 0) {
                throw new BadReq(errorCode.ORDER_NOT_FOUND)
            }
            const firstCustomerId = orders[0].customerId?._id?.toString()
            const hasDifferentCustomer = orders.some(
                (order) =>
                    order.customerId?._id?.toString() !== firstCustomerId,
            )

            if (hasDifferentCustomer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_MATCH)
            }

            const allDetails = await OrderDetailModel.find({
                orderId: { $in: orderIds },
            }).populate('productId', 'name code shortName')

            const remainingDetails = allDetails
                .filter(
                    (detail) =>
                        (detail.quantity || 0) > (detail.quantityExported || 0),
                )
                .map((detail) => ({
                    ...detail.toObject(),
                    remainingQuantity:
                        (detail.quantity || 0) - (detail.quantityExported || 0),
                }))

            return {
                customer: orders[0].customerId,
                items: remainingDetails,
            }
        } catch (error) {
            throw error
        }
    },
    getById: async (orderId) => {
        try {
            const order = await OrderModel.findById(orderId).populate({
                path: 'customerId',
                populate: {
                    path: 'productsInUse',
                    select: 'name',
                },
            })

            if (!order) {
                throw new BadReq(errorCode.ORDER_NOT_FOUND)
            }
            const orderDetails = await OrderDetailModel.find({ orderId })
                .populate('productId', 'name code shortName')
                .lean()

            return {
                customer: order.customerId,
                createAt: order.createdAt,
                items: orderDetails.map((detail) => ({
                    productId: detail.productId?._id,
                    productCode: detail.productId?.code,
                    productName: detail.productId?.name,
                    shortName: detail.productId?.shortName,
                    quantity: detail.quantity,
                    quantityExported: detail.quantityExported || 0,
                })),
            }
        } catch (error) {
            throw error
        }
    },

    update: async (orderId, reqData) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const { customerId, items } = reqData

            const order = await OrderModel.findById(orderId).session(session)
            if (!order) throw new BadReq(errorCode.ORDER_NOT_FOUND)

            if (customerId) {
                const customerExists =
                    await CustomerModel.findById(customerId).session(session)
                if (!customerExists)
                    throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
                order.customerId = customerId
            }

            if (items && Array.isArray(items)) {
                const productIds = items.map((i) => i.productId)
                // Kiểm tra sản phẩm hợp lệ
                const validProducts = await ProductModel.find({
                    _id: { $in: productIds },
                }).session(session)
                const validIds = validProducts.map((p) => p._id.toString())

                const invalidProducts = productIds.filter(
                    (id) => !validIds.includes(id.toString()),
                )
                if (invalidProducts.length > 0) {
                    throw new BadReq(errorCode.PRODUCT_NOT_FOUND)
                }
                const existingDetails = await OrderDetailModel.find({
                    orderId,
                }).session(session)

                const existingMap = new Map(
                    existingDetails.map((d) => [d.productId.toString(), d]),
                )
                for (const item of items) {
                    const existing = existingMap.get(item.productId.toString())

                    if (existing) {
                        if (
                            existing.quantityExported > 0 &&
                            item.quantity < existing.quantityExported
                        ) {
                            throw new BadReq(
                                errorCode.QUANTITY_LESS_THAN_EXPORTED,
                            )
                        }

                        await OrderDetailModel.updateOne(
                            { _id: existing._id },
                            { $set: { quantity: item.quantity } },
                            { session },
                        )
                    } else {
                        await OrderDetailModel.create(
                            [
                                {
                                    orderId,
                                    productId: item.productId,
                                    quantity: item.quantity,
                                },
                            ],
                            { session },
                        )
                    }
                }
                const productIdsToKeep = items.map((i) => i.productId)
                await OrderDetailModel.deleteMany(
                    {
                        orderId,
                        productId: { $nin: productIdsToKeep },
                        quantityExported: 0,
                    },
                    { session },
                )
            }

            await order.save({ session })

            await session.commitTransaction()

            return null
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    },

    delete: async (orderId) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            await OrderDetailModel.deleteMany({ orderId }, { session })

            const order = await OrderModel.findByIdAndDelete(orderId, {
                session,
            })
            if (!order) {
                throw new Error('Order not found')
            }
            await session.commitTransaction()
            return { message: 'Order deleted successfully' }
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    },
}
module.exports = orderService
