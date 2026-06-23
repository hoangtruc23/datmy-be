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
const technicianService = require('./technicianService')

const workOrderService = {
    // dashboard: async () => {
    //     try {
    //         const totalWorkOrders = await WorkOrderModel.countDocuments()
    //         const totalInProgress = await WorkOrderModel.find({ status: constant.WORK_REQUEST_STATUS.IN_PROGRESS.value }).countDocuments()
    //         const totalCompleted = await WorkOrderModel.find({ status: constant.WORK_REQUEST_STATUS.COMPLETED.value }).countDocuments()
    //         const totalOverdue = await WorkOrderModel.find({ status: constant.WORK_REQUEST_STATUS.OVERDUE.value }).countDocuments()
    //         const totalPending = await WorkOrderModel.find({ status: constant.WORK_REQUEST_STATUS.PENDING.value }).countDocuments()
    //         const technician = await TechnicianModel.countDocuments()
    //         const customers = await ContactPersonCustomerModel.countDocuments()
    //         return { totalWorkOrders, totalInProgress, totalCompleted, totalOverdue, totalPending, technician, customers }
    //     } catch (error) {
    //         throw error
    //     }
    // },
    dashboard: async (query) => {
        try {
            const { fromDate, toDate } = query;
            const matchStage = {};

            // 1. Xử lý khoảng thời gian lọc (createdAt)
            if (fromDate || toDate) {
                matchStage.createdAt = {};
                if (fromDate) matchStage.createdAt.$gte = new Date(fromDate);
                if (toDate) matchStage.createdAt.$lte = new Date(toDate);
            }

            // 2. Sử dụng Promise.all để chạy song song các bảng khác nhau
            const [workOrderStats, totalTechnicians, totalCustomers] = await Promise.all([
                // Gom tất cả các điều kiện đếm của WorkOrder vào 1 cú quét duy nhất (Aggregation Facet)
                WorkOrderModel.aggregate([
                    { $match: matchStage },
                    {
                        $facet: {
                            totalWorkOrders: [{ $count: "count" }],
                            totalInProgress: [
                                { $match: { status: constant.WORK_REQUEST_STATUS.IN_PROGRESS.value } },
                                { $count: "count" }
                            ],
                            totalCompleted: [
                                { $match: { status: constant.WORK_REQUEST_STATUS.COMPLETED.value } },
                                { $count: "count" }
                            ],
                            totalOverdue: [
                                { $match: { status: constant.WORK_REQUEST_STATUS.OVERDUE.value } },
                                { $count: "count" }
                            ],
                            totalPending: [
                                { $match: { status: constant.WORK_REQUEST_STATUS.PENDING.value } },
                                { $count: "count" }
                            ]
                        }
                    }
                ]),
                // Đếm số lượng kỹ thuật viên (Thường không bị ảnh hưởng bởi bộ lọc ngày của phiếu)
                TechnicianModel.countDocuments(),
                // Đếm số lượng khách hàng (Thường không bị ảnh hưởng bởi bộ lọc ngày của phiếu)
                ContactPersonCustomerModel.countDocuments()
            ]);

            // 3. Bóc tách dữ liệu từ mảng kết quả Aggregation Facet
            const stats = workOrderStats[0] || {};

            const totalWorkOrders = stats.totalWorkOrders[0]?.count || 0;
            const totalInProgress = stats.totalInProgress[0]?.count || 0;
            const totalCompleted = stats.totalCompleted[0]?.count || 0;
            const totalOverdue = stats.totalOverdue[0]?.count || 0;
            const totalPending = stats.totalPending[0]?.count || 0;

            return {
                totalWorkOrders,
                totalInProgress,
                totalCompleted,
                totalOverdue,
                totalPending,
                technician: totalTechnicians,
                customers: totalCustomers
            };

        } catch (error) {
            throw error;
        }
    },
    // getAll: async (reqUserId, query) => {
    //     try {
    //         let { limit = 10, page = 1, search = '', status, typeWork, startTime, endTime, history, address, typeHistory } = query
    //         limit = Number(limit)
    //         page = Number(page)
    //         search = new RegExp(search, 'i')
    //         address = new RegExp(address, 'i')

    //         const technician = await TechnicianModel.findById(reqUserId)
    //         const customers = await CustomerModel.find({ officialName: search })
    //         const customerIds = customers ? customers.map((c) => c._id) : []
    //         let conditions = {};
    //         if (history == undefined) {
    //             conditions = {
    //                 $or: [
    //                     { code: search },
    //                     { header: search },
    //                     { customerId: { $in: customerIds } },
    //                 ],
    //                 ...(status ? { status } : {}),
    //                 ...(typeWork ? { typeWork } : {}),
    //                 ...(technician ? { technicianId: reqUserId } : {}),
    //                 ...(startTime && endTime ? {
    //                     createdAt: {
    //                         $gte: startTime,
    //                         $lte: endTime
    //                     }
    //                 } : {}),
    //             }
    //         } else {
    //             history = new RegExp(history, 'i')

    //             if (typeHistory == 'serialNumber') {
    //                 conditions = {
    //                     ...(history ? { serialNumber: history } : {}),
    //                 }
    //             } else {
    //                 const customers = await CustomerModel.find({ officialName: history }).select({ _id: 1 })
    //                 const customerIds = customers.map(c => c._id);
    //                 const contacts = await ContactPersonCustomerModel.find({
    //                     customerId: { $in: customerIds },
    //                     address: {
    //                         $elemMatch: {
    //                             $or: [
    //                                 { provinceCity: address },
    //                                 { ward: address },
    //                                 { specificAddress: address }
    //                             ]
    //                         }
    //                     }
    //                 })
    //                     .populate('customerId', 'officialName billingAddress')
    //                     .select({ customerId: 1, devices: 1 }).lean();

    //                 const productCodes = contacts.flatMap(c => c.devices.flatMap(device => device.productCode) || []);
    //                 const products = await ProductModel.find({ code: { $in: productCodes } }).select({ name: 1, code: 1 })
    //                 const productMap = new Map(products.map(p => [String(p.code), p]));

    //                 for (const contact of contacts) {
    //                     const devices = contact.devices;
    //                     for (const device of devices) {
    //                         const matchedProduct = productMap.get(String(device.productCode));
    //                         if (matchedProduct) {
    //                             device.machineName = matchedProduct.name
    //                         }
    //                     }
    //                 }

    //                 //========= THỐNG KÊ ========
    //                 const uniqueCustomerIds = new Set(contacts.map(c => String(c.customerId?._id || c.customerId)));
    //                 const totalCustomers = uniqueCustomerIds.size;

    //                 let totalDevices = 0;
    //                 const deviceSummaryMap = {};

    //                 contacts.forEach(contact => {
    //                     if (contact.devices && Array.isArray(contact.devices)) {
    //                         contact.devices.forEach(device => {
    //                             totalDevices++;
    //                             const code = device.productCode;
    //                             const name = device.machineName || "Chưa xác định";

    //                             if (!deviceSummaryMap[code]) {
    //                                 deviceSummaryMap[code] = {
    //                                     productCode: code,
    //                                     machineName: name,
    //                                     quantity: 0
    //                                 };
    //                             }
    //                             deviceSummaryMap[code].quantity += 1;
    //                         });
    //                     }
    //                 });

    //                 return {
    //                     statistics: {
    //                         totalCustomers,
    //                         totalDevices,
    //                         deviceDetails: Object.values(deviceSummaryMap)
    //                     },
    //                     data: contacts
    //                 };

    //                 return contacts

    //                 // const customers = await CustomerModel.find({ officialName: history }).select({ _id: 1, officialName: 1 })
    //                 // const customerIds = customers.map(c => c._id);
    //                 // const contacts = await ContactPersonCustomerModel.find({ customerId: { $in: customerIds } });
    //                 // const productCodes = contacts.flatMap(c => c.productCode || []);


    //                 // conditions = {
    //                 //     $or: [
    //                 //         { customerId: { $in: customerIds } },
    //                 //         { productCode: { $in: productCodes } }
    //                 //     ]
    //                 // };
    //             }
    //         }
    //         const [workOrders, totalItems] = await Promise.all([
    //             WorkOrderModel.find(conditions)
    //                 .sort({ createdAt: -1 })
    //                 .skip((page - 1) * limit)
    //                 .limit(limit)
    //                 .populate(
    //                     'customerId',
    //                     'officialName representative.name phone email',
    //                 )
    //                 .populate('technicianId', 'fullname')
    //                 .lean(),
    //             WorkOrderModel.countDocuments(conditions),
    //         ])

    //         let fullAddress = ''
    //         const result = workOrders.map((order) => {
    //             let technicianInfo = null
    //             if (order.technicianId) {
    //                 technicianInfo = {
    //                     technicianId: order.technicianId._id,
    //                     fullname: order.technicianId.fullname,
    //                 }
    //             }
    //             if (history) {
    //                 const address = order?.address
    //                 if (address?.specificAddress != null) {
    //                     fullAddress = `${address?.specificAddress} ${address?.ward} ${address?.provinceCity}`
    //                 }
    //                 else {
    //                     fullAddress = ''
    //                 }
    //             }


    //             return {
    //                 ...order,
    //                 technicianInfo,
    //                 technicianId: undefined,
    //                 fullAddress
    //             }
    //         })
    //         return {
    //             result,
    //             totalItems,
    //             page,
    //             totalPage: Math.ceil(totalItems / limit),
    //         }
    //     } catch (error) {
    //         throw error
    //     }
    // },
    getAll: async (reqUserId, query) => {
        try {

            let { limit = 10, page = 1, search = '', status, typeWork, startTime, endTime, history = '', address = '', typeHistory } = query;
            limit = Number(limit);
            page = Number(page);
            const skip = (page - 1) * limit;

            // 2. LÀM SẠCH DỮ LIỆU (Sanitize) 

            const searchStr = search.trim();
            const historyStr = history.trim();
            const addressStr = address.trim();

            // Chỉ tạo Regex khi thực sự có chuỗi ký tự (Truthy)
            const searchRegex = searchStr ? new RegExp(searchStr, 'i') : null;
            const historyRegex = historyStr ? new RegExp(historyStr, 'i') : null;
            const addressRegex = addressStr ? new RegExp(addressStr, 'i') : null;


            if (!historyStr) {
                let conditions = {};

                // Chạy SONG SONG việc lấy Technician và Customer 

                const [technician, customers] = await Promise.all([
                    TechnicianModel.findById(reqUserId).select('_id').lean(),
                    searchRegex ? CustomerModel.find({ officialName: searchRegex }).select('_id').lean() : Promise.resolve([])
                ]);


                if (searchRegex) {
                    const customerIds = customers.map(c => c._id);
                    conditions.$or = [
                        { code: searchRegex },
                        { header: searchRegex },
                        { customerId: { $in: customerIds } },
                    ];
                }

                // Gắn các điều kiện tĩnh
                if (status) conditions.status = status;
                if (typeWork) conditions.typeWork = typeWork;
                if (technician) conditions.technicianId = reqUserId;
                if (startTime && endTime) {
                    conditions.createdAt = { $gte: startTime, $lte: endTime };
                }

                // Chạy song song Query lấy Data và Query đếm tổng số dòng
                const [workOrders, totalItems] = await Promise.all([
                    WorkOrderModel.find(conditions)
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .populate('customerId', 'officialName representative.name phone email')
                        .populate('technicianId', 'fullname')
                        .lean(), // Trả về POJO (Plain Object) để tối ưu RAM
                    WorkOrderModel.countDocuments(conditions),
                ]);

                const result = workOrders.map((order) => {

                    let fullAddress = '';



                    return {
                        ...order,
                        technicianInfo: order.technicianId ? {
                            technicianId: order.technicianId._id,
                            fullname: order.technicianId.fullname,
                        } : null,
                        technicianId: undefined,
                        fullAddress
                    };
                });

                return {
                    result,
                    totalItems,
                    page,
                    totalPage: Math.ceil(totalItems / limit)
                };
            }


            else {
                let contactConditions = {};

                if (typeHistory === 'serialNumber') {
                    if (historyRegex) contactConditions.serialNumber = historyRegex;
                } else {
                    const customers = await CustomerModel.find({ officialName: historyRegex }).select('_id').lean();
                    const customerIds = customers.map(c => c._id);

                    contactConditions.customerId = { $in: customerIds };

                    // Áp dụng Regex rẽ nhánh an toàn cho địa chỉ
                    if (addressRegex) {
                        contactConditions.address = {
                            $elemMatch: {
                                $or: [
                                    { provinceCity: addressRegex },
                                    { ward: addressRegex },
                                    { specificAddress: addressRegex }
                                ]
                            }
                        };
                    }

                    // Gắn Phân trang (.skip, .limit) để chống sập RAM khi data phình to
                    const [contacts, totalContacts] = await Promise.all([
                        ContactPersonCustomerModel.find(contactConditions)
                            .populate('customerId', 'officialName billingAddress')
                            .select('customerId devices')
                            .skip(skip)
                            .limit(limit)
                            .lean(),
                        ContactPersonCustomerModel.countDocuments(contactConditions)
                    ]);

                    // Kỹ thuật Map Product ID để tránh query n+1 trong vòng lặp
                    const productCodes = contacts.flatMap(c => c.devices?.map(d => d.productCode) || []);
                    const products = await ProductModel.find({ code: { $in: productCodes } }).select('name code').lean();
                    const productMap = new Map(products.map(p => [String(p.code), p.name]));

                    let totalDevices = 0;
                    const deviceSummaryMap = {};

                    // Gộp tính toán thiết bị vào chung 1 vòng lặp (O(n))
                    contacts.forEach(contact => {
                        if (!contact.devices || !Array.isArray(contact.devices)) return;

                        contact.devices.forEach(device => {
                            const codeStr = String(device.productCode);
                            device.machineName = productMap.get(codeStr) || "Chưa xác định";

                            totalDevices++;
                            if (!deviceSummaryMap[codeStr]) {
                                deviceSummaryMap[codeStr] = {
                                    productCode: device.productCode,
                                    machineName: device.machineName,
                                    quantity: 0
                                };
                            }
                            deviceSummaryMap[codeStr].quantity += 1;
                        });
                    });

                    const uniqueCustomerIds = new Set(contacts.map(c => String(c.customerId?._id || c.customerId)));

                    return {
                        statistics: {
                            totalCustomers: uniqueCustomerIds.size,
                            totalDevices,
                            deviceDetails: Object.values(deviceSummaryMap)
                        },
                        data: contacts,
                        totalItems: totalContacts,
                        page,
                        totalPage: Math.ceil(totalContacts / limit)
                    };
                }
            }
        } catch (error) {
            throw error;
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
                note,
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
                serialNumber,
                detailType
            } = reqData

            const customer = await CustomerModel.findById(customerId)
            if (!customer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }
            const technician = await TechnicianModel.findOne({
                _id: technicianId,
                isActive: true,
            })

            if (!technician) {
                throw new BadReq({
                    code: 1,
                    message: 'Vui lòng chọn kỹ thuật viên',
                },)
                return;
            }

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
                note,
                description,
                priority,
                contactPerson: { contactName, contactPhone, contactEmail },
                estimatedTime,
                overDueTime,
                type, //Loại máy
                detailType,
                serialNumber,
                address,
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

            //TẠO THÔNG TIN KHÁCH HÀNG VÀO BẢNG CONTACTPERSONCUSTOMER
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
                note,
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
                detailType
            } = reqData

            const checkWorkOrder = await WorkOrderModel.findById(workOrderId)
            if (!checkWorkOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }

            const technician = await TechnicianModel.findOne({
                _id: technicianId,
                isActive: true,
            })

            if (technicianId && !technician) {
                throw new BadReq(errorCode.TECHNICIAN_NOT_FOUND)
            }

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
                detailType,
                requestSource,
                note,
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

                // Update trạng thái KTV
                // await technicianService.checkStatusTechnical(checkWorkOrder?.technicianId)
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

    getAllProvinces: async () => {
        const api = "https://provinces.open-api.vn/api/v2/p/";
        try {
            const response = await fetch(api);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch provinces:", error);
        }
    },
    getAllWards: async (query) => {
        const { code } = query
        const api = `https://provinces.open-api.vn/api/v2/w/?province=${code}`;
        try {
            const response = await fetch(api);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch provinces:", error);
        }
    },

    getAllState: () => Object.values(constant.WORK_REQUEST_STATUS),
    getAllPriority: () => Object.values(constant.WORK_REQUEST_PRIORITY),
    getAllWorkType: () => Object.values(constant.WORK_ORDER_TYPE),
    getAllType: () => Object.values(constant.WORK_ORDER_DETAIL_TYPE),
    getAllWorkRequestSource: () => Object.values(constant.WORK_REQUEST_SOURCE),
}

module.exports = workOrderService
