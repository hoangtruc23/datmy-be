const WorkOrderBusinessModel = require('../models/workOrderBusiness')
const WorkOrderModel = require('../models/workOrder')
const constant = require('../utils/constant/constant')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')
const MachineSettingModel = require('../models/machineSetting')
const ProductModel = require('../models/product')
const MachinePropertyModel = require('../models/machineProperties')
const ProductCategoryModel = require('../models/productCategory')

const {
    getWorkOrderModel,
    checkExist,
} = require('../utils/helper/workOrderDetailHelper')

const workOrderDetailService = {
    create: async (workOrderId) => {
        try {
            //check workOrder
            const workOrder = await WorkOrderModel.findById(workOrderId).lean()
            if (!workOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }
            const machineCode = workOrder.type
            const machineId = await ProductModel.findOne({ code: machineCode }, { _id: 1 })
            //Lấy model
            const WorkOrderDetailModel = getWorkOrderModel(
                workOrder.typeWork,
                workOrder.type[0],
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
                    workOrder.type[0] === constant.WORK_ORDER_DETAIL_TYPE.A.value
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
                await WorkOrderDetailModel.create({ workOrderId, machineCode, machineTypeId: machineId._id })
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
                workOrder.type[0],
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
            const workOrder = await WorkOrderModel.findById(workOrderId)
                .select({ customerId: 1, contactPerson: 1, serialNumber: 1, type: 1, typeWork: 1, createdAt: 1, address: 1 })
                .populate(
                    'customerId',
                    'officialName representative.name phone email',
                )
                .lean()

            if (!workOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }

            const machine = await ProductModel.findOne({ code: workOrder.type }, { name: 1 })

            //Lấy ra thông số của machine
            const machineSetting = await MachineSettingModel.findOne({
                nameType: workOrder.type[0],
                workType: workOrder.typeWork
            }, { props: 1 }).populate('props').lean()

            const WorkOrderDetailModel = getWorkOrderModel(
                workOrder.typeWork,
                workOrder.type[0],
            )

            const workOrderDetail = await WorkOrderDetailModel.findOne({
                workOrderId,
            }, { _id: 0 })

            const spectValue = workOrderDetail?.machineSpecs


            //Thông số của phiếu theo dòng máy -> Dòng A , B,...
            const settingMap = machineSetting?.props.reduce((acc, setting) => {
                acc[setting._id.toString()] = setting;
                return acc;
            }, {});

            let machineValues = {}
            let spectMap = []
            if (settingMap != undefined) {

                if (spectValue) {
                    spectMap = spectValue.reduce((acc, spect) => {
                        acc[spect.propId] = spect.value;
                        return acc;
                    }, {});
                }


                machineValues = Object.values(settingMap).map((settingDetail) => {
                    const propId = settingDetail._id.toString();

                    // Lấy giá trị từ Map
                    const value = spectMap[propId] || null;

                    return {
                        ...settingDetail,
                        value: value,
                    };
                });
            }

            return { ...workOrder, machineSetting: machineValues, machineName: machine.name, workOrderDetail }
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
                workOrder.type[0],
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
                if (!machine.code.startsWith(workOrder.type[0])) {
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
                        const inkDefaultValue = await ProductModel.find({
                            _id: { $in: inkProp.defaultValue },
                        })
                            .select('name code')
                            .lean()
                        await WorkOrderDetailModel.findByIdAndUpdate(
                            workOrderDetail._id,
                            { machineTypeId },
                        )
                        result = {
                            inkPropId: inkProp.propId,
                            inkDefaultValue,
                        }
                    }
                } else {
                    propIds = machineSetting.props.map((p) =>
                        p.propId.toString(),
                    )

                    for (let p of machineSetting.props) {
                        const prop = await MachinePropertyModel.findById(
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
    updateData: async (workOrderId, query, reqData) => {
        try {
            const { isCompleted } = query
            //machineSpecs -> Thông số máy mà kỹ thuật viên tới nhập vào sau khi bảo trì
            const {
                serialNumber,
                maintainContract,
                repairDate,
                departureTime,
                machineInfo,
                technicalFeedback,
                replacement,
                customerFeedback,
                arrivalTime, // Thời gian đến
                leavingTime, //Thời gian đi
                workingTime, //Thời gian sửa chữa 
                installationDate,
                inkCode,
                machineStartup,
                inkjetTime,
                machineCode,
                failureSituation,
                differentApproach,
                machineSpecs,
                evaluate
            } = reqData

            //check workOrder
            const workOrder = await WorkOrderModel.findById(workOrderId).lean()
            if (!workOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }

            if (isCompleted === true || isCompleted === 'true') {
                const isMachineSpecsValid = machineSpecs && machineSpecs.length > 0 && machineSpecs.every(spec => {
                    // Kiểm tra value không được null, undefined hoặc chuỗi rỗng
                    if (Array.isArray(spec.value)) {
                        return spec.value.length > 0;
                    }
                    return spec.value !== '' && spec.value !== null && spec.value !== undefined;
                });

                if (!isMachineSpecsValid) {
                    throw new BadReq(errorCode.MachineSpecs_IN_Valid)
                }
            }

            //UPDATE WORKORDER
            await WorkOrderModel.findByIdAndUpdate(workOrderId, { status: "completed", serialNumber })

            //Lấy model
            const WorkOrderDetailModel = getWorkOrderModel(
                workOrder.typeWork,
                workOrder.type[0],
            )

            const workOrderDetail = await WorkOrderDetailModel.findOne({
                workOrderId,
            })

            //check workOrderDetail có tồn tại hay không
            if (!workOrderDetail) {
                throw new BadReq(errorCode.WORK_ORDER_DETAIL_NOT_FOUND)
            }

            const typeWork = workOrder.typeWork
            const type = workOrder.type[0]

            // Phiếu BẢO TRÌ MAINTENANCE
            if (typeWork === constant.WORK_ORDER_TYPE.MAINTENANCE.value) {
                if (type === constant.WORK_ORDER_DETAIL_TYPE.A.value) {
                    const {
                        maintainContractDate,
                        maintainDate,
                        arrivalTime,
                        departureTime,
                        machineSpecs,
                        maintainOperations,
                        replacement,
                        technicalFeedback,
                        customerFeedback,
                        customerInfo,
                        type,
                        machineName,
                        serialNumber,
                        failureSituation,
                        differentApproach,
                        inkCode,
                        machineStartup,
                        inkjetTime,
                        evaluate
                    } = reqData

                    // for (let i of replacement) {
                    //     const product = await ProductModel.findById(i)
                    //     if (!product) {
                    //         throw new BadReq(errorCode.REPLACEMENT_NOT_FOUND)
                    //     }
                    // }


                    await WorkOrderDetailModel.findByIdAndUpdate(
                        workOrderDetail._id,
                        {
                            customerInfo,
                            maintainDate,
                            arrivalTime,
                            departureTime,
                            type,
                            machineName,
                            serialNumber,
                            maintainContractDate,
                            machineSpecs,
                            failureSituation,
                            differentApproach,
                            technicalFeedback,
                            replacement,
                            customerFeedback,
                            inkCode,
                            machineStartup,
                            inkjetTime,
                            evaluate
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

            //Phiếu SỬA CHỮA
            if (typeWork === constant.WORK_ORDER_TYPE.REPAIR.value) {
                if (type === constant.WORK_ORDER_DETAIL_TYPE.A.value) {
                    await WorkOrderDetailModel.findByIdAndUpdate(
                        workOrderDetail._id,
                        {
                            maintainContract,
                            repairDate,
                            arrivalTime,
                            leavingTime,
                            workingTime,
                            departureTime,
                            installationDate,
                            inkCode,
                            machineStartup,
                            inkjetTime,
                            machineCode,
                            failureSituation,
                            differentApproach,
                            machineInfo,
                            machineSpecs,
                            technicalFeedback,
                            replacement,
                            customerFeedback,
                            evaluate
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

            //Phiếu lắp đặt
            if (typeWork === constant.WORK_ORDER_TYPE.INSTALLATION.value) {
                const {
                    deliveryDate,
                    installDate,
                    handOverDate,
                    machineSpecs,
                    warrantyTime,
                    technicalFeedback,
                    customerFeedback,
                    guide
                } = reqData
                await WorkOrderDetailModel.findByIdAndUpdate(
                    workOrderDetail._id,
                    {
                        deliveryDate,
                        installDate,
                        handOverDate,
                        warrantyTime,
                        machineSpecs,
                        // includedAccessories,
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
                const codeRegex = new RegExp(`^${workOrder.type[0]}`, 'i')
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
    getAllIncludeAccessories: async (query) => {
        try {
            let { search } = query
            search = new RegExp(search, 'i')
            const business = await WorkOrderBusinessModel.findOne({}).lean()
            let items = business?.includedAccessories
            items = items.filter((f) => search.test(f))
            return items
        } catch (error) {
            throw error
        }
    },
    getAllSyncSignal: () => Object.values(constant.SYNC_SIGNAL),
    getAllSyncMode: () => Object.values(constant.SYNC_MODE),
    getAllPurposeTest: () => Object.values(constant.PURPOSE_TEST),
}
module.exports = workOrderDetailService
