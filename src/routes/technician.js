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

module.exports = router
/**
 * @swagger:
 * tags:
 *   name: Technician
 *   description: Quản lý ktv
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
 *                 example: test
 *               password:
 *                 type: string
 *                 example: sửa máy test
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
 *     summary: Chỉnh sửa phiếu công việc mới
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
