const express = require('express')
const router = express.Router()
const validate = require('../middlewares/validation')

const technicianController = require('../controllers/technicianController')
const technicianValidation = require('../validations/technicianValidation')

router.get(
    '/getAll',
    validate(technicianValidation.getAll),
    technicianController.getAll,
)
router.get('/getById/:technicianId', technicianController.getById)
router.get('/getOverall', technicianController.getOverall)
router.post(
    '/create',
    validate(technicianValidation.create),
    technicianController.create,
)
router.post(
    '/update/:technicianId',
    validate(technicianValidation.update),
    technicianController.update,
)
router.post('/changeActive/:technicianId', technicianController.changeActive)
router.get(
    '/getAllTechnicianStatus',
    technicianController.getAllTechnicianStatus,
)
router.post(
    '/login',
    validate(technicianValidation.login),
    technicianController.login,
)
router.get(
    '/getTechnicianLoginDetail',
    technicianController.getTechnicianLoginDetail,
)
router.post(
    '/changePassword',
    validate(technicianValidation.changePassword),
    technicianController.changePassword,
)
router.post(
    '/resetPassword/:technicianId',  //technician/resetPassword
    technicianController.resetPassword,
)
router.get('/logout', technicianController.logout)

module.exports = router
/**
 * @swagger:
 * tags:
 *   name: Technician
 *   description: Quản lý ktv
 */

/**
 * @swagger
 * /technician/login:
 *   post:
 *     summary: Đăng nhập và nhận access token
 *     tags: [Technician]
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
 *               username:
 *                 type: string
 *                 example: kythuatvien1
 *               password:
 *                 type: string
 *                 example: Admin123!@#
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
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
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1ZGVlNDQxZDhjYmIwMGNhZGQzMGY5ZiIsInVzZXJuYW1lIjoicm9vdCIsInJvbGUiOiJ1c2VyIn0sImlhdCI6MTc0NzAzNzA1MSwiZXhwIjoxNzQ3MDczMDUxfQ.r6k1EIB4IXYHZ0hejFrtwt7lG26GwEQanx_sS6gDSr0
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
 *                   example: Tên đăng nhập là bắt buộc
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

/**
 * @swagger
 * /technician/getTechnicianLoginDetail:
 *   get:
 *     summary: Lấy thông tin của người dùng đang đăng nhập
 *     security:
 *       - bearerAuth: []
 *     tags: [Technician]
 *     responses:
 *       200:
 *         description: Login success
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
 *                       example: 684686f736b60123f03418dd
 *                     fullname:
 *                       type: string
 *                       example: Nguyễn Văn Tài
 *                     username:
 *                       type: string
 *                       example: admin
 *                     email:
 *                       type: string
 *                       example: admin@gmail.com
 *                     phoneNumber:
 *                       type: string
 *                       example: 0968457245
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-06-09T07:02:15.834Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-06-09T07:02:15.834Z
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
 * /technician/changePassword:
 *   post:
 *     summary: Thay đổi mật khẩu của tài khoản đang đăng nhập
 *     security:
 *       - bearerAuth: []
 *     tags: [Technician]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: Admin123!@#
 *     responses:
 *       200:
 *         description: Thay đổi mật khẩu thành công
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
 *                   example: Mật khẩu mới là bắt buộc!
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

/**
 * @swagger
 * /technician/logout:
 *   get:
 *     summary: Đăng xuất
 *     security:
 *       - bearerAuth: []
 *     tags: [Technician]
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
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
 * /technician/create:
 *   post:
 *     summary: Tạo kỹ thuật viên
 *     security:
 *       - bearerAuth: []
 *     tags: [Technician]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - username
 *               - email
 *               - phoneNumber
 *               - password
 *               - area
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               username:
 *                 type: string
 *                 example: kythuatvien
 *               password:
 *                 type: string
 *                 example: Admin123!@#
 *               phoneNumber:
 *                 type: string
 *                 example: "0912345678"
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               area:
 *                 type: string
 *                 example: 123, ABC Street
 *
 *     responses:
 *       200:
 *         description: Tạo kỹ thuật thành công
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
 *                   example: Tên kho là bắt buộc!
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

/**
 * @swagger
 * /technician/update/{technicianId}:
 *   post:
 *     summary: Chỉnh sửa thông tin kỹ thuật viên
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: technicianId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của kỹ thuật viên cần chỉnh Sửa
 *     tags: [Technician]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - username
 *               - email
 *               - phoneNumber
 *               - area
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               username:
 *                 type: string
 *                 example: test
 *               phoneNumber:
 *                 type: string
 *                 example: "0912345678"
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               area:
 *                 type: string
 *                 example: 123, ABC Street
 *     responses:
 *       200:
 *         description: Sửa kỹ thuật viên thành công
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
 *                   example: Tên kho là bắt buộc!
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

/**
 * @swagger
 * /technician/getAll:
 *   get:
 *     summary: Lấy toàn bộ các thông tin của kỹ thuật viên
 *     security:
 *       - bearerAuth: []
 *     tags: [Technician]
 *     parameters:
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: ["free", "working"]
 *         description: Tình trạng của kỹ thuật viên
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
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
 *     responses:
 *       200:
 *         description: Trả về danh sách các kỹ thuật viên
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
 *                     technicians:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 68dba0c6d790507bce84d743
 *                           userId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 68dba0c6d790507bce84d73f
 *                               fullname:
 *                                 type: string
 *                                 example: Nguyễn Văn A
 *                               username:
 *                                 type: string
 *                                 example: kythuatvien1
 *                               email:
 *                                 type: string
 *                                 example: test1@gmail.com
 *                               phoneNumber:
 *                                 type: string
 *                                 example: 0912345678
 *                           code:
 *                             type: string
 *                             example: TECH-00001
 *                           area:
 *                             type: string
 *                             example: 123, ABC Street
 *                           status:
 *                             type: string
 *                             example: free
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-09-30T09:20:07.000Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-09-30T09:45:26.598Z
 *                           numOfWork:
 *                             type: number
 *                             example: 0
 *                     page:
 *                       type: number
 *                       example: 1
 *                     totalItems:
 *                       type: number
 *                       example: 2
 *                     totalPage:
 *                       type: number
 *                       example: 1
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
 * /technician/getById/{technicianId}:
 *   get:
 *     summary: Lấy thông tin kỹ thuật viên theo id
 *     security:
 *       - bearerAuth: []
 *     tags: [Technician]
 *     parameters:
 *       - in: path
 *         name: technicianId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của kỹ thuật viên cần lấy thông tin
 *     responses:
 *       200:
 *         description: Trả về thông tin kỹ thuật viên
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
 *                       example: 68dba0c6d790507bce84d743
 *                     userId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 68dba0c6d790507bce84d73f
 *                         fullname:
 *                           type: string
 *                           example: Nguyễn Văn A
 *                         username:
 *                           type: string
 *                           example: kythuatvien1
 *                         email:
 *                           type: string
 *                           example: test1@gmail.com
 *                         phoneNumber:
 *                           type: string
 *                           example: 0912345678
 *                     code:
 *                       type: string
 *                       example: TECH-00001
 *                     area:
 *                       type: string
 *                       example: 123, ABC Street
 *                     status:
 *                       type: string
 *                       example: free
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-09-30T09:20:07.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-09-30T09:45:26.598Z
 *                     __v:
 *                       type: number
 *                       example: 0
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
 * /technician/getOverall:
 *   get:
 *     summary: Lấy thống kê về các kỹ thuật viên
 *     security:
 *       - bearerAuth: []
 *     tags: [Technician]
 *     parameters: []
 *     responses:
 *       200:
 *         description: Trả về tổng quan của các kỹ thuật viên
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
 *                     allTechnician:
 *                       type: number
 *                       example: 2
 *                     free:
 *                       type: number
 *                       example: 2
 *                     working:
 *                       type: number
 *                       example: 0
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
 * /technician/changeActive/{technicianId}:
 *   post:
 *     summary: Cập nhật trạng thái của KTV
 *     security:
 *       - bearerAuth: []
 *     tags: [Technician]
 *     parameters:
 *     - name: technicianId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của KTV
 *     responses:
 *       200:
 *         description: Cập nhật thành công
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
 *                   example: Không tìm thấy nhân viên!
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

/**
 * @swagger
 * /technician/getAllTechnicianStatus:
 *   get:
 *     summary: Lấy ra tất cả các trạng thái của KTV
 *     security:
 *       - bearerAuth: []
 *     tags: [Technician]
 *     parameters: []
 *     responses:
 *       200:
 *         description: Trả về tất cả các trạng thái của KTV
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         example: free
 *                       name:
 *                         type: string
 *                         example: Rảnh
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
