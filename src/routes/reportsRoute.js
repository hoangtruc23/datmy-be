const express = require('express')
const validate = require('../middlewares/validation')
const reportController = require('../controllers/reportController')
const debtReconciliationValidation = require('../validations/debtReconciliationValidation')
const reportValidation = require('../validations/reportValidation')
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

router.post('/fileDebtReconciliation', reportController.fileDebtReconciliation)

router.get(
    '/generateSalesDetailReport',
    reportController.generateSalesDetailReport,
)

router.get(
    '/getDebtConfigDetailByInvoice',
    reportController.getDebtConfigDetailByInvoice,
)
router.get(
    '/generateDebtConfigDetailByInvoice',
    reportController.generateDebtConfigDetailByInvoice,
)
router.get(
    '/getCustomerReceivableDetail',
    reportController.getCustomerReceivableDetail,
)
router.get(
    '/generateCustomerReceivableDetail',
    reportController.generateCustomerReceivableDetail,
)

router.get(
    '/reportHistoryMachine/:deviceId',
    reportController.reportHistoryMachine,
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
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "01/01/2025"
 *         description: Ngày bắt đầu
 *       - in: query
 *         name: endDate
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

/**
 * @swagger
 * /reports/fileDebtReconciliation:
 *   post:
 *     summary: Sinh báo cáo đối chiếu công nợ
 *     description: Sinh file docx mẫu biên bản đối chiếu công nợ
 *     security:
 *       - bearerAuth: []
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startDate
 *               - endDate
 *               - customerId
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-01"
 *                 description: Ngày bắt đầu của kỳ đối chiếu công nợ (YYYY-MM-DD).
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *                 description: Ngày kết thúc của kỳ đối chiếu công nợ (YYYY-MM-DD).
 *               customerId:
 *                 type: string
 *                 example: "688b814c95d7387437055e33"
 *                 description: ID khách hàng
 *     responses:
 *       200:
 *         description: OK
 */

/**
 * @swagger
 * /reports/getDebtConfigDetailByInvoice:
 *   get:
 *     summary: Sinh báo cáo sổ chi tiết công nợ theo hóa đơn
 *     description: Sinh báo cáo sổ chi tiết công nợ theo hóa đơn
 *     security:
 *       - bearerAuth: []
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           example: "2025/06/18"
 *         description: Ngày bắt đầu
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           example: "2026/01/01"
 *         description: Ngày kết thúc
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
 *       - in: query
 *         name: customerIds
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         example: ["507f1f77bcf86cd799439011","507f1f77bcf86cd799439012"]
 *         style: form
 *         explode: true
 *         description: ID khách hàng
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
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
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-17T17:00:00.000Z"
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-31T17:00:00.000Z"
 *                     customerData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           customerName:
 *                             type: string
 *                             example: "CÔNG TY CỔ PHẦN CÔNG NGHỆ PHẨM DEF"
 *                           invoices:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 postingDate:
 *                                   type: string
 *                                   format: date-time
 *                                   example: "2025-08-28T03:42:31.550Z"
 *                                 invoiceCode:
 *                                   type: string
 *                                   example: "280801"
 *                                 description:
 *                                   type: string
 *                                   example: "Bán hàng CÔNG TY CỔ PHẦN CÔNG NGHỆ PHẨM DEF theo số hóa đơn 280801"
 *                                 dueDate:
 *                                   type: string
 *                                   format: date-time
 *                                   example: "2026-01-01T00:00:00.000Z"
 *                                 totalAmount:
 *                                   type: number
 *                                   example: 1540000
 *                                 totalPaid:
 *                                   type: number
 *                                   example: 1540000
 *                                 remainingDebt:
 *                                   type: number
 *                                   example: 0
 *                           totalAmountAll:
 *                             type: number
 *                             example: 4180000
 *                           totalPaidAll:
 *                             type: number
 *                             example: 4080000
 *                           totalRemainingDebtAll:
 *                             type: number
 *                             example: 100000
 *                     totalAmountAllCus:
 *                       type: number
 *                       example: 4180000
 *                     totalPaidAllCus:
 *                       type: number
 *                       example: 4080000
 *                     totalRemainingDebtAllCus:
 *                       type: number
 *                       example: 100000
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 2
 *                         totalItems:
 *                           type: integer
 *                           example: 2
 *                         totalPages:
 *                           type: integer
 *                           example: 2
 *
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
 * /reports/generateDebtConfigDetailByInvoice:
 *   get:
 *     summary: Sinh báo cáo chi tiết công nợ phải thu theo hóa đơn
 *     description: Tạo file Excel báo cáo chi tiết bán hàng theo khoảng thời gian và khách hàng
 *     security:
 *       - bearerAuth: []
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           example: "2025/06/18"
 *         description: Ngày bắt đầu
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           example: "2026/01/01"
 *         description: Ngày kết thúc
 *       - in: query
 *         name: customerIds
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         example: ["507f1f77bcf86cd799439011","507f1f77bcf86cd799439012"]
 *         style: form
 *         explode: true
 *         description: ID khách hàng
 *     responses:
 *       200:
 *         description: OK
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
 * /reports/getCustomerReceivableDetail:
 *   get:
 *     summary: Sinh báo cáo sổ chi tiết công nợ của khách hàng
 *     description: Sinh báo cáo sổ chi tiết công nợ của khách hàng
 *     security:
 *       - bearerAuth: []
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           example: "2025/06/18"
 *         description: Ngày bắt đầu
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           example: "2026/01/01"
 *         description: Ngày kết thúc
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
 *       - in: query
 *         name: customerIds
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         example: ["507f1f77bcf86cd799439011","507f1f77bcf86cd799439012"]
 *         style: form
 *         explode: true
 *         description: ID khách hàng
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
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
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-17T17:00:00.000Z"
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-31T17:00:00.000Z"
 *                     customerData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           customerName:
 *                             type: string
 *                             example: "CÔNG TY CỔ PHẦN CÔNG NGHỆ PHẨM DEF"
 *                           invoices:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 postingDate:
 *                                   type: string
 *                                   format: date-time
 *                                   example: "2025-08-28T03:42:31.550Z"
 *                                 invoiceDate:
 *                                   type: string
 *                                   format: date-time
 *                                   nullable: true
 *                                   example: "2025-08-28T00:00:00.000Z"
 *                                 invoiceCode:
 *                                   type: string
 *                                   nullable: true
 *                                   example: "280801"
 *                                 description:
 *                                   type: string
 *                                   example: "Phí mua sản phẩm: Sản phẩm A"
 *                                 debtAccount:
 *                                   type: string
 *                                   example: "131"
 *                                 contraAccount:
 *                                   type: string
 *                                   example: "5111"
 *                                 amountDebt:
 *                                   type: number
 *                                   example: 1000000
 *                                 amountPay:
 *                                   type: number
 *                                   example: 0
 *                           totalAmountAll:
 *                             type: number
 *                             example: 4180000
 *                           totalPaidAll:
 *                             type: number
 *                             example: 4080000
 *                           totalAllDebtRemainingBefore:
 *                             type: number
 *                             example: 0
 *                     totalAmountAllCus:
 *                       type: number
 *                       example: 4180000
 *                     totalPaidAllCus:
 *                       type: number
 *                       example: 4080000
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 2
 *                         totalItems:
 *                           type: integer
 *                           example: 2
 *                         totalPages:
 *                           type: integer
 *                           example: 2
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
 * /reports/generateCustomerReceivableDetail:
 *   get:
 *     summary: Sinh báo cáo chi tiết công nợ phải thu của khách hàng
 *     description: Tạo file Excel báo cáo chi tiết bán hàng theo khoảng thời gian và khách hàng
 *     security:
 *       - bearerAuth: []
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           example: "2025/06/18"
 *         description: Ngày bắt đầu
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           example: "2026/01/01"
 *         description: Ngày kết thúc
 *       - in: query
 *         name: customerIds
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         example: ["507f1f77bcf86cd799439011","507f1f77bcf86cd799439012"]
 *         style: form
 *         explode: true
 *         description: ID khách hàng
 *     responses:
 *       200:
 *         description: OK
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
