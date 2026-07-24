const ContactPersonCustomerModel = require('../models/contactPersonCustomer')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode.js')
const CustomerModel = require('../models/customer')
const { Types } = require('mongoose')
const WorkOrderModel = require('../models/workOrder.js')

const contactPersonCustomerService = {
    create: async (reqData, typeAction) => {
        try {
            const {
                customerId,
                contactName,
                contactPhone,
                contactEmail,
                provinceCity,
                ward,
                specificAddress,
                productCode,
                serialNumber
            } = reqData

            const customer = await CustomerModel.findById(customerId)
            if (!customer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }
            const record = await ContactPersonCustomerModel.findOne({
                customerId,
            })

            // 1. Kiểm tra xem thông tin contact có hợp lệ hay không (không trống, không chỉ chứa dấu cách)
            const hasContactName = contactName && contactName.trim() !== "";
            const hasContactPhone = contactPhone && contactPhone.trim() !== "";
            const hasContactEmail = contactEmail && contactEmail.trim() !== "";
            const isValidContact = hasContactName || hasContactPhone || hasContactEmail;

            if (!record) {
                const recordData = {
                    customerId,
                    contactPerson: isValidContact ? [{
                        contactName: contactName?.trim() || "",
                        contactEmail: contactEmail?.trim() || "",
                        contactPhone: contactPhone?.trim() || ""
                    }] : [],
                    devices: []
                }

                if (productCode && productCode.trim() !== "") {
                    recordData.devices.push({
                        productCode: productCode.trim(),
                        serialNumber: (serialNumber || "").trim(),
                        installDate: reqData.installDate ? new Date(reqData.installDate) : null,
                        isActive: true
                    })
                }

                if (provinceCity != null && ward != null && specificAddress != null) {
                    if (provinceCity != "" && ward !== "" && specificAddress != "") {
                        recordData.address = [{
                            provinceCity,
                            ward,
                            specificAddress,
                        }]
                    }
                }

                await ContactPersonCustomerModel.create(recordData)
            } else {
                //-----XỬ LÝ THÔNG TIN LIÊN HỆ
                // Chỉ xử lý nếu dữ liệu truyền lên có ít nhất 1 thông tin hợp lệ
                if (isValidContact) {
                    const existedPerson = record.contactPerson.some(
                        (r) =>
                            (r?.contactName || "").trim() === (contactName || "").trim() &&
                            (r?.contactEmail || "").trim() === (contactEmail || "").trim() &&
                            (r?.contactPhone || "").trim() === (contactPhone || "").trim()
                    )

                    if (!existedPerson) {
                        await ContactPersonCustomerModel.findByIdAndUpdate(
                            record._id,
                            {
                                $push: {
                                    contactPerson: {
                                        contactName: contactName?.trim() || "",
                                        contactEmail: contactEmail?.trim() || "",
                                        contactPhone: contactPhone?.trim() || "",
                                    },
                                },
                            }
                        )
                    }
                }

                //-----XỬ LÝ ĐỊA CHỈ
                const existedAddress = record.address.find((a) => a.specificAddress == specificAddress && a.ward === ward && a.provinceCity === provinceCity)
                if (!existedAddress &&
                    (provinceCity != null && ward != null && specificAddress != null)
                ) {
                    await ContactPersonCustomerModel.findByIdAndUpdate(
                        record._id,
                        {
                            $push: {
                                address: {
                                    provinceCity,
                                    ward,
                                    specificAddress,
                                },
                            },

                        },
                    )
                }

                //-----XỬ LÝ MÃ SẢN PHẨM (DEVICES)
                if (productCode && productCode.trim() !== "") {
                    const normProductCode = productCode.trim();
                    const normSerialNumber = (serialNumber || "").trim();
                    const normOldSerialNumber = (reqData.oldSerialNumber || "").trim();

                    if (typeAction === 'installation') {
                        // For installation, we want to add the device.
                        // To avoid duplicates, let's first check if this exact productCode and serialNumber already exists.
                        const exactMatch = record.devices.find(
                            (d) =>
                                d.productCode === normProductCode &&
                                (d.serialNumber || "").trim() === normSerialNumber
                        );
                        if (exactMatch) {
                            if (!exactMatch.isActive) {
                                await ContactPersonCustomerModel.findOneAndUpdate(
                                    { _id: record._id, "devices._id": exactMatch._id },
                                    { $set: { "devices.$.isActive": true } }
                                );
                            }
                        } else {
                            await ContactPersonCustomerModel.findByIdAndUpdate(
                                record._id,
                                {
                                    $push: {
                                        devices: {
                                            productCode: normProductCode,
                                            serialNumber: normSerialNumber,
                                            isActive: true
                                        }
                                    },
                                }
                            );
                        }
                    } else if (typeAction === 'update') {
                        // Update action: We want to update an existing device's serial number.
                        let deviceToUpdate = null;
                        if (normOldSerialNumber !== "") {
                            deviceToUpdate = record.devices.find(
                                (d) =>
                                    d.productCode === normProductCode &&
                                    (d.serialNumber || "").trim() === normOldSerialNumber
                            );
                        }

                        // If not found by oldSerialNumber, or oldSerialNumber was empty, let's check if there is a device with empty serial number.
                        if (!deviceToUpdate) {
                            deviceToUpdate = record.devices.find(
                                (d) =>
                                    d.productCode === normProductCode &&
                                    (!d.serialNumber || d.serialNumber.trim() === "")
                            );
                        }

                        if (deviceToUpdate) {
                            // Update the found device
                            await ContactPersonCustomerModel.findOneAndUpdate(
                                { _id: record._id, "devices._id": deviceToUpdate._id },
                                {
                                    $set: {
                                        "devices.$.serialNumber": normSerialNumber,
                                        "devices.$.isActive": true
                                    }
                                }
                            );
                        } else {
                            // If no matching device to update was found, push it as a new device if exact combination doesn't exist yet.
                            const exactMatch = record.devices.find(
                                (d) =>
                                    d.productCode === normProductCode &&
                                    (d.serialNumber || "").trim() === normSerialNumber
                            );
                            if (!exactMatch) {
                                await ContactPersonCustomerModel.findByIdAndUpdate(
                                    record._id,
                                    {
                                        $push: {
                                            devices: {
                                                productCode: normProductCode,
                                                serialNumber: normSerialNumber,
                                                isActive: true
                                            }
                                        }
                                    }
                                );
                            } else if (!exactMatch.isActive) {
                                await ContactPersonCustomerModel.findOneAndUpdate(
                                    { _id: record._id, "devices._id": exactMatch._id },
                                    { $set: { "devices.$.isActive": true } }
                                );
                            }
                        }
                    } else {
                        // Default action (creating a ticket / generic check):
                        // Check if exact match exists.
                        const exactMatch = record.devices.find(
                            (d) =>
                                d.productCode === normProductCode &&
                                (d.serialNumber || "").trim() === normSerialNumber
                        );

                        if (exactMatch) {
                            if (!exactMatch.isActive) {
                                await ContactPersonCustomerModel.findOneAndUpdate(
                                    { _id: record._id, "devices._id": exactMatch._id },
                                    { $set: { "devices.$.isActive": true } }
                                );
                            }
                        } else {
                            // No exact match found.
                            if (normSerialNumber !== "") {
                                // Ticket has serial number. Check for empty slot to update.
                                const emptySlot = record.devices.find(
                                    (d) =>
                                        d.productCode === normProductCode &&
                                        (!d.serialNumber || d.serialNumber.trim() === "")
                                );

                                if (emptySlot) {
                                    await ContactPersonCustomerModel.findOneAndUpdate(
                                        { _id: record._id, "devices._id": emptySlot._id },
                                        {
                                            $set: {
                                                "devices.$.serialNumber": normSerialNumber,
                                                "devices.$.isActive": true
                                            }
                                        }
                                    );
                                } else {
                                    // No empty slot. Push new device.
                                    await ContactPersonCustomerModel.findByIdAndUpdate(
                                        record._id,
                                        {
                                            $push: {
                                                devices: {
                                                    productCode: normProductCode,
                                                    serialNumber: normSerialNumber,
                                                    isActive: true
                                                }
                                            }
                                        }
                                    );
                                }
                            } else {
                                // Ticket has no serial number. Check if they have ANY device with this productCode.
                                const hasAnyDevice = record.devices.some(
                                    (d) => d.productCode === normProductCode
                                );
                                if (!hasAnyDevice) {
                                    await ContactPersonCustomerModel.findByIdAndUpdate(
                                        record._id,
                                        {
                                            $push: {
                                                devices: {
                                                    productCode: normProductCode,
                                                    serialNumber: "",
                                                    isActive: true
                                                }
                                            }
                                        }
                                    );
                                }
                            }
                        }
                    }
                }
            }
            return null
        } catch (error) {
            throw error
        }
    },
    getAllPerson: async (customerId, query) => {
        try {
            const customer = await CustomerModel.findById(customerId)
            if (!customer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }
            let { search } = query
            search = new RegExp(search, 'i')
            const record = await ContactPersonCustomerModel.findOne({
                customerId,
            }).lean()

            return record
                ? record.contactPerson?.filter((c) => search.test(c.contactName))
                : []
        } catch (error) {
            throw error
        }
    },
    getAllAddress: async (customerId, query) => {
        try {
            const customer = await CustomerModel.findById(customerId)
            if (!customer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }
            let { search } = query
            search = new RegExp(search, 'i')
            const record = await ContactPersonCustomerModel.findOne({
                customerId,
            }).populate('customerId', 'deliveryAddresses').lean()
            if (record?.address.length > 0) {
                return record ? record?.address.filter((a) => search.test(a)) : []
            } else {
                const deliveryAddresses = customer?.deliveryAddresses
                let result = []

                deliveryAddresses && deliveryAddresses.map((address) => {
                    result.push({
                        specificAddress: address.street,
                        ward: address.ward,
                        provinceCity: address.city,
                    }
                    )

                })
                return result
            }
        } catch (error) {
            throw error
        }
    },
    getAddressesByFilter: async (filterData) => {
        try {
            const { provinceCity, ward, specificAddress } = filterData;

            // 1. Tự động xây dựng điều kiện lọc (Chỉ lấy các trường có dữ liệu hợp lệ)
            const matchCondition = {};

            if (provinceCity && provinceCity.trim() !== "") {
                matchCondition["address.provinceCity"] = { $regex: new RegExp(`^${provinceCity.trim()}$`, 'i') };
            }

            if (ward && ward.trim() !== "") {
                matchCondition["address.ward"] = { $regex: new RegExp(`^${ward.trim()}$`, 'i') };
            }

            if (specificAddress && specificAddress.trim() !== "") {
                matchCondition["address.specificAddress"] = { $regex: new RegExp(specificAddress.trim(), 'i') };
            }

            // 2. Thực hiện Aggregation Pipeline
            const pipeline = [];

            // Bước 1: $match trước khi unwind để lọc bớt các document không liên quan (Tối ưu performance)
            if (Object.keys(matchCondition).length > 0) {
                pipeline.push({ $match: matchCondition });
            }

            // Bước 2: Phẳng hóa mảng address
            pipeline.push({ $unwind: "$address" });

            // Bước 3: $match lại lần 2 để loại bỏ các địa chỉ không khớp trong mảng
            if (Object.keys(matchCondition).length > 0) {
                pipeline.push({ $match: matchCondition });
            }

            // Bước 4: Nhóm (Group) lại để loại bỏ trùng lặp địa chỉ giống nhau
            pipeline.push({
                $group: {
                    _id: {
                        provinceCity: "$address.provinceCity",
                        ward: "$address.ward",
                        specificAddress: "$address.specificAddress"
                    },
                    // Nếu bạn vẫn muốn giữ lại danh sách các customerId thuộc địa chỉ này (tùy chọn)
                    customerIds: { $addToSet: "$customerId" }
                }
            });

            // Bước 5: Định dạng lại dữ liệu đầu ra cho gọn đẹp
            pipeline.push({
                $project: {
                    _id: 0,
                    provinceCity: "$_id.provinceCity",
                    ward: "$_id.ward",
                    specificAddress: "$_id.specificAddress",
                    customerIds: 1
                }
            });

            const result = await ContactPersonCustomerModel.aggregate(pipeline);
            return result;

        } catch (error) {
            console.error("Lỗi khi tìm kiếm địa chỉ:", error);
            throw error;
        }
    },
    deletePerson: async (customerId, reqData) => {
        try {
            const { contactName, contactPhone, contactEmail } = reqData
            const customer = await CustomerModel.findById(customerId)
            if (!customer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }

            const record = await ContactPersonCustomerModel.findOne({
                customerId,
            }).lean()
            if (!record) {
                throw new BadReq(errorCode.CONTACT_PERSON_NOT_FOUND)
            }

            const existed = record.contactPerson.some(
                (c) =>
                    c.contactName === contactName &&
                    c.contactEmail === contactEmail &&
                    c.contactPhone === contactPhone,
            )

            if (!existed) {
                throw new BadReq(errorCode.CONTACT_PERSON_NOT_FOUND)
            }

            await ContactPersonCustomerModel.findByIdAndUpdate(record._id, {
                $pull: {
                    contactPerson: {
                        contactName,
                        contactPhone,
                        contactEmail,
                    },
                },
            })

            return null
        } catch (error) {
            throw error
        }
    },
    deleteAddress: async (customerId, reqData) => {
        try {
            const { addressId } = reqData
            const customer = await CustomerModel.findById(customerId)
            if (!customer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }

            const record = await ContactPersonCustomerModel.findOne({
                customerId,
            }).lean()
            if (!record) {
                throw new BadReq(errorCode.CONTACT_PERSON_NOT_FOUND)
            }

            const workOrder = await WorkOrderModel.findOne({ customerId })

            if (workOrder.address) {
                const checkAddress = record?.address.find((add) => add._id == addressId)
                if (checkAddress?.specificAddress == workOrder?.address?.specificAddress) {
                    await WorkOrderModel.findOneAndUpdate({ customerId }, { address: { specificAddress: null, ward: null, provinceCity: null } })
                }
            }

            if (record?.address.length > 0) {
                await ContactPersonCustomerModel.findOneAndUpdate(
                    { customerId },
                    {
                        $pull: {
                            address: { _id: new Types.ObjectId(addressId) }
                        }
                    },
                )
            }

            return null
        } catch (error) {
            throw error
        }
    },
    getSerialNumber: async (params, query) => {
        try {
            const { customerId } = params
            const { productCode } = query
            const contact = await ContactPersonCustomerModel.findOne({ customerId })
            let result = []
            if (contact) {
                for (let device of contact?.devices) {
                    if (device.productCode == productCode) {
                        result.push(device.serialNumber)
                    }
                }
            }
            return result
        } catch (error) {
            throw error
        }
    },
    deleteMachine: async (params, query) => {
        try {
            const { customerId } = params
            const { machineId } = query

            const customer = await CustomerModel.findById(customerId)
            if (!customer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }

            const record = await ContactPersonCustomerModel.findOne({ customerId })
            if (!record) {
                throw new BadReq(errorCode.CONTACT_PERSON_NOT_FOUND)
            }

            const workOrder = await WorkOrderModel.findOne({ customerId })

            if (workOrder.type) {
                const checkType = record?.devices.find((type) => type._id == machineId)
                if (checkType?.productCode == workOrder?.type?.specificAddress) {
                    await WorkOrderModel.findOneAndUpdate({ customerId }, { type: null })
                }
            }

            if (machineId) {
                await ContactPersonCustomerModel.findOneAndUpdate(
                    { customerId },
                    {
                        $set: { "devices.$[elem].isActive": false }
                    },
                    {
                        arrayFilters: [{ "elem._id": new Types.ObjectId(machineId) }],
                        new: true
                    }
                    // {
                    //     $pull: {
                    //         devices: { _id: new Types.ObjectId(machineId) }
                    //     }
                    // },
                )
            }

            return null
        } catch (error) {
            throw error
        }
    },
    addMachine: async (customerId, reqData) => {
        try {
            console.log(reqData)

            let devices;
            // Nếu reqData bản chất đã là một mảng sẵn rồi
            if (Array.isArray(reqData)) {
                devices = reqData;
            }
            // Nếu reqData là Object chứa key devices bên trong: { devices: [...] }
            else if (reqData && reqData.devices) {
                devices = reqData.devices;
            }
            // Nếu reqData chỉ là 1 Object thiết bị lẻ duy nhất: { productCode: 'A100', ... }
            else if (reqData && reqData.productCode) {
                devices = [reqData];
            }

            console.log("Devices sau khi xử lý:", devices)

            // Kiểm tra tính hợp lệ của mảng devices
            if (!devices || !Array.isArray(devices) || devices.length === 0) {
                throw new BadReq({
                    code: 1,
                    message: 'Danh sách thiết bị (devices) không hợp lệ hoặc trống'
                })
            }

            // --- Giữ nguyên các logic validate và lưu DB tối ưu (dùng .save() ở trên) ---
            const validContractTypes = ['rent', 'buy', 'demo'];
            for (const item of devices) {
                if (!item.productCode || item.productCode.trim() === "") {
                    throw new BadReq({
                        code: 1,
                        message: 'Mã máy (productCode) của thiết bị không được để trống'
                    })
                }
                if (item.contractType && item.contractType.trim() !== "") {
                    const normType = item.contractType.trim().toLowerCase();
                    if (!validContractTypes.includes(normType)) {
                        throw new BadReq({
                            code: 1,
                            message: `Loại hợp đồng (contractType) không hợp lệ. Phải là một trong: ${validContractTypes.join(', ')}`
                        })
                    }
                }
            }

            const customer = await CustomerModel.findById(customerId)
            if (!customer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }

            let record = await ContactPersonCustomerModel.findOne({ customerId })

            if (!record) {
                const newDevices = devices.map(item => ({
                    productCode: item.productCode.trim(),
                    serialNumber: (item.serialNumber || "").trim(),
                    contractType: item.contractType ? item.contractType.trim().toLowerCase() : "",
                    installDate: item.installDate ? new Date(item.installDate) : null,
                    isActive: true
                }))

                const recordData = {
                    customerId,
                    contactPerson: [],
                    devices: newDevices,
                    address: []
                }
                await ContactPersonCustomerModel.create(recordData)
            } else {
                for (const item of devices) {
                    const normProductCode = item.productCode.trim()
                    const normSerialNumber = (item.serialNumber || "").trim()
                    const normContractType = item.contractType ? item.contractType.trim().toLowerCase() : ""

                    const exactMatch = record.devices.find(
                        (d) =>
                            d.productCode === normProductCode &&
                            (d.serialNumber || "").trim() === normSerialNumber
                    )

                    if (exactMatch) {
                        exactMatch.contractType = normContractType
                        if (item.installDate) {
                            exactMatch.installDate = new Date(item.installDate)
                        }
                        exactMatch.isActive = true
                    } else {
                        record.devices.push({
                            productCode: normProductCode,
                            serialNumber: normSerialNumber,
                            contractType: normContractType,
                            installDate: item.installDate ? new Date(item.installDate) : null,
                            isActive: true
                        })
                    }
                }
                await record.save()
            }

            return null
        } catch (error) {
            throw error
        }
    },
    // updateFilterChangeStatus: async (customerId, serialNumber, productCode, reqData) => {
    //     try {
    //         const { replacement, inkjetTime, dateOfChange } = reqData

    //         // Normalize productCode & serialNumber
    //         const normProductCode = productCode ? productCode.trim() : ""
    //         const normSerialNumber = serialNumber ? serialNumber.trim() : ""

    //         // Only run if productCode starts with "A" (machine modelA)
    //         if (!normProductCode.startsWith("A")) return;

    //         const record = await ContactPersonCustomerModel.findOne({ customerId })
    //         if (!record) return;

    //         // Find matching device
    //         const device = record.devices.find(
    //             (d) =>
    //                 d.productCode === normProductCode &&
    //                 (d.serialNumber || "").trim() === normSerialNumber
    //         )

    //         if (!device) return;

    //         let updatedFields = {}

    //         // Check if replacement contains "đầu lọc"
    //         let hasFilterChange = false
    //         if (replacement && Array.isArray(replacement)) {
    //             hasFilterChange = replacement.some(item => /đầu lọc|dau loc/i.test(item))
    //         }

    //         const inkTime = Number(inkjetTime)
    //         if (!isNaN(inkTime) && inkTime > 0) {
    //             updatedFields["devices.$[elem].currentInkjetTime"] = inkTime

    //             if (hasFilterChange) {
    //                 updatedFields["devices.$[elem].lastFilterChangeDate"] = dateOfChange || new Date()
    //                 updatedFields["devices.$[elem].lastFilterChangeInkjetTime"] = inkTime
    //                 updatedFields["devices.$[elem].warningReplaceFilter"] = false
    //             } else {
    //                 // Calculate warning based on current inkjetTime and existing lastFilterChangeInkjetTime
    //                 const lastInkTime = device.lastFilterChangeInkjetTime || 0
    //                 if (inkTime - lastInkTime >= 2000) {
    //                     updatedFields["devices.$[elem].warningReplaceFilter"] = true
    //                 } else {
    //                     updatedFields["devices.$[elem].warningReplaceFilter"] = false
    //                 }
    //             }

    //             await ContactPersonCustomerModel.findOneAndUpdate(
    //                 { customerId },
    //                 { $set: updatedFields },
    //                 {
    //                     arrayFilters: [{ "elem._id": device._id }],
    //                     new: true
    //                 }
    //             )
    //         }
    //     } catch (error) {
    //         console.error("Error in updateFilterChangeStatus:", error)
    //     }
    // }
}
module.exports = contactPersonCustomerService
