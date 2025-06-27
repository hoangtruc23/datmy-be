const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')
const GoodsAdvanceModel = require('../models/goodsAdvance')
const ProductModel = require('../models/product')
const GoodsAdvanceDetaileModel = require('../models/goodsAdvanceDetail')
const WarehouseModel = require('../models/warehouses')
const { Types, default: mongoose } = require('mongoose')
const constant = require('../utils/constant/constant')
const ProductStorageModel = require('../models/productStorage')
const GoodsAdvanceProcessModel = require('../models/goodsAdvanceProcess')
const UserModel = require('../models/user')
const CustomerModel = require('../models/customer')
const { findDuplicateTrackingCode } = require('../utils/helper/helper')

const goodsAdvanceService = {
    getAll: async (query) => {
        try {
            let {
                search,
                page = 1,
                limit = 10,
                statuses = Object.values(constant.GOODS_ADVANCE_STATUS),
            } = query
            page = Number(page)
            limit = Number(limit)
            search = new RegExp(search, 'i')
            const [items, totalItem] = await Promise.all([
                GoodsAdvanceModel.find({
                    status: { $in: statuses },
                    $or: [{ customer: search }],
                    isTemporary: false,
                })
                    .skip((page - 1) * limit)
                    .limit(limit),
                GoodsAdvanceModel.countDocuments({
                    status: { $in: statuses },
                    $or: [{ customer: search }],
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
    getById: async (goodsIssueId) => {
        try {
            const goodsAdvance = await GoodsAdvanceModel.aggregate([
                {
                    $match: {
                        _id: new Types.ObjectId(String(goodsAdvanceId)),
                    },
                },
                {
                    $lookup: {
                        from: 'goodsadvancedetails',
                        as: 'products',
                        localField: '_id',
                        foreignField: 'goodsAdvanceId',
                    },
                },
                {
                    $lookup: {
                        from: 'goodsadvanceapprovals',
                        as: 'approvals',
                        localField: '_id',
                        foreignField: 'goodsAdvanceId',
                    },
                },
            ])
            if (!goodsAdvance[0]) {
                throw new BadReq(errorCode.GOODS_ADVANCE_NOT_FOUND)
            }
            return goodsAdvance[0]
        } catch (error) {
            throw error
        }
    },
    createTemporary: async (currentUserId) => {
        try {
            const goodsIssue = await GoodsAdvanceModel.create({
                createdBy: currentUserId,
            })
            return goodsIssue
        } catch (error) {
            throw error
        }
    },
    create: async (goodsAdvanceId, goodsAdvance, currentUserId) => {
        const session = await mongoose.startSession()
        try {
            session.startTransaction()
            const {
                customerId,
                borrower,
                expectedReturnDate,
                borrowContent,
                customer,
                deliveryAddresses,
            } = goodsAdvance
            const checkGoodsAdvance =
                await GoodsAdvanceModel.findById(goodsAdvanceId)
            if (!checkGoodsAdvance) {
                throw new BadReq(errorCode.GOODS_ADVANCE_NOT_FOUND)
            }
            const checkCustomer = await CustomerModel.findById(customerId)
            if (!checkCustomer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }
            // if (!isDraft && checkGoodsIssue.isDraft) {
            // Nếu phiếu tạo mà không phải nháp thì ta cập nhật lại productStorage (tồn kho)
            const goodsAdvanceDetails =
                await GoodsAdvanceDetaileModel.find(goodsAdvanceId)
            for (let goodsAdvanceDetail of goodsAdvanceDetails) {
                if (goodsAdvanceDetail.borrowStorages.length > 0) {
                    for (let storage of goodsAdvanceDetail.borrowStorages) {
                        await ProductStorageModel.findOneAndUpdate(
                            {
                                warehouseId: goodsAdvanceDetail.warehouseId,
                                productId: goodsAdvanceDetail.productId,
                                trackingCode: storage.trackingCode,
                            },
                            // nhớ check lại khi nó trừ số lượng âm thì có throw lỗi không
                            {
                                $inc: { quantity: -storage.quantity },
                            },
                            { session },
                        )
                    }
                }
            }
            // }
            await GoodsAdvanceModel.findByIdAndUpdate(
                goodsAdvanceId,
                {
                    customerId,
                    borrower,
                    expectedReturnDate,
                    borrowContent,
                    customer,
                    deliveryAddresses,
                    isTemporary: false,
                    status: constant.GOODS_ADVANCE_STATUS
                        .WAREHOUSE_STAFF_APPROVAL,
                    createdBy: currentUserId,
                },
                { session },
            )

            const user = await UserModel.findById(currentUserId)
            await GoodsAdvanceProcessModel.create(
                [
                    {
                        goodsAdvanceId,
                        title: constant.GOODS_ADVANCE_PROCESS_TITLE.CREATE,
                        createdBy: currentUserId,
                        status: true,
                    },
                    {
                        goodsAdvanceId,
                        title: constant.GOODS_ADVANCE_PROCESS_TITLE.APPROVAL,
                        // createdBy: currentUserId,
                        status: false,
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
    update: async (goodsAdvanceId, goodsAdvance, currentUserId) => {
        const session = await mongoose.startSession()
        try {
            session.startTransaction()
            const {
                customerId,
                borrower,
                expectedReturnDate,
                borrowContent,
                customer,
                deliveryAddresses,
            } = goodsAdvance
            const checkGoodsAdvance =
                await GoodsAdvanceModel.findById(goodsAdvanceId)
            if (!checkGoodsAdvance) {
                throw new BadReq(errorCode.GOODS_ADVANCE_NOT_FOUND)
            }
            if (checkGoodsAdvance.status != '') {
                throw new BadReq(errorCode.DO_NOT_UPDATE_GOODS_ADVANCE_CREATED)
            }
            // if (checkGoodsAdvance.status == constant.GOODS_ADVANCE_STATUS.CANCEL) {
            //     throw new BadReq(errorCode.DO_NOT_UPDATE_STATUS_CANCEL)
            // }
            const checkCustomer = await CustomerModel.findById(customerId)
            if (!checkCustomer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }
            // if (!isDraft && checkGoodsAdvance.isDraft) {
            //     // Nếu phiếu tạo mà không phải nháp thì ta cập nhật lại productStorage (tồn kho)
            //     const goodsAdvanceDetails = await GoodsAdvanceDetaileModel.find({
            //         goodsAdvanceId,
            //     })
            //     for (let goodsAdvanceDetail of goodsAdvanceDetails) {
            //         if (goodsAdvanceDetail.storages.length > 0) {
            //             for (let storage of goodsAdvanceDetail.storages) {
            //                 await ProductStorageModel.findOneAndUpdate(
            //                     {
            //                         warehouseId: goodsAdvanceDetail.warehouseId,
            //                         productId: goodsAdvanceDetail.productId,
            //                         trackingCode: storage.trackingCode,
            //                     },
            //                     // nhớ check lại khi nó trừ số lượng âm thì có throw lỗi không
            //                     {
            //                         $inc: { quantity: -storage.quantity },
            //                     },
            //                     { session },
            //                 )
            //             }
            //         }
            //     }
            // }
            await GoodsAdvanceModel.findByIdAndUpdate(
                goodsAdvanceId,
                {
                    customerId,
                    borrower,
                    expectedReturnDate,
                    borrowContent,
                    customer,
                    deliveryAddresses,
                    // isTemporary: false,
                    // status: constant.GOODS_ISSUE_STATUS.WAREHOUSE_STAFF_APPROVAL,
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
    cancel: async (goodsAdvanceId, input, currentUserId) => {
        const session = await mongoose.startSession()
        try {
            session.startTransaction()
            const { note } = input
            const checkGoodsAdvance =
                await GoodsAdvanceModel.findById(goodsAdvanceId)
            if (!checkGoodsAdvance) {
                throw new BadReq(errorCode.GOODS_ADVANCE_NOT_FOUND)
            }
            if (checkGoodsAdvance.createdBy != currentUserId) {
                throw new BadReq(errorCode.DO_NOT_CANCEL_GOODS_ADVANCE)
            }

            // Cập nhật lại số lượng sản phẩm khi bị từ chối hoặc hủy
            const goodsAdvanceDetails = await GoodsAdvanceDetaileModel.find({
                goodsAdvanceId: checkGoodsAdvance.goodsAdvanceId,
            })
            for (let goodsAdvanceDetail of goodsAdvanceDetails) {
                if (goodsAdvanceDetail.storages.length > 0) {
                    for (let storage of goodsAdvanceDetail.storages) {
                        await ProductStorageModel.findOneAndUpdate(
                            {
                                warehouseId: goodsAdvanceDetail.warehouseId,
                                productId: goodsAdvanceDetail.productId,
                                trackingCode: storage.trackingCode,
                            },
                            {
                                $inc: { quantity: storage.quantity },
                            },
                            { session },
                        )
                    }
                }
            }
            await GoodsAdvanceModel.findByIdAndUpdate(
                goodsAdvanceId,
                {
                    status: constant.GOODS_ADVANCE_STATUS.CANCEL,
                    updatedBy: currentUserId,
                },
                { session },
            )
            await GoodsAdvanceProcessModel.create(
                [
                    {
                        goodsAdvanceId,
                        title: constant.GOODS_ADVANCE_PROCESS_TITLE.CANCEL,
                        createdBy: currentUserId,
                        status: true,
                        note,
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
    extend: async (goodsAdvanceId, input, currentUserId) => {
        const session = await mongoose.startSession()
        try {
            session.startTransaction()
            const { extendedReturnDate, note } = input
            const checkGoodsAdvance =
                await GoodsAdvanceModel.findById(goodsAdvanceId)
            if (!checkGoodsAdvance) {
                throw new BadReq(errorCode.GOODS_ADVANCE_NOT_FOUND)
            }
            // if (checkGoodsAdvance.createdBy != currentUserId) {
            //     throw new BadReq(errorCode.DO_NOT_CANCEL_GOODS_ADVANCE)
            // }

            await GoodsAdvanceModel.findByIdAndUpdate(
                goodsAdvanceId,
                {
                    extendedReturnDate,
                    status: constant.GOODS_ADVANCE_STATUS.WAITING_FOR_EXTENSION,
                    updatedBy: currentUserId,
                },
                { session },
            )
            await GoodsAdvanceProcessModel.create(
                [
                    {
                        goodsAdvanceId,
                        title: constant.GOODS_ADVANCE_PROCESS_TITLE.CANCEL,
                        createdBy: currentUserId,
                        status: true,
                        note,
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
    addProduct: async (product) => {
        const session = await mongoose.startSession()
        try {
            const {
                goodsAdvanceId,
                productId,
                warehouseId,
                origin,
                borrowedQuantity,
                borrowStatus,
                usageContent,
                storages,
            } = product

            session.startTransaction()
            const checkGoodsAdvanceDetail =
                await GoodsAdvanceDetaileModel.findOne({
                    goodsAdvanceId,
                    productId,
                    warehouseId,
                })
            if (checkGoodsAdvanceDetail) {
                throw new BadReq(errorCode.GOODS_ADVANCE_DETAIL_EXISTED)
            }
            // Kiểm tra các số serial/ số lô truyền xuống có trùng không
            const duplicatesKey = findDuplicateTrackingCode(storages)
            if (duplicatesKey.length > 0) {
                throw new BadReq(errorCode.SERIAL_OR_BATCH_DUPLICATED)
            }
            const [checkAdvance, checkWarehouse, checkProduct] =
                await Promise.all([
                    GoodsAdvanceModel.findById(goodsAdvanceId),
                    WarehouseModel.findById(warehouseId),
                    ProductModel.findById(productId),
                ])

            if (!checkAdvance) {
                throw new BadReq(errorCode.GOODS_ADVANCE_NOT_FOUND)
            }

            if (!checkWarehouse) {
                throw new BadReq(errorCode.WAREHOUSE_NOT_FOUND)
            }
            if (!checkProduct) {
                throw new BadReq(errorCode.PRODUCT_NOT_FOUND)
            }
            // Check số lượng xuất có lớn hơn số lượng tồn kho không
            const productStorages = await ProductStorageModel.find({
                warehouseId,
                productId,
            })
            const totalProduct = productStorages.reduce(
                (acc, cur) => acc + cur.quantity,
                0,
            )
            if (borrowedQuantity > totalProduct) {
                throw new BadReq(errorCode.ADVANCE_QUANTITY_INVALID)
            }

            let batchQuantityTotal = 0
            // Check số lượng của từng số lô có lớn hơn tồn kho không, nếu hợp lệ thì cập nhật lại số lượng luôn
            for (let storage of storages) {
                const checkProductStorage = await ProductStorageModel.findById(
                    storage.productStorageId,
                )
                if (!checkProductStorage) {
                    throw new BadReq(errorCode.PRODUCT_STORAGE_NOT_FOUND)
                }
                if (storage.quantity > checkProductStorage.quantity) {
                    throw new BadReq(errorCode.SERIAL_OR_BATCH_QUANTITY_INVALID)
                }
                batchQuantityTotal += storage.quantity
            }
            // Check tổng số lượng các lô xuất có khớp với số lượng xuất không
            if (batchQuantityTotal != borrowedQuantity) {
                throw new BadReq(
                    errorCode.SERIAL_OR_BATCH_QUANTITY_TOTAL_INVALID,
                )
            }
            await GoodsAdvanceDetaileModel.create(
                [
                    {
                        goodsAdvanceId,
                        productId,
                        warehouseId,
                        productCode: checkProduct?.code,
                        productName: checkProduct?.name,
                        managementType: checkProduct?.managementType,
                        unit: checkProduct?.checkProduct,
                        origin,
                        borrowedQuantity,
                        borrowStatus,
                        usageContent,
                        borrowWarehouseName: checkWarehouse.warehouseName,
                        borrowStorages: storages,
                        note,
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
    updateProduct: async (goodsAdvanceDetailId, product) => {
        try {
            const {
                goodsAdvanceId,
                productId,
                warehouseId,
                origin,
                borrowedQuantity,
                borrowStatus,
                usageContent,
                storages,
                note,
            } = product
            const checkGoodsAdvanceDetailExist =
                await GoodsAdvanceDetaileModel.findOne({
                    _id: { $ne: goodsAdvanceDetailId },
                    goodsAdvanceId,
                    productId,
                    warehouseId,
                })
            if (checkGoodsAdvanceDetailExist) {
                throw new BadReq(errorCode.GOODS_ADVANCE_DETAIL_EXISTED)
            }
            // Kiểm tra các số serial/ số lô truyền xuống có trùng không
            const duplicatesKey = findDuplicateTrackingCode(storages)
            if (duplicatesKey.length > 0) {
                throw new BadReq(errorCode.SERIAL_OR_BATCH_DUPLICATED)
            }
            const [
                checkGoodsAdvanceDetail,
                checkAdvance,
                checkWarehouse,
                checkProduct,
            ] = await Promise.all([
                GoodsAdvanceDetaileModel.findById(goodsAdvanceDetailId),
                GoodsAdvanceModel.findById(goodsAdvanceId),
                WarehouseModel.findById(warehouseId),
                ProductModel.findById(productId),
            ])

            if (!checkGoodsAdvanceDetail) {
                throw new BadReq(errorCode.GOODS_ADVANCE_DETAIL_NOT_FOUND)
            }

            if (!checkAdvance) {
                throw new BadReq(errorCode.GOODS_ADVANCE_NOT_FOUND)
            }

            if (!checkWarehouse) {
                throw new BadReq(errorCode.WAREHOUSE_NOT_FOUND)
            }
            if (!checkProduct) {
                throw new BadReq(errorCode.PRODUCT_NOT_FOUND)
            }
            // Check số lượng xuất có lớn hơn số lượng tồn kho không
            const productStorages = await ProductStorageModel.find({
                warehouseId,
                productId,
            })
            const totalProduct = productStorages.reduce(
                (acc, cur) => acc + cur.quantity,
                0,
            )
            if (borrowedQuantity > totalProduct) {
                throw new BadReq(errorCode.ADVANCE_QUANTITY_INVALID)
            }

            let batchQuantityTotal = 0
            // Check số lượng của từng số lô có lớn hơn tồn kho không, nếu hợp lệ thì cập nhật lại số lượng luôn
            for (let storage of storages) {
                const checkProductStorage = await ProductStorageModel.findById(
                    storage.productStorageId,
                )
                if (storage.quantity > checkProductStorage.quantity) {
                    throw new BadReq(errorCode.SERIAL_OR_BATCH_QUANTITY_INVALID)
                }
                batchQuantityTotal += storage.quantity
            }
            // Check tổng số lượng các lô xuất có khớp với số lượng xuất không
            if (batchQuantityTotal != borrowedQuantity) {
                throw new BadReq(
                    errorCode.SERIAL_OR_BATCH_QUANTITY_TOTAL_INVALID,
                )
            }

            await GoodsAdvanceDetaileModel.findByIdAndUpdate(
                goodsAdvanceDetailId,
                {
                    goodsAdvanceId,
                    productId,
                    warehouseId,
                    productCode: checkProduct?.productCode,
                    productName: checkProduct?.productName,
                    managementType: checkProduct?.managementType,
                    unit: checkProduct?.checkProduct,
                    origin,
                    borrowedQuantity,
                    borrowStatus,
                    usageContent,
                    borrowWarehouseName: checkWarehouse.warehouseName,
                    borrowStorages: storages,
                    note,
                },
            )
            return null
        } catch (error) {
            throw error
        }
    },
    deleteProduct: async (goodsAdvanceDetailId) => {
        try {
            const checkGoodsAdvanceDetail =
                await GoodsAdvanceDetaileModel.findById(goodsAdvanceDetailId)
            if (!checkGoodsAdvanceDetail) {
                throw new BadReq(errorCode.GOODS_ADVANCE_DETAIL_NOT_FOUND)
            }
            await GoodsAdvanceDetaileModel.findByIdAndDelete(
                goodsAdvanceDetailId,
            )
            return null
        } catch (error) {
            throw error
        }
    },
    approval: async (input, currentUserId) => {
        const session = await mongoose.startSession()
        try {
            session.startTransaction()
            const { goodsAdvanceProcesId, status, note } = input
            const checkGoodsAdvanceProcess =
                await GoodsAdvanceProcessModel.findById(goodsAdvanceProcesId)
            if (!checkGoodsAdvanceProcess) {
                throw new BadReq(errorCode.GOODS_ADVANCE_APPROVAL_NOT_FOUND)
            }
            // if (!checkGoodsAdvanceProcess.nextApprovalRoleId) {
            //     throw new BadReq(errorCode.GOODS_ADVANCE_APPROVAL_APPROVED)
            // }
            const checkGoodsAdvance = await GoodsAdvanceModel.findById(
                checkGoodsAdvanceProcess.goodsAdvanceId,
            )
            if (status) {
                const checkGoodsAdvanceDetails =
                    await GoodsAdvanceDetaileModel.find({
                        goodsAdvanceId: checkGoodsAdvance._id,
                    })
                for (let checkGoodsAdvanceDetail of checkGoodsAdvanceDetails) {
                    if (checkGoodsAdvanceDetail.storages.length <= 0) {
                        throw new BadReq(errorCode.APPROVAL_QUANTITY_NOT_YET)
                    }
                }
                const checkUser = await UserModel.findById(currentUserId)
                if (
                    !checkUser.roleIds.includes(constant.ROLES.warehouseStaff)
                ) {
                    throw new BadReq(errorCode.NOT_PERMISSION_APPROVAL)
                }
                await GoodsAdvanceProcessModel.create(
                    [
                        {
                            goodsAdvanceId: checkGoodsAdvance._id,
                            title: constant.GOODS_ADVANCE_PROCESS_TITLE
                                .APPROVAL,
                            createdBy: currentUserId,
                            status: true,
                            note,
                        },
                    ],
                    { session },
                )
                await GoodsAdvanceModel.findByIdAndUpdate(
                    checkGoodsAdvance._id,
                    {
                        status: constant.GOODS_ADVANCE_STATUS.APPROVED,
                        updatedBy: currentUserId,
                    },
                    { session },
                )
            }

            if (!status) {
                // Cập nhật lại số lượng sản phẩm khi bị từ chối hoặc hủy
                const goodsAdvanceDetails = await GoodsAdvanceDetaileModel.find(
                    checkGoodsAdvance.goodsAdvanceId,
                )
                for (let goodsAdvanceDetail of goodsAdvanceDetails) {
                    if (goodsAdvanceDetail.storages.length > 0) {
                        for (let storage of goodsAdvanceDetail.storages) {
                            await ProductStorageModel.findOneAndUpdate(
                                {
                                    warehouseId: goodsAdvanceDetail.warehouseId,
                                    productId: goodsAdvanceDetail.productId,
                                    trackingCode: storage.trackingCode,
                                },
                                {
                                    $inc: { quantity: storage.quantity },
                                },
                                { session },
                            )
                        }
                    }
                }
                await GoodsAdvanceProcessModel.create(
                    [
                        {
                            goodsAdvanceId: checkGoodsAdvance._id,
                            title: constant.GOODS_ADVANCE_PROCESS_TITLE
                                .APPROVAL,
                            createdBy: currentUserId,
                            status: false,
                            note,
                        },
                    ],
                    { session },
                )
                await GoodsAdvanceModel.findByIdAndUpdate(
                    checkGoodsAdvance._id,
                    {
                        status: constant.GOODS_ADVANCE_STATUS.REJECT,
                        updatedBy: currentUserId,
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
}

module.exports = goodsAdvanceService
