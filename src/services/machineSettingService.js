const MachineSettingModel = require('../models/machineSetting')
const MachinePropertiesModel = require('../models/machineProperties')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')
const ProductModel = require('../models/product')
const constant = require('../utils/constant/constant')
const ProductCategoryModel = require('../models/productCategory')
const { Types } = require('mongoose')

const machineSettingService = {
    getMachine: async (query) => {
        try {
            let { search } = query
            search = new RegExp(search, 'i')
            const category = await ProductCategoryModel.findOne({
                name: constant.CATEGORY_NAME.MACHINE,
            })
            if (!category) {
                throw new BadReq(errorCode.PRODUCT_CATEGORY_NOT_FOUND)
            }
            const result = await ProductModel.find({
                $or: [{ name: search }, { code: search }],
                categoryId: category._id,
            }).select('name code')
            return result
        } catch (error) {
            throw error
        }
    },
    getAllProperties: async () => {
        try {
            const props = await MachinePropertiesModel.find().select('-__v')
            return props
        } catch (error) {
            throw error
        }
    },
    getDefaultValue: async (propId, query) => {
        try {
            const prop = await MachinePropertiesModel.findById(propId)
            if (!prop) {
                throw new BadReq(errorCode.MACHINE_PROPERTIES_NOT_FOUND)
            }
            if (prop.type !== constant.MACHINE_PROPERTIES_TYPE.LINKED) {
                throw new BadReq(errorCode.MACHINE_PROPERTIES_NOT_LINKED_TYPE)
            }
            let { search } = query
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
            }).select('name code')
            return result
        } catch (error) {
            throw error
        }
    },
    create: async (reqData) => {
        try {
            const { machineId, props } = reqData
            const machine = await ProductModel.findById(machineId).populate(
                'categoryId',
                'name',
            )
            if (
                !machine ||
                machine.categoryId.name != constant.CATEGORY_NAME.MACHINE
            ) {
                throw new BadReq(errorCode.MACHINE_NOT_FOUND)
            }

            const checkMachine = await MachineSettingModel.findOne({
                machineId,
            })
            if (checkMachine) {
                throw new BadReq(errorCode.MACHINE_SETTING_IS_EXISTED)
            }

            const propIds = props.map((p) => p.propId)
            const allProps = await MachinePropertiesModel.find({
                _id: { $in: propIds },
            }).lean()
            const allPropsMap = Object.fromEntries(
                allProps.map((p) => [p._id.toString(), p]),
            )

            for (let p of props) {
                const checkProp = allPropsMap[p.propId]
                if (!checkProp) {
                    throw new BadReq(errorCode.MACHINE_PROPERTIES_NOT_FOUND)
                }
                if (
                    checkProp.type ===
                        constant.MACHINE_PROPERTIES_TYPE.CUSTOM ||
                    checkProp.type === constant.MACHINE_PROPERTIES_TYPE.LINKED
                ) {
                    const seen = new Set()
                    for (let v of p.defaultValue) {
                        if (seen.has(v.toString())) {
                            throw new BadReq(
                                errorCode.DUPLICATE_PROPS_DEFAULT_VALUE,
                            )
                        }
                        seen.add(v.toString())
                    }
                }
                if (
                    checkProp.type === constant.MACHINE_PROPERTIES_TYPE.LINKED
                ) {
                    const linkedCategory = await ProductCategoryModel.findOne({
                        name: checkProp.categoryLinkedName,
                    })
                    if (!linkedCategory) {
                        throw new BadReq(errorCode.PRODUCT_CATEGORY_NOT_FOUND)
                    }
                    await Promise.all(
                        p.defaultValue.map(async (v) => {
                            const checkValue = await ProductModel.findOne({
                                _id: new Types.ObjectId(v),
                                categoryId: linkedCategory._id,
                            }).lean()
                            if (!checkValue) {
                                throw new BadReq(
                                    errorCode.DEFAULT_VALUE_NOT_FOUND,
                                )
                            }
                        }),
                    )
                }
            }
            await MachineSettingModel.create({ machineId, props })
            return null
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
        const machines = await ProductModel.find({
            $or: [{ name: search }, { shortName: search }, { code: search }],
            categoryId: category._id,
        })
        const machineIds = machines.map((m) => m._id)
        const [items, totalItems] = await Promise.all([
            MachineSettingModel.find({ machineId: { $in: machineIds } })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('machineId', 'name code')
                .lean(),

            MachineSettingModel.countDocuments({
                machineId: { $in: machineIds },
            }),
        ])

        const result = items.map((i) => ({
            _id: i._id,
            machineId: i.machineId._id,
            machineName: i.machineId.name,
            machineCode: i.machineId.code,
        }))

        return {
            result,
            page,
            totalItems,
            totalPage: Math.ceil(totalItems / limit),
        }
    },
    getById: async (machineSettingId) => {
        try {
            const machineSetting = await MachineSettingModel.findById(
                machineSettingId,
            )
                .populate('machineId', 'name code')
                .lean()
            if (!machineSetting) {
                throw new BadReq(errorCode.MACHINE_NOT_FOUND)
            }

            const availablePropsMap = Object.fromEntries(
                machineSetting.props.map((p) => [p.propId.toString(), p]),
            )
            let linkedIds = []
            for (let p of machineSetting.props) {
                const prop = await MachinePropertiesModel.findById(
                    p.propId,
                ).lean()
                if (prop.type === constant.MACHINE_PROPERTIES_TYPE.LINKED) {
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
            const props = await MachinePropertiesModel.find()
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
            const machineSetting =
                await MachineSettingModel.findById(machineSettingId).lean()
            if (!machineSetting) {
                throw new BadReq(errorCode.MACHINE_SETTING_NOT_FOUND)
            }

            const { machineId, props } = reqData
            if (machineId !== machineSetting.machineId.toString()) {
                const category = await ProductCategoryModel.findOne({
                    name: constant.CATEGORY_NAME.MACHINE,
                }).lean()
                if (!category) {
                    throw new BadReq(errorCode.PRODUCT_CATEGORY_NOT_FOUND)
                }
                const checkMachine = await ProductModel.findOne({
                    _id: new Types.ObjectId(machineId),
                    categoryId: category._id,
                }).lean()
                if (!checkMachine) {
                    throw new BadReq(errorCode.MACHINE_NOT_FOUND)
                }

                const checkDuplicate = await MachineSettingModel.findOne({
                    machineId: new Types.ObjectId(machineId),
                }).lean()
                if (checkDuplicate) {
                    throw new BadReq(errorCode.MACHINE_SETTING_IS_EXISTED)
                }
            }

            const propIds = props.map((p) => p.propId)
            const allProps = await MachinePropertiesModel.find({
                _id: { $in: propIds },
            }).lean()
            const allPropsMap = Object.fromEntries(
                allProps.map((p) => [p._id.toString(), p]),
            )

            for (let p of props) {
                const checkProp = allPropsMap[p.propId]
                if (!checkProp) {
                    throw new BadReq(errorCode.MACHINE_PROPERTIES_NOT_FOUND)
                }
                if (
                    checkProp.type ===
                        constant.MACHINE_PROPERTIES_TYPE.CUSTOM ||
                    checkProp.type === constant.MACHINE_PROPERTIES_TYPE.LINKED
                ) {
                    const seen = new Set()
                    for (let v of p.defaultValue) {
                        if (seen.has(v.toString())) {
                            throw new BadReq(
                                errorCode.DUPLICATE_PROPS_DEFAULT_VALUE,
                            )
                        }
                        seen.add(v.toString())
                    }
                }
                if (
                    checkProp.type === constant.MACHINE_PROPERTIES_TYPE.LINKED
                ) {
                    const linkedCategory = await ProductCategoryModel.findOne({
                        name: checkProp.categoryLinkedName,
                    })
                    if (!linkedCategory) {
                        throw new BadReq(errorCode.PRODUCT_CATEGORY_NOT_FOUND)
                    }
                    await Promise.all(
                        p.defaultValue.map(async (v) => {
                            const checkValue = await ProductModel.findOne({
                                _id: new Types.ObjectId(v),
                                categoryId: linkedCategory._id,
                            }).lean()
                            if (!checkValue) {
                                throw new BadReq(
                                    errorCode.DEFAULT_VALUE_NOT_FOUND,
                                )
                            }
                        }),
                    )
                }
            }
            await MachineSettingModel.findByIdAndUpdate(machineSettingId, {
                machineId,
                props,
            })
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
