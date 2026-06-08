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
                    devices: { productCode }
                }

                if (serialNumber && serialNumber !== "") {
                    recordData.serialNumber = { serialNumber }
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
                //-----XỬ LÝ MÃ SẢN PHẨM
                const checkProductCode = record.devices.find((a) => a.productCode == productCode)
                if (typeAction == 'update' && checkProductCode) {
                    await ContactPersonCustomerModel.findOneAndUpdate(
                        {
                            _id: record._id,
                            "devices._id": checkProductCode._id
                        },
                        {
                            $set: { "devices.$.serialNumber": serialNumber }
                        },
                    )
                }
                else if (typeAction == 'installation') {
                    await ContactPersonCustomerModel.findByIdAndUpdate(
                        record._id,
                        {
                            $push: {
                                devices: { productCode, serialNumber }
                            },
                        },
                    )
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
                // Dùng Regex 'i' để tìm kiếm không phân biệt hoa thường
                matchCondition["address.provinceCity"] = { $regex: new RegExp(`^${provinceCity.trim()}$`, 'i') };
            }

            if (ward && ward.trim() !== "") {
                matchCondition["address.ward"] = { $regex: new RegExp(`^${ward.trim()}$`, 'i') };
            }

            if (specificAddress && specificAddress.trim() !== "") {
                // Đối với địa chỉ cụ thể, dùng regex chứa (gần đúng) sẽ tiện hơn cho user search
                matchCondition["address.specificAddress"] = { $regex: new RegExp(specificAddress.trim(), 'i') };
            }

            // 2. Thực hiện Aggregation Pipeline
            const pipeline = [];

            // Nếu người dùng không truyền bất kỳ điều kiện nào, matchCondition sẽ rỗng {}
            // Ta chỉ $match vòng ngoài nếu có ít nhất 1 điều kiện để tối ưu tốc độ quét dữ liệu
            if (Object.keys(matchCondition).length > 0) {
                pipeline.push({ $match: matchCondition });
            }

            pipeline.push(
                // Phẳng hóa mảng address để lọc chuẩn xác từng phần tử
                { $unwind: "$address" }
            );

            // Bắt buộc phải $match lại lần 2 sau khi unwind để loại bỏ các địa chỉ sai điều kiện
            if (Object.keys(matchCondition).length > 0) {
                pipeline.push({ $match: matchCondition });
            }

            // Định dạng lại dữ liệu đầu ra cho gọn đẹp
            pipeline.push({
                $project: {
                    _id: 0,
                    customerId: 1,
                    addressId: "$address._id",
                    provinceCity: "$address.provinceCity",
                    ward: "$address.ward",
                    specificAddress: "$address.specificAddress"
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
    }
}
module.exports = contactPersonCustomerService
