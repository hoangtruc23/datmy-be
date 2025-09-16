const express = require('express')
const router = express.Router()

const mailController = require('../controllers/mailController')
const validation = require('../middlewares/validation')
const mailValidation = require('../validations/mailValidation')

router.post('/configMailServer', mailController.configMailServer)
router.post(
    '/configMailReceiver',
    validation(mailValidation.configMailReceiver),
    mailController.configMailReceiver,
)
router.post('/sendMail', mailController.sendMail)
router.get('/getAll', mailController.getAll)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Mail
 *   description: gửi mail
 */

/**
 * @swagger
 * /mail/configMailServer:
 *   post:
 *     summary: Cấu hình mail server
 *     tags: [Mail]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - host
 *               - port
 *               - secure
 *               - username
 *               - password
 *             properties:
 *               host:
 *                 type: string
 *                 example: "test"
 *               port:
 *                 type: number
 *                 example: 465
 *               secure:
 *                 type: boolean
 *                 example: true
 *               username:
 *                 type: string
 *                 example: test
 *               password:
 *                 type: string
 *                 example: test
 *     responses:
 *       200:
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
 * /mail/configMailReceiver:
 *   post:
 *     summary: Cấu hình người nhận mail mặc định
 *     tags: [Mail]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverIds
 *             properties:
 *               receiverIds:
 *                 type: array
 *                 description: Id những user nhận
 *                 items:
 *                   type: string
 *                   example: id của customer
 *     responses:
 *       200:
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
 * /mail/sendMail:
 *   post:
 *     summary: Gửi thư
 *     tags: [Mail]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *             properties:
 *               subject:
 *                 type: string
 *                 description: Tiêu đề
 *                 example: Test
 *               html:
 *                 type: string
 *                 description: Nội dung thư
 *                 example: <p>Test</p>
 *     responses:
 *       200:
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
 * /mail/getAll:
 *   get:
 *     summary: Lấy ra mail server và danh sách người nhận
 *     security:
 *       - bearerAuth: []
 *     tags: [Mail]
 *     responses:
 *       200:
 *         description: Trả về cấu hình mail server và danh sách người nhận
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
 *                     _id:
 *                       type: string
 *                       example: 68c127e5bc75fbbcca8cf991
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                     host:
 *                       type: string
 *                       example: test
 *                     port:
 *                       type: integer
 *                       example: 465
 *                     secure:
 *                       type: boolean
 *                       example: true
 *                     user:
 *                       type: string
 *                       example: test
 *                     pass:
 *                       type: string
 *                       example: test
 *                     receiverIds:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 684bcaeb7cac1b319680bf10
 *                           username:
 *                             type: string
 *                             example: ketoanhoadon
 *                           email:
 *                             type: string
 *                             example: user1@gamil.com
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
