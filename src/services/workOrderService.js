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
const mailService = require('./mailService')

const sendAssignmentEmail = async (technicianId, workOrderData) => {
    try {

        if (!technicianId) return;
        const technician = await TechnicianModel.findById(technicianId);
        if (!technician || !technician.email) {
            console.log(`No email found for technician ${technicianId}. Skipping assignment email.`);
            return;
        }

        const typeWorkLabels = {
            repair: "Sửa chữa",
            maintenance: "Bảo trì",
            installation: "Lắp đặt",
            testIO: "Test Xuất/Nhập",
            demo: "Demo"
        };


        const typeWorkLabel = typeWorkLabels[workOrderData.typeWork] || workOrderData.typeWork || "Yêu cầu công việc";

        const subject = `[DMC] Phân công công việc mới - ${workOrderData.code}`;
        const html = `
            <p>Xin chào <strong>${technician.fullname}</strong>,</p>
            <p>Bạn đã được phân công một công việc mới trên hệ thống DMC.</p>
            <ul>
                <li><strong>Mã công việc:</strong> ${workOrderData.code}</li>
                <li><strong>Loại công việc:</strong> ${typeWorkLabel}</li>
                <li><strong>Loại máy:</strong> ${workOrderData.type || '-'}</li>
                <li><strong>Liên hệ:</strong> ${workOrderData?.contactPerson?.contactName - workOrderData?.contactPerson?.contactPhone || '-'}</li>
                <li><strong>Mô tả:</strong> ${workOrderData?.description || '-'}</li>

            </ul>
            <p>Vui lòng đăng nhập hệ thống để xem chi tiết công việc.</p>
            <p>Trân trọng,<br>Hệ thống DMC</p>
        `;

        await mailService.sendMailToTechnician(technician.email, subject, html);
    } catch (err) {
        console.error("Failed to send task assignment email:", err);
    }
};

const workOrderService = {
    dashboard: async (query) => {
        try {
            const { fromDate, toDate } = query;
            const matchStage = {};

            // 1. Xử lý khoảng thời gian lọc (createdAt)
            if (fromDate || toDate) {
                matchStage.createdAt = {};
                if (fromDate) matchStage.createdAt.$gte = new Date(`${fromDate}T00:00:00+07:00`);
                if (toDate) matchStage.createdAt.$lte = new Date(`${toDate}T23:59:59+07:00`);
            }

            // 2. Sử dụng Promise.all để chạy song song các bảng khác nhau
            const [workOrderStats, technicianStats] = await Promise.all([
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
                            ],
                            totalUniqueCustomers: [
                                { $group: { _id: "$customerId" } },
                                { $count: "count" }
                            ]
                        }
                    }
                ]),
                // Đếm số lượng kỹ thuật viên (Thường không bị ảnh hưởng bởi bộ lọc ngày của phiếu)
                // TechnicianModel.countDocuments(),
                TechnicianModel.aggregate([
                    {
                        $facet: {
                            total: [{ $count: "count" }],
                            free: [
                                { $match: { status: 'free' } }, // Bạn tự thay hằng số của hệ thống vào đây nhé
                                { $count: "count" }
                            ],
                            working: [
                                { $match: { status: 'working' } }, // Thay bằng constant.TECHNICIAN_STATUS.WORKING... nếu có
                                { $count: "count" }
                            ]
                        }
                    }
                ])
            ]);

            // 3. Bóc tách dữ liệu từ mảng kết quả Aggregation Facet
            const stats = workOrderStats[0] || {};
            const totalWorkOrders = stats.totalWorkOrders[0]?.count || 0;
            const totalInProgress = stats.totalInProgress[0]?.count || 0;
            const totalCompleted = stats.totalCompleted[0]?.count || 0;
            const totalOverdue = stats.totalOverdue[0]?.count || 0;
            const totalPending = stats.totalPending[0]?.count || 0;
            const totalCustomers = stats.totalUniqueCustomers[0]?.count || 0;

            // 4. Bóc tách dữ liệu từ Technician
            const techStats = technicianStats[0] || {};
            const totalTechnicians = techStats.total?.[0]?.count || 0;
            const totalFreeTechnicians = techStats.free?.[0]?.count || 0;
            const totalWorkingTechnicians = techStats.working?.[0]?.count || 0;

            return {
                totalWorkOrders,
                totalInProgress,
                totalCompleted,
                totalOverdue,
                totalPending,
                technician: totalTechnicians,
                freeTechnician: totalFreeTechnicians,
                workingTechnician: totalWorkingTechnicians,
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
            // 1. ĐỔI TÊN BIẾN CHO KHỚP API: startDate, endDate thay vì startTime, endTime
            let { limit = 10, page = 1, search = '', status, typeWork, startDate, endDate, history, address, typeHistory } = query
            limit = Number(limit)
            page = Number(page)
            search = new RegExp(search, 'i')

            const addressRegex = address && typeof address === 'string' && address.trim() !== ''
                ? new RegExp(address.trim(), 'i')
                : null;

            // 2. CHUẨN HÓA ĐIỀU KIỆN LỌC NGÀY THÁNG (Bảo hiểm đầu ngày - cuối ngày)
            let dateFilter = null;
            if (startDate || endDate) {
                dateFilter = {};
                if (startDate) {
                    const start = new Date(startDate);
                    start.setHours(0, 0, 0, 0); // 00:00:00 ngày bắt đầu
                    dateFilter.$gte = start;
                }
                if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999); // 23:59:59 ngày kết thúc
                    dateFilter.$lte = end;
                }
            }

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
                    ...(technician && !technician.isSupervisor ? { technicianId: reqUserId } : {}),
                    // Áp dụng bộ lọc ngày tháng đã chuẩn hóa vào đây
                    ...(dateFilter ? { createdAt: dateFilter } : {}),
                }
            } else {
                history = new RegExp(history, 'i')

                if (typeHistory == 'serialNumber') {
                    conditions = {
                        ...(history ? { serialNumber: history } : {}),
                        // Áp dụng cả lọc ngày nếu tìm theo serialNumber
                        ...(dateFilter ? { createdAt: dateFilter } : {}),
                    }
                } else {
                    const customers = await CustomerModel.find({ officialName: history }).select({ _id: 1 })
                    const customerIds = customers.map(c => c._id);

                    const contacts = await ContactPersonCustomerModel.find({
                        customerId: { $in: customerIds },
                        ...(addressRegex ? {
                            address: {
                                $elemMatch: {
                                    $or: [
                                        { provinceCity: addressRegex },
                                        { ward: addressRegex },
                                        { specificAddress: addressRegex }
                                    ]
                                }
                            }
                        } : {}),
                        ...(dateFilter ? { createdAt: dateFilter } : {}),
                    })
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

                    //========= THỐNG KÊ ========
                    const uniqueCustomerIds = new Set(contacts.map(c => String(c.customerId?._id || c.customerId)));
                    const totalCustomers = uniqueCustomerIds.size;

                    let totalDevices = 0;
                    const deviceSummaryMap = {};


                    contacts.forEach(contact => {
                        if (contact.devices && Array.isArray(contact.devices)) {
                            contact.devices.forEach(device => {
                                totalDevices++;
                                const code = device.productCode;
                                const name = device.machineName || "Chưa xác định";

                                if (!deviceSummaryMap[code]) {
                                    deviceSummaryMap[code] = {
                                        productCode: code,
                                        machineName: name,
                                        quantity: 0
                                    };
                                }
                                deviceSummaryMap[code].quantity += 1;
                            });
                        }
                    });

                    return {
                        statistics: {
                            totalCustomers,
                            totalDevices,
                            deviceDetails: Object.values(deviceSummaryMap)
                        },
                        data: contacts
                    };
                }
            }

            // Thực hiện query WorkOrder chính
            const [workOrders, totalItems] = await Promise.all([
                WorkOrderModel.find(conditions)
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('customerId', 'officialName representative.name phone email')
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
                    } else {
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
            console.log("============", workOrder)
            if (technicianId) {
                //ktv có việc => status = working
                await TechnicianModel.findByIdAndUpdate(technicianId, {
                    status: constant.TECHNICIAN_STATUS.WORKING.value,
                })
                await WorkOrderModel.findByIdAndUpdate(workOrder._id, {
                    assignedTime: new Date(),
                })
                sendAssignmentEmail(technicianId, workOrderData);
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
                oldSerialNumber: checkWorkOrder.serialNumber,
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
            if (technicianId && String(checkWorkOrder.technicianId || '') !== String(technicianId || '')) {
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

                sendAssignmentEmail(
                    technicianId,
                    checkWorkOrder
                );
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
