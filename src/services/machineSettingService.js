const MachineSettingModel = require('../models/machineSetting')
const MachinePropertyModel = require('../models/machineProperties')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')
const ProductModel = require('../models/product')
const constant = require('../utils/constant/constant')
const ProductCategoryModel = require('../models/productCategory')
const { Types } = require('mongoose')
const ContactPersonCustomerModel = require('../models/contactPersonCustomer')

const machineSettingService = {
    getMachine: async (query) => {
        try {
            let { search, type, customerId } = query

            if (customerId && customerId !== "") {
                const contact = await ContactPersonCustomerModel.findOne({ customerId }).lean();
                if (contact) {
                    const devices = contact?.devices
                    const productCodes = devices.flatMap(device => device.productCode) || [];
                    const products = await ProductModel.find({ code: { $in: productCodes } }).select({ name: 1, code: 1 })
                    const productMap = new Map(products.map(p => [String(p.code), p]));

                    const uniqueDevices = devices.filter((device, index, self) =>
                        index === self.findIndex((d) => d.productCode === device.productCode)
                    );
                    for (const device of uniqueDevices) {
                        const matchedProduct = productMap.get(String(device.productCode));
                        if (matchedProduct) {
                            device.code = matchedProduct.code
                            device.name = matchedProduct.name
                        }
                    }
                    return uniqueDevices
                }
            }

            search = new RegExp(search, 'i')
            type = new RegExp(type, 'i')
            const categoryId = await ProductCategoryModel.findOne({
                name: constant.CATEGORY_NAME.MACHINE,
            }, { _id: 1 })
            if (!categoryId) {
                throw new BadReq(errorCode.PRODUCT_CATEGORY_NOT_FOUND)
            }
            const result = await ProductModel.find({
                $and: [{ name: search }, { code: type }, { categoryId: categoryId }],
            }).select('code name')

            return result
        } catch (error) {
            throw error
        }
    },
    getAllProperties: async () => {
        try {
            const props = await MachinePropertyModel.find({}).select('-__v')
            return props
        } catch (error) {
            throw error
        }
    },
    getDefaultValue: async (propId, query) => {
        try {
            const prop = await MachinePropertyModel.findById(propId)
            if (!prop) {
                throw new BadReq(errorCode.MACHINE_PROPERTIES_NOT_FOUND)
            }
            if (prop.type !== constant.MACHINE_PROPERTIES_TYPE.LINKED) {
                throw new BadReq(errorCode.MACHINE_PROPERTIES_NOT_LINKED_TYPE)
            }

            let { machineId, search } = query
            let existedValueIds = []

            if (machineId) {
                const machine = await ProductModel.findById(machineId).populate(
                    'categoryId',
                    'name',
                )
                if (
                    !machine ||
                    machine.categoryId.name !== constant.CATEGORY_NAME.MACHINE
                ) {
                    throw new BadReq(errorCode.MACHINE_NOT_FOUND)
                }
                const machineSetting = await MachineSettingModel.findOne({
                    machineId,
                })
                if (machineSetting) {
                    for (let p of machineSetting.props) {
                        if (p.propId.toString() === propId) {
                            existedValueIds = p.defaultValue
                        }
                    }
                }
            }
            search = new RegExp(search, 'i')
            const category = await ProductCategoryModel.findOne({
                name: prop.categoryLinkedName,
            })
            if (!category) {
                throw new BadReq(errorCode.PRODUCT_CATEGORY_NOT_FOUND)
            }
            const result = await ProductModel.find({
                $or: [{ name: search }, { code: search }],
                categoryId: category._id,
                _id: { $nin: existedValueIds },
            }).select('name code')
            return result
        } catch (error) {
            throw error
        }
    },
    create: async (reqData) => {
        try {
            const { workType, nameType, props } = reqData
            if (
                !nameType
            ) {
                throw new BadReq(errorCode.MACHINE_NOT_FOUND)
            }

            const checkExisted = await MachineSettingModel.findOne({ workType, nameType })
            if (checkExisted) {
                throw new BadReq(errorCode.MACHINE_SETTING_IS_EXISTED)
            }

            await MachineSettingModel.create({ workType, nameType, props })
            return null

            //???????????
            // if (
            //     machine.code.startsWith(constant.WORK_ORDER_DETAIL_TYPE.G.value)
            // ) {
            //     if (
            //         !propIds.some(
            //             (id) =>
            //                 id.toString() ===
            //                 constant.PROPERTY_ID.PRINT_HEAD_QUANTITY,
            //         )
            //     ) {
            //         throw new BadReq(
            //             errorCode.MACHINE_TYPE_G_MUST_HAVE_PRINT_HEAD_QUANTITY_PROPERTY,
            //         )
            //     }
            // }
            // const allProps = await MachinePropertyModel.find({
            //     _id: { $in: propIds },
            // }).lean()
            // const allPropsMap = Object.fromEntries(
            //     allProps.map((p) => [p._id.toString(), p]),
            // )

            // for (let p of props) {
            //     const checkProp = allPropsMap[p.propId]
            //     if (!checkProp) {
            //         throw new BadReq(errorCode.MACHINE_PROPERTIES_NOT_FOUND)
            //     }
            //     if (
            //         checkProp.type ===
            //         constant.MACHINE_PROPERTIES_TYPE.CUSTOM ||
            //         checkProp.type === constant.MACHINE_PROPERTIES_TYPE.LINKED
            //     ) {
            //         const seen = new Set()
            //         for (let v of p.defaultValue) {
            //             if (seen.has(v.toString())) {
            //                 throw new BadReq(
            //                     errorCode.DUPLICATE_PROPS_DEFAULT_VALUE,
            //                 )
            //             }
            //             seen.add(v.toString())
            //         }
            //     }
            //     if (
            //         checkProp.type === constant.MACHINE_PROPERTIES_TYPE.LINKED
            //     ) {
            //         const linkedCategory = await ProductCategoryModel.findOne({
            //             name: checkProp.categoryLinkedName,
            //         })
            //         if (!linkedCategory) {
            //             throw new BadReq(errorCode.PRODUCT_CATEGORY_NOT_FOUND)
            //         }
            //         await Promise.all(
            //             p.defaultValue.map(async (v) => {
            //                 const checkValue = await ProductModel.findOne({
            //                     _id: new Types.ObjectId(v),
            //                     categoryId: linkedCategory._id,
            //                 }).lean()
            //                 if (!checkValue) {
            //                     throw new BadReq(
            //                         errorCode.DEFAULT_VALUE_NOT_FOUND,
            //                     )
            //                 }
            //             }),
            //         )
            //     }
            // }

        } catch (error) {
            throw error
        }
    },
    getAll: async (query) => {
        let { page = 1, limit = 10, search } = query
        page = Number(page)
        limit = Number(limit)
        search = new RegExp(search, 'i')

        const category = await ProductCategoryModel.findOne({
            name: constant.CATEGORY_NAME.MACHINE,
        })

        // const machines = await ProductModel.find({
        //     $or: [{ name: search }, { shortName: search }, { code: search }],
        //     categoryId: category._id,
        // })

        // const machines = await ProductModel.find({}).populate('categoryId')

        const machineSetting = await MachineSettingModel.find({}, { workType: 1, nameType: 1, props: 1 }).populate('props')

        return {
            machineSetting,
            page,
            totalItems: machineSetting.length,
            totalPage: Math.ceil(machineSetting.length / limit),
        }

        // const machineIds = machines.map((m) => m._id)
        // const [items, totalItems] = await Promise.all([
        //     MachineSettingModel.find({ machineId: { $in: machineIds } })
        //         .skip((page - 1) * limit)
        //         .limit(limit)
        //         .populate('machineId', 'name code')
        //         .lean(),

        //     MachineSettingModel.countDocuments({
        //         machineId: { $in: machineIds },
        //     }),
        // ])


        // const result = items.map((i) => ({
        //     _id: i._id,
        //     machineId: i.machineId._id,
        //     machineName: i.machineId.name,
        //     machineCode: i.machineId.code,
        // }))

        // return {
        //     result,
        //     page,
        //     totalItems,
        //     totalPage: Math.ceil(totalItems / limit),
        // }
    },
    getById: async (machineSettingId) => {
        try {
            const machineSetting = await MachineSettingModel.findById(
                machineSettingId,
            ).populate('props', '-__v').lean()

            if (!machineSetting) {
                throw new BadReq(errorCode.MACHINE_NOT_FOUND)
            }

            return machineSetting

            const availablePropsMap = Object.fromEntries(
                machineSetting.props.map((p) => [p.propId.toString(), p]),
            )
            let linkedIds = []
            for (let p of machineSetting.props) {
                const prop = await MachinePropertyModel.findById(
                    p.propId,
                ).lean()
                if (prop?.type === constant.MACHINE_PROPERTIES_TYPE.LINKED) {
                    linkedIds.push(...p.defaultValue)
                }
            }
            const defaultValueInfo = await ProductModel.find({
                _id: { $in: linkedIds },
            })
                .select('name code')
                .lean()
            const defaultValueInfoMap = Object.fromEntries(
                defaultValueInfo.map((d) => [d._id.toString(), d]),
            )
            const props = await MachinePropertyModel.find()
                .select('-__v')
                .lean()
            for (let p of props) {
                const availableProp = availablePropsMap[p._id.toString()]
                if (!availableProp) {
                    p.isAvailable = false
                    continue
                }
                p.isAvailable = true
                if (p.type === constant.MACHINE_PROPERTIES_TYPE.CUSTOM) {
                    p.defaultValue = availableProp.defaultValue
                }
                if (p.type === constant.MACHINE_PROPERTIES_TYPE.LINKED) {
                    p.categoryLinkedName = undefined
                    p.defaultValue = (availableProp.defaultValue || []).map(
                        (id) => defaultValueInfoMap[id],
                    )
                }
            }
            return {
                _id: machineSetting._id,
                machineId: machineSetting.machineId._id,
                machineName: machineSetting.machineId.name,
                machineCode: machineSetting.machineId.code,
                props,
            }
        } catch (error) {
            throw error
        }
    },

    update: async (machineSettingId, reqData) => {
        try {
            const { props } = reqData

            const checkExisted = await MachineSettingModel.findById(machineSettingId)
            if (!checkExisted) {
                throw new BadReq(errorCode.MACHINE_SETTING_NOT_FOUND)
            }


            await MachineSettingModel.findByIdAndUpdate(machineSettingId, { props })

            return null
        } catch (error) {
            throw error
        }
    },
    delete: async (machineSettingId) => {
        try {
            const machineSetting =
                await MachineSettingModel.findByIdAndDelete(machineSettingId)

            if (!machineSetting) {
                throw new BadReq(errorCode.MACHINE_SETTING_NOT_FOUND)
            }
        } catch (error) {
            throw error
        }
    },
}
module.exports = machineSettingService
