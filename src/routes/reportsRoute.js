const express = require('express')
const validate = require('../middlewares/validation')
const reportController = require('../controllers/reportController')
const debtReconciliationValidation = require('../validations/debtReconciliationValidation')
const reportValidation = require('../validations/reportValidation');
const router = express.Router()


router.get(
    '/sales',
    validate(reportValidation.getSalesReport),
    reportController.getSalesReport,
)
router.get(
    '/reconciliation/summary',
    validate(debtReconciliationValidation.getDebtSummary),
    reportController.getDebtComparisonSummary,
)
router.get(
    '/reconciliation/detail',
    validate(debtReconciliationValidation.getDebtDetail),
    reportController.getDebtComparisonDetail,
)

router.get(
    '/generateSalesDetailReport',
    reportController.generateSalesDetailReport,
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
 * /reports/sales:
 *   get:
 *     summary: Lấy dữ liệu báo cáo bán hàng chi tiết
 *     security:
 *       - bearerAuth: []
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           example: "01/01/2025"
 *         description: "Ngày bắt đầu (DD/MM/YYYY)"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           example: "02/02/2026"
 *         description: "Ngày kết thúc (DD/MM/YYYY)"
 *       - in: query
 *         name: customerId
 *         required: false
 *         schema:
 *           type: string
 *           example: ""
 *         description: "ID khách hàng để lọc"
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: "Số trang"
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: "Số mục trên mỗi trang"
 *     responses:
 *       200:
 *         description: Lấy dữ liệu báo cáo thành công
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
 *                     startDate:
 *                       type: string
 *                       example: "01/01/2025"
 *                     endDate:
 *                       type: string
 *                       example: "02/02/2026"
 *                     customerName:
 *                       type: string
 *                       example: ""
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalInvoices:
 *                       type: integer
 *                       example: 4
 *                     salesData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           customerName:
 *                             type: string
 *                             example: "Nguyễn Văn A"
 *                           invoiceCode:
 *                             type: string
 *                             example: "INV-20250715-001"
 *                           invoiceDate:
 *                             type: string
 *                             example: "16/07/2025"
 *                           taxCode:
 *                             type: string
 *                             example: ""
 *                           productId:
 *                             type: string
 *                             example: "64f1a4000000000000000020"
 *                           productCode:
 *                             type: string
 *                             example: "SP001"
 *                           productName:
 *                             type: string
 *                             example: "Sản phẩm A"
 *                           unit:
 *                             type: string
 *                             example: ""
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           unitPrice:
 *                             type: number
 *                             example: 350000
 *                           discount:
 *                             type: number
 *                             example: 0
 *                           totalAmount:
 *                             type: number
 *                             example: 700000
 *                           vatAmount:
 *                             type: number
 *                             example: 70000
 *                           totalPayment:
 *                             type: number
 *                             example: 770000
 *                           address:
 *                             type: string
 *                             example: ""
 *       400:
 *         description: Lỗi đầu vào không hợp lệ
 *       401:
 *         description: Chưa được xác thực (Unauthorized)
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /reports/reconciliation/summary:
 *   get:
 *     summary: Báo cáo đối chiếu công nợ cuối kỳ (có phân trang và tổng hợp)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *         required: true
 *         description: "Ngày bắt đầu (YYYY-MM-DD)"
 *         example: "2024-06-01"
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *         required: true
 *         description: "Ngày kết thúc (YYYY-MM-DD)"
 *         example: "2026-06-30"
 *       - in: query
 *         name: customerId
 *         schema: { type: string }
 *         description: "Lọc theo ID khách hàng (ObjectId). Để trống để lấy tất cả."
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: "Số trang"
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: "Số mục trên mỗi trang"
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
 * /reports/reconciliation/detail:
 *   get:
 *     summary: Báo cáo đối chiếu công nợ chi tiết (có phân trang và tổng hợp)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *         required: true
 *         description: "Ngày bắt đầu (YYYY-MM-DD)"
 *         example: "2024-06-01"
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *         required: true
 *         description: "Ngày kết thúc (YYYY-MM-DD)"
 *         example: "2026-06-30"
 *       - in: query
 *         name: customerId
 *         schema: { type: string }
 *         required: true
 *         description: "ID của khách hàng cần xem chi tiết"
 *         example: "6870afe7d9fc915162c48fd4"
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: "Số trang cho danh sách giao dịch"
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: "Số giao dịch trên mỗi trang"
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

/*
 * @swagger
 * /reports/periodic:
 *   get:
 *     summary: Báo cáo công nợ theo kỳ (Trang tổng quan có biểu đồ)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [weekly, monthly]
 *         required: true
 *         description: Loại báo cáo (tuần hoặc tháng).
 *         example: "weekly"
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Ngày bắt đầu (YYYY-MM-DD)
 *         example: "2025-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Ngày kết thúc (YYYY-MM-DD)
 *         example: "2025-01-31"
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *         description: Lọc theo một khách hàng cụ thể (ObjectId, tùy chọn).
 *         example: "6870afe7d9fc915162c48fd4"
 *     responses:
 *       200:
 *         description: Lấy dữ liệu báo cáo thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summaryCards:
 *                   type: object
 *                   properties:
 *                     totalClosingDebt:
 *                       type: object
 *                       properties:
 *                         value:
 *                           type: number
 *                           example: 39000000
 *                         comparison:
 *                           type: string
 *                           example: "-13% so với tuần trước"
 *                     incurredDebit:
 *                       type: object
 *                       properties:
 *                         value:
 *                           type: number
 *                           example: 5000000
 *                         comparison:
 *                           type: string
 *                           example: "-17% so với tuần trước"
 *                     incurredCredit:
 *                       type: object
 *                       properties:
 *                         value:
 *                           type: number
 *                           example: 8000000
 *                         comparison:
 *                           type: string
 *                           example: "+33% so với tuần trước"
 *                     overdueDebt:
 *                       type: object
 *                       properties:
 *                         value:
 *                           type: number
 *                           example: 8000000
 *                         comparison:
 *                           type: string
 *                           example: "+20% so với tuần trước"
 *                 charts:
 *                   type: object
 *                   properties:
 *                     debtTrend:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           period:
 *                             type: string
 *                             example: "Tuần 1"
 *                           totalDebt:
 *                             type: number
 *                             example: 45000000
 *                           overdueDebt:
 *                             type: number
 *                             example: 15000000
 *                     debitCreditAnalysis:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           period:
 *                             type: string
 *                             example: "Tuần 1"
 *                           debit:
 *                             type: number
 *                             example: 8000000
 *                           credit:
 *                             type: number
 *                             example: 5000000
 *                 customerDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       customerName:
 *                         type: string
 *                         example: "Công ty TNHH ABC"
 *                       openingBalance:
 *                         type: number
 *                         example: 5000000
 *                       incurredDebit:
 *                         type: number
 *                         example: 3000000
 *                       incurredCredit:
 *                         type: number
 *                         example: 2000000
 *                       closingBalance:
 *                         type: number
 *                         example: 6000000
 *                       trend:
 *                         type: string
 *                         example: "Tăng"
 */



/**
 * @swagger
 * /reports/generateSalesDetailReport:
 *   get:
 *     summary: Sinh báo cáo sổ chi tiết bán hàng
 *     description: Tạo file Excel báo cáo chi tiết bán hàng theo khoảng thời gian và khách hàng
 *     security:
 *       - bearerAuth: []
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "01/01/2025"
 *         description: Ngày bắt đầu
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "01/01/2026"
 *         description: Ngày kết thúc
 *       - in: query
 *         name: customerId
 *         required: false
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         description: ID khách hàng (không bắt buộc, nếu không có sẽ lấy tất cả khách hàng)
 *     responses:
 *       200:
 *         description: OK
 */
