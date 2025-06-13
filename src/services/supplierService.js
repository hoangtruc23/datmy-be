const SupplierModel = require('../models/supplier')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')

const supplierService = {
    create: async (supplier) => {
        try {
            const {
                type,
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
                warehouseId,
                productsInUse,
                status,
            } = supplier

            const checktaxCode = await SupplierModel.findOne({ taxCode })
            if (checktaxCode) {
                throw new BadReq(errorCode.TAXCODE_EXISTED)
            }

            await SupplierModel.create({
                type,
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
                warehouseId,
                productsInUse,
                status,
            })
            return null
        } catch (error) {
            throw error
        }
    },

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

            const updatableFields = [
                'type',
                'name',
                'officialName',
                'taxCode',
                'fax',
                'email',
                'phone',
                'billingAddress',
                'garageAddress',
                'deliveryAddresses',
                'representative',
                'contactPersons',
                'notes',
                'purchaseCycleInWeeks',
                'internalTransport',
                'warehouseId',
                'productsInUse',
                'status',
            ]

            updatableFields.forEach((field) => {
                if (supplier[field] !== undefined) {
                    current[field] = supplier[field]
                }
            })

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

    getById: async (id) => {
        try {
            const supplier = await SupplierModel.findById(id)
            if (!supplier) {
                throw new BadReq(errorCode.SUPPLIER_NOT_FOUND)
            }
            return supplier
        } catch (error) {
            throw error
        }
    },

    getAll: async (page = 1, limit = 10, search) => {
        try {
            page = parseInt(page, 10)
            limit = parseInt(limit, 10)
            const skip = (page - 1) * limit

            const filter = {}
            if (search && typeof search === 'string' && search.trim() !== '') {
                const regex = new RegExp(search.trim(), 'i')
                filter.$or = [{ name: regex }, { officialName: regex }]
            }

            const [items, total] = await Promise.all([
                SupplierModel.find(filter)
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 }),
                SupplierModel.countDocuments(filter),
            ])

            const totalPages = Math.ceil(total / limit)
            return { items, total, page, limit, totalPages }
        } catch (error) {
            throw error
        }
    },

    lockUnlock: async (id, isActive) => {
        try {
            const supplier = await SupplierModel.findById(id)
            if (!supplier) {
                throw new BadReq(errorCode.SUPPLIER_NOT_FOUND)
            }

            supplier.isActive = isActive
            await supplier.save()
            return supplier
        } catch (error) {
            throw error
        }
    },
}

module.exports = supplierService
