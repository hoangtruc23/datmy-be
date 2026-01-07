const ContactPersonCustomerModel = require('../models/contactPersonCustomer')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode.js')
const CustomerModel = require('../models/customer')

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

            if (!record) {
                const recordData = {
                    customerId,
                    contactPerson: [
                        { contactName, contactEmail, contactPhone },
                    ],
                    devices: { productCode }
                    // productCode,
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
                const existedPerson = record.contactPerson.some(
                    (r) =>
                        r.contactName === contactName &&
                        r.contactEmail === contactEmail &&
                        r.contactPhone === contactPhone,
                )
                if (!existedPerson) {
                    await ContactPersonCustomerModel.findByIdAndUpdate(
                        record._id,
                        {
                            $push: {
                                contactPerson: {
                                    contactName,
                                    contactEmail,
                                    contactPhone,
                                },
                            },
                        },
                    )
                }

                const existedAddress = record.address.find((a) => a.specificAddress == specificAddress)
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
                    console.log("Vô installation")
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
                ? record.contactPerson.filter((c) => search.test(c.contactName))
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
                const deliveryAddresses = record?.customerId?.deliveryAddresses
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
    // deleteAddress: async (customerId, reqData) => {
    //     try {
    //         const { address } = reqData
    //         const customer = await CustomerModel.findById(customerId)
    //         if (!customer) {
    //             throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
    //         }

    //         const record = await ContactPersonCustomerModel.findOne({
    //             customerId,
    //         }).lean()
    //         if (!record) {
    //             throw new BadReq(errorCode.CONTACT_PERSON_NOT_FOUND)
    //         }

    //         const existed = record.address.some((a) => a === address)

    //         if (!existed) {
    //             throw new BadReq(errorCode.CONTACT_PERSON_NOT_FOUND)
    //         }

    //         await ContactPersonCustomerModel.findByIdAndUpdate(record._id, {
    //             $pull: { address: address },
    //         })

    //         return null
    //     } catch (error) {
    //         throw error
    //     }
    // },
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
    }
}
module.exports = contactPersonCustomerService
