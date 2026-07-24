const ExcelJS = require('exceljs');
const path = require('path');
const WorkOrderBusinessModel = require('../models/workOrderBusiness')
const WorkOrderModel = require('../models/workOrder')
const constant = require('../utils/constant/constant')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')
const MachineSettingModel = require('../models/machineSetting')
const ProductModel = require('../models/product')
const MachinePropertyModel = require('../models/machineProperties')
const ProductCategoryModel = require('../models/productCategory')
const TechnicianModel = require('../models/technician')
const {
    getWorkOrderModel,
    checkExist,
} = require('../utils/helper/workOrderDetailHelper')
const technicianService = require('./technicianService')
const contactPersonCustomerService = require('./contactPersonCustomerService')
const pdfService = require('./pdfService')

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
                .select({
                    customerId: 1, contactPerson: 1, serialNumber: 1, type: 1, typeWork: 1, createdAt: 1, address: 1, technicianId: 1,
                    status: 1
                })
                .populate(
                    'customerId technicianId',
                    'officialName representative.name phone email fullname',
                )
                .lean()

            if (!workOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }

            const machine = await ProductModel.findOne({ code: workOrder.type }, { name: 1 })

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
            }, { _id: 0 }).lean()

            const isTestDetail =
                workOrder.typeWork === constant.WORK_ORDER_TYPE.TEST_IO.value &&
                ['D', 'G', 'M', 'V', 'A'].includes(workOrder.type?.[0])


            const spectValue = isTestDetail
                ? workOrderDetail?.props
                : workOrderDetail?.machineSpecs


            const settingMap = machineSetting?.props.reduce((acc, setting) => {
                acc[setting._id.toString()] = setting;
                return acc;
            }, {});

            let machineValues = {}
            let spectMap = []
            if (settingMap != undefined) {

                if (spectValue) {
                    spectMap = spectValue.reduce((acc, spect) => {
                        acc[spect.propId.toString()] = spect.value;
                        return acc;
                    }, {});
                }

                machineValues = Object.values(settingMap).map((settingDetail) => {
                    const propId = settingDetail._id.toString();
                    // Lấy giá trị từ Map
                    const value = spectMap[propId] ?? null;
                    return {
                        ...settingDetail,
                        value: value,
                    };
                });
            }

            let flattenedOrderDetail = null;
            if (workOrderDetail) {
                // Bóc tách baseInfo ra riêng, tất cả các trường còn lại gom vào rest
                const { baseInfo, ...rest } = workOrderDetail;
                flattenedOrderDetail = {
                    ...rest,
                    ...baseInfo // Trải các tham số bên trong baseInfo ra ngoài
                };
            }

            return { ...workOrder, machineSetting: Array.isArray(machineValues) ? machineValues : [] || [], machineName: machine.name, workOrderDetail: flattenedOrderDetail }
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
            const { isCompleted } = query;
            const isComp = isCompleted === true || isCompleted === 'true';

            // 1. Kiểm tra WorkOrder tồn tại
            const workOrder = await WorkOrderModel.findById(workOrderId).lean();
            if (!workOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND);
            }

            const typeWork = workOrder.typeWork;
            const workOrderType = workOrder.type[0]; // Dòng máy hiện tại của WorkOrder

            // Check xem dữ liệu gửi lên có đổi dòng máy khác không
            if (reqData.type && workOrderType !== reqData.type[0]) {
                throw new BadReq(errorCode.TYPE_MACHINE_INVALIB);
            }

            // 2. Lấy chi tiết WorkOrderDetail
            const WorkOrderDetailModel = getWorkOrderModel(typeWork, workOrderType);
            const workOrderDetail = await WorkOrderDetailModel.findOne({ workOrderId });
            if (!workOrderDetail) {
                throw new BadReq(errorCode.WORK_ORDER_DETAIL_NOT_FOUND);
            }

            // 3. KIỂM TRA ĐIỀU KIỆN (Validation)
            if (isComp) {
                const { machineSpecs } = reqData;
                const isMachineSpecsValid = machineSpecs && machineSpecs.length > 0 && machineSpecs.every(spec => {
                    if (Array.isArray(spec.value)) return spec.value.length > 0;
                    return spec.value !== '' && spec.value !== null && spec.value !== undefined;
                });

                if (!isMachineSpecsValid && workOrderType !== "G") {
                    throw new BadReq(errorCode.MachineSpecs_IN_Valid);
                }
            }

            // 4. TÍNH TOÁN THỜI GIAN SỬA CHỮA
            let timeUpdatePayload = {};
            const { arrivalTime, leavingTime } = reqData;

            //KTV CHECK-OUT
            if (leavingTime) {
                const arrival = arrivalTime || workOrderDetail?.arrivalTime;
                if (!arrival) {
                    throw new BadReq(errorCode.ARRIVAL_TIME_REQUIRED);
                }
                const timeMs = new Date(leavingTime) - new Date(arrival);
                const minutes = (timeMs / (1000 * 60)).toFixed(1);
                let workingTime = "";

                if (minutes >= 60) {
                    const hours = Math.floor(minutes / 60);
                    const mins = (minutes % 60).toFixed(1);
                    workingTime = `${hours} giờ ${mins} phút`;
                } else {
                    workingTime = `${minutes} phút`;
                }
                timeUpdatePayload = { arrivalTime, leavingTime, workingTime };
            } else if (arrivalTime && workOrderDetail.leavingTime) {
                throw new BadReq(errorCode.CANT_UPDATE_TIME);
            } else if (arrivalTime) {
                //KTV CHECK-IN
                timeUpdatePayload = { arrivalTime };

                await WorkOrderModel.findByIdAndUpdate(workOrderId, {
                    status: constant.WORK_REQUEST_STATUS.IN_PROGRESS.value || 'inProgress'
                });
            }

            // 5. PAYLOAD CẬP NHẬT THEO TỪNG LOẠI PHIẾU
            let updateDetailPayload = { ...timeUpdatePayload };

            // PHIẾU TEST (TEST_IO)
            if (typeWork === constant.WORK_ORDER_TYPE.TEST_IO.value) {

                if (reqData?.machineSpecs && !reqData?.props) {
                    reqData.props = reqData.machineSpecs
                }

                if (workOrderType === constant.WORK_ORDER_DETAIL_TYPE.A.value) {
                    const { testDate, technicalId, machineTypeId, inkCode, props, image } = reqData

                    Object.assign(updateDetailPayload, {
                        testDate,
                        technicalId,
                        machineTypeId,
                        inkCode,
                        props,
                        image,
                    })
                } else {
                    // workOrderTestD/G/M/V: fields nằm trong baseInfo
                    // UI hiện tại có thể gửi top-level: testDate/purposeTest/receiptDate và machineSpecs
                    // -> convert sang đúng shape backend nhận

                    let baseInfo = reqData?.baseInfo
                    let props = reqData?.props
                    const { machineTypeId, image } = reqData

                    if (!baseInfo && (reqData?.testDate || reqData?.purposeTest || reqData?.receiptDate !== undefined)) {
                        baseInfo = {
                            testDate: reqData?.testDate ?? null,
                            purposeTest: reqData?.purposeTest ?? null,
                            receiptDate: reqData?.receiptDate ?? null,
                        }
                        // testDate = reqData?.testDate ?? null;
                        // purposeTest = reqData?.purposeTest ?? null;
                        // receiptDate = reqData?.receiptDate ?? null;
                    }

                    if (!props && Array.isArray(reqData?.machineSpecs)) {
                        // Normalize về đúng shape propSchema: { propId, value }
                        props = reqData.machineSpecs.map((s) => ({
                            propId: s.propId,
                            value: s.value,
                        }))
                    }



                    const testDate = reqData?.testDate ? new Date(reqData.testDate) : (baseInfo?.testDate ?? null)
                    const purposeTest = reqData?.purposeTest ?? baseInfo?.purposeTest ?? null
                    const receiptDate = reqData?.receiptDate ? new Date(reqData.receiptDate) : (baseInfo?.receiptDate ?? null)

                    const sharedPayload = {
                        baseInfo,
                        purposeTest,
                        receiptDate,
                        testDate,
                        machineTypeId,
                        props,
                        image,
                    }

                    if (workOrderType === constant.WORK_ORDER_DETAIL_TYPE.G.value) {
                        Object.assign(sharedPayload, {
                            inkCode: reqData?.inkCode ?? null,
                            printHeads: reqData?.printHeads ?? [],
                            printHead: reqData?.printHead ?? null,
                            singleHeadCount: reqData?.singleHeadCount ?? null,
                            compositeHeadCount: reqData?.compositeHeadCount ?? null,
                            serialPrintHeads: reqData?.serialPrintHeads ?? [],
                            serialControllerNumber: reqData?.serialControllerNumber ?? null,
                        })
                    }

                    if (workOrderType === constant.WORK_ORDER_DETAIL_TYPE.D.value) {
                        Object.assign(sharedPayload, {
                            serialControllerNumber: reqData?.serialControllerNumber ?? null,
                            serialLaserHeadNumber: reqData?.serialLaserHeadNumber ?? null,
                            controllerTime: reqData?.controllerTime ?? null,
                            laserHeadTime: reqData?.laserHeadTime ?? null,
                        })
                    }

                    if (workOrderType === constant.WORK_ORDER_DETAIL_TYPE.M.value) {
                        Object.assign(sharedPayload, {
                            serialControllerNumber: reqData?.serialControllerNumber ?? null,
                            serialNumber: reqData?.serialNumber ?? null,
                            otherFeatures: reqData?.otherFeatures ?? [],
                        })
                    }

                    if (workOrderType === constant.WORK_ORDER_DETAIL_TYPE.V.value) {
                        Object.assign(sharedPayload, {
                            serialNumber: reqData?.serialNumber ?? null,
                            serialControllerNumber: reqData?.serialControllerNumber ?? null,
                        })
                    }

                    Object.assign(updateDetailPayload, sharedPayload)
                }
            }
            // PHIẾU BẢO TRÌ
            else if (typeWork === constant.WORK_ORDER_TYPE.MAINTENANCE.value) {
                //PHIẾU A
                if (workOrderType === constant.WORK_ORDER_DETAIL_TYPE.A.value) {
                    const {
                        maintainContractDate, maintainDate, machineSpecs, replacement,
                        technicalFeedback, customerFeedback, customerInfo, machineName,
                        serialNumber, failureSituation, differentApproach, inkCode,
                        machineStartup, inkjetTime, evaluate, type, ambientTemperature, environmentHumidity, dustLevel
                    } = reqData;

                    Object.assign(updateDetailPayload, {
                        customerInfo, maintainDate, type, machineName, serialNumber,
                        maintainContractDate, machineSpecs, failureSituation, differentApproach,
                        technicalFeedback, replacement, customerFeedback, inkCode,
                        machineStartup, inkjetTime, evaluate, ambientTemperature, environmentHumidity, dustLevel
                    });
                }
                // PHIẾU G
                else if (workOrderType === constant.WORK_ORDER_DETAIL_TYPE.G.value) {
                    const fieldsG = ['machineTypeId', 'machineInfo', 'maintainContract', 'repairDate', 'arrivalTime', 'leavingTime', 'workingTime', 'ambientTemperature', 'environmentHumidity', 'dustLevel', 'installationDate', 'printHead', 'inkSupply', 'singlePrintHead', 'compositePrintHead', 'singleSerialNumber', 'compositeSerialNumber', 'machineSpecs', 'groups', 'maintainOperations', 'technicalFeedback', 'customerFeedback'];
                    fieldsG.forEach(key => reqData[key] !== undefined && (updateDetailPayload[key] = reqData[key]));
                }
                else if (workOrderType === "D" || workOrderType === constant.WORK_ORDER_DETAIL_TYPE.D?.value) {
                    const fieldsD = [
                        'machineTypeId', 'machineInfo', 'maintainContract', 'maintainDate',
                        'arrivalTime', 'leavingTime', 'workingTime', 'ambientTemperature',
                        'environmentHumidity', 'dustLevel', 'installationDate',
                        'serialControllerNumber', 'serialLaserHeadNumber', 'controllerTime',
                        'laserHeadTime', 'maintainOperations', 'machineSpecs',
                        'differentApproach', 'failureSituation', 'technicalFeedback',
                        'replacement', 'customerFeedback', 'evaluate', 'note', 'signature'
                    ];
                    fieldsD.forEach(key => reqData[key] !== undefined && (updateDetailPayload[key] = reqData[key]));
                }
                else {
                    const { machineInfo, machineSpecs, groups, maintainOperations, technicalFeedback, customerFeedback } = reqData;
                    Object.assign(updateDetailPayload, { machineInfo, machineSpecs, groups, maintainOperations, technicalFeedback, customerFeedback });
                }
            }
            // PHIẾU SỬA CHỮA
            else if (typeWork === constant.WORK_ORDER_TYPE.REPAIR.value) {
                if (workOrderType === constant.WORK_ORDER_DETAIL_TYPE.A.value) {
                    const {
                        maintainContract, repairDate, installationDate, inkCode, machineStartup,
                        inkjetTime, machineCode, failureSituation, differentApproach, machineInfo,
                        machineSpecs, technicalFeedback, replacement, customerFeedback, evaluate,
                        ambientTemperature, environmentHumidity, dustLevel
                    } = reqData;

                    Object.assign(updateDetailPayload, {
                        maintainContract, repairDate, installationDate, inkCode, machineStartup,
                        inkjetTime, machineCode, failureSituation, differentApproach, machineInfo,
                        machineSpecs, technicalFeedback, replacement, customerFeedback, evaluate,
                        ambientTemperature, environmentHumidity, dustLevel
                    });
                } else if (workOrderType === "G") {
                    updateDetailPayload = { ...updateDetailPayload, ...reqData };
                } else {
                    const {
                        maintainContract, repairDate, installationDate, serialControllerNumber,
                        serialLaserHeadNumber, laserHeadTime, controllerTime, machineCode,
                        failureSituation, differentApproach, machineInfo, machineSpecs,
                        technicalFeedback, replacement, customerFeedback, evaluate,
                        adhesiveType, ribbonType, labelSize, padSize, beltSpeed
                    } = reqData;

                    Object.assign(updateDetailPayload, {
                        maintainContract, repairDate, installationDate, serialControllerNumber,
                        serialLaserHeadNumber, laserHeadTime, controllerTime, machineCode,
                        failureSituation, differentApproach, machineInfo, machineSpecs,
                        technicalFeedback, replacement, customerFeedback, evaluate,
                        adhesiveType, ribbonType, labelSize, padSize, beltSpeed
                    });
                }
            }
            // PHIẾU LẮP ĐẶT
            else if (typeWork === constant.WORK_ORDER_TYPE.INSTALLATION.value) {
                const { deliveryDate, installDate, handOverDate, machineSpecs, warrantyTime, guide } = reqData;
                Object.assign(updateDetailPayload, { deliveryDate, installDate, handOverDate, warrantyTime, machineSpecs, guide });
            }

            // Thực hiện cập nhật vào DB chi tiết phiếu
            const updatedDetail = await WorkOrderDetailModel.findByIdAndUpdate(
                workOrderDetail._id,
                updateDetailPayload,
                { new: true }
            );

            // // Trigger filter change warning checks for machine Model A (starts with "A")
            // if (workOrderType === "A" || (workOrder.type && workOrder.type[0] === "A")) {
            //     const replacement = reqData.replacement !== undefined ? reqData.replacement : updatedDetail.replacement;
            //     const inkjetTime = reqData.inkjetTime !== undefined ? reqData.inkjetTime : updatedDetail.inkjetTime;
            //     const dateOfChange = reqData.repairDate || reqData.maintainDate || updatedDetail.repairDate || updatedDetail.maintainDate;

            //     await contactPersonCustomerService.updateFilterChangeStatus(
            //         workOrder.customerId,
            //         reqData.serialNumber || workOrder.serialNumber,
            //         workOrderType,
            //         { replacement, inkjetTime, dateOfChange }
            //     );
            // }

            // 6. XỬ LÝ KHI HOÀN THÀNH PHIẾU (isCompleted === true)
            if (isComp) {
                // UPDATE WORKORDER thành completed
                await WorkOrderModel.findByIdAndUpdate(workOrderId, {
                    status: "completed",
                    serialNumber: reqData.serialNumber || workOrder.serialNumber
                });

                // UPDATE STATUS KỸ THUẬT VIÊN
                await technicianService.checkStatusTechnical(workOrder.technicianId);

                // UPDATE KHÁCH HÀNG
                const dataUpdate = {
                    customerId: workOrder?.customerId,
                    serialNumber: reqData?.serialNumber,
                    productCode: reqData?.type,
                    oldSerialNumber: workOrder?.serialNumber,
                    installDate: reqData?.installationDate || updatedDetail?.installationDate || reqData?.installDate || updatedDetail?.installDate
                };

                await contactPersonCustomerService.create(dataUpdate, 'update');

                return null; // Hoàn thành toàn bộ quy trình đơn hàng
            }

            // Nếu chỉ là update tiến độ/thời gian thông thường (isCompleted = false)
            return { workingTime: updatedDetail?.workingTime };

        } catch (error) {
            throw error;
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

    generatePdf: async (workOrderId) => {
        //check workOrder
        const workOrder = await WorkOrderModel.findById(workOrderId).populate('customerId', 'officialName').lean()
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
        }).populate('machineSpecs.propId');

        if (!workOrderDetail) {
            throw new BadReq(errorCode.WORK_ORDER_DETAIL_NOT_FOUND)
        }

        const data = { ...workOrder, workOrderDetail }

        const pdfBuffer = await pdfService.generateWorkOrderPdf(data)

        const typeWorkLabel = data.typeWork === 'repair'
            ? "sua_chua"
            : data.typeWork === "maintain"
                ? "bao_tri"
                : "lap_dat";

        return {
            pdfBuffer: pdfBuffer,
            typeWorkLabel: typeWorkLabel,
        }
    },

    generateExcel: async (workOrderId) => {
        try {
            // 1. Lấy dữ liệu từ DB (Dựa trên schema chính xác của bạn)
            const workOrder = await WorkOrderModel.findById(workOrderId).populate('customerId', 'officialName').lean();
            if (!workOrder) throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND);

            const WorkOrderDetailModel = getWorkOrderModel(workOrder.typeWork, workOrder.type[0]);
            const detail = await WorkOrderDetailModel.findOne({ workOrderId }).populate('machineSpecs.propId').lean();
            if (!detail) throw new BadReq(errorCode.WORK_ORDER_DETAIL_NOT_FOUND);

            // 2. Đọc file Template Excel chứa các token {{biến}} của bạn
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(path.join(__dirname, '../templates/excel_template_repair.xlsx'));
            const ws = workbook.getWorksheet(1);

            // 3. Chuẩn bị object map dữ liệu tương thích với các Token {{key}} trong Excel
            const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : "";
            // Xử lý mảng machineSpecs động
            const mSpecs = detail.machineSpecs || [];

            const getSpec = (name) => {
                const spec = mSpecs.find(s => s?.propId?.name?.toLowerCase().trim() === name.toLowerCase().trim());
                return spec ? (spec.value ?? "") : "";
            };

            const subValue = (arr, subName) => {
                const item = arr.find(i => i && i.name && i.name.toLowerCase().trim() === subName.toLowerCase().trim());
                return item ? (item.value ?? "") : "";
            };

            const itmArray = getSpec("ITM") || [];
            const itmString = itmArray
                .filter(item => item && item.value !== undefined && item.value !== null && String(item.value).trim() !== "")
                .map(item => `${item.name}: ${item.value}`)
                .join(', ');

            const addr = workOrder?.address;

            const replacements = {
                // Dữ liệu từ workOrder cha
                "{{officialName}}": workOrder.customerId?.officialName || "",
                "{{reportDate}}": formatDate(workOrder.createdAt),
                "{{machineType}}": workOrder.type || "",
                "{{serialNumber}}": workOrder.serialNumber || "",
                "{{contactPerson}}": workOrder?.contactPerson?.contactName || "",
                "{{address}}": addr
                    ? [addr.specificAddress, addr.ward, addr.provinceCity].filter(Boolean).join(", ")
                    : "",

                // Dữ liệu từ workOrderRepairASchema của bạn
                "{{installationDate}}": formatDate(detail.installationDate),
                "{{repairDate}}": formatDate(detail.repairDate),
                // "{{arrivalTime}}": detail.arrivalTime || "",
                // "{{leavingTime}}": detail.leavingTime || "",
                "{{arrivalTime}}": detail.arrivalTime ? detail.arrivalTime.slice(11, 16) : "",
                "{{leavingTime}}": detail.leavingTime ? detail.leavingTime.slice(11, 16) : "",
                "{{workingTime}}": detail.workingTime ? `${detail.workingTime}` : "0 phút",
                "{{ambientTemperature}}": detail.ambientTemperature !== null ? `${detail.ambientTemperature}°C` : "",
                "{{environmentHumidity}}": detail.environmentHumidity !== null ? `${detail.environmentHumidity}%` : "",
                "{{dustLevel}}": detail.dustLevel || "",
                "{{inkCode}}": detail.inkCode || "",
                "{{machineStartup}}": detail.machineStartup || "",
                "{{inkjetTime}}": detail.inkjetTime || "",

                // Xử lý các mảng chuỗi [String] bằng cách gom dòng bằng dấu xuống dòng \n
                "{{failureSituation}}": Array.isArray(detail.failureSituation) ? detail.failureSituation.map(x => `- ${x}`).join('\n') : "",
                "{{differentApproach}}": Array.isArray(detail.differentApproach) ? detail.differentApproach.map(x => `- ${x}`).join('\n') : "",
                "{{technicalFeedback}}": Array.isArray(detail.technicalFeedback) ? detail.technicalFeedback.map(x => `- ${x}`).join('\n') : "",
                "{{replacement}}": Array.isArray(detail.replacement) ? detail.replacement.map(x => `- ${x}`).join('\n') : "",
                "{{customerFeedback}}": Array.isArray(detail.customerFeedback) ? detail.customerFeedback.map(x => `- ${x}`).join('\n') : "",

                // Map các thông số con trong bảng máy
                "{{ink_conc_arrival}}": subValue(getSpec("Nồng độ mực"), "Lúc đến"),
                "{{ink_conc_departure}}": subValue(getSpec("Nồng độ mực"), "Lúc đi"),
                "{{standard_conc}}": getSpec("Nồng độ chuẩn"),
                "{{pump_speed}}": getSpec("Tốc độ bơm"),
                "{{standard_pressure}}": getSpec("Áp suất chuẩn"),
                "{{current_pressure}}": getSpec("Áp suất hiện hành"),
                "{{nozzle}}": getSpec("Béc phun"),
                "{{charge_level}}": getSpec("Charge level"),
                "{{vacuum_pressure}}": getSpec("Áp chân không"),
                "{{vacuum_pump_speed}}": getSpec("Tốc độ bơm chân không"),
                "{{printContent}}": getSpec("Nội dung in phun"),
                "{{cai_tu_dong}}": subValue(getSpec("Mức giọt mực"), "Cài tự động"),
                "{{thao_tac_tay}}": subValue(getSpec("Mức giọt mực"), "Thao tác tay"),
                "{{bup}}": subValue(getSpec("Mức giọt mực"), "BUP"),
                "{{ink_temp}}": getSpec("Nhiệt độ mực"),
                "{{itm}}": itmString,
                "{{time_start}}": getSpec("Đầu thời gian"),
                "{{software_version}}": getSpec("Phần mềm sử dụng"),
            };

            // 4. QUÉT QUA TOÀN BỘ CÁC Ô TRÊN SHEET ĐỂ REPLACE BIẾN
            ws.eachRow((row) => {
                row.eachCell((cell) => {
                    if (cell.value && typeof cell.value === 'string') {
                        let cellStr = cell.value;
                        let updated = false;

                        // Tìm xem nội dung ô có chứa token nào trong danh sách không
                        for (const [token, realValue] of Object.entries(replacements)) {
                            if (cellStr.includes(token)) {
                                cellStr = cellStr.replace(new RegExp(token, 'g'), realValue);
                                updated = true;
                            }
                        }

                        if (updated) {
                            cell.value = cellStr;
                            // Giữ định dạng chuyên nghiệp: tự động xuống dòng đối với ô chứa nội dung dài
                            if (cellStr.includes('\n')) {
                                cell.alignment = { ...cell.alignment, wrapText: true, vertical: 'top' };
                            }
                        }
                    }
                });
            });

            // 5. Xử lý riêng biệt Checkbox cho `maintainContract` (Boolean)
            const isMaintain = detail.maintainContract === true;
            ws.eachRow((row) => {
                row.eachCell((cell) => {
                    if (cell.value === '{{maintainContract_true}}') cell.value = isMaintain ? "X" : "";
                    if (cell.value === '{{maintainContract_false}}') cell.value = isMaintain ? "" : "X";

                    if (cell.value === '{{evaluationRatings}}') {
                        const score = detail.evaluate;
                        cell.value = `${score >= 3 ? '[X]' : '[  ]'} 😊   ${score === 2 || !score ? '[X]' : '[  ]'} 😐   ${score <= 1 && score !== null ? '[X]' : '[  ]'} 🙁`;
                    }
                });
            });

            // 6. Trả file buffer về cho client tải xuống
            const buffer = await workbook.xlsx.writeBuffer();
            return buffer;

        } catch (error) {
            throw error;
        }
    }
}
module.exports = workOrderDetailService
