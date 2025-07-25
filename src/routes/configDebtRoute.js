const express = require('express')
const configDebtController = require('../controllers/configDebtController')
//const validate = require('../middlewares/validation')
//const configDebtValidation = require('../validations/configDebtValidation')

const router = express.Router()

router.post('/create', configDebtController.create)
router.post('/update/:id', configDebtController.update)
router.get('/getAll', configDebtController.getAll)
router.get('/getById/:id', configDebtController.getById)
router.delete('/delete/:id', configDebtController.delete)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: ConfigDebt
 *   description: Quản lý cấu hình nợ
 */

/**
 * @swagger
 * /configDebt/create:
 *   post:
 *     summary: Tạo mới cấu hình nợ
 *     tags: [ConfigDebt]
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
 *               - limitDebt
 *               - limitRemindDay
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: ID khách hàng (ObjectId)
 *                 example: "6853b220547baefa48a9bf9f"
 *               customerName:
 *                 type: string
 *                 description: Tên khách hàng
 *                 example: "Công ty Dược ABC"
 *               limitDebt:
 *                 type: number
 *                 description: Giới hạn tiền cho nợ
 *                 example: 5000000
 *               limitDue:
 *                 type: number
 *                 description: Hạn trả tiền (ngày)
 *                 example: 30
 *               limitOverdue:
 *                 type: number
 *                 description: Hạn cho phép nợ quá hạn (ngày)
 *                 example: 7
 *               limitRemindDay:
 *                 type: number
 *                 description: Số ngày trước hạn trả để nhắc nợ
 *                 example: 5
 *               notes:
 *                 type: string
 *                 description: Ghi chú thêm
 *                 example: "Cấu hình nợ cho khách hàng VIP"
 *     responses:
 *       200:
 *         description: Tạo cấu hình nợ thành công
 */

/**
 * @swagger
 * /configDebt/update/{id}:
 *   post:
 *     summary: Cập nhật cấu hình nợ
 *     tags: [ConfigDebt]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID cấu hình nợ cần cập nhật
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
 *                 example: "Công ty Dược ABC"
 *               limitDebt:
 *                 type: number
 *                 description: Giới hạn tiền cho nợ
 *                 example: 7000000
 *               limitDue:
 *                 type: number
 *                 description: Hạn trả tiền (ngày)
 *                 example: 45
 *               limitOverdue:
 *                 type: number
 *                 description: Hạn cho phép nợ quá hạn (ngày)
 *                 example: 10
 *               limitRemindDay:
 *                 type: number
 *                 description: Số ngày trước hạn trả để nhắc nợ
 *                 example: 7
 *               notes:
 *                 type: string
 *                 description: Ghi chú thêm
 *                 example: "Cập nhật cấu hình nợ cho khách hàng VIP"
 *     responses:
 *       200:
 *         description: Cập nhật cấu hình nợ thành công
 */

/**
 * @swagger
 * /configDebt/getAll:
 *   get:
 *     summary: Lấy danh sách cấu hình nợ
 *     tags: [ConfigDebt]
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
 *         description: Từ khóa tìm kiếm tên khách hàng hoặc ghi chú
 *     responses:
 *       200:
 *         description: Lấy danh sách cấu hình nợ thành công
 */

/**
 * @swagger
 * /configDebt/getById/{id}:
 *   get:
 *     summary: Lấy chi tiết cấu hình nợ theo ID
 *     tags: [ConfigDebt]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID cấu hình nợ cần lấy
 *         example: "686d177fc27070cd8eb49dd0"
 *     responses:
 *       200:
 *         description: Lấy chi tiết cấu hình nợ thành công
 */

/**
 * @swagger
 * /configDebt/delete/{id}:
 *   delete:
 *     summary: Xóa cấu hình nợ
 *     tags: [ConfigDebt]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID cấu hình nợ cần xóa
 *     responses:
 *       200:
 *         description: Xóa cấu hình nợ thành công
 */