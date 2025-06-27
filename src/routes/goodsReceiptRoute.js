const express = require('express')
const validate = require('../middlewares/validation')
const goodsReceiptController = require('../controllers/goodsReceiptController')
const userValidation = require('../validations/userValidation')
const router = express.Router()

router.get('/getAll', goodsReceiptController.getAll)
router.get('/getById/:goodsReceiptId', goodsReceiptController.getById)
router.post('/createTemporary', goodsReceiptController.createTemporary)
router.post('/create/:goodsReceiptId', goodsReceiptController.create)
router.post('/update/:goodsReceiptId', goodsReceiptController.update)
router.post('/cancel/:goodsReceiptId', goodsReceiptController.cancel)
router.post('/addProduct', goodsReceiptController.addProduct)
router.post(
    '/updateProduct/:goodsReceiptDetailId',
    goodsReceiptController.updateProduct,
)
router.post(
    '/deleteProduct/:goodsReceiptDetailId',
    goodsReceiptController.deleteProduct,
)
router.post(
    '/confirmQuantity/:goodsReceiptDetailId',
    goodsReceiptController.confirmQuantity,
)
router.post('/approval', goodsReceiptController.approval)
router.post('/export', goodsReceiptController.exportReport)
module.exports = router

/**
 * @swagger
 * tags:
 *   name: GoodsReceipt
 *   description: Phiếu nhập kho
 */

/**
 * @swagger
 * /goodsReceipt/getAll:
 *   get:
 *     summary: Lấy danh sách các phiếu nhập kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsReceipt]
 *     parameters:
 *     - name: search
 *       in: query
 *       schema:
 *         type: string
 *       description: Từ khóa tìm kiếm
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
 *     - name: statuses
 *       in: query
 *       required: false
 *       description: Danh sách trạng thái lọc(là 1 mảng chứa các giá trị bên dưới, nếu muốn lấy tất cả thì truyền null xuống)
 *       schema:
 *         type: array
 *         items:
 *           type: string
 *           enum: [warehouseStaffApproval, reject, cancel, approved]
 *         example: [warehouseStaffApproval, reject, cancel, approved]
 *         style: form
 *         explode: true
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
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
 *                             example: 684686f736b60123f03418dd
 *                           fullname:
 *                             type: string
 *                             example: Nguyễn Văn Tài
 *                           username:
 *                             type: string
 *                             example: admin
 *                           email:
 *                             type: string
 *                             example: admin@gmail.com
 *                           phoneNumber:
 *                             type: string
 *                             example: 0968457245
 *                           isActive:
 *                             type: boolean
 *                             example: true
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-06-09T07:02:15.834Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-06-09T07:02:15.834Z
 *                           roleIds:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: [ 684927c871287f2ae7d8130b ]
 *                     page:
 *                       type: number
 *                       example: 1
 *                     totalItem:
 *                       type: number
 *                       example: 10
 *                     totalPage:
 *                       example: 1
 *                       type: number
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
 * /goodsReceipt/getById/{goodsReceiptId}:
 *   get:
 *     summary: Lấy thông tin 1 phiếu nhập kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsReceipt]
 *     parameters:
 *     - name: goodsReceiptId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của phiếu nhập kho
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
 *                     roleIds:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [ 684927c871287f2ae7d8130b ]
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
 * /goodsReceipt/createTemporary:
 *   post:
 *     summary: Gọi api khi nhấn nút tạo phiếu nhập kho để lấy _id phiếu nhập kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsReceipt]
 *     responses:
 *       200:
 *         description: Tạo phiếu nhập kho tạm thành công
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
 * /goodsReceipt/create/{goodsReceiptId}:
 *   post:
 *     summary: Tạo tài khoản người dùng
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsReceipt]
 *     parameters:
 *     - name: goodsReceiptId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của phiếu nhập kho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - supplierId
 *               - invoiceOrContractNumber
 *               - estimatedDeliveryDate
 *               - supplier
 *               - deliveryAddresses
 *             properties:
 *               supplierId:
 *                 type: string
 *                 example: 68568d96dd90fa75cb28647a
 *               invoiceFile:
 *                 type: string
 *                 example: path/to/file
 *               invoiceOrContractNumber:
 *                 type: string
 *                 example: 123
 *               estimatedDeliveryDate:
 *                 type: date
 *                 example: 2025-06-23
 *               supplier:
 *                 type: string
 *                 example: Tên chính thức của nhà cung cấp
 *               deliveryAddresses:
 *                 type: string
 *                 example: Địa chỉ giao hàng
 *               note:
 *                 type: string
 *                 example: Ghi chú
 *     responses:
 *       200:
 *         description: Tạo phiếu nhập kho thành công
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
 * /goodsReceipt/update/{goodsReceiptId}:
 *   post:
 *     summary: Cập nhật thông tin phiếu nhập kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsReceipt]
 *     parameters:
 *     - name: goodsReceiptId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của phiếu nhập kho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - supplierId
 *               - invoiceOrContractNumber
 *               - estimatedDeliveryDate
 *               - supplier
 *               - deliveryAddresses
 *             properties:
 *               supplierId:
 *                 type: string
 *                 example: 68568d96dd90fa75cb28647a
 *               invoiceFile:
 *                 type: string
 *                 example: /path/to/file
 *               invoiceOrContractNumber:
 *                 type: string
 *                 example: 123
 *               estimatedDeliveryDate:
 *                 type: date
 *                 example: 2025-06-21
 *               supplier:
 *                 type: string
 *                 example: Công ty TNHH ABC Việt Nam
 *               deliveryAddresses:
 *                 type: string
 *                 example: 123 Đường ABC, Phường 5, Quận 1, TP.HCM, Việt Nam
 *               note:
 *                 type: string
 *                 example: Ghi chú
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
 * /goodsReceipt/cancel/{goodsReceiptId}:
 *   post:
 *     summary: Hủy phiếu nhập kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsReceipt]
 *     parameters:
 *     - name: goodsReceiptId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của phiếu nhập kho
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
 * /goodsReceipt/addProduct:
 *   post:
 *     summary: Thêm sản phẩm vào phiếu nhập kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsReceipt]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - goodsReceiptId
 *               - productId
 *               - warehouseId
 *               - orderedQuantity
 *               - price
 *               - totalAmount
 *             properties:
 *               goodsReceiptId:
 *                 type: string
 *                 example: "684c4cd3d1becf7806470255"
 *               productId:
 *                 type: string
 *                 example: "684c4cd3d1becf7806470255"
 *               warehouseId:
 *                 type: string
 *                 example: "684c4cd3d1becf7806470255"
 *               origin:
 *                 type: string
 *                 example: Xuất xứ sản phẩm
 *               orderedQuantity:
 *                 type: number
 *                 example: 3
 *               price:
 *                 type: number
 *                 example: 20000
 *               totalAmount:
 *                 type: number
 *                 example: 60000
 *               note:
 *                 type: string
 *                 example: Ghi chú
 *     responses:
 *       200:
 *         description: Thêm sản phẩm cho phiếu nhập kho thành công
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
 * /goodsReceipt/updateProduct/{goodsReceiptDetailId}:
 *   post:
 *     summary: Thêm sản phẩm vào phiếu nhập kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsReceipt]
 *     parameters:
 *     - name: goodsReceiptDetailId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của 1 sản phẩm được thêm vào phiếu nhập kho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - goodsReceiptId
 *               - productId
 *               - warehouseId
 *               - orderedQuantity
 *               - price
 *               - totalAmount
 *             properties:
 *               goodsReceiptId:
 *                 type: string
 *                 example: "684c4cd3d1becf7806470255"
 *               productId:
 *                 type: string
 *                 example: "684c4cd3d1becf7806470255"
 *               warehouseId:
 *                 type: string
 *                 example: "684c4cd3d1becf7806470255"
 *               origin:
 *                 type: string
 *                 example: Xuất xứ sản phẩm
 *               orderedQuantity:
 *                 type: number
 *                 example: 3
 *               price:
 *                 type: number
 *                 example: 20000
 *               totalAmount:
 *                 type: number
 *                 example: 60000
 *               note:
 *                 type: string
 *                 example: Ghi chú
 *     responses:
 *       200:
 *         description: Chỉnh sửa sản phẩm cho phiếu nhập kho thành công
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
 * /goodsReceipt/deleteProduct/{goodsReceiptDetailId}:
 *   post:
 *     summary: Xóa sản phẩm khỏi phiếu nhập kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsReceipt]
 *     parameters:
 *     - name: goodsReceiptDetailId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của 1 sản phẩm xóa khỏi phiếu nhập kho
 *     responses:
 *       200:
 *         description: Xóa sản phẩm khỏi phiếu nhập kho thành công
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
 * /goodsReceipt/confirmQuantity/{goodsReceiptDetailId}:
 *   post:
 *     summary: Nhân viên kho xác nhận lại số lượng nhập và lưu sản phẩm với số serial hoặc số lô
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsReceipt]
 *     parameters:
 *     - name: goodsReceiptDetailId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của 1 sản phẩm trong phiếu nhập kho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - warehouseId
 *               - actualQuantity
 *               - storages
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "684c4cd3d1becf7806470255"
 *               warehouseId:
 *                 type: string
 *                 example: "684c4cd3d1becf7806470255"
 *               actualQuantity:
 *                 type: number
 *                 example: 20
 *               storages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     trackingCode:
 *                       type: string
 *                       example: 'Số serial/ số lô'
 *                     quantity:
 *                       type: number
 *                       example: 10
 *     responses:
 *       200:
 *         description: Xác nhận số lượng sản phẩm nhập kho thành công
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
 * /goodsReceipt/approval:
 *   post:
 *     summary: Duyệt phiếu nhập kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsReceipt]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - goodsReceiptApprovalId
 *               - goodsReceiptId
 *               - status
 *             properties:
 *               goodsReceiptApprovalId:
 *                 type: string
 *                 example: "684c4cd3d1becf7806470255"
 *               status:
 *                 type: string
 *                 enum: [approved, rejected, cancel]
 *                 example: approved
 *               content:
 *                 type: string
 *                 example: Ok
 *     responses:
 *       200:
 *         description: Xác nhập phiếu nhập kho thành công
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
 * /goodsReceipt/export:
 *   post:
 *     summary: Xuất báo cáo nhập kho ra file excel
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsReceipt]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: "Ngày bắt đầu (YYYY-MM-DD). Nếu bỏ trống sẽ lấy từ đầu."
 *                 example: "2025-06-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: "Ngày kết thúc (YYYY-MM-DD). Nếu bỏ trống sẽ lấy tới hiện tại."
 *                 example: "2025-06-25"
 *               warehouseIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Mảng chứa các ID của kho cần lọc. Gửi mảng rỗng [] để lấy tất cả."
 *                 example: ["684c41f3ae24ff427ec487ea", "68511d6d55dd137821188fdb"]
 *               statuses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Mảng chứa các trạng thái cần lọc. Gửi mảng rỗng [] để lấy tất cả."
 *                 example: ["success", "warehouseStaffApproval"]
 *     responses:
 *       200:
 *         description: Trả về file excel để tải xuống.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
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
