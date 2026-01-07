const WorkOrderModel = require('../models/workOrder')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')
const CustomerModel = require('../models/customer')
const constant = require('../utils/constant/constant')
const TechnicianModel = require('../models/technician')
const workOrderDetailService = require('../services/workOrderDetailService')
const contactPersonCustomerService = require('./contactPersonCustomerService')
const ContactPersonCustomerModel = require('../models/contactPersonCustomer')
const MachineSettingModel = require('../models/machineSetting')
const ProductModel = require('../models/product')
const { getWorkOrderModel } = require('../utils/helper/workOrderDetailHelper')

const workOrderService = {
    getAll: async (reqUserId, query) => {
        try {
            let { limit = 10, page = 1, search = '', status, typeWork, startTime, endTime, history, typeHistory } = query
            limit = Number(limit)
            page = Number(page)
            search = new RegExp(search, 'i')


            const technician = await TechnicianModel.findById(reqUserId)
            const customers = await CustomerModel.find({ officialName: search })
            const customerIds = customers ? customers.map((c) => c._id) : []
            let conditions = {};
            if (history == undefined) {
                conditions = {
                    $or: [
                        { code: search },
                        { header: search },
                        { customerId: { $in: customerIds } },
                    ],
                    ...(status ? { status } : {}),
                    ...(typeWork ? { typeWork } : {}),
                    ...(technician ? { technicianId: reqUserId } : {}),
                    ...(startTime && endTime ? {
                        createdAt: {
                            $gte: startTime,
                            $lte: endTime
                        }
                    } : {}),
                }
            } else {
                history = new RegExp(history, 'i')

                if (typeHistory == 'serialNumber') {
                    conditions = {
                        ...(history ? { serialNumber: history } : {}),
                    }
                } else {
                    const customers = await CustomerModel.find({ officialName: history }).select({ _id: 1 })
                    const customerIds = customers.map(c => c._id);
                    const contacts = await ContactPersonCustomerModel.find({ customerId: { $in: customerIds } })
                        .populate('customerId', 'officialName billingAddress')
                        .select({ customerId: 1, devices: 1 }).lean();

                    const productCodes = contacts.flatMap(c => c.devices.flatMap(device => device.productCode) || []);
                    const products = await ProductModel.find({ code: { $in: productCodes } }).select({ name: 1, code: 1 })
                    const productMap = new Map(products.map(p => [String(p.code), p]));

                    for (const contact of contacts) {
                        const devices = contact.devices;
                        for (const device of devices) {
                            const matchedProduct = productMap.get(String(device.productCode));
                            if (matchedProduct) {
                                device.machineName = matchedProduct.name
                            }
                        }
                    }

                    return contacts

                    // const customers = await CustomerModel.find({ officialName: history }).select({ _id: 1, officialName: 1 })
                    // const customerIds = customers.map(c => c._id);
                    // const contacts = await ContactPersonCustomerModel.find({ customerId: { $in: customerIds } });
                    // const productCodes = contacts.flatMap(c => c.productCode || []);


                    // conditions = {
                    //     $or: [
                    //         { customerId: { $in: customerIds } },
                    //         { productCode: { $in: productCodes } }
                    //     ]
                    // };
                }
            }
            const [workOrders, totalItems] = await Promise.all([
                WorkOrderModel.find(conditions)
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate(
                        'customerId',
                        'officialName representative.name phone email',
                    )
                    .populate('technicianId', 'fullname')
                    .lean(),
                WorkOrderModel.countDocuments(conditions),
            ])

            let fullAddress = ''
            const result = workOrders.map((order) => {
                let technicianInfo = null
                if (order.technicianId) {
                    technicianInfo = {
                        technicianId: order.technicianId._id,
                        fullname: order.technicianId.fullname,
                    }
                }
                if (history) {
                    const address = order?.address
                    if (address?.specificAddress != null) {
                        fullAddress = `${address?.specificAddress} ${address?.ward} ${address?.provinceCity}`
                    }
                    else {
                        fullAddress = ''
                    }
                }
                return {
                    ...order,
                    technicianInfo,
                    technicianId: undefined,
                    fullAddress
                }
            })
            return {
                result,
                totalItems,
                page,
                totalPage: Math.ceil(totalItems / limit),
            }
        } catch (error) {
            throw error
        }
    },
    getById: async (workOrderId) => {
        try {
            const workOrder = await WorkOrderModel.findById(workOrderId)
                .populate(
                    'customerId',
                    'officialName representative.name phone email',
                )
                .populate('technicianId', 'fullname')
                .lean()
            if (!workOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }

            const machine = await ProductModel.findOne({ code: workOrder.type }, { name: 1 })

            return { ...workOrder, machineName: machine.name }
        } catch (error) {
            throw error
        }
    },
    getOverall: async () => {
        try {
            const countByStatus = await WorkOrderModel.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                    },
                },
            ])

            const acc = Object.values(constant.WORK_REQUEST_STATUS)
                .map((s) => s.value)
                .reduce((acc, cur) => {
                    acc[cur] = 0
                    return acc
                }, {})

            let result = countByStatus.reduce((acc, cur) => {
                acc[cur._id] = cur.count
                return acc
            }, acc)

            const dueNow = await WorkOrderModel.countDocuments({
                overDueTime: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    $lte: new Date(new Date().setHours(23, 59, 59, 999)),
                },
            })

            result['dueNow'] = dueNow

            return result
        } catch (error) {
            throw error
        }
    },
    create: async (reqData) => {
        try {
            const {
                technicianId,
                header,
                typeWork,
                customerId,
                contactName,
                contactPhone,
                contactEmail,
                description,
                priority,
                estimatedTime,
                overDueTime,
                requestSource,
                address,
                type,
                serialNumber
            } = reqData

            const customer = await CustomerModel.findById(customerId)
            if (!customer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }
            const technician = await TechnicianModel.findOne({
                _id: technicianId,
                isActive: true,
            })
            if (technicianId && !technician) {
                throw new BadReq(errorCode.TECHNICIAN_NOT_FOUND)
            }

            //gen workOrder code
            const latestOrder = await WorkOrderModel.findOne()
                .sort({ code: -1 })
                .lean()
            const code = latestOrder
                ? `JOB-${String(Number(latestOrder.code.slice(4)) + 1).padStart(5, '0')}`
                : 'JOB-00001'

            const contactPersonData = {
                customerId,
                contactName,
                contactEmail,
                contactPhone,
                productCode: type,
                serialNumber
            }

            const workOrderData = {
                code,
                technicianId,
                customerId,
                typeWork,
                requestSource,
                header,
                description,
                priority,
                contactPerson: { contactName, contactPhone, contactEmail },
                estimatedTime,
                overDueTime,
                type, //Loại máy
                serialNumber,
                address
            }

            if (
                address &&
                address.specificAddress !== null &&
                address.ward !== null &&
                address.provinceCity !== null
            ) {
                contactPersonData.provinceCity = address?.provinceCity
                contactPersonData.ward = address?.ward
                contactPersonData.specificAddress = address?.specificAddress

                // workOrderData.address = { specificAddress, ward, provinceCity }
            }

            if (typeWork == 'installation') {
                //Tạo thông tin khách qua bên kỹ thuật
                await contactPersonCustomerService.create(contactPersonData, 'installation')
            }
            await contactPersonCustomerService.create(contactPersonData)

            const workOrder = await WorkOrderModel.create(workOrderData)

            // if (
            //     typeWork === constant.WORK_ORDER_TYPE.INSTALLATION.value ||
            //     typeWork === constant.WORK_ORDER_TYPE.SAMPLE_PRINTING.value ||
            //     typeWork === constant.WORK_ORDER_TYPE.DEMO.value
            // ) {
            //     await workOrderDetailService.create(workOrder._id)
            // }

            await workOrderDetailService.create(workOrder)

            if (technicianId) {
                //ktv có việc => status = working
                await TechnicianModel.findByIdAndUpdate(technicianId, {
                    status: constant.TECHNICIAN_STATUS.WORKING.value,
                })
                await WorkOrderModel.findByIdAndUpdate(workOrder._id, {
                    assignedTime: new Date(),
                })
            }
            return null
        } catch (error) {
            throw error
        }
    },

    update: async (workOrderId, reqData) => {
        try {
            const {
                technicianId,
                typeWork,
                type, //Loại máy
                requestSource,
                header,
                description,
                priority,
                estimatedTime,
                overDueTime,
                status,
                contactName,
                contactEmail,
                contactPhone,
                address,
                serialNumber,
            } = reqData

            const checkWorkOrder = await WorkOrderModel.findById(workOrderId)
            if (!checkWorkOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }

            const oldTypeWork = checkWorkOrder.typeWork
            const oldType = checkWorkOrder.type //Loại Máy

            // if (
            //     oldTypeWork === constant.WORK_ORDER_TYPE.INSTALLATION.value ||
            //     oldTypeWork === constant.WORK_ORDER_TYPE.DEMO.value ||
            //     oldTypeWork === constant.WORK_ORDER_TYPE.SAMPLE_PRINTING.value
            // ) {
            //     if (typeWork === oldTypeWork && type !== oldType) {
            //         throw new BadReq(errorCode.WORK_ORDER_NOT_HAVE_DETAIL_TYPE)
            //     }
            // } 
            // else {
            //     if (
            //         typeWork === constant.WORK_ORDER_TYPE.INSTALLATION.value ||
            //         typeWork === constant.WORK_ORDER_TYPE.DEMO.value ||
            //         typeWork === constant.WORK_ORDER_TYPE.SAMPLE_PRINTING.value
            //     ) {
            //         if (type !== constant.WORK_ORDER_DETAIL_TYPE.NULL.value) {
            //             throw new BadReq(
            //                 errorCode.WORK_ORDER_NOT_HAVE_DETAIL_TYPE,
            //             )
            //         }
            //     }
            // }

            const technician = await TechnicianModel.findOne({
                _id: technicianId,
                isActive: true,
            })

            if (technicianId && !technician) {
                throw new BadReq(errorCode.TECHNICIAN_NOT_FOUND)
            }

            // if (typeWork !== oldTypeWork || type !== oldType) {
            //     if (
            //         oldTypeWork ===
            //         constant.WORK_ORDER_TYPE.INSTALLATION.value ||
            //         (oldTypeWork !== constant.WORK_ORDER_TYPE.NULL.value &&
            //             oldType !== constant.WORK_ORDER_DETAIL_TYPE.NULL.value)
            //     ) {
            //         await workOrderDetailService.delete(workOrderId)
            //     }
            // }


            // if (
            //     contactEmail !== checkWorkOrder.contactPerson.contactEmail ||
            //     contactName !== checkWorkOrder.contactPerson.contactName ||
            //     contactPhone !== checkWorkOrder.contactPerson.contactPhone
            // ) {
            //     await contactPersonCustomerService.create({
            //         customerId: checkWorkOrder.customerId,
            //         contactName,
            //         contactEmail,
            //         contactPhone,
            //         provinceCity,
            //         ward,
            //         specificAddress,
            //         // type, //Loại máy
            //         // serialNumber,
            //     })
            // }

            await contactPersonCustomerService.create({
                customerId: checkWorkOrder.customerId,
                contactName,
                contactEmail,
                contactPhone,
                provinceCity: address?.provinceCity,
                ward: address?.ward,
                specificAddress: address?.specificAddress,
                productCode: type, //Loại máy
                serialNumber,
            }, "update")

            await WorkOrderModel.findByIdAndUpdate(workOrderId, {
                technicianId,
                typeWork,
                type, //Loại máy
                requestSource,
                header,
                description,
                priority,
                estimatedTime,
                overDueTime,
                status,
                contactPerson: {
                    contactName,
                    contactEmail,
                    contactPhone,
                },
                address: {
                    specificAddress: address.specificAddress,
                    ward: address.ward,
                    provinceCity: address.provinceCity,
                },
                serialNumber,
            })

            //cập nhật ktv
            if (technicianId && checkWorkOrder.technicianId !== technicianId) {
                await WorkOrderModel.findByIdAndUpdate(workOrderId, {
                    assignedTime: new Date(),
                })

                // ktv cũ nếu hết việc => cập nhật trạng thái
                const othersWorkOrder = await WorkOrderModel.findOne({
                    technicianId: checkWorkOrder.technicianId,
                })
                if (!othersWorkOrder) {
                    await TechnicianModel.findByIdAndUpdate(
                        checkWorkOrder.technicianId,
                        {
                            status: constant.TECHNICIAN_STATUS.FREE.value,
                        },
                    )
                }
                // ktv mới cập nhật trạng thái
                await TechnicianModel.findByIdAndUpdate(technicianId, {
                    status: constant.TECHNICIAN_STATUS.WORKING.value,
                })
            }

            if (!technicianId && checkWorkOrder.technicianId) {
                // ktv cũ nếu hết việc => cập nhật trạng thái
                const othersWorkOrder = await WorkOrderModel.findOne({
                    technicianId: checkWorkOrder.technicianId,
                })
                if (!othersWorkOrder) {
                    await TechnicianModel.findByIdAndUpdate(
                        checkWorkOrder.technicianId,
                        {
                            status: constant.TECHNICIAN_STATUS.FREE.value,
                        },
                    )
                }
            }

            return null
        } catch (error) {
            throw error
        }
    },
    delete: async (workOrderId) => {
        try {
            const checkWorkOrder = await WorkOrderModel.findById(workOrderId)
            if (!checkWorkOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }
            const oldTypeWork = checkWorkOrder.typeWork
            const oldType = checkWorkOrder.type
            if (
                oldTypeWork === constant.WORK_ORDER_TYPE.INSTALLATION.value ||
                (oldTypeWork !== constant.WORK_ORDER_TYPE.NULL.value &&
                    oldType !== constant.WORK_ORDER_DETAIL_TYPE.NULL.value)
            ) {
                await workOrderDetailService.delete(workOrderId)
            }
            await WorkOrderModel.findByIdAndDelete(workOrderId)

            //cập nhật ktv
            // ktv cũ nếu hết việc => cập nhật trạng thái
            const othersWorkOrder = await WorkOrderModel.findOne({
                technicianId: checkWorkOrder.technicianId,
            })
            if (!othersWorkOrder) {
                await TechnicianModel.findByIdAndUpdate(
                    checkWorkOrder.technicianId,
                    {
                        status: constant.TECHNICIAN_STATUS.FREE.value,
                    },
                )
            }
            return null
        } catch (error) {
            throw error
        }
    },

    getAllState: () => Object.values(constant.WORK_REQUEST_STATUS),
    getAllPriority: () => Object.values(constant.WORK_REQUEST_PRIORITY),
    getAllWorkType: () => Object.values(constant.WORK_ORDER_TYPE),
    getAllType: () => Object.values(constant.WORK_ORDER_DETAIL_TYPE),
    getAllWorkRequestSource: () => Object.values(constant.WORK_REQUEST_SOURCE),
}

module.exports = workOrderService
