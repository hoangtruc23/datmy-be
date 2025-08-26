const express = require('express')
const invoiceController = require('../controllers/invoiceController')
const validate = require('../middlewares/validation')
const invoiceValidation = require('../validations/invoiceValidation')

const router = express.Router()

router.post('/create', invoiceController.create)
router.post('/update/:id', invoiceController.update)
router.get('/getAll', invoiceController.getAll)
router.get('/getById/:id', invoiceController.getById)
router.delete('/delete/:id', invoiceController.delete)
router.get('/summary', invoiceController.getSummary)
router.post('/import', invoiceController.importFromExcel)
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
 *                 description: Tổng giá trị hóa đơn (Có bao gồm thuế))
 *                 example: 1468500
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
 *     summary: Cập nhật hóa đơn, chỉ update các trường cần thiết
 *     description: Cập nhật hóa đơn theo ID, chỉ các trường cần thiết sẽ được cập nhật. Không cập nhật các trường phụ thuộc như tổng tiền, sản phẩm.
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
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày đáo hạn (tính ngược ra limitDue nếu có)
 *                 example: "2025-09-15"
 *               invoiceLink:
 *                 type: string
 *                 description: Đường dẫn đến hóa đơn (nếu có)
 *                 example: "https://example.com/invoice/L00123"
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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileUrl
 *             properties:
 *               fileUrl:
 *                 type: string
 *                 description: Đường dẫn tới file Excel đã upload. Lấy từ api upload/file
 *                 example: "https://example.com/uploads/1756193071488-sochitietbanhang---dulieu.xlsx"
 */
