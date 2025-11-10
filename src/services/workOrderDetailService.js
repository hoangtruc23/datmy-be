const WorkOrderInstallationModel = require('../models/workOrderInstallation')
const WorkOrderMaintainAModel = require('../models/workOrderMaintainA')
const WorkOrderMaintainDModel = require('../models/workOrderMaintainD')
const WorkOrderMaintainMModel = require('../models/workOrderMaintainM')
const WorkOrderMaintainVModel = require('../models/workOrderMaintainV')
const WorkOrderRepairAModel = require('../models/workOrderRepairA')
const WorkOrderRepairDModel = require('../models/workOrderRepairD')
const WorkOrderRepairGModel = require('../models/workOrderRepairG')
const WorkOrderRepairMModel = require('../models/workOrderRepairM')
const WorkOrderRepairVModel = require('../models/workOrderRepairV')
const WorkOrderTestAModel = require('../models/workOrderTestA')
const WorkOrderTestDModel = require('../models/workOrderTestD')
const WorkOrderTestGModel = require('../models/workOrderTestG')
const WorkOrderTestMModel = require('../models/workOrderTestM')
const WorkOrderTestVModel = require('../models/workOrderTestV')

const WorkOrderBusinessModel = require('../models/workOrderBusiness')
const constant = require('../utils/constant/constant')

const workOrderDetailService = {
    create: async (reqData) => {
        try {
            const { typeWork, type, data } = reqData
            if (typeWork === constant.WORK_ORDER_TYPE.INSTALLATION) {
                await WorkOrderInstallationModel.create(data)
            } else if (typeWork === constant.WORK_ORDER_TYPE.MAINTENANCE) {
                if (type === constant.WORK_ORDER_DETAIL_TYPE.A) {
                    await WorkOrderMaintainAModel.create(data)
                }
                if (type === constant.WORK_ORDER_DETAIL_TYPE.D) {
                    await WorkOrderMaintainDModel.create(data)
                }
                if (type === constant.WORK_ORDER_DETAIL_TYPE.M) {
                    await WorkOrderMaintainMModel.create(data)
                }
                if (type === constant.WORK_ORDER_DETAIL_TYPE.V) {
                    await WorkOrderMaintainVModel.create(data)
                }
            } else if (typeWork === constant.WORK_ORDER_TYPE.REPAIR){
                if (type === constant.WORK_ORDER_DETAIL_TYPE.A) {
                    await WorkOrderRepairAModel.create(data)
                }
                if (type === constant.WORK_ORDER_DETAIL_TYPE.D) {
                    await WorkOrderRepairDModel.create(data)
                }
                if (type === constant.WORK_ORDER_DETAIL_TYPE.G) {
                    await WorkOrderRepairGModel.create(data)
                }
                if (type === constant.WORK_ORDER_DETAIL_TYPE.M) {
                    await WorkOrderRepairMModel.create(data)
                }
                if (type === constant.WORK_ORDER_DETAIL_TYPE.V) {
                    await WorkOrderRepairVModel.create(data)
                }
            }else if(typeWork === constant.WORK_ORDER_TYPE.TEST_IO){
                if (type === constant.WORK_ORDER_DETAIL_TYPE.A) {
                    await WorkOrderTestAModel.create(data)
                }
                if (type === constant.WORK_ORDER_DETAIL_TYPE.D) {
                    await WorkOrderTestDModel.create(data)
                }
                if (type === constant.WORK_ORDER_DETAIL_TYPE.G) {
                    await WorkOrderTestGModel.create(data)
                }
                if (type === constant.WORK_ORDER_DETAIL_TYPE.M) {
                    await WorkOrderTestMModel.create(data)
                }
                if (type === constant.WORK_ORDER_DETAIL_TYPE.V) {
                    await WorkOrderTestVModel.create(data)
                }
            }
        } catch (error) {
            throw error
        }
    },
}
module.exports = workOrderDetailService
