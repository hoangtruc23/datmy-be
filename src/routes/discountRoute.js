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
router.get(
    '/getDiscountHistoryById/:id',
    discountController.getDiscountHistoryById,
)
router.get('/getHistory', discountController.getHistory)
router.post('/setRefund', discountController.setRefund)
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
 *       - name: customerId
 *         in: query
 *         schema:
 *           type: string
 *         description: Id khách hàng
 *       - name: productId
 *         in: query
 *         schema:
 *           type: string
 *         description: Id sản phẩm
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
 *     summary: Lấy thông tin lịch sử chiết khấu (group theo khách hàng)
 *     security:
 *       - bearerAuth: []
 *     tags: [Discount]
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm (tên khách hàng hoặc mã sản phẩm)
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *         description: Trang muốn lấy (mặc định = 1)
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *         description: Giới hạn số nhóm khách hàng trong 1 trang (mặc định = 10)
 *       - name: refundStatus
 *         in: query
 *         schema:
 *           type: string
 *           enum: ["paid", "unpaid"]
 *         description: Lọc theo trạng thái hoàn tiền
 *     responses:
 *       200:
 *         description: Trả về lịch sử chiết khấu, được nhóm theo khách hàng
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
 *                     data:
 *                       type: array
 *                       description: Danh sách các khách hàng kèm chi tiết chiết khấu
 *                       items:
 *                         type: object
 *                         properties:
 *                           customerInfo:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 6899751541af42d9da26a9cd
 *                               officialName:
 *                                 type: string
 *                                 example: CÔNG TY CỔ PHẦN DƯỢC PHẨM ABC
 *                           discountOfCustomer:
 *                             type: array
 *                             description: Danh sách sản phẩm và chi tiết chiết khấu của khách hàng này
 *                             items:
 *                               type: object
 *                               properties:
 *                                 productInfo:
 *                                   type: object
 *                                   properties:
 *                                     _id:
 *                                       type: string
 *                                       example: 68883718d8bdb6a24119d57c
 *                                     name:
 *                                       type: string
 *                                       example: Sản phẩm 297B
 *                                     code:
 *                                       type: string
 *                                       example: 297B
 *                                 content:
 *                                   type: string
 *                                   example: ""
 *                                 discounts:
 *                                   type: array
 *                                   description: Danh sách hóa đơn áp dụng chiết khấu
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       _id:
 *                                         type: string
 *                                         example: 68e72957ba9bdfa169ed26ee
 *                                       invoiceCode:
 *                                         type: string
 *                                         example: HOADON1
 *                                       quantity:
 *                                         type: number
 *                                         example: 10
 *                                       discountAmount:
 *                                         type: number
 *                                         example: 10000
 *                                       totalDiscountAmount:
 *                                         type: number
 *                                         example: 100000
 *                                       refundStatus:
 *                                         type: string
 *                                         example: paid
 *                                       paymentDate:
 *                                         type: string
 *                                         nullable: true
 *                                         example: 2025-10-16T17:00:00.000Z
 *                     page:
 *                       type: number
 *                       example: 1
 *                     limit:
 *                       type: number
 *                       example: 10
 *                     totalGroups:
 *                       type: number
 *                       example: 5
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
 * /discount/getDiscountHistoryById/{id}:
 *   get:
 *     summary: Lấy thông tin lịch sử chiết khấu của 1 cài đặt chiết khấu
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
 * /discount/setRefund:
 *   post:
 *     summary: Cập nhật lại phiếu chiết khấu thành trạng thái đã trả chiết khấu
 *     security:
 *       - bearerAuth: []
 *     tags: [Discount]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discountRequestId:
 *                 type: string
 *                 description: Id của phiếu chiết khấu
 *               invoiceId:
 *                 type: string
 *                 description: Id của hóa đơn
 *               paymentDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-16T00:00:00.000Z"
 *                 description: Ngày thanh toán chiết khấu (frontend truyền vào, dạng ISO hoặc new Date())
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
