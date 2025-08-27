const { generateGoodsReport } = require('../utils/helper/excelReportHelper')
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
    getById: async (goodsAdvanceId) => {
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
                        from: 'goodsadvanceprocesses',
                        as: 'processes',
                        localField: '_id',
                        foreignField: 'goodsAdvanceId',
                    },
                },
                //add fullname for createdBy
                {
                    $unwind: {
                        path: '$processes',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'processes.createdBy',
                        foreignField: '_id',
                        as: 'processes.createdByUser',
                    },
                },
                //unwind because lookup always return an array
                {
                    $unwind: {
                        path: '$processes.createdByUser',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        root: { $first: '$$ROOT' },
                        processes: { $push: '$processes' },
                    },
                },
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: [
                                '$root',
                                { processes: '$processes' },
                            ],
                        },
                    },
                },
            ])
            if (!goodsAdvance[0]) {
                throw new BadReq(errorCode.GOODS_ADVANCE_NOT_FOUND)
            }

            const finalResult = goodsAdvance[0]
            if (
                finalResult.processes &&
                finalResult.processes[0] &&
                finalResult.processes[0]._id
            ) {
                //check for sure
                finalResult.processes.forEach((process) => {
                    if (process.createdByUser) {
                        // overwrite original 'createdBy' field
                        process.createdBy = {
                            _id: process.createdByUser._id,
                            fullname: process.createdByUser.fullname,
                        }
                        delete process.createdByUser
                    }
                })
            }

            return finalResult
        } catch (error) {
            throw error
        }
    },
    createTemporary: async (currentUserId) => {
        try {
            const goodsAdvance = await GoodsAdvanceModel.create({
                createdBy: currentUserId,
            })
            return goodsAdvance
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

            const goodsAdvanceDetails = await GoodsAdvanceDetaileModel.find({
                goodsAdvanceId,
            })
            for (let goodsAdvanceDetail of goodsAdvanceDetails) {
                if (goodsAdvanceDetail.borrowStorages.length > 0) {
                    for (let storage of goodsAdvanceDetail.borrowStorages) {
                        await ProductStorageModel.findOneAndUpdate(
                            {
                                warehouseId:
                                    goodsAdvanceDetail.borrowWarehouseId,
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
                { session, ordered: true },
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
                if (goodsAdvanceDetail.borrowStorages.length > 0) {
                    for (let storage of goodsAdvanceDetail.borrowStorages) {
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
                        title: constant.GOODS_ADVANCE_PROCESS_TITLE.EXTEND,
                        createdBy: currentUserId,
                        status: true,
                        note,
                    },
                    {
                        goodsAdvanceId,
                        title: constant.GOODS_ADVANCE_PROCESS_TITLE.APPROVAL,
                        // createdBy: currentUserId,
                        status: false,
                    },
                ],
                { session, ordered: true },
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
                borrowWarehouseId,
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
                    borrowWarehouseId,
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
                    WarehouseModel.findById(borrowWarehouseId),
                    ProductModel.findById(productId).populate('unit'),
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
                warehouseId: borrowWarehouseId,
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
                    throw new BadReq(errorCode.BATCH_QUANTITY_EXCEEDS_STOCK)
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
                        borrowWarehouseId,
                        productCode: checkProduct?.code,
                        productName: checkProduct?.name,
                        managementType: checkProduct?.managementType,
                        unit: checkProduct?.unit?.name,
                        origin,
                        borrowedQuantity,
                        borrowStatus,
                        usageContent,
                        borrowWarehouseName: checkWarehouse.name,
                        borrowStorages: storages,
                        // note,
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
                borrowWarehouseId,
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
                    borrowWarehouseId,
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
                WarehouseModel.findById(borrowWarehouseId),
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
                warehouseId: borrowWarehouseId,
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
                    throw new BadReq(errorCode.BATCH_QUANTITY_EXCEEDS_STOCK)
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
                    borrowWarehouseId,
                    productCode: checkProduct?.code,
                    productName: checkProduct?.name,
                    managementType: checkProduct?.managementType,
                    unit: checkProduct?.unit,
                    origin,
                    borrowedQuantity,
                    borrowStatus,
                    usageContent,
                    borrowWarehouseName: checkWarehouse.name,
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
            const { goodsAdvanceProcessId, status, note } = input
            const checkGoodsAdvanceProcess =
                await GoodsAdvanceProcessModel.findById(goodsAdvanceProcessId)
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
                    if (checkGoodsAdvanceDetail.borrowStorages.length <= 0) {
                        throw new BadReq(errorCode.APPROVAL_QUANTITY_NOT_YET)
                    }
                }
                const checkUser = await UserModel.findById(currentUserId)
                if (
                    !checkUser.roleIds.includes(constant.ROLES.warehouseStaff)
                ) {
                    throw new BadReq(errorCode.NOT_PERMISSION_APPROVAL)
                }
                await GoodsAdvanceProcessModel.findByIdAndUpdate(
                    goodsAdvanceProcessId,
                    {
                        goodsAdvanceId: checkGoodsAdvance._id,
                        title: constant.GOODS_ADVANCE_PROCESS_TITLE.APPROVAL,
                        createdBy: currentUserId,
                        status: true,
                        note,
                    },
                    { session },
                )

                const updatePayload = {
                    status: constant.GOODS_ADVANCE_STATUS.APPROVED,
                    updatedBy: currentUserId,
                }

                if (
                    checkGoodsAdvance.status ===
                    constant.GOODS_ADVANCE_STATUS.WAITING_FOR_EXTENSION
                ) {
                    updatePayload.expectedReturnDate =
                        checkGoodsAdvance.extendedReturnDate
                    updatePayload.extendedReturnDate = null
                }
                await GoodsAdvanceModel.findByIdAndUpdate(
                    checkGoodsAdvance._id,
                    updatePayload,
                    { session },
                )
            }

            if (!status) {
                // Cập nhật lại số lượng sản phẩm khi bị từ chối hoặc hủy
                const goodsAdvanceDetails = await GoodsAdvanceDetaileModel.find(
                    checkGoodsAdvance.goodsAdvanceId,
                )
                for (let goodsAdvanceDetail of goodsAdvanceDetails) {
                    if (goodsAdvanceDetail.borrowStorages.length > 0) {
                        for (let storage of goodsAdvanceDetail.borrowStorages) {
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
    receiveBack: async (goodsAdvanceId, input, currentUserId) => {
        const session = await mongoose.startSession()
        try {
            session.startTransaction()
            const { returner, returnDate, details } = input

            const goodsAdvance =
                await GoodsAdvanceModel.findById(goodsAdvanceId).session(
                    session,
                )

            if (!goodsAdvance) {
                throw new BadReq(errorCode.GOODS_ADVANCE_NOT_FOUND)
            }

            if (
                goodsAdvance.status !== constant.GOODS_ADVANCE_STATUS.APPROVED
            ) {
                throw new BadReq(
                    errorCode.GOODS_ADVANCE_INVALID_STATE_FOR_RETURN,
                )
            }

            //loop các sản phẩm trong phiếu
            for (const detail of details) {
                const {
                    goodsAdvanceDetailId,
                    returnWarehouseId,
                    declaredQuantity,
                    returnStatus,
                    returnStorages = [],
                    lostStorages = [],
                    lostReason = '',
                    purchaseStorages = [],
                    purchaseReason = '',
                } = detail

                const sumQuantities = (items) =>
                    items.reduce((total, item) => total + item.quantity, 0)

                const totalItemCount =
                    sumQuantities(returnStorages) +
                    sumQuantities(lostStorages) +
                    sumQuantities(purchaseStorages)

                if (totalItemCount !== declaredQuantity) {
                    throw new BadReq({
                        ...errorCode.GOODS_ADVANCE_SERIAL_COUNT_MISMATCH,
                        message: `Tổng số lượng sản phẩm (${totalItemCount}) không khớp với Số lượng đã khai báo (${declaredQuantity}).`,
                    })
                }

                const advanceDetail =
                    await GoodsAdvanceDetaileModel.findById(
                        goodsAdvanceDetailId,
                    ).session(session)

                if (!advanceDetail) {
                    throw new BadReq(errorCode.GOODS_ADVANCE_DETAIL_NOT_FOUND)
                }

                if (declaredQuantity > advanceDetail.borrowedQuantity) {
                    throw new BadReq({
                        ...errorCode.GOODS_ADVANCE_RETURN_QUANTITY_INVALID,
                        message: `Số lượng xử lý (${declaredQuantity}) vượt quá số lượng đã mượn (${advanceDetail.borrowedQuantity}) cho sản phẩm ${advanceDetail.productName}.`,
                    })
                }

                advanceDetail.returnWarehouseId = returnWarehouseId
                const warehouse =
                    await WarehouseModel.findById(returnWarehouseId)
                if (!warehouse) throw new BadReq(errorCode.WAREHOUSE_NOT_FOUND)
                advanceDetail.returnWarehouseName = warehouse.name

                advanceDetail.returnStorages = returnStorages
                advanceDetail.lostStorages = lostStorages
                advanceDetail.purchaseStorages = purchaseStorages
                advanceDetail.lostReason = lostReason
                advanceDetail.returnStatus = returnStatus
                advanceDetail.purchaseReason = purchaseReason
                advanceDetail.returnedQuantity = sumQuantities(returnStorages)

                for (const storage of returnStorages) {
                    await ProductStorageModel.findOneAndUpdate(
                        {
                            warehouseId: returnWarehouseId,
                            productId: advanceDetail.productId,
                            trackingCode: storage.trackingCode,
                        },
                        { $inc: { quantity: storage.quantity } },
                        { upsert: true, session }, //nếu ko có thì tạo mới
                    )
                }

                await advanceDetail.save({ session })
            }

            const allDetails = await GoodsAdvanceDetaileModel.find({
                goodsAdvanceId,
            }).session(session)

            //detail này từ database, ktra tất cả các sản phẩm

            const isEverythingPhysicallyReturned = allDetails.every(
                (detail) => {
                    const sumQuantities = (items) =>
                        items.reduce((total, item) => total + item.quantity, 0)
                    const totalReturned = sumQuantities(detail.returnStorages)
                    return totalReturned >= detail.borrowedQuantity
                },
            )

            goodsAdvance.status = isEverythingPhysicallyReturned
                ? constant.GOODS_ADVANCE_STATUS.RETURNED // Đã trả
                : constant.GOODS_ADVANCE_STATUS.IN_DEBT // Đang nợ
            goodsAdvance.updatedBy = currentUserId
            goodsAdvance.returner = returner
            goodsAdvance.returnDate = returnDate

            await goodsAdvance.save({ session })
            await GoodsAdvanceProcessModel.create(
                [
                    {
                        goodsAdvanceId,
                        title: constant.GOODS_ADVANCE_PROCESS_TITLE
                            .RECEIVE_BACK,
                        createdBy: currentUserId,
                        status: true,
                        note: 'Đã nhận lại hàng tạm ứng.',
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
    exportReport: async (filters) => {
        try {
            const { startDate, endDate, statuses, warehouseIds } = filters

            const matchConditions = { 'goodsAdvance.isTemporary': false }
            if (statuses && statuses.length > 0) {
                matchConditions['goodsAdvance.status'] = { $in: statuses }
            }
            if (warehouseIds && warehouseIds.length > 0) {
                matchConditions.borrowWarehouseId = {
                    $in: warehouseIds.map(
                        (id) => new Types.ObjectId(String(id)),
                    ),
                }
            }
            if (startDate || endDate) {
                matchConditions['goodsAdvance.createdAt'] = {}
                if (startDate) {
                    matchConditions['goodsAdvance.createdAt'].$gte = new Date(
                        startDate,
                    )
                }
                if (endDate) {
                    const end = new Date(endDate)
                    end.setHours(23, 59, 59, 999)
                    matchConditions['goodsAdvance.createdAt'].$lte = end
                }
            }

            const results = await GoodsAdvanceDetaileModel.aggregate([
                {
                    $lookup: {
                        from: 'goodsadvances',
                        localField: 'goodsAdvanceId',
                        foreignField: '_id',
                        as: 'goodsAdvance',
                    },
                },
                { $unwind: '$goodsAdvance' },
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
                        'goodsAdvance.createdAt': -1,
                        'goodsAdvance.advanceNumber': 1,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        date: '$goodsAdvance.createdAt',
                        receiptNumber: '$goodsAdvance.advanceNumber',
                        status: '$goodsAdvance.status',
                        deliveryAddress: {
                            $ifNull: ['$goodsAdvance.deliveryAddresses', 'N/A'],
                        },
                        customer: '$goodsAdvance.customer',
                        productCode: '$productInfo.code',
                        specification: '$productInfo.specification',
                        brandName: '$brandInfo.name',
                        warehouseName: '$borrowWarehouseName',
                        totalAmount: '$borrowedQuantity',
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
                worksheetName: 'Bảng kê chi tiết tạm ứng',
                reportTitle: 'BẢNG KÊ CHI TIẾT TẠM ỨNG HÀNG THEO NGÀY',
                dateRange: { startDate: finalStartDate, endDate: finalEndDate },
                headers: [
                    'NGÀY',
                    'SỐ PTUK',
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
                    'customer',
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
                    'customer',
                ],
                statusMap: {
                    warehouseStaffApproval: 'Chờ duyệt',
                    approved: 'Đã xác nhận',
                    waitingForExtension: 'Gia hạn',
                    reject: 'Từ chối',
                    cancel: 'Đã huỷ',
                },
                summaryRowText: 'TỔNG CỘNG:',
                grandTotalText: 'TỔNG CỘNG:',
                columnConfigs: [
                    {
                        key: 'date',
                        width: 15,
                        style: {
                            alignment: {
                                vertical: 'middle',
                                horizontal: 'center',
                            },
                            numFmt: 'dd/mm/yyyy',
                        },
                    },
                    {
                        key: 'receiptNumber',
                        width: 12,
                        style: {
                            alignment: {
                                vertical: 'middle',
                                horizontal: 'left',
                            },
                        },
                    },
                    {
                        key: 'status',
                        width: 20,
                        style: {
                            alignment: {
                                vertical: 'middle',
                                horizontal: 'left',
                            },
                        },
                    },
                    {
                        key: 'deliveryAddress',
                        width: 45,
                        style: {
                            alignment: {
                                vertical: 'middle',
                                horizontal: 'left',
                            },
                        },
                    },
                    {
                        key: 'customer',
                        width: 45,
                        style: {
                            alignment: {
                                vertical: 'middle',
                                horizontal: 'left',
                            },
                        },
                    },
                    {
                        key: 'productCode',
                        width: 18,
                        style: {
                            alignment: {
                                vertical: 'middle',
                                horizontal: 'left',
                            },
                        },
                    },
                    {
                        key: 'specification',
                        width: 15,
                        style: {
                            alignment: {
                                vertical: 'middle',
                                horizontal: 'left',
                            },
                        },
                    },
                    {
                        key: 'brandName',
                        width: 15,
                        style: {
                            alignment: {
                                vertical: 'middle',
                                horizontal: 'left',
                            },
                        },
                    },
                    {
                        key: 'warehouseName',
                        width: 20,
                        style: {
                            alignment: {
                                vertical: 'middle',
                                horizontal: 'left',
                            },
                        },
                    },
                    {
                        key: 'totalAmount',
                        width: 20,
                        style: {
                            numFmt: '#,##0',
                            alignment: {
                                vertical: 'middle',
                                horizontal: 'center',
                            },
                        },
                    },
                ],
            }

            return generateGoodsReport(groupedByDate, reportConfig)
        } catch (error) {
            throw error
        }
    },
}

module.exports = goodsAdvanceService
