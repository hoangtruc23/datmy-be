// src/routes/reportRoute.js
const express = require('express')
const reportController = require('../controllers/reportController')
const validate = require('../middlewares/validation')
const reportValidation = require('../validations/reportValidation')

const router = express.Router()

router.get(
    '/debt-comparison/summary',
    validate(reportValidation.getDebtComparison),
    reportController.getDebtComparisonSummary,
)
router.get(
    '/debt-comparison/detail',
    validate(reportValidation.getDebtDetail),
    reportController.getDebtComparisonDetail,
)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Báo cáo tổng hợp
 */

/**
 * @swagger
 * /reports/debt-comparison/summary:
 *   get:
 *     summary: Báo cáo đối chiếu công nợ cuối kỳ (Bảng đối chiếu công nợ cuối kỳ)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Ngày bắt đầu (YYYY-MM-DD)
 *         example: "2025-05-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Ngày kết thúc (YYYY-MM-DD)
 *         example: "2025-05-31"
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *         description: Lọc theo một khách hàng cụ thể (ObjectId, tùy chọn)
 *         example: "6870afe7d9fc915162c48fd4"
 *     responses:
 *       200:
 *         description: Lấy báo cáo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   customerName:
 *                     type: string
 *                   openingBalance:
 *                     type: number
 *                   incurredCredit:
 *                     type: number
 *                   incurredDebit:
 *                     type: number
 *                   closingBalance:
 *                     type: number
 *                   creditLimit:
 *                     type: number
 *                   status:
 *                     type: string
 *             example:
 *               - customerName: "Công ty Dược ABC"
 *                 openingBalance: 70000
 *                 incurredCredit: 40000
 *                 incurredDebit: 50000
 *                 closingBalance: 80000
 *                 creditLimit: 0
 *                 status: "Bình thường"
 *               - customerName: "Khách Hàng XYZ"
 *                 openingBalance: 0
 *                 incurredCredit: 100000
 *                 incurredDebit: 150000
 *                 closingBalance: 50000
 *                 creditLimit: 10000000
 *                 status: "Bình thường"
 */

/**
 * @swagger
 * /reports/debt-comparison/detail:
 *   get:
 *     summary: Báo cáo đối chiếu công nợ chi tiết cho một khách hàng
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Ngày bắt đầu (YYYY-MM-DD)
 *         example: "2025-05-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Ngày kết thúc (YYYY-MM-DD)
 *         example: "2025-05-31"
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của khách hàng cần xem chi tiết
 *         example: "6870afe7d9fc915162c48fd4"
 *     responses:
 *       200:
 *         description: Lấy báo cáo chi tiết thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customerName:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                 endDate:
 *                   type: string
 *                 openingBalance:
 *                   type: number
 *                 incurredDuringPeriod:
 *                   type: number
 *                 closingBalance:
 *                   type: number
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       documentCode:
 *                         type: string
 *                       description:
 *                         type: string
 *                       debit:
 *                         type: number
 *                       credit:
 *                         type: number
 *             example:
 *               customerName: "Công ty Dược ABC"
 *               startDate: "2025-05-01"
 *               endDate: "2025-05-31"
 *               openingBalance: 70000
 *               incurredDuringPeriod: 10000
 *               closingBalance: 80000
 *               transactions:
 *                 - date: "2025-05-10T14:00:00.000Z"
 *                   documentCode: "INV-MAY-002"
 *                   description: "Hóa đơn INV-MAY-002"
 *                   debit: 50000
 *                   credit: 0
 *                 - date: "2025-05-25T15:00:00.000Z"
 *                   documentCode: "INV-MAY-002"
 *                   description: "Thanh toán cho hóa đơn tháng 5"
 *                   debit: 0
 *                   credit: 40000
 */
