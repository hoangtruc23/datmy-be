const { generateGoodsReport } = require('../utils/helper/excelReportHelper')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')
const GoodsIssueModel = require('../models/goodsIssue')
const ProductModel = require('../models/product')
const GoodsIssueDetaileModel = require('../models/goodsIssueDetail')
const WarehouseModel = require('../models/warehouses')
const { Types, default: mongoose } = require('mongoose')
const constant = require('../utils/constant/constant')
const ProductStorageModel = require('../models/productStorage')
const GoodsIssueApprovalModel = require('../models/goodsIssueApproval')
const UserModel = require('../models/user')
const CustomerModel = require('../models/customer')
const GoodsIssueDetailModel = require('../models/goodsIssueDetail')
const { findDuplicateTrackingCode } = require('../utils/helper/helper')
const downloadService = require('./downloadService')
const pdfService = require('./pdfService')

const goodsIssueService = {
    getAll: async (query) => {
        try {
            let {
                search,
                page = 1,
                limit = 10,
                statuses = Object.values(constant.GOODS_ISSUE_STATUS),
            } = query
            page = Number(page)
            limit = Number(limit)
            search = new RegExp(search, 'i')
            const [items, totalItem] = await Promise.all([
                GoodsIssueModel.find({
                    status: { $in: statuses },
                    $or: [{ customer: search }],
                    isTemporary: false,
                })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('createdBy', 'fullname'),
                GoodsIssueModel.countDocuments({
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
            const goodsIssue = await GoodsIssueModel.aggregate([
                {
                    $match: {
                        _id: new Types.ObjectId(String(goodsIssueId)),
                    },
                },
                {
                    $lookup: {
                        from: 'goodsissuedetails',
                        as: 'products',
                        localField: '_id',
                        foreignField: 'goodsIssueId',
                    },
                },
                {
                    $lookup: {
                        from: 'goodsissueapprovals',
                        as: 'approvals',
                        localField: '_id',
                        foreignField: 'goodsIssueId',
                    },
                },
            ])
            if (!goodsIssue[0]) {
                throw new BadReq(errorCode.GOODS_ISSUE_NOT_FOUND)
            }
            return goodsIssue[0]
        } catch (error) {
            throw error
        }
    },
    createTemporary: async (currentUserId) => {
        try {
            const goodsIssue = await GoodsIssueModel.create({
                createdBy: currentUserId,
            })
            return goodsIssue
        } catch (error) {
            throw error
        }
    },
    create: async (goodsIssueId, goodsIssue, currentUserId) => {
        const session = await mongoose.startSession()
        try {
            session.startTransaction()
            const {
                customerId,
                invoiceFile,
                invoiceOrContractNumber,
                estimatedDeliveryDate,
                customer,
                // billingAddress,
                deliveryAddresses,
                orderedBy,
                recipient,
                note,
                isDraft,
            } = goodsIssue
            const checkGoodsIssue = await GoodsIssueModel.findById(goodsIssueId)
            if (!checkGoodsIssue) {
                throw new BadReq(errorCode.GOODS_ISSUE_NOT_FOUND)
            }
            const checkCustomer = await CustomerModel.findById(customerId)
            if (!checkCustomer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }
            if (!isDraft && checkGoodsIssue.isDraft) {
                // Nếu phiếu tạo mà không phải nháp thì ta cập nhật lại productStorage (tồn kho)
                const goodsIssueDetails =
                    await GoodsIssueDetaileModel.find(goodsIssueId)
                for (let goodsIssueDetail of goodsIssueDetails) {
                    if (goodsIssueDetail.storages.length > 0) {
                        for (let storage of goodsIssueDetail.storages) {
                            await ProductStorageModel.findOneAndUpdate(
                                {
                                    warehouseId: goodsIssueDetail.warehouseId,
                                    productId: goodsIssueDetail.productId,
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
            }
            await GoodsIssueModel.findByIdAndUpdate(
                goodsIssueId,
                {
                    customerId,
                    invoiceFile,
                    invoiceOrContractNumber,
                    estimatedDeliveryDate,
                    customer,
                    billingAddress: checkCustomer.billingAddress,
                    deliveryAddresses,
                    garageAddress: checkCustomer.garageAddress,
                    orderedBy,
                    recipient,
                    note,
                    isDraft,
                    isTemporary: false,
                    status: isDraft
                        ? constant.GOODS_ISSUE_STATUS.DRAFT
                        : constant.GOODS_ISSUE_STATUS.WAREHOUSE_STAFF_APPROVAL,
                    createdBy: currentUserId,
                },
                { session },
            )

            const user = await UserModel.findById(currentUserId)
            await GoodsIssueApprovalModel.create(
                [
                    {
                        goodsIssueId,
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
    update: async (goodsIssueId, goodsIssue, currentUserId) => {
        const session = await mongoose.startSession()
        try {
            session.startTransaction()
            const {
                customerId,
                invoiceFile,
                invoiceOrContractNumber,
                estimatedDeliveryDate,
                customer,
                // billingAddress,
                deliveryAddresses,
                orderedBy,
                recipient,
                note,
                isDraft,
            } = goodsIssue
            const checkGoodsIssue = await GoodsIssueModel.findById(goodsIssueId)
            if (!checkGoodsIssue) {
                throw new BadReq(errorCode.GOODS_ISSUE_NOT_FOUND)
            }
            if (!checkGoodsIssue.isDraft) {
                throw new BadReq(errorCode.DO_NOT_UPDATE_GOODS_ISSUE_NOT_DRAFT)
            }
            if (checkGoodsIssue.status == constant.GOODS_ISSUE_STATUS.CANCEL) {
                throw new BadReq(errorCode.DO_NOT_UPDATE_STATUS_CANCEL)
            }
            const checkCustomer = await CustomerModel.findById(customerId)
            if (!checkCustomer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }
            if (!isDraft && checkGoodsIssue.isDraft) {
                // Nếu phiếu tạo mà không phải nháp thì ta cập nhật lại productStorage (tồn kho)
                const goodsIssueDetails = await GoodsIssueDetaileModel.find({
                    goodsIssueId,
                })
                for (let goodsIssueDetail of goodsIssueDetails) {
                    if (goodsIssueDetail.storages.length > 0) {
                        for (let storage of goodsIssueDetail.storages) {
                            await ProductStorageModel.findOneAndUpdate(
                                {
                                    warehouseId: goodsIssueDetail.warehouseId,
                                    productId: goodsIssueDetail.productId,
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
            }
            await GoodsIssueModel.findByIdAndUpdate(
                goodsIssueId,
                {
                    customerId,
                    invoiceFile,
                    invoiceOrContractNumber,
                    estimatedDeliveryDate,
                    customer,
                    billingAddress: checkCustomer.billingAddress,
                    deliveryAddresses,
                    garageAddress: checkCustomer.garageAddress,
                    orderedBy,
                    recipient,
                    note,
                    isDraft,
                    status: isDraft
                        ? constant.GOODS_ISSUE_STATUS.DRAFT
                        : constant.GOODS_ISSUE_STATUS.WAREHOUSE_STAFF_APPROVAL,
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
    cancel: async (goodsIssueId, currentUserId) => {
        const session = await mongoose.startSession()
        try {
            session.startTransaction()
            const checkGoodsIssue = await GoodsIssueModel.findById(goodsIssueId)
            if (!checkGoodsIssue) {
                throw new BadReq(errorCode.GOODS_ISSUE_NOT_FOUND)
            }
            if (checkGoodsIssue.createdBy != currentUserId) {
                throw new BadReq(errorCode.DO_NOT_CANCEL_GOODS_ISSUE)
            }

            // Cập nhật lại số lượng sản phẩm khi bị từ chối hoặc hủy
            const goodsIssueDetails = await GoodsIssueDetaileModel.find({
                goodsIssueId,
            })
            for (let goodsIssueDetail of goodsIssueDetails) {
                if (goodsIssueDetail.storages.length > 0) {
                    for (let storage of goodsIssueDetail.storages) {
                        await ProductStorageModel.findOneAndUpdate(
                            {
                                warehouseId: goodsIssueDetail.warehouseId,
                                productId: goodsIssueDetail.productId,
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

            await GoodsIssueModel.findByIdAndUpdate(
                goodsIssueId,
                {
                    status: constant.GOODS_ISSUE_STATUS.CANCEL,
                    updatedBy: currentUserId,
                },
                { session },
            )
            await GoodsIssueApprovalModel.findOneAndUpdate(
                { goodsIssueId },
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
        const session = await mongoose.startSession()
        try {
            const {
                goodsIssueId,
                productId,
                warehouseId,
                origin,
                issuedQuantity,
                price,
                totalAmount,
                storages,
                note,
            } = product

            session.startTransaction()
            const checkGoodsIssueDetail = await GoodsIssueDetaileModel.findOne({
                goodsIssueId,
                productId,
                warehouseId,
            })
            if (checkGoodsIssueDetail) {
                throw new BadReq(errorCode.GOODS_ISSUE_DETAIL_EXISTED)
            }
            // Kiểm tra các số serial/ số lô truyền xuống có trùng không
            const duplicatesKey = findDuplicateTrackingCode(storages)
            if (duplicatesKey.length > 0) {
                throw new BadReq(errorCode.SERIAL_OR_BATCH_DUPLICATED)
            }
            const [checkIssue, checkWarehouse, checkProduct] =
                await Promise.all([
                    GoodsIssueModel.findById(goodsIssueId),
                    WarehouseModel.findById(warehouseId),
                    ProductModel.findById(productId),
                ])

            if (!checkIssue) {
                throw new BadReq(errorCode.GOODS_ISSUE_NOT_FOUND)
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
            if (issuedQuantity > totalProduct) {
                throw new BadReq(errorCode.ISSUED_QUANTITY_INVALID)
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
            if (batchQuantityTotal != issuedQuantity) {
                throw new BadReq(
                    errorCode.SERIAL_OR_BATCH_QUANTITY_TOTAL_INVALID,
                )
            }
            await GoodsIssueDetaileModel.create(
                [
                    {
                        goodsIssueId,
                        productId,
                        warehouseId,
                        productCode: checkProduct?.code,
                        productName: checkProduct?.name,
                        managementType: checkProduct?.managementType,
                        unit: checkProduct?.unit?.name,
                        origin,
                        issuedQuantity,
                        price,
                        totalAmount,
                        warehouseName: checkWarehouse.warehouseName,
                        storages,
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
    updateProduct: async (goodsIssueDetailId, product) => {
        try {
            const {
                goodsIssueId,
                productId,
                warehouseId,
                origin,
                issuedQuantity,
                price,
                totalAmount,
                storages,
                note,
            } = product
            const checkGoodsIssueDetailExist =
                await GoodsIssueDetaileModel.findOne({
                    _id: { $ne: goodsIssueDetailId },
                    goodsIssueId,
                    productId,
                    warehouseId,
                })
            if (checkGoodsIssueDetailExist) {
                throw new BadReq(errorCode.GOODS_ISSUE_DETAIL_EXISTED)
            }
            // Kiểm tra các số serial/ số lô truyền xuống có trùng không
            const duplicatesKey = findDuplicateTrackingCode(storages)
            if (duplicatesKey.length > 0) {
                throw new BadReq(errorCode.SERIAL_OR_BATCH_DUPLICATED)
            }
            const [
                checkGoodsIssueDetail,
                checkIssue,
                checkWarehouse,
                checkProduct,
            ] = await Promise.all([
                GoodsIssueDetaileModel.findById(goodsIssueDetailId),
                GoodsIssueModel.findById(goodsIssueId),
                WarehouseModel.findById(warehouseId),
                ProductModel.findById(productId),
            ])

            if (!checkGoodsIssueDetail) {
                throw new BadReq(errorCode.GOODS_ISSUE_DETAIL_NOT_FOUND)
            }

            if (!checkIssue) {
                throw new BadReq(errorCode.GOODS_ISSUE_NOT_FOUND)
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
            if (issuedQuantity > totalProduct) {
                throw new BadReq(errorCode.ISSUED_QUANTITY_INVALID)
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
            if (batchQuantityTotal != issuedQuantity) {
                throw new BadReq(
                    errorCode.SERIAL_OR_BATCH_QUANTITY_TOTAL_INVALID,
                )
            }

            await GoodsIssueDetaileModel.findByIdAndUpdate(goodsIssueDetailId, {
                goodsIssueId,
                productId,
                warehouseId,
                productCode: checkProduct?.productCode,
                productName: checkProduct?.productName,
                managementType: checkProduct?.managementType,
                unit: checkProduct?.unit?.name,
                origin,
                issuedQuantity,
                price,
                totalAmount,
                warehouseName: checkWarehouse.warehouseName,
                storages,
                note,
            })
            return null
        } catch (error) {
            throw error
        }
    },
    deleteProduct: async (goodsIssueDetailId) => {
        try {
            const checkGoodsIssueDetail =
                await GoodsIssueDetaileModel.findById(goodsIssueDetailId)
            if (!checkGoodsIssueDetail) {
                throw new BadReq(errorCode.GOODS_ISSUE_DETAIL_NOT_FOUND)
            }
            await GoodsIssueDetaileModel.findByIdAndDelete(goodsIssueDetailId)
            return null
        } catch (error) {
            throw error
        }
    },
    approval: async (input, currentUserId) => {
        const session = await mongoose.startSession()
        try {
            session.startTransaction()
            const { goodsIssueApprovalId, status, invoiceNumber, content } =
                input
            const checkGoodsIssueApproval =
                await GoodsIssueApprovalModel.findById(goodsIssueApprovalId)
            if (!checkGoodsIssueApproval) {
                throw new BadReq(errorCode.GOODS_ISSUE_APPROVAL_NOT_FOUND)
            }
            if (!checkGoodsIssueApproval.nextApprovalRoleId) {
                throw new BadReq(errorCode.GOODS_ISSUE_APPROVAL_APPROVED)
            }
            const checkGoodsIssue = await GoodsIssueModel.findById(
                checkGoodsIssueApproval.goodsIssueId,
            )
            if (status == constant.APPROVAL_STATUS.APPROVED) {
                const checkGoodsIssueDetails =
                    await GoodsIssueDetaileModel.find({
                        goodsIssueId: checkGoodsIssue._id,
                    })
                for (let checkGoodsIssueDetail of checkGoodsIssueDetails) {
                    if (checkGoodsIssueDetail.storages.length <= 0) {
                        throw new BadReq(errorCode.APPROVAL_QUANTITY_NOT_YET)
                    }
                }
                const checkUser = await UserModel.findById(currentUserId)
                if (
                    !checkUser.roleIds.includes(
                        checkGoodsIssueApproval.nextApprovalRoleId,
                    )
                ) {
                    throw new BadReq(errorCode.NOT_PERMISSION_APPROVAL)
                }
            }

            if (
                status == constant.APPROVAL_STATUS.REJECTED ||
                status == constant.APPROVAL_STATUS.CANCEL
            ) {
                // Cập nhật lại số lượng sản phẩm khi bị từ chối hoặc hủy
                const goodsIssueDetails = await GoodsIssueDetaileModel.find({
                    goodsIssueId: checkGoodsIssue.goodsIssueId,
                })
                for (let goodsIssueDetail of goodsIssueDetails) {
                    if (goodsIssueDetail.storages.length > 0) {
                        for (let storage of goodsIssueDetail.storages) {
                            await ProductStorageModel.findOneAndUpdate(
                                {
                                    warehouseId: goodsIssueDetail.warehouseId,
                                    productId: goodsIssueDetail.productId,
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
            }

            if (
                status == constant.APPROVAL_STATUS.APPROVED ||
                status == constant.APPROVAL_STATUS.REJECTED ||
                status == constant.APPROVAL_STATUS.CANCEL
            ) {
                const user = await UserModel.findById(currentUserId)
                switch (checkGoodsIssueApproval.nextApprovalRoleId) {
                    case constant.ROLES.warehouseStaff: {
                        await GoodsIssueApprovalModel.findByIdAndUpdate(
                            goodsIssueApprovalId,
                            {
                                warehouseStaffApproval: {
                                    approvedBy: user.fullname,
                                    status,
                                    content,
                                },
                                nextApprovalRoleId:
                                    constant.ROLES.warehouseAccountant,
                            },
                            {
                                session,
                            },
                        )
                        await GoodsIssueModel.findByIdAndUpdate(
                            checkGoodsIssueApproval.goodsIssueId,
                            {
                                status:
                                    status == constant.APPROVAL_STATUS.APPROVED
                                        ? constant.GOODS_ISSUE_STATUS
                                              .WAREHOUSE_ACCOUNTANT_APPROVAL
                                        : status,
                            },
                            { session },
                        )
                        break
                    }
                    case constant.ROLES.warehouseAccountant: {
                        await GoodsIssueApprovalModel.findByIdAndUpdate(
                            goodsIssueApprovalId,
                            {
                                warehouseAccountantApproval: {
                                    approvedBy: user.fullname,
                                    status,
                                    content,
                                },
                                nextApprovalRoleId:
                                    constant.ROLES.debtAccountant,
                            },
                            {
                                session,
                            },
                        )
                        await GoodsIssueModel.findByIdAndUpdate(
                            checkGoodsIssueApproval.goodsIssueId,
                            {
                                status:
                                    status == constant.APPROVAL_STATUS.APPROVED
                                        ? constant.GOODS_ISSUE_STATUS
                                              .DEBT_ACCOUNTANT_APPROVAL
                                        : status,
                            },
                            { session },
                        )
                        break
                    }
                    case constant.ROLES.debtAccountant: {
                        await GoodsIssueApprovalModel.findByIdAndUpdate(
                            goodsIssueApprovalId,
                            {
                                debtAccountantApproval: {
                                    approvedBy: user.fullname,
                                    status,
                                    content,
                                },
                                nextApprovalRoleId:
                                    constant.ROLES.billAccountant,
                            },
                            {
                                session,
                            },
                        )
                        await GoodsIssueModel.findByIdAndUpdate(
                            checkGoodsIssueApproval.goodsIssueId,
                            {
                                status:
                                    status == constant.APPROVAL_STATUS.APPROVED
                                        ? constant.GOODS_ISSUE_STATUS
                                              .BILL_ACCOUNTANT_APPROVAL
                                        : status,
                            },
                            { session },
                        )
                        break
                    }
                    case constant.ROLES.billAccountant: {
                        await GoodsIssueModel.findByIdAndUpdate(
                            checkGoodsIssue._id,
                            {
                                invoiceNumber,
                            },
                        )
                        await GoodsIssueApprovalModel.findByIdAndUpdate(
                            goodsIssueApprovalId,
                            {
                                billAccountantApproval: {
                                    approvedBy: user.fullname,
                                    status,
                                    content,
                                },
                                nextApprovalRoleId: null,
                            },
                            {
                                session,
                            },
                        )
                        await GoodsIssueModel.findByIdAndUpdate(
                            checkGoodsIssueApproval.goodsIssueId,
                            {
                                status:
                                    status == constant.APPROVAL_STATUS.APPROVED
                                        ? constant.GOODS_ISSUE_STATUS.APPROVED
                                        : status,
                            },
                            { session },
                        )
                        break
                    }
                }
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

            // Step 1: Fetch and Prepare Data
            const matchConditions = { 'goodsIssue.isTemporary': false }
            if (statuses && statuses.length > 0) {
                matchConditions['goodsIssue.status'] = { $in: statuses }
            }
            if (warehouseIds && warehouseIds.length > 0) {
                matchConditions.warehouseId = {
                    $in: warehouseIds.map(
                        (id) => new Types.ObjectId(String(id)),
                    ),
                }
            }
            if (startDate || endDate) {
                matchConditions['goodsIssue.createdAt'] = {}
                if (startDate) {
                    matchConditions['goodsIssue.createdAt'].$gte = new Date(
                        startDate,
                    )
                }
                if (endDate) {
                    const end = new Date(endDate)
                    end.setHours(23, 59, 59, 999)
                    matchConditions['goodsIssue.createdAt'].$lte = end
                }
            }

            const results = await GoodsIssueDetaileModel.aggregate([
                {
                    $lookup: {
                        from: 'goodsissues',
                        localField: 'goodsIssueId',
                        foreignField: '_id',
                        as: 'goodsIssue',
                    },
                },
                { $unwind: '$goodsIssue' },
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
                        'goodsIssue.createdAt': -1,
                        'goodsIssue.issueNumber': 1,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        date: '$goodsIssue.createdAt',
                        issueNumber: '$goodsIssue.issueNumber',
                        status: '$goodsIssue.status',
                        deliveryAddress: {
                            $ifNull: ['$goodsIssue.deliveryAddresses', 'N/A'],
                        },
                        customer: '$goodsIssue.customer',
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
                const receiptKey = item.issueNumber
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
                worksheetName: 'Bảng kê chi tiết bán hàng',
                reportTitle: 'BẢNG KÊ CHI TIẾT BÁN HÀNG THEO NGÀY',
                dateRange: { startDate: finalStartDate, endDate: finalEndDate },
                headers: [
                    'NGÀY',
                    'SỐ PXK',
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
                    'issueNumber',
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
                    'issueNumber',
                    'status',
                    'deliveryAddress',
                    'customer',
                ],
                statusMap: {
                    approved: 'Thành công',
                    draft: 'Nháp',
                    reject: 'Từ chối',
                    cancel: 'Đã hủy',
                    warehouseStaffApproval: 'Chờ duyệt',
                    warehouseAccountantApproval: 'Chờ duyệt',
                    debtAccountantApproval: 'Chờ duyệt',
                    billAccountApproval: 'Chờ duyệt',
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
                        key: 'issueNumber',
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
                        key: 'customer',
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
    downloadInvoiceFile: async (goodsIssueId, res) => {
        try {
            const goodsIssue = await GoodsIssueModel.findById(goodsIssueId)
            if (!goodsIssue) {
                throw new BadReq(errorCode.GOODS_ISSUE_NOT_FOUND)
            }

            const invoiceFile = goodsIssue.invoiceFile
            await downloadService.downloadFile(invoiceFile, res)
        } catch (error) {
            throw error
        }
    },

    generatePdf: async (goodsIssueId) => {
        const goodsIssue = await GoodsIssueModel.findById(goodsIssueId).lean()
        if (!goodsIssue) {
            throw new BadReq(errorCode.GOODS_ISSUE_NOT_FOUND)
        }
        const goodsIssueDetails = await GoodsIssueDetailModel.find({
            goodsIssueId,
        }).lean()
        const goodsIssueApproval = await GoodsIssueApprovalModel.findOne({
            goodsIssueId,
        }).lean()
        const data = { ...goodsIssue, goodsIssueDetails, goodsIssueApproval }
        const pdfBuffer = await pdfService.generateGoodsIssuePdf(data)
        return {
            pdfBuffer: pdfBuffer,
            invoiceNumber: goodsIssue.invoiceNumber || goodsIssueId,
        }
    },
}

module.exports = goodsIssueService
