const express = require('express')
const router = express.Router()

const discountController = require('../controllers/discountController')
const discountValidation = require('../validations/discountValidation')
const validate = require('../middlewares/validation')

router.post(
    '/create',
    validate(discountValidation.create),
    discountController.create,
)
router.get('/getAll', discountController.getAll)
router.get('/getById/:id', discountController.getById)
router.get('/getHistory', discountController.getHistory)
router.get('/getOverview', discountController.getOverview)
router.post('/approved/:id', discountController.approved)
router.post('/rejected/:id', discountController.rejected)
router.post('/setRefund/:id', discountController.setRefund)
router.post(
    '/update/:id',
    validate(discountValidation.update),
    discountController.update,
)
router.delete('/delete/:id', discountController.delete)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Discount
 *   description: Phiếu chiết khấu
 */

/**
 * @swagger
 * /discount/create:
 *   post:
 *     summary: Tạo phiếu chiết khấu mới
 *     security:
 *       - bearerAuth: []
 *     tags: [Discount]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - productId
 *               - requestDate
 *               - amount
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: ID của một khách hàng
 *                 example: ""
 *               productId:
 *                 type: string
 *                 description: ID của một sản phẩm
 *                 example: ""
 *               requestDate:
 *                 type: string
 *                 format: date
 *                 example: "YYYY-MM-DD"
 *               amount:
 *                 type: number
 *                 example: 10
 *               content:
 *                 type: string
 *                 example: "test"
 *     responses:
 *       200:
 *         description: Tạo phiếu chiết khấu thành công
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
 *                   example: Value là không được bỏ trống
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
 * /discount/getAll:
 *   get:
 *     summary: Lấy thông tin toàn bộ phiếu chiết khấu
 *     security:
 *       - bearerAuth: []
 *     tags: [Discount]
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm (tên khách hàng, tên sản phẩm, code sản phẩm)
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
 *         description: Trả về danh sách các phiếu chiết khấu trong database
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
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 68e4db6b2582e5aef9be81ea
 *                           content:
 *                             type: string
 *                             example: test
 *                           requestDate:
 *                             type: string
 *                             example: 2025-09-28T17:00:00.000Z
 *                           discountAmount:
 *                             type: number
 *                             example: 200000
 *                           customerInfo:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 689b2296324b9d06707df03b
 *                               officialName:
 *                                 type: string
 *                                 example: CÔNG TY CỔ PHẦN XUẤT NHẬP KHẨU THƯƠNG MẠI BLUE OCEAN
 *                           productInfo:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 689b2296324b9d06707de4c2
 *                               name:
 *                                 type: string
 *                                 example: Giá đỡ máy
 *                               code:
 *                                 type: string
 *                                 example: MOUNTING BRACKET
 *                     limit:
 *                       type: number
 *                       example: 10
 *                     totalItems:
 *                       type: number
 *                       example: 2
 *                     totalPages:
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
 * /discount/getHistory:
 *   get:
 *     summary: Lấy thông tin lịch sử của phiếu chiết khấu
 *     security:
 *       - bearerAuth: []
 *     tags: [Discount]
 *     parameters:
 *     - name: search
 *       in: query
 *       schema:
 *         type: string
 *       description: Từ khóa tìm kiếm (tên khách hàng, mã hóa đơn)
 *     - name: page
 *       in: query
 *       schema:
 *         type: integer
 *       description: Page muốn lấy
 *     - name: limit
 *       in: query
 *       schema:
 *         type: integer
 *       description: Giới hạn số phần tử trong 1 page
 *     - name: refundStatus
 *       in: query
 *       schema:
 *         type: string
 *         enum: ["paid", "unpaid"]
 *       description: Lọc theo trạng thái
 *     responses:
 *       200:
 *         description: Trả về lịch sử của phiếu chiết khấu
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
 *                     discountRequest:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 68e4da9c2582e5aef9be81d8
 *                           discounts:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 amount:
 *                                   type: number
 *                                   example: 100000
 *                                 requestDate:
 *                                   type: string
 *                                   example: 2025-09-16T00:00:00.000Z
 *                                 quantity:
 *                                   type: number
 *                                   example: 10
 *                                 discountAmount:
 *                                   type: number
 *                                   example: 1000000
 *                           content:
 *                             type: string
 *                             example: test
 *                           customerInfo:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 689b2296324b9d06707df03e
 *                               officialName:
 *                                 type: string
 *                                 example: CÔNG TY TNHH NTC INVEST
 *                           productInfo:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 689b2296324b9d06707de4de
 *                               name:
 *                                 type: string
 *                                 example: Ruy băng KL00142-1
 *                               code:
 *                                 type: string
 *                                 example: KL00142-1
 *                     page:
 *                       type: number
 *                       example: 1
 *                     totalItems:
 *                       type: number
 *                       example: 3
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
 * /discount/getById/{id}:
 *   get:
 *     summary: Lấy thông tin 1 phiếu chiết khấu
 *     security:
 *       - bearerAuth: []
 *     tags: [Discount]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của phiếu chiết khấu cần lấy thông tin
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
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
 *                       _id:
 *                         type: string
 *                         example: 68e4db6b2582e5aef9be81ea
 *                       content:
 *                         type: string
 *                         example: test
 *                       requestDate:
 *                         type: string
 *                         example: 2025-09-16T00:00:00.000Z
 *                       discountAmount:
 *                         type: number
 *                         example: 100000
 *                       customerInfo:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 689b2296324b9d06707df03b
 *                           officialName:
 *                             type: string
 *                             example: CÔNG TY CỔ PHẦN XUẤT NHẬP KHẨU THƯƠNG MẠI BLUE OCEAN
 *                       productInfo:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 689b2296324b9d06707de4c2
 *                           name:
 *                             type: string
 *                             example: Giá đỡ máy
 *                           code:
 *                             type: string
 *                             example: MOUNTING BRACKET
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
 *                   example: Phiếu chiết khấu không tồn tại
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
 * /discount/update/{id}:
 *   post:
 *     summary: Cập nhật thông tin phiếu chiết khấu
 *     security:
 *       - bearerAuth: []
 *     tags: [Discount]
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của phiếu chiết khấu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requestDate
 *               - customerId
 *               - productId
 *               - amount
 *             properties:
 *               requestDate:
 *                 type: string
 *                 format: date
 *                 example: "YYYY/MM/DD"
 *               customerId:
 *                 type: string
 *                 example: ''
 *               productId:
 *                 type: string
 *                 example: ''
 *               amount:
 *                 type: number
 *                 example: 10
 *               content:
 *                 type: string
 *                 example: "test"
 *     responses:
 *       200:
 *         description: Cập nhật phiếu chiết khấu thành công
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
 *                   example: Phiếu chiết khấu không tồn tại
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
 * /discount/setRefund/{id}:
 *   post:
 *     summary: Cập nhận lại phiếu chiết khấu thành trạng thái đã trả chiết khấu
 *     security:
 *       - bearerAuth: []
 *     tags: [Discount]
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của phiếu chiết khấu
 *     responses:
 *       200:
 *         description: Cập nhật phiếu chiết khấu thành công
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
 *                   example: Phiếu chiết khấu không tồn tại!
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
 * /discount/delete/{id}:
 *   delete:
 *     summary: Xóa phiếu chiết khấu
 *     tags: [Discount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của phiếu chiết khấu cần xóa
 *     responses:
 *       200:
 *         description: Xoá phiếu chiết khấu thành công
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
 *                   example: Phiếu chiết khấu không tồn tại!
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
