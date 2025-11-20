const WorkOrderBusinessModel = require('../models/workOrderBusiness')
const WorkOrderModel = require('../models/workOrder')
const constant = require('../utils/constant/constant')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')
const MachineSettingModel = require('../models/machineSetting')
const ProductModel = require('../models/product')
const MachinePropertiesModel = require('../models/machineProperties')
const ProductCategoryModel = require('../models/productCategory')

const {
    getWorkOrderModel,
    checkExist,
} = require('../utils/helper/workOrderDetailHelper')
const TechnicianModel = require('../models/technician')

const workOrderDetailService = {
    create: async (workOrderId) => {
        try {
            //check workOrder
            const workOrder = await WorkOrderModel.findById(workOrderId).lean()
            if (!workOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }
            //Lấy model
            const WorkOrderDetailModel = getWorkOrderModel(
                workOrder.typeWork,
                workOrder.type,
            )
            //check workOrderDetail có tồn tại hay không, nếu có thì không cho tạo
            const existed = await checkExist(workOrderId)
            if (existed) {
                throw new BadReq(errorCode.WORK_ORDER_DETAIL_EXISTED)
            }
            if (workOrder.typeWork === constant.WORK_ORDER_TYPE.TEST_IO.value) {
                let testerId = null
                if (workOrder.technicianId) {
                    testerId = workOrder.technicianId
                }
                if (
                    workOrder.type === constant.WORK_ORDER_DETAIL_TYPE.A.value
                ) {
                    await WorkOrderDetailModel.create({ workOrderId, testerId })
                    return null
                } else {
                    await WorkOrderDetailModel.create({
                        workOrderId,
                        baseInfo: {
                            testDate: null,
                            testerId,
                            purposeTest: null,
                            receiptDate: null,
                        },
                    })
                    return null
                }
            } else {
                await WorkOrderDetailModel.create({ workOrderId })
            }
            return null
        } catch (error) {
            throw error
        }
    },
    delete: async (workOrderId) => {
        try {
            //check WorkOrder
            const workOrder = await WorkOrderModel.findById(workOrderId).lean()
            if (!workOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }
            //Lấy model
            const WorkOrderDetailModel = getWorkOrderModel(
                workOrder.typeWork,
                workOrder.type,
            )

            const workOrderDetail = await WorkOrderDetailModel.findOne({
                workOrderId,
            })
            //check workOrderDetail có tồn tại hay không
            if (!workOrderDetail) {
                throw new BadReq(errorCode.WORK_ORDER_DETAIL_NOT_FOUND)
            }
            await WorkOrderDetailModel.findOneAndDelete({ workOrderId })
            return null
        } catch (error) {
            throw error
        }
    },
    getByWorkOrderId: async (workOrderId) => {
        try {
            //check workOrder
            const workOrder = await WorkOrderModel.findById(workOrderId)
                .populate('customerId', 'officialName ')
                .lean()
            if (!workOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }
            //Lấy model
            const WorkOrderDetailModel = getWorkOrderModel(
                workOrder.typeWork,
                workOrder.type,
            )

            const workOrderDetail = await WorkOrderDetailModel.findOne({
                workOrderId,
            }).lean()
            //check workOrderDetail có tồn tại hay không
            if (!workOrderDetail) {
                throw new BadReq(errorCode.WORK_ORDER_DETAIL_NOT_FOUND)
            }

            let result = {}
            if (
                workOrder.typeWork === constant.WORK_ORDER_TYPE.REPAIR.value ||
                workOrder.typeWork ===
                    constant.WORK_ORDER_TYPE.INSTALLATION.value ||
                workOrder.typeWork ===
                    constant.WORK_ORDER_TYPE.MAINTENANCE.value
            ) {
                let returnInfo = []
                if (workOrderDetail.machineInfo.length) {
                    for (let info of workOrderDetail.machineInfo) {
                        const prop = await MachinePropertiesModel.findById(
                            info.propId,
                        )
                        const machineSetting =
                            await MachineSettingModel.findOne({
                                machineId: workOrderDetail.machineId,
                            })
                        let defaultValue = []
                        if (machineSetting) {
                            for (let p of machineSetting.props) {
                                if (p.propId === info.propId) {
                                    defaultValue = p.defaultValue
                                }
                            }
                        }
                        returnInfo.push({
                            _id: prop._id,
                            name: prop.name,
                            type: prop.type,
                            defaultValue:
                                prop.type !==
                                constant.MACHINE_PROPERTIES_TYPE.NORMAL
                                    ? defaultValue
                                    : undefined,
                            value: info.value,
                        })
                    }
                }
                let returnSpecs = []
                if (workOrderDetail.machineSpecs.length) {
                    for (let spec of workOrderDetail.machineSpecs) {
                        const prop = await MachinePropertiesModel.findById(
                            spec.propId,
                        )
                        const machineSetting =
                            await MachineSettingModel.findOne({
                                machineId: workOrderDetail.machineId,
                            })
                        let defaultValue = []
                        if (machineSetting) {
                            for (let p of machineSetting.props) {
                                if (p.propId === spec.propId) {
                                    defaultValue = p.defaultValue
                                }
                            }
                        }
                        returnSpecs.push({
                            _id: prop._id,
                            name: prop.name,
                            type: prop.type,
                            defaultValue:
                                prop.type !==
                                constant.MACHINE_PROPERTIES_TYPE.NORMAL
                                    ? defaultValue
                                    : undefined,
                            value: spec.value,
                        })
                    }
                }
                result = {
                    ...workOrderDetail,
                    machineInfo: returnInfo,
                    machineSpecs: returnSpecs,
                }
            } else if (
                workOrder.typeWork === constant.WORK_ORDER_TYPE.TEST_IO.value ||
                workOrder.typeWork === constant.WORK_ORDER_TYPE.DEMO.value
            ) {
                let returnProps = []
                if (workOrderDetail.props.length) {
                    for (let mp of workOrderDetail.props) {
                        const prop = await MachinePropertiesModel.findById(
                            mp.propId,
                        )
                        const machineSetting =
                            await MachineSettingModel.findOne({
                                machineId: workOrderDetail.machineId,
                            })
                        let defaultValue = []
                        if (machineSetting) {
                            for (let p of machineSetting.props) {
                                if (p.propId === mp.propId) {
                                    defaultValue = p.defaultValue
                                }
                            }
                        }
                        returnProps.push({
                            _id: prop._id,
                            name: prop.name,
                            type: prop.type,
                            defaultValue:
                                prop.type !==
                                constant.MACHINE_PROPERTIES_TYPE.NORMAL
                                    ? defaultValue
                                    : undefined,
                            value: mp.value,
                        })
                    }
                }
                result = {
                    ...workOrderDetail,
                    props: returnProps,
                }
                let tester = null
                if (
                    workOrder.typeWork ===
                    constant.WORK_ORDER_TYPE.TEST_IO.value
                ) {
                    const testerId =
                        workOrder.type ===
                        constant.WORK_ORDER_DETAIL_TYPE.A.value
                            ? workOrderDetail.testerId
                            : workOrderDetail.baseInfo.testerId
                    if (testerId) {
                        tester = await TechnicianModel.findById(testerId)
                            .select('fullname')
                            .lean()
                    }
                    if (
                        workOrder.type ===
                        constant.WORK_ORDER_DETAIL_TYPE.A.value
                    ) {
                        result.testerName = tester.fullname
                    } else {
                        result.baseInfo.testerName = tester.fullname
                    }
                }
            } else if (
                workOrder.typeWork ===
                constant.WORK_ORDER_TYPE.SAMPLE_PRINTING.value
            ) {
                result = workOrderDetail
            }
            return {
                customerInfo:
                    workOrder.typeWork !==
                    constant.WORK_ORDER_TYPE.TEST_IO.value
                        ? {
                              officialName: workOrder.customerId.officialName,
                              contactPerson:
                                  workOrder.contactPerson.contactName,
                              phone: workOrder.contactPerson.contactPhone,
                              address: workOrder.address,
                              reportDate: workOrder.createdAt,
                          }
                        : undefined,
                ...result,
            }
        } catch (error) {
            throw error
        }
    },
    updateMachineTypeId: async (workOrderId, reqData) => {
        try {
            //check workOrder
            const workOrder = await WorkOrderModel.findById(workOrderId).lean()
            if (!workOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }
            //Lấy model
            const WorkOrderDetailModel = getWorkOrderModel(
                workOrder.typeWork,
                workOrder.type,
            )

            const workOrderDetail = await WorkOrderDetailModel.findOne({
                workOrderId,
            })
            //check workOrderDetail có tồn tại hay không
            if (!workOrderDetail) {
                throw new BadReq(errorCode.WORK_ORDER_DETAIL_NOT_FOUND)
            }

            if (
                workOrderDetail.machineTypeId &&
                workOrderDetail.props?.some((p) => p.value) &&
                workOrderDetail.machineInfo?.some((p) => p.value) &&
                workOrderDetail.machineSpecs?.some((p) => p.value)
            ) {
                throw new BadReq(
                    errorCode.WORK_ORDER_DETAIL_PROPS_HAVE_DATA_SO_CAN_NOT_UPDATE_MACHINE_TYPE,
                )
            }

            const { machineTypeId } = reqData
            const machine = await ProductModel.findById(machineTypeId).populate(
                'categoryId',
                'name',
            )

            if (
                !machine ||
                machine.categoryId.name !== constant.CATEGORY_NAME.MACHINE
            ) {
                throw new BadReq(errorCode.MACHINE_NOT_FOUND)
            } else {
                if (!machine.code.startsWith(workOrder.type)) {
                    throw new BadReq(
                        errorCode.MACHINE_NOT_MATCH_WORK_ORDER_TYPE,
                    )
                }
            }

            let propData = []
            let infoData = []
            let specData = []
            let result = {}
            const machineSetting = await MachineSettingModel.findOne({
                machineId: machineTypeId,
            })
            if (!machineSetting) {
                await WorkOrderDetailModel.findByIdAndUpdate(
                    workOrderDetail._id,
                    { machineTypeId },
                )
            } else {
                if (
                    workOrder.typeWork ===
                    constant.WORK_ORDER_TYPE.SAMPLE_PRINTING.value
                ) {
                    const inkProp = machineSetting.props.find(
                        (p) =>
                            p.propId.toString() ===
                            constant.PROPERTY_ID.INK_TYPE,
                    )
                    if (inkProp) {
                        const inkDefaultValue = await ProductModel.findById({
                            _id: { $in: inkProp.defaultValue },
                        })
                            .select('name code')
                            .lean()
                        await WorkOrderDetailModel.findByIdAndUpdate(
                            workOrderDetail._id,
                            { machineTypeId },
                        )
                        result = { inkDefaultValue }
                    }
                } else {
                    propIds = machineSetting.props.map((p) =>
                        p.propId.toString(),
                    )

                    for (let p of machineSetting.props) {
                        const prop = await MachinePropertiesModel.findById(
                            p.propId,
                        )
                            .select('-__v -categoryLinkedName')
                            .lean()
                        if (!prop) {
                            throw new BadReq(
                                errorCode.MACHINE_PROPERTIES_NOT_FOUND,
                            )
                        }
                        let defaultValue = p.defaultValue
                        if (
                            prop.type ===
                            constant.MACHINE_PROPERTIES_TYPE.LINKED
                        ) {
                            defaultValue = await ProductModel.find({
                                _id: { $in: p.defaultValue },
                            }).select('name code')
                        }
                        if (
                            prop.type ===
                            constant.MACHINE_PROPERTIES_TYPE.NORMAL
                        ) {
                            defaultValue = undefined
                        }
                        propData.push({
                            ...prop,
                            group: undefined,
                            defaultValue,
                        })
                        if (
                            prop.group ===
                            constant.MACHINE_PROPERTIES_GROUP_NAME.INFO
                        ) {
                            infoData.push({
                                ...prop,
                                group: undefined,
                                defaultValue,
                            })
                        }
                        if (
                            prop.group ===
                            constant.MACHINE_PROPERTIES_GROUP_NAME.SPECS
                        ) {
                            specData.push({
                                ...prop,
                                group: undefined,
                                defaultValue,
                            })
                        }
                    }
                    if (
                        workOrder.typeWork ===
                            constant.WORK_ORDER_TYPE.REPAIR.value ||
                        workOrder.typeWork ===
                            constant.WORK_ORDER_TYPE.MAINTENANCE.value ||
                        workOrder.typeWork ===
                            constant.WORK_ORDER_TYPE.INSTALLATION.value
                    ) {
                        const infos = infoData.map((info) => ({
                            propId: info._id.toString(),
                            value: '',
                        }))
                        const specs = specData.map((spec) => ({
                            propId: spec._id.toString(),
                            value: '',
                        }))
                        await WorkOrderDetailModel.findByIdAndUpdate(
                            workOrderDetail._id,
                            {
                                machineTypeId,
                                machineInfo: infos,
                                machineSpecs: specs,
                            },
                        )
                        result = {
                            machineInfo: infoData,
                            machineSpecs: specData,
                        }
                    } else if (
                        workOrder.typeWork ===
                            constant.WORK_ORDER_TYPE.TEST_IO.value ||
                        workOrder.typeWork ===
                            constant.WORK_ORDER_TYPE.DEMO.value
                    ) {
                        const props = propData.map((prop) => ({
                            propId: prop._id.toString(),
                            value: '',
                        }))
                        await WorkOrderDetailModel.findByIdAndUpdate(
                            workOrderDetail._id,
                            {
                                machineTypeId,
                                props,
                            },
                        )
                        result = {
                            machineProps: propData,
                        }
                    }
                }
            }

            return result
        } catch (error) {
            throw error
        }
    },
    updateData: async (workOrderId, reqData) => {
        try {
            //check workOrder
            const workOrder = await WorkOrderModel.findById(workOrderId).lean()
            if (!workOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }
            //Lấy model
            const WorkOrderDetailModel = getWorkOrderModel(
                workOrder.typeWork,
                workOrder.type,
            )

            const workOrderDetail = await WorkOrderDetailModel.findOne({
                workOrderId,
            })
            //check workOrderDetail có tồn tại hay không
            if (!workOrderDetail) {
                throw new BadReq(errorCode.WORK_ORDER_DETAIL_NOT_FOUND)
            }
            const typeWork = workOrder.typeWork
            const type = workOrder.type

            const { machineProps, machineInfo, machineSpecs } = reqData
            if (
                !workOrderDetail.machineTypeId &&
                (machineSpecs.length !== 0 ||
                    machineInfo.length !== 0 ||
                    machineProps.length !== 0)
            ) {
                throw new BadReq(errorCode.MACHINE_TYPE_ID_NOT_FOUND)
            }
            const checkProps = [
                ...(machineProps ?? []),
                ...(machineInfo ?? []),
                ...(machineSpecs ?? []),
            ]
            for (let p of checkProps) {
                const prop = await MachinePropertiesModel.findById(p.propId)
                if (!prop) {
                    throw new BadReq(errorCode.MACHINE_PROPERTIES_NOT_FOUND)
                }
            }
            if (type === constant.WORK_ORDER_DETAIL_TYPE.G.value) {
                const { machineInfo, groups } = reqData
                if (machineInfo || groups) {
                    if (
                        !machineInfo.some(
                            (i) =>
                                i.propId ===
                                constant.PROPERTY_ID.PRINT_HEAD_QUANTITY,
                        )
                    ) {
                        throw new BadReq(
                            errorCode.MACHINE_TYPE_NOT_SUITABLE_FOR_G_TYPE,
                        )
                    }
                    const printHeadQuantity = machineInfo.find(
                        (i) =>
                            i.propId ===
                            constant.PROPERTY_ID.PRINT_HEAD_QUANTITY,
                    ).value
                    if (groups.length !== Number(printHeadQuantity)) {
                        throw new BadReq(
                            errorCode.PRINT_HEAD_QUANTITY_AND_NUMBER_OF_GROUP_NOT_MATCH,
                        )
                    }
                }
            }

            if (typeWork === constant.WORK_ORDER_TYPE.MAINTENANCE.value) {
                if (type === constant.WORK_ORDER_DETAIL_TYPE.A.value) {
                    const {
                        maintainContractDate,
                        maintainDate,
                        arrivalTime,
                        departureTime,
                        machineInfo,
                        machineSpecs,
                        maintainOperations,
                        replacement,
                        technicalFeedback,
                        customerFeedback,
                    } = reqData

                    for (let i of replacement) {
                        const product = await ProductModel.findById(i)
                        if (!product) {
                            throw new BadReq(errorCode.REPLACEMENT_NOT_FOUND)
                        }
                    }
                    await WorkOrderDetailModel.findByIdAndUpdate(
                        workOrderDetail._id,
                        {
                            maintainContractDate,
                            maintainDate,
                            arrivalTime,
                            departureTime,
                            machineInfo,
                            machineSpecs,
                            maintainOperations,
                            replacement,
                            technicalFeedback,
                            customerFeedback,
                        },
                    )
                    return null
                } else {
                    const {
                        machineInfo,
                        machineSpecs,
                        groups,
                        maintainOperations,
                        technicalFeedback,
                        customerFeedback,
                    } = reqData

                    await WorkOrderDetailModel.findByIdAndUpdate(
                        workOrderDetail._id,
                        {
                            machineInfo,
                            machineSpecs,
                            groups,
                            maintainOperations,
                            technicalFeedback,
                            customerFeedback,
                        },
                    )
                    return null
                }
            }
            if (typeWork === constant.WORK_ORDER_TYPE.REPAIR.value) {
                if (type === constant.WORK_ORDER_DETAIL_TYPE.A.value) {
                    const {
                        maintainContract,
                        repairDate,
                        arrivalTime,
                        departureTime,
                        machineInfo,
                        machineSpecs,
                        repairAFault,
                        technicalFeedback,
                        customerFeedback,
                    } = reqData
                    await WorkOrderDetailModel.findByIdAndUpdate(
                        workOrderDetail._id,
                        {
                            maintainContract,
                            repairDate,
                            arrivalTime,
                            departureTime,
                            machineInfo,
                            machineSpecs,
                            repairAFault,
                            technicalFeedback,
                            customerFeedback,
                        },
                    )
                    return null
                } else {
                    const {
                        machineInfo,
                        machineSpecs,
                        groups,
                        repairFault,
                        technicalFeedback,
                        customerFeedback,
                    } = reqData
                    await WorkOrderDetailModel.findByIdAndUpdate(
                        workOrderDetail._id,
                        {
                            machineInfo,
                            machineSpecs,
                            groups,
                            repairFault,
                            technicalFeedback,
                            customerFeedback,
                        },
                    )
                    return null
                }
            }
            if (typeWork === constant.WORK_ORDER_TYPE.INSTALLATION.value) {
                const {
                    deliveryDate,
                    installDate,
                    handOverDate,
                    machineInfo,
                    machineSpecs,
                    includedAccessories,
                    guide,
                } = reqData
                await WorkOrderDetailModel.findByIdAndUpdate(
                    workOrderDetail._id,
                    {
                        deliveryDate,
                        installDate,
                        handOverDate,
                        machineInfo,
                        machineSpecs,
                        includedAccessories,
                        guide,
                    },
                )
                return null
            }
            if (typeWork === constant.WORK_ORDER_TYPE.SAMPLE_PRINTING.value) {
                const {
                    inkTypeId,
                    sellMachineTypeId,
                    packagingMaterial,
                    temperature,
                    method,
                    informationFrom,
                    customerRequest,
                    managerOpinion,
                    solution,
                    testInkTypeIds,
                    managerOpinionOnSample,
                    receivingTime,
                    returnTime,
                    note,
                } = reqData
                await WorkOrderDetailModel.findByIdAndUpdate(
                    workOrderDetail._id,
                    {
                        inkTypeId,
                        sellMachineTypeId,
                        packagingMaterial,
                        temperature,
                        method,
                        informationFrom,
                        customerRequest,
                        managerOpinion,
                        solution,
                        testInkTypeIds,
                        managerOpinionOnSample,
                        receivingTime,
                        returnTime,
                        note,
                    },
                )
                return null
            }
            if (typeWork === constant.WORK_ORDER_TYPE.DEMO.value) {
                const { props, technicalFeedback, customerFeedback } = reqData
                await WorkOrderDetailModel.findByIdAndUpdate(
                    workOrderDetail._id,
                    {
                        props,
                        technicalFeedback,
                        customerFeedback,
                    },
                )
                return null
            }
            if (typeWork === constant.WORK_ORDER_TYPE.TEST_IO.value) {
                if (type === constant.WORK_ORDER_DETAIL_TYPE.A.value) {
                    const { testDate, testerId, props } = reqData
                    await WorkOrderDetailModel.findByIdAndUpdate(
                        workOrderDetail._id,
                        { testDate, testerId, props },
                    )
                    return null
                } else {
                    const {
                        testDate,
                        testerId,
                        purposeTest,
                        receiptDate,
                        props,
                        image,
                        printHeads,
                    } = reqData
                    await WorkOrderDetailModel.findByIdAndUpdate(
                        workOrderDetail._id,
                        {
                            baseInfo: {
                                testDate,
                                testerId,
                                purposeTest,
                                receiptDate,
                            },
                            props,
                            image,
                            printHeads,
                        },
                    )
                    return null
                }
            }
        } catch (error) {
            throw error
        }
    },
    getAllRepairFault: async (query) => {
        try {
            let { search } = query
            search = new RegExp(search, 'i')
            const business = await WorkOrderBusinessModel.findOne({}).lean()
            let items = business?.repairFault
            items = items.filter((f) => search.test(f.fault))
            return items
        } catch (error) {
            throw error
        }
    },
    getAllPrintHeaderFault: async (query) => {
        try {
            let { search } = query
            search = new RegExp(search, 'i')
            const business = await WorkOrderBusinessModel.findOne({}).lean()
            let items = business?.repairAFault.printHeaderFault
            items = items.filter((f) => search.test(f))
            return items
        } catch (error) {
            throw error
        }
    },
    getAllInkSystemFault: async (query) => {
        try {
            let { search } = query
            search = new RegExp(search, 'i')
            const business = await WorkOrderBusinessModel.findOne({}).lean()
            let items = business?.repairAFault.inkSystemFault
            items = items.filter((f) => search.test(f))
            return items
        } catch (error) {
            throw error
        }
    },
    getAllElectricalSystemFault: async (query) => {
        try {
            let { search } = query
            search = new RegExp(search, 'i')
            const business = await WorkOrderBusinessModel.findOne({}).lean()
            let items = business?.repairAFault.electricalSystemFault
            items = items.filter((f) => search.test(f))
            return items
        } catch (error) {
            throw error
        }
    },
    getAllResolution: async (query) => {
        try {
            let { search } = query
            search = new RegExp(search, 'i')
            const business = await WorkOrderBusinessModel.findOne({}).lean()
            let items = business?.repairAFault.resolution
            items = items.filter((f) => search.test(f))
            return items
        } catch (error) {
            throw error
        }
    },
    getAllMaintainOperations: async (query) => {
        try {
            let { search } = query
            search = new RegExp(search, 'i')
            const business = await WorkOrderBusinessModel.findOne({}).lean()
            let items = business?.maintainOperations
            items = items.filter((f) => search.test(f.operationName))
            return items
        } catch (error) {
            throw error
        }
    },
    getAllPowerControl: async (query) => {
        try {
            let { search } = query
            search = new RegExp(search, 'i')
            const business = await WorkOrderBusinessModel.findOne({}).lean()
            let items = business?.guide.powerControl
            items = items.filter((f) => search.test(f))
            return items
        } catch (error) {
            throw error
        }
    },
    getAllPrintProgramming: async (query) => {
        try {
            let { search } = query
            search = new RegExp(search, 'i')
            const business = await WorkOrderBusinessModel.findOne({}).lean()
            let items = business?.guide.printProgramming
            items = items.filter((f) => search.test(f))
            return items
        } catch (error) {
            throw error
        }
    },
    getAllPrintSetting: async (query) => {
        try {
            let { search } = query
            search = new RegExp(search, 'i')
            const business = await WorkOrderBusinessModel.findOne({}).lean()
            let items = business?.guide.printSetting
            items = items.filter((f) => search.test(f))
            return items
        } catch (error) {
            throw error
        }
    },
    getAllSaveProgram: async (query) => {
        try {
            let { search } = query
            search = new RegExp(search, 'i')
            const business = await WorkOrderBusinessModel.findOne({}).lean()
            let items = business?.guide.saveProgram
            items = items.filter((f) => search.test(f))
            return items
        } catch (error) {
            throw error
        }
    },
    getAllViewSpecifications: async (query) => {
        try {
            let { search } = query
            search = new RegExp(search, 'i')
            const business = await WorkOrderBusinessModel.findOne({}).lean()
            let items = business?.guide.viewSpecifications
            items = items.filter((f) => search.test(f))
            return items
        } catch (error) {
            throw error
        }
    },
    getAllInkReplace: async (query) => {
        try {
            let { search } = query
            search = new RegExp(search, 'i')
            const business = await WorkOrderBusinessModel.findOne({}).lean()
            let items = business?.guide.inkReplace
            items = items.filter((f) => search.test(f))
            return items
        } catch (error) {
            throw error
        }
    },
    getAllErrorMessage: async (query) => {
        try {
            let { search } = query
            search = new RegExp(search, 'i')
            const business = await WorkOrderBusinessModel.findOne({}).lean()
            let items = business?.guide.errorMessages
            items = items.filter((f) => search.test(f))
            return items
        } catch (error) {
            throw error
        }
    },
    getAllTechnicianFeedback: async (query) => {
        try {
            let { search } = query
            search = new RegExp(search, 'i')
            const business = await WorkOrderBusinessModel.findOne({}).lean()
            let items = business?.technicalFeedback
            items = items.filter((f) => search.test(f))
            return items
        } catch (error) {
            throw error
        }
    },
    getAllCustomerFeedback: async (query) => {
        try {
            let { search } = query
            search = new RegExp(search, 'i')
            const business = await WorkOrderBusinessModel.findOne({}).lean()
            let items = business?.customerFeedback
            items = items.filter((f) => search.test(f))
            return items
        } catch (error) {
            throw error
        }
    },
    getAllSamplePrintingMethodName: () =>
        Object.values(constant.SAMPLE_PRINTING_METHOD_NAME),
    getAllSamplePrintingInformationFrom: () =>
        Object.values(constant.SAMPLE_PRINTING_INFORMATION_FROM),
    getAllRepairAResolutionState: () =>
        Object.values(constant.REPAIR_A_RESOLUTION_STATE),
    getMachineByWorkOrderId: async (workOrderId, query) => {
        try {
            let { search } = query
            search = new RegExp(search, 'i')
            const category = await ProductCategoryModel.findOne({
                name: constant.CATEGORY_NAME.MACHINE,
            })
            if (!category) {
                throw new BadReq(errorCode.PRODUCT_CATEGORY_NOT_FOUND)
            }
            const workOrder = await WorkOrderModel.findById(workOrderId)
            if (!workOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }
            let conditions = [
                { $or: [{ name: search }, { code: search }] },
                { categoryId: category._id },
            ]
            if (
                workOrder.typeWork ===
                    constant.WORK_ORDER_TYPE.MAINTENANCE.value ||
                workOrder.typeWork === constant.WORK_ORDER_TYPE.REPAIR.value ||
                workOrder.typeWork === constant.WORK_ORDER_TYPE.TEST_IO.value
            ) {
                const codeRegex = new RegExp(`^${workOrder.type}`, 'i')
                conditions.push({ code: codeRegex })
            }
            const result = await ProductModel.find({ $and: conditions }).select(
                'name code',
            )
            return result
        } catch (error) {
            throw error
        }
    },
}
module.exports = workOrderDetailService
