const express = require('express')
const invoiceController = require('../controllers/invoiceController')
const validate = require('../middlewares/validation')
const invoiceValidation = require('../validations/invoiceValidation')

const router = express.Router()

router.post(
    '/create',
    validate(invoiceValidation.create),
    invoiceController.create,
)
router.post(
    '/update/:id',
    validate(invoiceValidation.update),
    invoiceController.update,
)
router.get('/getAll', invoiceController.getAll)
router.get('/getById/:id', invoiceController.getById)
router.delete('/delete/:id', invoiceController.delete)
router.get('/summary', invoiceController.getSummary)
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
 *                 description: Mã hóa đơn (L/T + số)
 *                 example: "L00123"
 *               totalAmount:
 *                 type: number
 *                 description: Tổng giá trị hóa đơn
 *                 example: 1500000
 *               limitDue:
 *                 type: number
 *                 description: Số ngày đáo hạn (tính từ ngày tạo hóa đơn)
 *                 example: 30
 *               orderBy:
 *                 type: object
 *                 description: Người đặt hàng
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
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Lê  C"
 *                   phone:
 *                     type: string
 *                     example: "0909123456"
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
 *                 description: Tổng giá trị hóa đơn
 *                 example: 3000000
 *               limitDue:
 *                 type: number
 *                 description: Số ngày đáo hạn (tính từ ngày tạo hóa đơn)
 *                 example: 45
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
