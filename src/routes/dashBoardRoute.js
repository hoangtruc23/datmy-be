const express = require('express')

const router = express.Router()

const dashBoardController = require('../controllers/dashBoardController')
router.get('/summary', dashBoardController.getSumaryDashBoard)
router.get('/getTopCustomersDebt', dashBoardController.getTopCustomersDebt)
router.get('/getRevenueMonthly', dashBoardController.getRevenueMonthly)
router.get('/getInvoiceRecent', dashBoardController.getRecentInvoices)
router.get('/getTopCustomerRevenue', dashBoardController.getTopCustomerRevenue)

module.exports = router

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Lấy tổng quan thống kê Dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK - Lấy dữ liệu tổng quan thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 code: { type: integer, example: 1 }
 *                 message: { type: string, example: "Thành công" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     monthRevenue:
 *                       type: number
 *                       example: 15000000
 *                     monthTotalInvoiceAmount:
 *                       type: number
 *                       example: 30000000
 *                     monthTotalDept:
 *                       type: number
 *                       example: 15000000
 *                     allActiveCustomers:
 *                       type: integer
 *                       example: 12
 *                     invoiceCount:
 *                       type: integer
 *                       example: 25
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-01T00:00:00.000Z"
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-01T00:00:00.000Z"
 *       '401':
 *         description: Unauthorized - Token không hợp lệ hoặc thiếu.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer }
 *                 code: { type: integer }
 *                 message: { type: string }
 *                 data: { type: 'object' }
 *             example:
 *               status: 401
 *               code: -1
 *               message: "Không có token"
 *               data: null
 *       '403':
 *         description: Forbidden - Không có quyền truy cập.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer }
 *                 code: { type: integer }
 *                 message: { type: string }
 *                 data: { type: 'object' }
 *             example:
 *               status: 403
 *               code: -1
 *               message: "Không có quyền"
 *               data: null
 */

/**
 * @swagger
 * /dashboard/getTopCustomersDebt:
 *   get:
 *     summary: Lấy top khách hàng có công nợ cao nhất
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Thành công - Trả về danh sách khách hàng có công nợ cao nhất
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
 *                   example: "OK!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     result:
 *                       type: array
 *                       description: Danh sách khách hàng có công nợ cao nhất
 *                       items:
 *                         type: object
 *                         properties:
 *                               customerName:
 *                                 type: string
 *                                 example: "Nguyễn Văn A"
 *                               totalDebt:
 *                                 type: number
 *                                 example: 1700000
 *       '401':
 *         description: Unauthorized - Token không hợp lệ hoặc thiếu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer }
 *                 code: { type: integer }
 *                 message: { type: string }
 *                 data: { type: object }
 *             example:
 *               status: 401
 *               code: -1
 *               message: "Không có token"
 *               data: null
 *       '403':
 *         description: Forbidden - Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer }
 *                 code: { type: integer }
 *                 message: { type: string }
 *                 data: { type: object }
 *             example:
 *               status: 403
 *               code: -1
 *               message: "Không có quyền"
 *               data: null
 */

/**
 * @swagger
 * /dashboard/getRevenueMonthly:
 *   get:
 *     summary: Lấy doanh thu và công nợ theo từng tháng trong năm
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2025
 *         required: false
 *         description: Năm cần lấy dữ liệu, nếu không truyền sẽ lấy năm hiện tại
 *     responses:
 *       '200':
 *         description: OK - Lấy dữ liệu doanh thu và công nợ theo tháng thành công
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
 *                   example: "OK!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     monthRevenue:
 *                       type: array
 *                       description: Danh sách doanh thu và công nợ theo từng tháng
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: integer
 *                             example: 1
 *                           revenue:
 *                             type: number
 *                             example: 3300000
 *                           totalDept:
 *                             type: number
 *                             example: 700000
 *       '401':
 *         description: Unauthorized - Token không hợp lệ hoặc thiếu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 code:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *             example:
 *               status: 401
 *               code: -1
 *               message: "Không có token"
 *               data: null
 *       '403':
 *         description: Forbidden - Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 code:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *             example:
 *               status: 403
 *               code: -1
 *               message: "Không có quyền"
 *               data: null
 */

/**
 * @swagger
 * /dashboard/getTopCustomerRevenue:
 *   get:
 *     summary: Lấy top khách hàng có doanh thu cao nhất, kèm công nợ
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK - Lấy dữ liệu thành công.
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
 *                   example: "OK!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     result:
 *                       type: array
 *                       description: Danh sách khách hàng với doanh thu, công nợ
 *                       items:
 *                         type: object
 *                         properties:
 *                           customerName:
 *                             type: string
 *                             example: "Nguyễn Văn A"
 *                           totalInvoiceAmount:
 *                             type: number
 *                             example: 4000000
 *                           totalPaid:
 *                             type: number
 *                             example: 2300000
 *                           totalDebt:
 *                             type: number
 *                             example: 1700000
 *                           lastPaymentDate:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-07-15T10:30:00.000Z"
 *                           customerId:
 *                             type: string
 *                             example: "64f1a4000000000000000001"
 *       '401':
 *         description: Unauthorized - Token không hợp lệ hoặc thiếu.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 code:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *             example:
 *               status: 401
 *               code: -1
 *               message: "Không có token"
 *               data: null
 *       '403':
 *         description: Forbidden - Không có quyền truy cập.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 code:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *             example:
 *               status: 403
 *               code: -1
 *               message: "Không có quyền"
 *               data: null
 */



/**
 * @swagger
 * /dashboard/getInvoiceRecent:
 *   get:
 *     summary: Lấy 4 hóa đơn gần nhất
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK - Lấy dữ liệu 4 hóa đơn gần nhất thành công.
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
 *                   example: "OK!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     result:
 *                       type: array
 *                       description: Danh sách 4 hóa đơn gần nhất
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "64f1a5000000000000000011"
 *                           customerId:
 *                             type: string
 *                             example: "64f1a4000000000000000001"
 *                           customerName:
 *                             type: string
 *                             example: "Nguyễn Văn A"
 *                           invoiceLink:
 *                             type: string
 *                             example: "https://example.com/invoice/1001"
 *                           invoiceCode:
 *                             type: string
 *                             example: "INV-20250715-002"
 *                           totalAmount:
 *                             type: number
 *                             example: 2000000
 *                           invoiceDate:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-07-15T00:00:00.000Z"
 *                           dueDate:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-07-31T00:00:00.000Z"
 *                           limitDue:
 *                             type: integer
 *                             example: 30
 *                           isFullyPaid:
 *                             type: boolean
 *                             example: false
 *                           orderBy:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "Nguyễn Văn A"
 *                               phone:
 *                                 type: string
 *                                 example: "0909123456"
 *                           accountant:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "Lê Thị C"
 *                               phone:
 *                                 type: string
 *                                 example: "0987765432"
 *                           paymentBy:
 *                             type: string
 *                             example: "TRANSFER"
 *                           reminderContact:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "Phạm Văn D"
 *                               phone:
 *                                 type: string
 *                                 example: "0912345678"
 *                           notes:
 *                             type: string
 *                             example: "Thanh toán trả góp"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-07-15T00:00:00.000Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-07-15T00:00:00.000Z"
 *       '401':
 *         description: Unauthorized - Token không hợp lệ hoặc thiếu.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 code:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *             example:
 *               status: 401
 *               code: -1
 *               message: "Không có token"
 *               data: null
 *       '403':
 *         description: Forbidden - Không có quyền truy cập.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 code:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *             example:
 *               status: 403
 *               code: -1
 *               message: "Không có quyền"
 *               data: null
 */

