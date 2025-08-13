const express = require('express')
const debtReminderController = require('../controllers/debtReminderController')
//const validate = require('../middlewares/validation')
//const debtReminderValidation = require('../validations/debtReminderValidation')

const router = express.Router()

router.post('/create', debtReminderController.create)
router.post('/update/:id', debtReminderController.update)
router.get('/getAll', debtReminderController.getAll)
router.get('/getAllHistory', debtReminderController.getAllHistory)
router.get('/getById/:id', debtReminderController.getById)
router.delete('/delete/:id', debtReminderController.delete)

router.get(
    '/getDebtReminderPriority',
    debtReminderController.getDebtReminderPriority,
)
router.get('/getDebtResult', debtReminderController.getDebtResult)
router.get(
    '/getDebtReminderMethod',
    debtReminderController.getDebtReminderMethod,
)

router.post('/checkCompleted/:id', debtReminderController.checkCompleted)
router.get('/getSumHistory', debtReminderController.getSumHistory)
router.get('/getSummary', debtReminderController.getSummary)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: DebtReminder
 *   description: Quản lý đòi nợ
 */

/**
 * @swagger
 * /debtReminder/create:
 *   post:
 *     summary: Tạo mới nhắc nhở nợ
 *     tags: [DebtReminder]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - customerName
 *               - dueDate
 *               - method
 *               - priority
 *               - status
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: ID khách hàng (ObjectId)
 *                 example: "6853b220547baefa48a9bf9f"
 *               customerName:
 *                 type: string
 *                 description: Tên khách hàng
 *                 example: "Công ty Dược ABC"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày đến hạn
 *                 example: "2025-07-28"
 *               method:
 *                 type: string
 *                 description: Phương thức nhắc nhở
 *                 enum: ["email", "phone", "offline", "null"]
 *                 example: "email"
 *               tryCount:
 *                 type: number
 *                 description: Số lần đã thử nhắc nhở
 *                 example: 0
 *               assignedTo:
 *                 type: object
 *                 description: Thông tin người được giao
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Nguyễn Văn A"
 *                   phone:
 *                     type: string
 *                     example: "0123456789"
 *               priority:
 *                 type: string
 *                 description: Mức độ ưu tiên
 *                 enum: ["high", "medium", "low", "urgent"]
 *                 example: "medium"
 *               status:
 *                 type: string
 *                 description: Trạng thái nhắc nhở
 *                 enum: ["scheduled", "completed", "null"]
 *                 example: "scheduled"
 *               notes:
 *                 type: string
 *                 example: "Ghi chú về nhắc nhở"
 *               followUpDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày theo dõi
 *                 example: "2025-07-30"
 *               result:
 *                 type: string
 *                 description: Kết quả mong đợi (sẽ hiển thị thành kết quả trong lịch sử đòi nợ)
 *                 enum: ["promisePaid", "partiallyPaid", "noResponse", "null"]
 *                 example: "promisePaid"
 *     responses:
 *       200:
 *         description: Tạo nhắc nhở nợ thành công
 */

/**
 * @swagger
 * /debtReminder/update/{id}:
 *   post:
 *     summary: Cập nhật nhắc nhở nợ
 *     tags: [DebtReminder]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID nhắc nhở nợ cần cập nhật
 *         example: "686d177fc27070cd8eb49dd0"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: ID khách hàng (ObjectId)
 *                 example: "6853b220547baefa48a9bf9f"
 *               customerName:
 *                 type: string
 *                 description: Tên khách hàng
 *                 example: "Công ty Dược ABC"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày đến hạn
 *                 example: "2025-07-28"
 *               method:
 *                 type: string
 *                 description: Phương thức nhắc nhở
 *                 enum: ["email", "phone", "sms", "null"]
 *                 example: "phone"
 *               tryCount:
 *                 type: number
 *                 description: Số lần đã thử nhắc nhở
 *                 example: 1
 *               assignedTo:
 *                 type: object
 *                 description: Thông tin người được giao
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Nguyễn Văn B"
 *                   contact:
 *                     type: string
 *                     example: "0987654321"
 *               priority:
 *                 type: string
 *                 description: Mức độ ưu tiên
 *                 enum: ["high", "medium", "low"]
 *                 example: "high"
 *               status:
 *                 type: string
 *                 description: Trạng thái nhắc nhở
 *                 enum: ["scheduled", "completed", "null"]
 *                 example: "scheduled"
 *               result:
 *                 type: string
 *                 description: Kết quả của nhắc nhở
 *                 enum: ["promisePaid", "partiallyPaid", "noResponse"]
 *                 example: "promisePaid"
 *               contactDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày liên hệ
 *                 example: "2025-07-20"
 *               followUpDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày theo dõi
 *                 example: "2025-07-30"
 *               timeContact:
 *                 type: string
 *                 description: Khoảng gian liên hệ
 *                 example: "15 phút"
 *               notes:
 *                 type: string
 *                 description: Ghi chú thêm
 *                 example: "Khách hẹn sẽ thanh toán vào cuối tháng"
 *     responses:
 *       200:
 *         description: Cập nhật nhắc nhở nợ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo kết quả
 *                   example: "OK"
 *                 data:
 *                   type: object
 *                   description: Dữ liệu nhắc nhở nợ đã cập nhật
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID của nhắc nhở nợ
 *                       example: "686d177fc27070cd8eb49dd0"
 *                     customerId:
 *                       type: string
 *                       description: ID khách hàng liên quan
 *                       example: "ID khách hàng"
 *                     customerName:
 *                       type: string
 *                       description: Tên khách hàng liên quan
 *                       example: "Tên khách hàng"
 *                     dueDate:
 *                       type: string
 *                       format: date
 *                       description: Ngày đến hạn
 *                       example: "Ngày đến hạn"
 *                     method:
 *                       type: string
 *                       description: Phương thức nhắc nhở
 *                       enum: ["email", "phone", "sms", "null"]
 *                       example: "Phương thức"
 *                     tryCount:
 *                       type: number
 *                       description: Số lần đã thử nhắc nhở
 *                       example: Số lần
 *                     assignedTo:
 *                       type: object
 *                       description: Thông tin người được giao
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Nguyễn Văn B"
 *                         contact:
 *                           type: string
 *                           example: "0987654321"
 *                     priority:
 *                       type: string
 *                       description: Mức độ ưu tiên
 *                       enum: ["high", "medium", "low"]
 *                       example: "high"
 *                     status:
 *                       type: string
 *                       description: Trạng thái nhắc nhở
 *                       enum: ["scheduled", "completed", "null"]
 *                       example: "scheduled"
 *                     result:
 *                       type: string
 *                       description: Kết quả của nhắc nhở
 *                       enum: ["promisePaid", "partiallyPaid", "noResponse"]
 *                       example: "Kết quả của nhắc nhở (update trong lịch sử đòi nợ)"
 *                     contactDate:
 *                       type: string
 *                       format: date
 *                       description: Ngày liên hệ
 *                       example: "2025-07-20 (update trong lịch sử đòi nợ)"
 *                     followUpDate:
 *                       type: string
 *                       format: date
 *                       description: Ngày theo dõi
 *                       example: "2025-07-30 (update trong lịch sử đòi nợ)"
 *                     timeContact:
 *                       type: string
 *                       description: Khoảng gian liên hệ
 *                       example: "15 phút (update trong lịch sử đòi nợ)"
 *                     notes:
 *                       type: string
 *                       description: Ghi chú thêm
 *                       example: "Khách hẹn sẽ thanh toán vào cuối tháng (update trong lịch sử đòi nợ)"
 */

/**
 * @swagger
 * /debtReminder/getAll:
 *   get:
 *     summary: Lấy danh sách nhắc nhở nợ (Danh sách nhiệm vụ đòi nợ)
 *     tags: [DebtReminder]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số mục trên mỗi trang
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm tên khách hàng
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ["scheduled", "completed"]
 *         description: Trạng thái nhắc nhở
 *         example: "scheduled"
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: ["urgent", "high", "medium", "low"]
 *         description: Mức độ ưu tiên
 *         example: "medium"
 *     responses:
 *       200:
 *         description: Lấy danh sách nhắc nhở nợ thành công
 */

/**
 * @swagger
 * /debtReminder/getAllHistory:
 *   get:
 *     summary: Lấy danh sách lịch sử nhắc nhở nợ  (lịch sử đòi nợ) chỉ lấy các nhắc nhở đã hoàn thành
 *     tags: [DebtReminder]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bản ghi mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm theo tên khách hàng
 *     responses:
 *       200:
 *         description: Lấy danh sách lịch sử nhắc nhở thành công
 */

/**
 * @swagger
 * /debtReminder/getById/{id}:
 *   get:
 *     summary: Lấy chi tiết nhắc nhở nợ theo ID
 *     tags: [DebtReminder]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID nhắc nhở nợ cần lấy
 *         example: "686d177fc27070cd8eb49dd0"
 *     responses:
 *       200:
 *         description: Lấy chi tiết nhắc nhở nợ thành công
 */

/**
 * @swagger
 * /debtReminder/delete/{id}:
 *   delete:
 *     summary: Xóa nhắc nhở nợ
 *     tags: [DebtReminder]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID nhắc nhở nợ cần xóa
 *     responses:
 *       200:
 *         description: Xóa nhắc nhở nợ thành công
 */

/**
 * @swagger
 * /debtReminder/getDebtReminderPriority:
 *   get:
 *     summary: Lấy danh sách mức độ ưu tiên của nhắc nhở nợ
 *     tags: [DebtReminder]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách nhắc nhở nợ thành công
 */

/**
 * @swagger
 * /debtReminder/getDebtResult:
 *   get:
 *     summary: Lấy danh sách kết quả nhắc nhở nợ
 *     tags: [DebtReminder]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách nhắc nhở nợ thành công
 */

/**
 * @swagger
 * /debtReminder/getDebtReminderMethod:
 *   get:
 *     summary: Lấy danh sách phương thức nhắc nhở nợ
 *     tags: [DebtReminder]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách nhắc nhở nợ thành công
 */

/**
 * @swagger
 * /debtReminder/checkCompleted/{id}:
 *   post:
 *     summary: Đánh dấu nhắc nhở nợ là đã hoàn thành
 *     tags: [DebtReminder]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của nhắc nhở nợ cần đánh dấu hoàn thành
 *         example: "686d177fc27070cd8eb49dd0"
 *     responses:
 *       200:
 *         description: Đánh dấu nhắc nhở nợ là đã hoàn thành
 */

/**
 * @swagger
 * /debtReminder/getSumHistory:
 *   get:
 *     summary: Lấy tổng lịch sử
 *     tags: [DebtReminder]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cập nhật nhắc nhở nợ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo kết quả
 *                   example: "OK"
 *                 data:
 *                   type: object
 *                   description: Dữ liệu nhắc nhở nợ đã cập nhật
 *                   properties:
 *                     totalContacts:
 *                       type: string
 *                       description: Tổng số lần liên hệ
 *                       example: "Tổng số lần liên hệ hoàn thành trong tháng này"
 *                     promisePaid:
 *                       type: string
 *                       description: hứa trả
 *                       example: "số lượng hứa trả"
 *                     partiallyPaid:
 *                       type: string
 *                       description: Trả một phần
 *                       example: "số lượng trả một phần"
 *                     noResponse:
 *                       type: string
 *                       description: không phản hồi
 *                       example: "số lượng không phản hồi"
 */

/**
 * @swagger
 * /debtReminder/getSummary:
 *   get:
 *     summary: Lấy thông tin tổng quan về nhiệm vụ nhắc nhở nợ
 *     tags: [DebtReminder]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin tổng quan thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalTasks:
 *                       type: number
 *                       description: Tổng số nhiệm vụ nhắc nhở nợ từ trước đến nay
 *                       example: 45
 *                     completedTasks:
 *                       type: number
 *                       description: Tổng số nhiệm vụ nhắc nhở nợ đã hoàn thành
 *                       example: 28
 *                     scheduledTasks:
 *                       type: number
 *                       description: Tổng số nhiệm vụ nhắc nhở nợ đã lên lịch
 *                       example: 17
 *                     successRate:
 *                       type: number
 *                       format: float
 *                       description: Tỷ lệ thành công trong successMonth (không có xét +15.3% so với tháng trước)
 *                       example: 62.2
 *                     successMonth:
 *                       type: number
 *                       description: Tháng đang xét tỷ lệ thành công
 *                       example: 7
 *                     activeStaff:
 *                       type: number
 *                       description: Tổng số nhân viên đang hoạt động
 *                       example: 8
 */
