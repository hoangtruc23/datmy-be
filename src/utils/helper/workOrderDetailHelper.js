const WorkOrderInstallationModel = require('../../models/workOrderInstallation')
const WorkOrderMaintainAModel = require('../../models/workOrderMaintainA')
const WorkOrderMaintainDModel = require('../../models/workOrderMaintainD')
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
    [constant.WORK_ORDER_TYPE.INSTALLATION]: WorkOrderInstallationModel,
    [constant.WORK_ORDER_TYPE.MAINTENANCE]: {
        [constant.WORK_ORDER_DETAIL_TYPE.A]: WorkOrderMaintainAModel,
        [constant.WORK_ORDER_DETAIL_TYPE.D]: WorkOrderMaintainDModel,
        [constant.WORK_ORDER_DETAIL_TYPE.M]: WorkOrderMaintainMModel,
        [constant.WORK_ORDER_DETAIL_TYPE.V]: WorkOrderMaintainVModel,
    },
    [constant.WORK_ORDER_TYPE.REPAIR]: {
        [constant.WORK_ORDER_DETAIL_TYPE.A]: WorkOrderRepairAModel,
        [constant.WORK_ORDER_DETAIL_TYPE.D]: WorkOrderRepairDModel,
        [constant.WORK_ORDER_DETAIL_TYPE.G]: WorkOrderRepairGModel,
        [constant.WORK_ORDER_DETAIL_TYPE.M]: WorkOrderRepairMModel,
        [constant.WORK_ORDER_DETAIL_TYPE.V]: WorkOrderRepairVModel,
    },
    [constant.WORK_ORDER_TYPE.TEST_IO]: {
        [constant.WORK_ORDER_DETAIL_TYPE.A]: WorkOrderTestAModel,
        [constant.WORK_ORDER_DETAIL_TYPE.D]: WorkOrderTestDModel,
        [constant.WORK_ORDER_DETAIL_TYPE.G]: WorkOrderTestGModel,
        [constant.WORK_ORDER_DETAIL_TYPE.M]: WorkOrderTestMModel,
        [constant.WORK_ORDER_DETAIL_TYPE.V]: WorkOrderTestVModel,
    },
}

function getWorkOrderModel(typeWork, type) {
    try {
        if (!typeWork) {
            throw new BadReq(errorCode.WORK_ORDER_TYPE_NOT_FOUND)
        }
        if (!type && typeWork !== constant.WORK_ORDER_TYPE.INSTALLATION) {
            throw new BadReq(errorCode.WORK_ORDER_DETAIL_TYPE_NOT_FOUND)
        }
        const model =
            typeWork === constant.WORK_ORDER_TYPE.INSTALLATION
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
            allModel.map((m) => m.findOne({ workOrderId })),
        )
        return results.some(Boolean)
    } catch (error) {
        throw error
    }
}

module.exports = { getWorkOrderModel, checkExist }
