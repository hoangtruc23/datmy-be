const express = require('express')
const router = express.Router()

const workOrderController = require('../controllers/workOrderController')
const workOrderValidation = require('../validations/workOrderValidation')
const validate = require('../middlewares/validation')

router.get(
    '/getAll',
    validate(workOrderValidation.getAll),
    workOrderController.getAll,
)
router.get('/getById/:workOrderId', workOrderController.getById)
router.get('/getOverall', workOrderController.getOverall)
router.post(
    '/create',
    validate(workOrderValidation.create),
    workOrderController.create,
)
router.post(
    '/update/:workOrderId',
    validate(workOrderValidation.update),
    workOrderController.update,
)
router.delete('/delete/:workOrderId', workOrderController.delete)
router.get('/getAllState', workOrderController.getAllState)
router.get('/getAllPriority', workOrderController.getAllPriority)
router.get('/getAllWorkType', workOrderController.getAllWorkType)
router.get('/getAllType', workOrderController.getAllType)
router.get(
    '/getAllWorkRequestSource',
    workOrderController.getAllWorkRequestSource,
)
router.get(
    '/getAllTechnicianStatus',
    workOrderController.getAllTechnicianStatus,
)
/**
 * @swagger
 * tags:
 *   name: WorkOrder
 *   description: phiếu công việc
 */

/**
 * @swagger
 * /workOrder/getAll:
 *   get:
 *     summary: Lấy toàn bộ các yêu cầu công việc
 *     security:
 *       - bearerAuth: []
 *     tags: [WorkOrder]
 *     parameters:
 *       - name: typeWork
 *         in: query
 *         schema:
 *           type: string
 *           enum: ["repair", "maintenance", "installation", "testIO", "demo", "samplePrinting"]
 *           default: ""
 *         description: Loại công việc
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: ["pending", "inProgress", "completed", "overdue"]
 *         description: Tình trạng của phiếu yêu cầu công việc
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *         description: Page muốn lấy
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *         description: Giới hạn số phần tử trong 1 page
 *     responses:
 *       200:
 *         description: Trả về danh sách các phiếu yêu cầu công việc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 code:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: OK!
 *                 data:
 *                   type: object
 *                   properties:
 *                     result:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 68dba8f3edc476e8fc580c77
 *                           customerId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 689b2296324b9d06707dec99
 *                               officialName:
 *                                 type: string
 *                                 example: CÔNG TY CỔ PHẦN DƯỢC PHẨM 23/9
 *                               representative:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                                     example: ""
 *                           code:
 *                             type: string
 *                             example: JOB-00001
 *                           typeWork:
 *                             type: string
 *                             example: repair
 *                           type:
 *                             type: string
 *                             example: ""
 *                           requestSource:
 *                             type: string
 *                             example: warehouse
 *                           header:
 *                             type: string
 *                             example: TEST1
 *                           description:
 *                             type: string
 *                             example: sửa máy test
 *                           status:
 *                             type: string
 *                             example: pending
 *                           priority:
 *                             type: string
 *                             example: low
 *                           address:
 *                             type: string
 *                             example: 123, ABC Street
 *                           estimatedTime:
 *                             type: number
 *                             example: 2
 *                           overDueTime:
 *                             type: string
 *                             format: date-time
 *                             example: 2026-01-01T00:00:00.000Z
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-09-30T09:54:59.384Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-09-30T09:54:59.384Z
 *                           __v:
 *                             type: number
 *                             example: 0
 *                           technicianInfo:
 *                             type: object
 *                             properties:
 *                               technicianId:
 *                                 type: string
 *                                 example: 68dba0c6d790507bce84d743
 *                               fullname:
 *                                 type: string
 *                                 example: Nguyễn Văn A
 *                     totalItems:
 *                       type: number
 *                       example: 1
 *                     page:
 *                       type: number
 *                       example: 1
 *                     totalPage:
 *                       type: number
 *                       example: 1
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /workOrder/getById/{workOrderId}:
 *   get:
 *     summary: Lấy yêu cầu công việc theo id
 *     security:
 *       - bearerAuth: []
 *     tags: [WorkOrder]
 *     parameters:
 *       - in: path
 *         name: workOrderId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của phiếu cần lấy thông tin
 *     responses:
 *       200:
 *         description: Trả về thông tin chi tiết một phiếu yêu cầu công việc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 code:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: OK!
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 68dba8f3edc476e8fc580c77
 *                     customerId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 689b2296324b9d06707dec99
 *                         officialName:
 *                           type: string
 *                           example: CÔNG TY CỔ PHẦN DƯỢC PHẨM 23/9
 *                         representative:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               example: ""
 *                     code:
 *                       type: string
 *                       example: JOB-00001
 *                     typeWork:
 *                       type: string
 *                       example: repair
 *                     type:
 *                       type: string
 *                       example: ""
 *                     requestSource:
 *                       type: string
 *                       example: warehouse
 *                     header:
 *                       type: string
 *                       example: TEST1
 *                     description:
 *                       type: string
 *                       example: sửa máy test
 *                     status:
 *                       type: string
 *                       example: pending
 *                     priority:
 *                       type: string
 *                       example: low
 *                     address:
 *                       type: string
 *                       example: 123, ABC Street
 *                     estimatedTime:
 *                       type: number
 *                       example: 2
 *                     overDueTime:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-01-01T00:00:00.000Z
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-09-30T09:54:59.384Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-09-30T09:54:59.384Z
 *                     __v:
 *                       type: number
 *                       example: 0
 *                     technicianInfo:
 *                       type: object
 *                       properties:
 *                         technicianId:
 *                           type: string
 *                           example: 68dba0c6d790507bce84d743
 *                         fullname:
 *                           type: string
 *                           example: Nguyễn Văn A
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /workOrder/getOverall:
 *   get:
 *     summary: Lấy thống kê về các phiếu yêu cầu công việc
 *     security:
 *       - bearerAuth: []
 *     tags: [WorkOrder]
 *     parameters: []
 *     responses:
 *       200:
 *         description: Trả về tổng quan của các phiếu yêu cầu công việc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 code:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: OK!
 *                 data:
 *                   type: object
 *                   properties:
 *                     pending:
 *                       type: number
 *                       example: 3
 *                     inProgress:
 *                       type: number
 *                       example: 1
 *                     completed:
 *                       type: number
 *                       example: 0
 *                     overdue:
 *                       type: number
 *                       example: 0
 *                     dueNow:
 *                       type: number
 *                       example: 1
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /workOrder/getAllState:
 *   get:
 *     summary: Lấy ra tất cả các trạng thái
 *     security:
 *       - bearerAuth: []
 *     tags: [WorkOrder]
 *     parameters: []
 *     responses:
 *       200:
 *         description: Trả về tất cả các trạng thái
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 code:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: OK!
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         example: pending
 *                       name:
 *                         type: string
 *                         example: Chờ xử lý
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /workOrder/getAllPriority:
 *   get:
 *     summary: Lấy ra tất cả các độ ưu tiên
 *     security:
 *       - bearerAuth: []
 *     tags: [WorkOrder]
 *     parameters: []
 *     responses:
 *       200:
 *         description: Trả về tất cả độ ưu tiên
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 code:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: OK!
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         example: high
 *                       name:
 *                         type: string
 *                         example: cao
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /workOrder/getAllWorkType:
 *   get:
 *     summary: Lấy ra tất cả các loại công việc
 *     security:
 *       - bearerAuth: []
 *     tags: [WorkOrder]
 *     parameters: []
 *     responses:
 *       200:
 *         description: Trả về tất cả các loại công việc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 code:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: OK!
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         example: Repair
 *                       name:
 *                         type: string
 *                         example: Sửa chữa
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /workOrder/getAllType:
 *   get:
 *     summary: Lấy ra tất cả các loại chi tiết công việc
 *     security:
 *       - bearerAuth: []
 *     tags: [WorkOrder]
 *     parameters: []
 *     responses:
 *       200:
 *         description: Trả về tất cả loại chi tiết công việc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 code:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: OK!
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         example: A
 *                       name:
 *                         type: string
 *                         example: A
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /workOrder/getAllWorkRequestSource:
 *   get:
 *     summary: Lấy ra tất cả các nguồn yêu cầu công việc
 *     security:
 *       - bearerAuth: []
 *     tags: [WorkOrder]
 *     parameters: []
 *     responses:
 *       200:
 *         description: Trả về tất cả các nguồn yêu cầu công việc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 code:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: OK!
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         example: warehouse
 *                       name:
 *                         type: string
 *                         example: Kho
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /workOrder/getAllTechnicianStatus:
 *   get:
 *     summary: Lấy ra tất cả các trạng thái của KTV
 *     security:
 *       - bearerAuth: []
 *     tags: [WorkOrder]
 *     parameters: []
 *     responses:
 *       200:
 *         description: Trả về tất cả các trạng thái của KTV
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 code:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: OK!
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         example: free
 *                       name:
 *                         type: string
 *                         example: Rảnh
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /workOrder/create:
 *   post:
 *     summary: Tạo phiếu công việc mới
 *     security:
 *       - bearerAuth: []
 *     tags: [WorkOrder]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - header
 *               - typeWork
 *               - customerId
 *               - contactName
 *               - contactPhone
 *               - contactEmail
 *               - address
 *               - description
 *               - priority
 *               - estimatedTime
 *               - overDueTime
 *               - requestSource
 *             properties:
 *               technicianId:
 *                 type: string
 *                 example:
 *               header:
 *                 type: string
 *                 example: TEST
 *               typeWork:
 *                 type: string
 *                 enum: ['', 'repair', 'maintenance', 'installation', 'testIO', 'demo', 'samplePrinting']
 *                 example: "repair"
 *               customerId:
 *                 type: string
 *                 example:
 *               contactName:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               contactPhone:
 *                 type: string
 *                 example: "0912345678"
 *               contactEmail:
 *                 type: string
 *                 example: test@gmail.com
 *               address:
 *                 type: string
 *                 example: 123, ABC Street
 *               description:
 *                 type: string
 *                 example: sửa máy test
 *               priority:
 *                 type: string
 *                 enum: ["high", "medium", "low"]
 *                 example: low
 *               estimatedTime:
 *                 type: string
 *                 example: 2
 *               overDueTime:
 *                 type: string
 *                 format: date
 *                 example: 2026-01-01
 *               requestSource:
 *                 type: string
 *                 enum: ["customer", "warehouse", "demo"]
 *                 example: warehouse
 *     responses:
 *       200:
 *         description: Tạo yêu cầu công việc thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 code:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: OK!
 *                 data:
 *                   type: object
 *                   example: null
 *       400:
 *         description: Lỗi input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Tên kho là bắt buộc!
 *                 data:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /workOrder/update/{workOrderId}:
 *   post:
 *     summary: Chỉnh sửa phiếu công việc
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workOrderId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của phiếu yêu cầu công việc cần xóa
 *     tags: [WorkOrder]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - header
 *               - typeWork
 *               - typel
 *               - description
 *               - priority
 *               - estimatedTime
 *               - overDueTime
 *               - requestSource
 *             properties:
 *               technicianId:
 *                 type: string
 *                 example:
 *               header:
 *                 type: string
 *                 example: TEST
 *               typeWork:
 *                 type: string
 *                 enum: ['', 'repair', 'maintenance', 'installation', 'testIO', 'demo', 'samplePrinting']
 *                 example: "repair"
 *               type:
 *                 type: string
 *                 enum: ['', 'D', 'G', 'V', 'M', 'A']
 *                 example: D
 *               description:
 *                 type: string
 *                 example: sửa máy test
 *               priority:
 *                 type: string
 *                 enum: ["high", "medium", "low"]
 *                 example: low
 *               estimatedTime:
 *                 type: string
 *                 example: 2
 *               overDueTime:
 *                 type: string
 *                 format: date
 *                 example: 2026-01-01
 *               requestSource:
 *                 type: string
 *                 enum: ["customer", "warehouse", "demo"]
 *                 example: warehouse
 *               status:
 *                 type: string
 *                 enum: ["pending", "inProgress", "completed", "overdue"]
 *                 example: "inProgress"
 *     responses:
 *       200:
 *         description: Tạo yêu cầu công việc thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 code:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: OK!
 *                 data:
 *                   type: object
 *                   example: null
 *       400:
 *         description: Lỗi input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Tên kho là bắt buộc!
 *                 data:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /workOrder/delete/{workOrderId}:
 *   delete:
 *     summary: Xóa kho hàng
 *     tags: [WorkOrder]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workOrderId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của phiếu yêu cầu công việc cần xóa
 *     responses:
 *       200:
 *         description: Xoá kho hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 code:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: OK!
 *                 data:
 *                   type: object
 *                   example: null
 *       400:
 *         description: Lỗi input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Kho không tồn tại!
 *                 data:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */
module.exports = router
