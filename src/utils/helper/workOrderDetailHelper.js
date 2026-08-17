const WorkOrderInstallationModel = require('../../models/workOrderInstallation')
const WorkOrderDemoModel = require('../../models/workOrderDemo')
const WorkOrderSamplePrintingModel = require('../../models/workOrderSamplePrinting')
const WorkOrderMaintainAModel = require('../../models/workOrderMaintainA')
const WorkOrderMaintainDModel = require('../../models/workOrderMaintainD')
const WorkOrderMaintainGModel = require('../../models/workOrderMaintainG')
const WorkOrderMaintainMModel = require('../../models/workOrderMaintainM')
const WorkOrderMaintainVModel = require('../../models/workOrderMaintainV')
const WorkOrderRepairAModel = require('../../models/workOrderRepairA')
const WorkOrderRepairDModel = require('../../models/workOrderRepairD')
const WorkOrderRepairGModel = require('../../models/workOrderRepairG')
const WorkOrderRepairMModel = require('../../models/workOrderRepairM')
const WorkOrderRepairVModel = require('../../models/workOrderRepairV')
const WorkOrderTestAModel = require('../../models/workOrderTestA')
const WorkOrderTestDModel = require('../../models/workOrderTestD')
const WorkOrderTestGModel = require('../../models/workOrderTestG')
const WorkOrderTestMModel = require('../../models/workOrderTestM')
const WorkOrderTestVModel = require('../../models/workOrderTestV')

const constant = require('../constant/constant')
const BadReq = require('../response/requestError')
const errorCode = require('../response/errorCode')

const modelMap = {
    [constant.WORK_ORDER_TYPE.INSTALLATION.value]: WorkOrderInstallationModel,
    [constant.WORK_ORDER_TYPE.DEMO.value]: WorkOrderDemoModel,
    [constant.WORK_ORDER_TYPE.SAMPLE_PRINTING.value]:
        WorkOrderSamplePrintingModel,
    [constant.WORK_ORDER_TYPE.MAINTENANCE.value]: {
        [constant.WORK_ORDER_DETAIL_TYPE.A.value]: WorkOrderMaintainAModel,
        [constant.WORK_ORDER_DETAIL_TYPE.D.value]: WorkOrderMaintainDModel,
        [constant.WORK_ORDER_DETAIL_TYPE.G.value]: WorkOrderMaintainGModel,
        [constant.WORK_ORDER_DETAIL_TYPE.M.value]: WorkOrderMaintainMModel,
        [constant.WORK_ORDER_DETAIL_TYPE.V.value]: WorkOrderMaintainVModel,
    },
    [constant.WORK_ORDER_TYPE.REPAIR.value]: {
        [constant.WORK_ORDER_DETAIL_TYPE.A.value]: WorkOrderRepairAModel,
        [constant.WORK_ORDER_DETAIL_TYPE.D.value]: WorkOrderRepairDModel,
        [constant.WORK_ORDER_DETAIL_TYPE.G.value]: WorkOrderRepairGModel,
        [constant.WORK_ORDER_DETAIL_TYPE.M.value]: WorkOrderRepairMModel,
        [constant.WORK_ORDER_DETAIL_TYPE.V.value]: WorkOrderRepairVModel,
    },
    [constant.WORK_ORDER_TYPE.TEST_IO.value]: {
        [constant.WORK_ORDER_DETAIL_TYPE.A.value]: WorkOrderTestAModel,
        [constant.WORK_ORDER_DETAIL_TYPE.D.value]: WorkOrderTestDModel,
        [constant.WORK_ORDER_DETAIL_TYPE.G.value]: WorkOrderTestGModel,
        [constant.WORK_ORDER_DETAIL_TYPE.M.value]: WorkOrderTestMModel,
        [constant.WORK_ORDER_DETAIL_TYPE.V.value]: WorkOrderTestVModel,
    },
}

function getWorkOrderModel(typeWork, type) {
    try {
        if (!typeWork) {
            throw new BadReq(errorCode.WORK_ORDER_TYPE_NOT_FOUND)
        }
        if (
            typeWork !== constant.WORK_ORDER_TYPE.INSTALLATION.value &&
            typeWork !== constant.WORK_ORDER_TYPE.DEMO.value &&
            typeWork !== constant.WORK_ORDER_TYPE.SAMPLE_PRINTING.value
        ) {
            if (!type) {
                throw new BadReq(errorCode.WORK_ORDER_DETAIL_TYPE_NOT_FOUND)
            }
        }

        const model =
            typeWork === constant.WORK_ORDER_TYPE.INSTALLATION.value ||
                typeWork === constant.WORK_ORDER_TYPE.DEMO.value ||
                typeWork === constant.WORK_ORDER_TYPE.SAMPLE_PRINTING.value
                ? modelMap[typeWork]
                : modelMap[typeWork]?.[type]

        if (!model) {
            throw new BadReq(errorCode.MODEL_NOT_FOUND_FOR_TYPE_WORK_AND_TYPE)
        }
        return model
    } catch (error) {
        throw error
    }
}

async function checkExist(workOrderId) {
    try {
        const allModel = Object.values(modelMap).flatMap((i) =>
            typeof i === 'object' ? Object.values(i) : [i],
        )
        const results = await Promise.all(
            allModel.map((m) =>
                m.findOne({ workOrderId, status: { $in: [null, 'active'] } }),
            ),
        )
        return results.some(Boolean)
    } catch (error) {
        throw error
    }
}

module.exports = { getWorkOrderModel, checkExist }
