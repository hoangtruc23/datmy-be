const WorkOrderBusinessModel = require('../models/workOrderBusiness')
const WorkOrderModel = require('../models/workOrder')
const constant = require('../utils/constant/constant')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')
const {
    getWorkOrderModel,
    checkExist,
} = require('../utils/helper/workOrderDetailHelper')

const workOrderDetailService = {
    create: async (workOrderId) => {
        try {
            //check workOrder
            const checkWorkOrder =
                await WorkOrderModel.findById(workOrderId).lean()
            if (!checkWorkOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }
            //Lấy model
            const WorkOrderDetailModel = getWorkOrderModel(
                checkWorkOrder.typeWork,
                checkWorkOrder.type,
            )
            //check workOrderDetail có tồn tại hay không, nếu có thì không cho tạo
            const existed = await checkExist(workOrderId)
            if (existed) {
                throw new BadReq(errorCode.WORK_ORDER_DETAIL_EXISTED)
            }

            await WorkOrderDetailModel.create(workOrderId)
            return null
        } catch (error) {
            throw error
        }
    },
    delete: async (workOrderId) => {
        try {
            //check WorkOrder
            const checkWorkOrder =
                await WorkOrderModel.findById(workOrderId).lean()
            if (!checkWorkOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }
            //Lấy model
            const WorkOrderDetailModel = getWorkOrderModel(
                checkWorkOrder.typeWork,
                checkWorkOrder.type,
            )
            //check workOrderDetail có tồn tại hay không
            const existed = await checkExist(workOrderId)
            if (!existed) {
                throw new BadReq(errorCode.WORK_ORDER_DETAIL_NOT_FOUND)
            }
            //check xem workOrderDetail đã có thông tin chưa, nếu có thì không cho xóa
            const workOrderDetail = await WorkOrderDetailModel.findOne({
                workOrderId,
            })
            if (workOrderDetail.machineTypeId) {
                throw new BadReq(
                    errorCode.WORK_ORDER_DETAIL_HAVE_DATA_SO_CAN_NOT_UPDATE_OR_DELETE,
                )
            }
            await WorkOrderDetailModel.findOneAndDelete({ workOrderId })
            return null
        } catch (error) {
            throw error
        }
    },
}
module.exports = workOrderDetailService
