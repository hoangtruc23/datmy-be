const express = require('express')
const paymentHistoryController = require('../controllers/paymentHistoryController')
//const validate = require('../middlewares/validation')
//const paymentHistoryValidation = require('../validations/paymentHistoryValidation')

const router = express.Router()

router.post('/create', paymentHistoryController.create)
router.post('/update/:id', paymentHistoryController.update)
router.get('/getAll', paymentHistoryController.getAll)
router.get('/getById/:id', paymentHistoryController.getById)
router.delete('/delete/:id', paymentHistoryController.delete)
router.get('/getAllPaymentMethod', paymentHistoryController.getAllPaymentMethod)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: PaymentHistory
 *   description: Quản lý lịch sử thanh toán
 */

/**
 * @swagger
 * /paymentHistory/create:
 *   post:
 *     summary: Tạo mới lịch sử thanh toán
 *     tags: [PaymentHistory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invoiceId
 *               - customerName
 *               - paymentDate
 *               - amount
 *               - status
 *             properties:
 *               invoiceId:
 *                 type: string
 *                 description: ID hóa đơn (ObjectId)
 *                 example: "6853b220547baefa48a9bf9f"
 *               customerName:
 *                 type: string
 *                 description: Tên khách hàng
 *                 example: "Công ty Dược ABC"
 *               paymentDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày thanh toán
 *                 example: "2025-07-21"
 *               amount:
 *                 type: number
 *                 description: Số tiền thanh toán
 *                 example: 1000000
 *               content:
 *                 type: string
 *                 description: Nội dung thanh toán
 *                 example: "Thanh toán hóa đơn L00123"
 *               status:
 *                 type: string
 *                 description: Trạng thái thanh toán
 *                 enum: [ "paid", "partiallyPaid"]
 *               method:
 *                 type: string
 *                 description: Phương thức thanh toán
 *                 enum: [ "cash", "bank_transfer", "credit_card", "null" ]
 *               notes:
 *                 type: string
 *                 description: Ghi chú thêm
 *                 example: "Thanh toán lần 1"
 *     responses:
 *       200:
 *         description: Tạo lịch sử thanh toán thành công
 */

/**
 * @swagger
 * /paymentHistory/update/{id}:
 *   post:
 *     summary: Cập nhật lịch sử thanh toán
 *     tags: [PaymentHistory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID lịch sử thanh toán cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               invoiceId:
 *                 type: string
 *                 description: ID hóa đơn (ObjectId)
 *                 example: "6853b220547baefa48a9bf9f"
 *               customerName:
 *                 type: string
 *                 description: Tên khách hàng
 *                 example: "Công ty Dược ABC"
 *               paymentDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày thanh toán
 *                 example: "2025-07-21"
 *               amount:
 *                 type: number
 *                 description: Số tiền thanh toán
 *                 example: 1500000
 *               content:
 *                 type: string
 *                 description: Nội dung thanh toán
 *                 example: "Thanh toán hóa đơn L00123 - lần 2"
 *               status:
 *                 type: string
 *                 description: Trạng thái thanh toán
 *                 enum: [ "paid", "partiallyPaid" ]
 *               method:
 *                 type: string
 *                 description: Phương thức thanh toán
 *                 enum: [ "cash", "bank_transfer", "credit_card", "null" ]
 *               notes:
 *                 type: string
 *                 description: Ghi chú thêm
 *                 example: "Cập nhật thông tin thanh toán"
 *     responses:
 *       200:
 *         description: Cập nhật lịch sử thanh toán thành công
 */

/**
 * @swagger
 * /paymentHistory/getAll:
 *   get:
 *     summary: Lấy danh sách lịch sử thanh toán
 *     tags: [PaymentHistory]
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
 *         description: Từ khóa tìm kiếm tên khách hàng hoặc nội dung thanh toán
 *     responses:
 *       200:
 *         description: Lấy danh sách lịch sử thanh toán thành công
 */

/**
 * @swagger
 * /paymentHistory/getById/{id}:
 *   get:
 *     summary: Lấy chi tiết lịch sử thanh toán theo ID
 *     tags: [PaymentHistory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID lịch sử thanh toán cần lấy
 *         example: "686d177fc27070cd8eb49dd0"
 *     responses:
 *       200:
 *         description: Lấy chi tiết lịch sử thanh toán thành công
 */

/**
 * @swagger
 * /paymentHistory/delete/{id}:
 *   delete:
 *     summary: Xóa lịch sử thanh toán
 *     tags: [PaymentHistory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID lịch sử thanh toán cần xóa
 *     responses:
 *       200:
 *         description: Xóa lịch sử thanh toán thành công
 */


/**
 * @swagger
 * /paymentHistory/getAllPaymentMethod:
 *   get:
 *     summary: Lấy danh sách phương thức thanh toán
 *     tags: [PaymentHistory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách phương thức thanh toán
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   key:
 *                     type: string
 *                     example: "cash"
 *                   value:
 *                     type: string
 *                     example: "Tiền mặt"
 */
