const express = require('express')
const invoiceController = require('../controllers/invoiceController')
const validate = require('../middlewares/validation')
const invoiceValidation = require('../validations/invoiceValidation')
const { uploadMemoryFile } = require('../middlewares/upload')
const router = express.Router()

router.post('/create', invoiceController.create)
router.post('/update/:id', invoiceController.update)
router.get('/getAll', invoiceController.getAll)
router.get('/getById/:id', invoiceController.getById)
router.delete('/delete/:id', invoiceController.delete)
router.get('/summary', invoiceController.getSummary)
router.post('/import', uploadMemoryFile.single('file'), invoiceController.importFromExcel)
module.exports = router

/**
 * @swagger
 * tags:
 *   name: Invoice
 *   description: Quản lý hóa đơn
 */

/**
 * @swagger
 * /invoice/create:
 *   post:
 *     summary: Tạo mới hóa đơn
 *     tags: [Invoice]
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
 *               - invoiceCode
 *               - totalAmount
 *               - invoiceDate
 *               - invoiceDetails
 *               - VATRate
 *               - VATAmount
 *               - notVATtotalAmount
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: ID khách hàng (ObjectId)
 *                 example: "6853b220547baefa48a9bf9f"
 *               customerName:
 *                 type: string
 *                 description: Tên khách hàng
 *                 example: "Công ty Dược ABC"
 *               invoiceCode:
 *                 type: string
 *                 description: Mã hóa đơn
 *                 example: "L00123"
 *               totalAmount:
 *                 type: number
 *                 description: Tổng giá trị hóa đơn (có bao gồm VAT)
 *                 example: 1468500
 *               notVATtotalAmount:
 *                 type: number
 *                 description: Tổng giá trị hóa đơn chưa VAT
 *                 example: 1335000
 *               VATRate:
 *                 type: number
 *                 description: Thuế suất VAT (%)
 *                 example: 10
 *               VATAmount:
 *                 type: number
 *                 description: Số tiền VAT
 *                 example: 133500
 *               invoiceDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày lập hóa đơn, mặc dịnh ngày hiện tại
 *                 example: "2025-08-04"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày đáo hạn
 *                 example: "2025-08-30"
 *               invoiceLink:
 *                 type: string
 *                 description: Đường dẫn đến hóa đơn (nếu có)
 *                 example: "https://example.com/invoice/L00123"
 *               paymentBy:
 *                 type: string
 *                 enum: [transfer, cash, other]
 *                 description: Phương thức thanh toán
 *                 example: "transfer"
 *               orderBy:
 *                 type: object
 *                 description: Người đặt hàng, không bắt buộc
 *                 required:
 *                   - name
 *                   - phone
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Nguyễn A"
 *                   phone:
 *                     type: string
 *                     example: "0912345678"
 *               accountant:
 *                 type: object
 *                 description: Thông tin kế toán
 *                 required:
 *                   - name
 *                   - phone
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Trần B"
 *                   phone:
 *                     type: string
 *                     example: "0987654321"
 *               reminderContact:
 *                 type: object
 *                 description: Người liên hệ nhắc nợ
 *                 required:
 *                   - name
 *                   - phone
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Lê C"
 *                   phone:
 *                     type: string
 *                     example: "0909123456"
 *               invoiceDetails:
 *                 type: array
 *                 description: Danh sách sản phẩm trong hóa đơn
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID sản phẩm
 *                       example: "64fce248a67d3e4d93db7390"
 *                     code:
 *                       type: string
 *                       description: Mã sản phẩm
 *                       example: "Mã sản phẩm"
 *                     name:
 *                       type: string
 *                       description: Tên sản phẩm
 *                       example: "Tên sản phẩm"
 *                     unit:
 *                       type: string
 *                       description: Đơn vị
 *                       example: "Đơn vị"
 *                     quantity:
 *                       type: number
 *                       minimum: 1
 *                       example: 5
 *                     price:
 *                       type: number
 *                       minimum: 0
 *                       example: 100000
 *                     discount:
 *                       type: number
 *                       minimum: 0
 *                       example: 5000
 *                     totalAmountProduct:
 *                       type: number
 *                       minimum: 0
 *                       example: 475000
 *                 example:
 *                   - productId: "64fce248a67d3e4d93db7390"
 *                     quantity: 5
 *                     price: 100000
 *                     discount: 5000
 *                     totalAmountProduct: 495000
 *                   - productId: "64fce248a67d3e4d93db7391"
 *                     quantity: 2
 *                     price: 200000
 *                     discount: 10000
 *                     totalAmountProduct: 390000
 *                   - productId: "64fce248a67d3e4d93db7392"
 *                     quantity: 1
 *                     price: 500000
 *                     discount: 50000
 *                     totalAmountProduct: 450000
 *               notes:
 *                 type: string
 *                 description: Ghi chú thêm
 *                 example: "Đây là note từ quản lý hóa đơn"
 *     responses:
 *       200:
 *         description: Tạo hóa đơn thành công
 */

/**
 * @swagger
 * /invoice/update/{id}:
 *   post:
 *     summary: Cập nhật hóa đơn
 *     description: Cập nhật hóa đơn theo ID. Các trường không gửi lên sẽ giữ nguyên giá trị cũ.
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID hóa đơn cần cập nhật
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
 *                 example: "CÔNG TY CỔ PHẦN DƯỢC PHẨM ABC"
 *               invoiceCode:
 *                 type: string
 *                 description: Mã hóa đơn (L/T + số)
 *                 example: "L00123"
 *               totalAmount:
 *                 type: number
 *                 description: Tổng giá trị hóa đơn (có bao gồm VAT)
 *                 example: 1468500
 *               notVATtotalAmount:
 *                 type: number
 *                 description: Tổng giá trị hóa đơn chưa VAT
 *                 example: 1335000
 *               VATRate:
 *                 type: number
 *                 description: Thuế suất VAT (%)
 *                 example: 10
 *               VATAmount:
 *                 type: number
 *                 description: Số tiền VAT
 *                 example: 133500
 *               invoiceDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày lập hóa đơn
 *                 example: "2025-08-04"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày đáo hạn (tự tính ra limitDue nếu có)
 *                 example: "2025-09-15"
 *               invoiceLink:
 *                 type: string
 *                 description: Đường dẫn đến hóa đơn (nếu có)
 *                 example: "https://example.com/invoice/L00123"
 *               paymentBy:
 *                 type: string
 *                 enum: [transfer, cash, other]
 *                 description: Phương thức thanh toán
 *                 example: "transfer"
 *               orderBy:
 *                 type: object
 *                 description: Người đặt hàng
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Nguyễn Văn A"
 *                   phone:
 *                     type: string
 *                     example: "0912345678"
 *               accountant:
 *                 type: object
 *                 description: Thông tin kế toán
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Trần Thị B"
 *                   phone:
 *                     type: string
 *                     example: "0987654321"
 *               reminderContact:
 *                 type: object
 *                 description: Người liên hệ nhắc nợ
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Lê Văn C"
 *                   phone:
 *                     type: string
 *                     example: "0909123456"
 *               invoiceDetails:
 *                 type: array
 *                 description: Danh sách sản phẩm trong hóa đơn
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID sản phẩm
 *                       example: "64fce248a67d3e4d93db7390"
 *                     code:
 *                       type: string
 *                       description: Mã sản phẩm
 *                       example: "Mã sản phẩm"
 *                     name:
 *                       type: string
 *                       description: Tên sản phẩm
 *                       example: "Tên sản phẩm"
 *                     unit:
 *                       type: string
 *                       description: Đơn vị
 *                       example: "Đơn vị"
 *                     quantity:
 *                       type: number
 *                       example: 5
 *                     price:
 *                       type: number
 *                       example: 100000
 *                     discount:
 *                       type: number
 *                       example: 5000
 *                     totalAmountProduct:
 *                       type: number
 *                       example: 495000
 *               notes:
 *                 type: string
 *                 description: Ghi chú thêm
 *                 example: "Cập nhật thông tin hóa đơn"
 *     responses:
 *       200:
 *         description: Cập nhật hóa đơn thành công
 */

/**
 * @swagger
 * /invoice/getAll:
 *   get:
 *     summary: Lấy danh sách hóa đơn
 *     tags: [Invoice]
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
 *         description: Từ khóa tìm kiếm mã hoặc tên khách hàng
 *       - in: query
 *         name: status
 *         schema:
 *           type: enum
 *           enum: [pending, partiallyPaid, paid, overdue]
 *           description: Trạng thái hóa đơn (pending, partiallyPaid, paid, overdue)
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */

/**
 * @swagger
 * /invoice/getById/{id}:
 *   get:
 *     summary: Lấy chi tiết hóa đơn theo ID
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID hóa đơn cần lấy
 *         example: "686d177fc27070cd8eb49dd0"
 *     responses:
 *       200:
 *         description: Lấy chi tiết hóa đơn thành công
 */

/**
 * @swagger
 * /invoice/delete/{id}:
 *   delete:
 *     summary: Xóa
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID
 *     responses:
 *       200:
 *         description: Xóa thành công
 */

/**
 * @swagger
 * /invoice/summary:
 *   get:
 *     summary: Lấy tổng hợp thông tin hóa đơn
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy tổng hợp thông tin thành công
 */

/**
 * @swagger
 * /invoice/import:
 *   post:
 *     summary: Import hóa đơn từ file Excel
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File Excel chứa dữ liệu hóa đơn (.xlsx)
 *     responses:
 *       200:
 *         description: Kết quả import hóa đơn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalInvoices:
 *                       type: integer
 *                       description: Tổng số hóa đơn trong file
 *                       example: 494
 *                     successCount:
 *                       type: integer
 *                       description: Số hóa đơn import thành công
 *                       example: 422
 *                     failedCount:
 *                       type: integer
 *                       description: Số hóa đơn thất bại
 *                       example: 95
 *                     failedInvoices:
 *                       type: array
 *                       description: Danh sách các hóa đơn thất bại kèm lý do
 *                       items:
 *                         type: string
 *                       example:
 *                         - "Hóa đơn số 00002982 lỗi do: Không tìm được sản phẩm với mã hàng là sc32,"
 *                         - "Hóa đơn số 00002983 lỗi do: Không tìm được sản phẩm với mã hàng là BAOTRI,"
 *                         - "Hóa đơn số 00002984 lỗi do: Không tìm được sản phẩm với mã hàng là SC1,"
 *       400:
 *         description: Yêu cầu không hợp lệ (thiếu fileUrl hoặc file không đúng định dạng)
 *       500:
 *         description: Lỗi server trong quá trình import
 */
