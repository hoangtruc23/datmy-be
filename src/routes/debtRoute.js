const express = require('express')
const debtController = require('../controllers/debtController')
// const validate = require('../middlewares/validation')
// const debtValidation = require('../validations/debtValidation')

const router = express.Router()

router.get('/getAll', debtController.getAll)
router.get('/getSummary/', debtController.getSummary)

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
 *         description: Lấy tổng hợp thông tin thành công
 */
module.exports = router
