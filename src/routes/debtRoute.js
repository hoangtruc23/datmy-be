const express = require('express')
const debtController = require('../controllers/debtController')
// const validate = require('../middlewares/validation')
// const debtValidation = require('../validations/debtValidation')

const router = express.Router()

router.get('/getAll', debtController.getAll)
router.get('/getSummary/', debtController.getSummary)
// router.post('/generateReport', debtController.generateReport)
router.post('/generatePaymentRequest', debtController.generatePaymentRequest)
// router.get(
//     '/generateSalesDetailReport',
//     debtController.generateSalesDetailReport,
// )

module.exports = router
/**
 * @swagger
 * tags:
 *   name: Debt
 *   description: Quản lý công nợ
 */

/**
 * @swagger
 * /debt/getAll:
 *   get:
 *     summary: Lấy danh sách công nợ của khách hàng
 *     tags: [Debt]
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
 *         example: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm theo tên khách hàng
 *         example: "Công ty Dược ABC"
 *       - in: query
 *         name: debtStatus
 *         schema:
 *           type: enum
 *           enum: [noDebt, normal, overdue, badDebt]
 *           description: Trạng thái hóa đơn (noDebt, normal, overdue, badDebt)
 *     responses:
 *       200:
 *         description: Lấy danh sách công nợ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       customerId:
 *                         type: string
 *                         description: ID khách hàng
 *                         example: "6853b220547baefa48a9bf9f   //ID khách hàng"
 *                       customerName:
 *                         type: string
 *                         description: Tên khách hàng
 *                         example: "Công ty Dược ABC    //Tên khách hàng"
 *                       totalDebt:
 *                         type: number
 *                         description: Tổng số tiền nợ
 *                         example: 2500000    //Tổng số tiền nợ - Tổng nợ
 *                       overdueDebt:
 *                         type: number
 *                         description: Tổng số tiền nợ quá hạn
 *                         example: 1000000   //Nợ quá hạn-quá hạn nợ
 *                       maxDebtDays:
 *                         type: number
 *                         description: Số ngày nợ tối đa
 *                         example: 3   //Số ngày nợ (từ đơn cũ nhất)
 *                       limitOverdue:
 *                         type: number
 *                         description: Hạn cho phép nợ (ngày)
 *                         example: 7   //Hạn nợ - hạn cho phép nợ
 *                       debtStatus:
 *                         type: string
 *                         description: Trạng thái công nợ
 *                         enum: ["noDebt", "normal", "overdue", "badDebt"]
 *                         example: "normal"
 *                       lastReminder:
 *                         type: object
 *                         description: Thông tin nhắc nợ cuối
 *                         properties:
 *                           remindDate:
 *                             type: string
 *                             format: date-time
 *                             description: Ngày nhắc nợ
 *                             example: "2025-07-20T00:00:00.000Z"
 *                 total:
 *                   type: integer
 *                   description: Tổng số khách hàng có nợ
 *                   example: 100
 *                 page:
 *                   type: integer
 *                   description: Trang hiện tại
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   description: Số mục trên mỗi trang
 *                   example: 20
 *                 totalPages:
 *                   type: integer
 *                   description: Tổng số trang
 *                   example: 5
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /debt/getSummary:
 *   get:
 *     summary: Lấy tổng hợp thông tin công nợ
 *     tags: [Debt]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */

/**
 * @swagger
 * /debt/generatePaymentRequest:
 *   post:
 *     summary: Sinh báo cáo đề nghị thanh toán
 *     description: Sinh báo cáo đề nghị thanh toán
 *     security:
 *       - bearerAuth: []
 *     tags: [Debt]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - invoiceId
 *             properties:
 *               customerId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *                 description: ID khách hàng
 *               invoiceId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *                 description: ID hóa đơn
 *               accountName:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *                 description: Tên P. Kế toán, người ký tên. Nếu không điền, sẽ để trống và viết tay.
 *     responses:
 *       200:
 *         description: Tạo giấy đề nghị thanh toán thành công.
 *       400:
 *         description: Tổng số tiền lưu trong hóa đơn và tổng số tiền (Cộng tiền hàng) sau khi tính trong đề nghị thanh toán không khớp.
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
 *                   example: 81
 *                 message:
 *                   type: string
 *                   example: "Tổng số tiền hóa đơn không khớp."
 *                 data:
 *                   type: "null"
 *                   example: null
 */
