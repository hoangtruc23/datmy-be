// src/services/customerService.js

const CustomerModel = require('../models/customer')
const UserModel = require('../models/user')
const ProductModel = require('../models/product')
const constant = require('../utils/constant/constant')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')

const customerService = {
    create: async (customerData) => {
        try {
            const existingCustomer = await CustomerModel.findOne({
                code: customerData.code,
            })
            if (existingCustomer) {
                throw new BadReq(errorCode.CUSTOMER_CODE_EXISTED)
            }
            const newCustomer = await CustomerModel.create(customerData)
            return newCustomer
        } catch (error) {
            throw error
        }
    },

    update: async (id, customerData) => {
        try {
            const currentCustomer = await CustomerModel.findById(id)
            if (!currentCustomer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }
            if (
                customerData.code &&
                customerData.code !== currentCustomer.code
            ) {
                const existingCustomer = await CustomerModel.findOne({
                    code: customerData.code,
                })
                if (existingCustomer) {
                    throw new BadReq(errorCode.CUSTOMER_CODE_EXISTED)
                }
            }
            // Apply the updates from customerData to the found customer document
            currentCustomer.set(customerData)
            const updatedCustomer = await currentCustomer.save()

            return updatedCustomer
        } catch (error) {
            throw error
        }
    },

    getById: async (id, userId) => {
        try {
            // 1. Fetch the user to get their roles
            const user = await UserModel.findById(userId)
            if (!user) {
                throw new BadReq(errorCode.USER_NOT_FOUND)
            }
            const roleIds = (user.roleIds || [])
                .filter(Boolean)
                .map((id) => id.toString())

            // 2. Build the 'select' string for contactPersons based on role
            let contactPersonsFields = ''

            if (
                user.username === constant.USER_ROOT ||
                roleIds.includes(constant.ROLES.BGD) ||
                roleIds.includes(constant.ROLES.admin)
            ) {
                contactPersonsFields = 'contactPersons'
            } else if (
                roleIds.includes(constant.ROLES.warehouseAccountant) ||
                roleIds.includes(constant.ROLES.warehouseStaff)
            ) {
                contactPersonsFields = 'contactPersons.warehouseAccountant'
            } else if (roleIds.includes(constant.ROLES.sale)) {
                contactPersonsFields = 'contactPersons.sale'
            } else if (roleIds.includes(constant.ROLES.debtAccountant)) {
                contactPersonsFields = 'contactPersons.debtAccountant'
            } else if (roleIds.includes(constant.ROLES.billAccountant)) {
                contactPersonsFields = 'contactPersons.billAccountant'
            } else {
                // If no matching role, do not select any contact person fields
                contactPersonsFields = ''
            }

            // 3. Define all other common fields to be returned
            const commonFields =
                'code name officialName taxCode isActive status fax email phone billingAddress garageAddress deliveryAddresses representative notes purchaseCycleInWeeks internalTransport warehouseId productsInUse createdAt updatedAt'

            // 4. Combine the fields into the final select string
            const fieldsToSelect = contactPersonsFields
                ? `${contactPersonsFields} ${commonFields}`
                : commonFields

            // 5. Execute the query with the select clause
            const customer = await CustomerModel.findById(id)
                .select(fieldsToSelect)
                .populate({
                path: 'productsInUse',
                select: 'name code', // chỉ lấy field name của
            })

            if (!customer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }

            return customer
        } catch (error) {
            throw error
        }
    },
    getAll: async (options = {}) => {
        try {
            const {
                page = 1,
                limit = 10,
                search = '',
                city = '',
                district = '',
                status = '', // e.g., 'active', 'inactive'
            } = options

            const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10)

            const filter = {}

            // Search filter (by name or officialName)
            if (search) {
                const regex = new RegExp(search.trim(), 'i')
                filter.$or = [
                    { name: regex },
                    { officialName: regex },
                    { code: regex },
                    { taxCode: regex },
                    { billingAddress: regex },
                ]
            }

            // Status filter (based on the isActive field)
            if (status === 'active') {
                filter.isActive = true
            } else if (status === 'inactive') {
                filter.isActive = false
            }

            // Location filters
            if (city) {
                filter['deliveryAddresses.city'] = new RegExp(city.trim(), 'i')
            }
            if (district) {
                filter['deliveryAddresses.district'] = new RegExp(
                    district.trim(),
                    'i',
                )
            }

            const [items, total] = await Promise.all([
                CustomerModel.find(filter)
                    .skip(skip)
                    .limit(parseInt(limit, 10))
                    .sort({ createdAt: -1 })
                    .select(
                        'code name officialName taxCode phone status isActive deliveryAddresses',
                    ),
                CustomerModel.countDocuments(filter),
            ])

            return {
                items,
                total,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                totalPages: Math.ceil(total / limit),
            }
        } catch (error) {
            throw error
        }
    },

    getAllCities: async () => {
        try {
            const cities = await CustomerModel.distinct(
                'deliveryAddresses.city',
            )
            return cities
        } catch (error) {
            throw error
        }
    },

    getAllDistricts: async () => {
        try {
            const districts = await CustomerModel.distinct(
                'deliveryAddresses.district',
            )
            return districts
        } catch (error) {
            throw error
        }
    },

    changeActiveStatus: async (id) => {
        try {
            const customer = await CustomerModel.findById(id)
            if (!customer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }

            customer.isActive = !customer.isActive
            await customer.save()

            return { isActive: customer.isActive }
        } catch (error) {
            throw error
        }
    },
    delete: async (id) => {
        try {
            const customer = await CustomerModel.findByIdAndDelete(id)
            if (!customer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }
            // Return null on successful deletion, as no data needs to be sent back
            return null
        } catch (error) {
            throw error
        }
    },
}

module.exports = customerService
