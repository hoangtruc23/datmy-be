const express = require('express')
const validate = require('../middleware/validation')
const userController = require('../controllers/userController')
const userValidation = require('../validation/userValidation')
const router = express.Router()

router.post('/create', validate(userValidation.create), userController.create)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User
 */

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Tạo tài khoản người dùng
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: Nguyễn Văn Tài
 *               username:
 *                 type: string
 *                 example: quantrivien
 *               email:
 *                 type: string
 *                 example: quantrivien@gmail.com
 *               phoneNumber:
 *                 type: string
 *                 example: "0987548548"
 *               password:
 *                 type: string
 *                 example: Quantrivien123!@#
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [ quantrivien ]
 *     responses:
 *       200:
 *         description: Tạo user thành công
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
 *                   example: null
 *       400:
 *         description: Lỗi input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Tên đăng nhập là bắt buộc!
 *                 data:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
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
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */
