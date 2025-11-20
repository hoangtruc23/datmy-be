const ContactPersonCustomerModel = require('../models/contactPersonCustomer')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode.js')
const CustomerModel = require('../models/customer')

const contactPersonCustomerService = {
    create: async (reqData) => {
        try {
            const {
                customerId,
                contactName,
                contactPhone,
                contactEmail,
                address,
            } = reqData
            const customer = await CustomerModel.findById(customerId)
            if (!customer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }
            const record = await ContactPersonCustomerModel.findOne({
                customerId,
            })
            if (!record) {
                await ContactPersonCustomerModel.create({
                    customerId,
                    contactPerson: [
                        { contactName, contactEmail, contactPhone },
                    ],
                    address: [address],
                })
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
                const existedAddress = record.address.some((r) => r === address)
                if (!existedAddress) {
                    await ContactPersonCustomerModel.findByIdAndUpdate(
                        record._id,
                        { $push: { address: address } },
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
            }).lean()
            return record ? record.address.filter((a) => search.test(a)) : []
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
    deleteAddress: async (customerId, reqData) => {
        try {
            const { address } = reqData
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

            const existed = record.address.some((a) => a === address)

            if (!existed) {
                throw new BadReq(errorCode.CONTACT_PERSON_NOT_FOUND)
            }

            await ContactPersonCustomerModel.findByIdAndUpdate(record._id, {
                $pull: { address: address },
            })

            return null
        } catch (error) {
            throw error
        }
    },
}
module.exports = contactPersonCustomerService
