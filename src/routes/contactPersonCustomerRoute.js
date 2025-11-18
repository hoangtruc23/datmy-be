const express = require('express')
const router = express.Router()

const contactPersonCustomerController = require('../controllers/contactPersonCustomerController')

router.get('/getAll/:customerId', contactPersonCustomerController.getAll)
router.post('/deleteContact/:customerId', contactPersonCustomerController.delete)

/**
 * @swagger
 * tags:
 *   name: ContactPerson
 *   description: thông tin liên hệ tương ứng với khách hàng
 */

/**
 * @swagger
 * /contactPerson/getAll/{customerId}:
 *   get:
 *     summary: Lấy toàn bộ các người liên hệ theo khách hàng
 *     security:
 *       - bearerAuth: []
 *     tags: [ContactPerson]
 *     parameters:
 *       - name: customerId
 *         in: path
 *         schema:
 *           type: string
 *         description: Id khách hàng
 *         required: true
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Trả về danh sách các người liên hệ theo khách hàng
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
 *                     result:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 68dba8f3edc476e8fc580c77
 *                           customerId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 689b2296324b9d06707dec99
 *                               officialName:
 *                                 type: string
 *                                 example: CÔNG TY CỔ PHẦN DƯỢC PHẨM 23/9
 *                               representative:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                                     example: ""
 *                           code:
 *                             type: string
 *                             example: JOB-00001
 *                           typeWork:
 *                             type: string
 *                             example: repair
 *                           type:
 *                             type: string
 *                             example: ""
 *                           requestSource:
 *                             type: string
 *                             example: warehouse
 *                           header:
 *                             type: string
 *                             example: TEST1
 *                           description:
 *                             type: string
 *                             example: sửa máy test
 *                           status:
 *                             type: string
 *                             example: pending
 *                           priority:
 *                             type: string
 *                             example: low
 *                           address:
 *                             type: string
 *                             example: 123, ABC Street
 *                           estimatedTime:
 *                             type: number
 *                             example: 2
 *                           overDueTime:
 *                             type: string
 *                             format: date-time
 *                             example: 2026-01-01T00:00:00.000Z
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-09-30T09:54:59.384Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-09-30T09:54:59.384Z
 *                           __v:
 *                             type: number
 *                             example: 0
 *                           technicianInfo:
 *                             type: object
 *                             properties:
 *                               technicianId:
 *                                 type: string
 *                                 example: 68dba0c6d790507bce84d743
 *                               fullname:
 *                                 type: string
 *                                 example: Nguyễn Văn A
 *                     totalItems:
 *                       type: number
 *                       example: 1
 *                     page:
 *                       type: number
 *                       example: 1
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
 * /contactPerson/deleteContact/{customerId}:
 *   post:
 *     summary: Xóa liên hệ
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của khách hàng
 *     tags: [ContactPerson]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contactName
 *               - contactEmail
 *               - contactPhone
 *             properties:
 *               contactName:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               contactEmail:
 *                 type: string
 *                 example: test@gmail.com
 *               contactPhone:
 *                 type: string
 *                 example: 0912345678
 *     responses:
 *       200:
 *         description: Xoá liên hệ thành công
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
 *                   example: Kho không tồn tại!
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

module.exports = router
