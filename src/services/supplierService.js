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
                productsInUse,
                status,
            } = supplier

            const checktaxCode = await SupplierModel.findOne({ taxCode })
            if (checktaxCode) {
                throw new BadReq(errorCode.TAXCODE_EXISTED)
            }

            const listSuppliers = await SupplierModel.find({}, 'MKH').sort({ MKH: 1 })
            let nextMKH = 1
            for (let i = 0; i < listSuppliers.length; i++) {
                if (listSuppliers[i].MKH === nextMKH) {
                    nextMKH++
                } else {
                    break
                }
            }


            await SupplierModel.create({
                MKH: nextMKH,
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

    getById: async (id, userId) => {
        try {
            const supplier = await SupplierModel.findById(id)
            if (!supplier) {
                throw new BadReq(errorCode.SUPPLIER_NOT_FOUND)
            }

            const user = await UserModel.findById(userId)
             if (!user) {
                 throw new BadReq(errorCode.USER_NOT_FOUND)
            }
            
            let result = supplier.toObject(); 
            const roleIds = user.roleIds.map(id => id.toString());
            if (
                roleIds.includes(constant.Role.BGD) || // admin
                roleIds.includes(constant.Role.quan_tri_vien)   // quản trị viên
                ) {
                 result.contactPersons = result.contactPersons || {};
                }

                else if (roleIds.includes(constant.Role.ke_toan_kho)) { // kế toán kho
                    result.contactPersons = { ke_toan_kho: result.contactPersons.ke_toan_kho || [] };
                } else if (roleIds.includes(constant.Role.ban_hang)) { // bán hàng
                    result.contactPersons = { ban_hang: result.contactPersons.ban_hang || [] };
                } else if (roleIds.includes(constant.Role.ke_toan_cong_no)) { // kế toán công nợ
                    result.contactPersons = { ke_toan_cong_no: result.contactPersons.ke_toan_cong_no || [] };
                } else if (roleIds.includes(constant.Role.ke_toan_hoa_don)) { // kế toán hoa đơn
                    result.contactPersons = { ke_toan_hoa_don: result.contactPersons.ke_toan_hoa_don || [] };
                } 
                 else {
                    result.contactPersons = {};
                }

            return result;

        } catch (error) {
            throw error
        }
    },


    getAll: async (page = 1, limit = 10, search = '', city = '', district = '')  => {
        try {
            page = parseInt(page, 10)
            limit = parseInt(limit, 10)
            const skip = (page - 1) * limit

            const filter = {}
            if (search && typeof search === 'string' && search.trim() !== '') {
                const regex = new RegExp(search.trim(), 'i')
                filter.$or = [
                    { name: regex }, 
                    { officialName: regex },

                ]
                
            }
            
            if (city && typeof city === 'string' && city.trim() !== '') {
                filter['deliveryAddresses'] = {
                    ...filter['deliveryAddresses'],
                    $elemMatch: {
                        city: new RegExp(city.trim(), 'i')
                    }
                };
            }

            if (district && typeof district === 'string' && district.trim() !== '') {
                if (filter['deliveryAddresses'] && filter['deliveryAddresses'].$elemMatch) {
                    filter['deliveryAddresses'].$elemMatch.district = new RegExp(district.trim(), 'i');
                } else {
                    filter['deliveryAddresses'] = {
                        $elemMatch: {
                            district: new RegExp(district.trim(), 'i')
                        }
                    };
                }
            }


            const [items, total, cities, districts] = await Promise.all([
                SupplierModel.find(filter)
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .select(
                        'name officialName taxCode phone status isActive deliveryAddresses',
                    ),
                SupplierModel.countDocuments(filter),
                SupplierModel.distinct('deliveryAddresses.city'),
                SupplierModel.distinct('deliveryAddresses.district'),
            ])

            const totalPages = Math.ceil(total / limit)
            return { items, total, page, limit, totalPages, cities, districts };


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
