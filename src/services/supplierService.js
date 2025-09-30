const SupplierModel = require('../models/supplier')

const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')
const UserModel = require('../models/user')
const constant = require('../utils/constant/constant')
const supplierService = {
    // hàm create, update cần check taxCode trùng với khách hàng nữa
    create: async (supplier) => {
        try {
            const {
                name,
                officialName,
                taxCode,
                fax,
                email,
                phone,
                billingAddress,
                garageAddress,
                deliveryAddresses,
                representative,
                contactPersons,
                notes,
                purchaseCycleInWeeks,
                internalTransport,
                productsInUse,
                status,
            } = supplier

            const checktaxCode = await SupplierModel.findOne({ taxCode })
            if (checktaxCode) {
                throw new BadReq(errorCode.TAXCODE_EXISTED)
            }

            const lastSupplier = await SupplierModel.findOne({}, 'code')
                .sort({ code: -1 })
                .lean()
            let nextCode
            if (lastSupplier) nextCode = lastSupplier.code + 1
            else nextCode = 1
            await SupplierModel.create({
                code: nextCode,
                name,
                officialName,
                taxCode,
                fax,
                email,
                phone,
                billingAddress,
                garageAddress,
                deliveryAddresses,
                representative,
                contactPersons,
                notes,
                purchaseCycleInWeeks,
                internalTransport,
                productsInUse,
                status,
            })
            return null
        } catch (error) {
            throw error
        }
    },

    // hàm update cần check taxCode trùng với khách hàng nữa
    update: async (id, supplier) => {
        try {
            const current = await SupplierModel.findById(id)
            if (!current) {
                throw new BadReq(errorCode.SUPPLIER_NOT_FOUND)
            }

            if (supplier.taxCode && supplier.taxCode !== current.taxCode) {
                const conflict = await SupplierModel.findOne({
                    taxCode: supplier.taxCode,
                })
                if (conflict) {
                    throw new BadReq(errorCode.TAXCODE_EXISTED)
                }
            }

            current.set(supplier)
            const updated = await current.save()
            return updated
        } catch (error) {
            throw error
        }
    },

    delete: async (id) => {
        try {
            const supplier = await SupplierModel.findByIdAndDelete(id)
            if (!supplier) {
                throw new BadReq(errorCode.SUPPLIER_NOT_FOUND)
            }
            return null
        } catch (error) {
            throw error
        }
    },

    getById: async (id, userId) => {
        try {
            const user = await UserModel.findById(userId)
            if (!user) {
                throw new BadReq(errorCode.USER_NOT_FOUND)
            }
            const roleIds = (user.roleIds || [])
                .filter(Boolean)
                .map((id) => id.toString())

            let contactPersonsFields = ''

            if (
                user.username === constant.USER_ROOT ||
                roleIds.includes(constant.ROLES.BGD) || // Ban giám đốc
                roleIds.includes(constant.ROLES.admin) // Quản trị viên
            ) {
                contactPersonsFields = 'contactPersons'
            } else if (roleIds.includes(constant.ROLES.warehouseAccountant)) {
                contactPersonsFields = 'contactPersons.warehouseAccountant'
            } else if (roleIds.includes(constant.ROLES.sale)) {
                contactPersonsFields = 'contactPersons.sale'
            } else if (roleIds.includes(constant.ROLES.debtAccountant)) {
                contactPersonsFields = 'contactPersons.debtAccountant'
            } else if (roleIds.includes(constant.ROLES.billAccountant)) {
                contactPersonsFields = 'contactPersons.billAccountant'
            } else {
                contactPersonsFields = ''
            }

            const commonFields =
                'code name officialName taxCode isActive status fax email phone billingAddress garageAddress deliveryAddresses representative notes purchaseCycleInWeeks internalTransport productsInUse'
            const fieldsToSelect = contactPersonsFields
                ? `${contactPersonsFields} ${commonFields}`
                : commonFields

            const supplier =
                await SupplierModel.findById(id).select(fieldsToSelect)
            if (!supplier) {
                throw new BadReq(errorCode.SUPPLIER_NOT_FOUND)
            }

            return supplier
        } catch (error) {
            throw error
        }
    },

    getAll: async (
        page = 1,
        limit = 10,
        search = '',
        city = '',
        district = '',
    ) => {
        try {
            page = parseInt(page, 10)
            limit = parseInt(limit, 10)
            const skip = (page - 1) * limit

            const filter = {}
            if (search && typeof search === 'string' && search.trim() !== '') {
                const regex = new RegExp(search.trim(), 'i')
                filter.$or = [{ name: regex }, { officialName: regex }]
            }

            if (city && typeof city === 'string' && city.trim() !== '') {
                filter['deliveryAddresses'] = {
                    ...filter['deliveryAddresses'],
                    $elemMatch: {
                        city: new RegExp(city.trim(), 'i'),
                    },
                }
            }

            if (
                district &&
                typeof district === 'string' &&
                district.trim() !== ''
            ) {
                if (
                    filter['deliveryAddresses'] &&
                    filter['deliveryAddresses'].$elemMatch
                ) {
                    filter['deliveryAddresses'].$elemMatch.district =
                        new RegExp(district.trim(), 'i')
                } else {
                    filter['deliveryAddresses'] = {
                        $elemMatch: {
                            district: new RegExp(district.trim(), 'i'),
                        },
                    }
                }
            }

            const [items, total] = await Promise.all([
                SupplierModel.find(filter)
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .select(
                        'name officialName taxCode phone status isActive deliveryAddresses',
                    ),
                SupplierModel.countDocuments(filter),
            ])

            const totalPages = Math.ceil(total / limit)
            return { items, total, page, limit, totalPages }
        } catch (error) {
            throw error
        }
    },
    getAllCities: async () => {
        try {
            const cities = await SupplierModel.distinct(
                'deliveryAddresses.city',
            )
            return cities
        } catch (error) {
            throw error
        }
    },

    getAllDistricts: async () => {
        try {
            const districts = await SupplierModel.distinct(
                'deliveryAddresses.district',
            )
            return districts
        } catch (error) {
            throw error
        }
    },

    lockUnlock: async (id) => {
        try {
            const supplier = await SupplierModel.findById(id)
            if (!supplier) {
                throw new BadReq(errorCode.SUPPLIER_NOT_FOUND)
            }

            supplier.isActive = !supplier.isActive
            await supplier.save()
            return supplier.isActive
        } catch (error) {
            throw error
        }
    },
}

module.exports = supplierService
