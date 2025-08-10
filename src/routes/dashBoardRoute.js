const express = require('express')

const router = express.Router()

const dashBoardController = require('../controllers/dashBoardController')
router.get('/summary', dashBoardController.getSumaryDashBoard)
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
