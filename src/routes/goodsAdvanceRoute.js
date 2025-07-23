const express = require('express')
const goodsAdvanceController = require('../controllers/goodsAdvanceController')
const router = express.Router()

router.get('/getAll', goodsAdvanceController.getAll)
router.get('/getById/:goodsAdvanceId', goodsAdvanceController.getById)
router.post('/createTemporary', goodsAdvanceController.createTemporary)
router.post('/create/:goodsAdvanceId', goodsAdvanceController.create)
router.post('/update/:goodsAdvanceId', goodsAdvanceController.update)
router.post('/cancel/:goodsAdvanceId', goodsAdvanceController.cancel)
router.post('/extend/:goodsAdvanceId', goodsAdvanceController.extend)
router.post('/receiveBack/:goodsAdvanceId', goodsAdvanceController.receiveBack)
router.post('/addProduct', goodsAdvanceController.addProduct)
router.post(
    '/updateProduct/:goodsAdvanceDetailId',
    goodsAdvanceController.updateProduct,
)
router.post(
    '/deleteProduct/:goodsAdvanceDetailId',
    goodsAdvanceController.deleteProduct,
)
router.post('/approval', goodsAdvanceController.approval)
router.post('/export', goodsAdvanceController.exportReport)
module.exports = router

/**
 * @swagger
 * tags:
 *   name: GoodsAdvance
 *   description: Phiếu tạm ứng
 */

/**
 * @swagger
 * /goodsAdvance/getAll:
 *   get:
 *     summary: Lấy danh sách các phiếu tạm ứng
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsAdvance]
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
 *           enum: [warehouseStaffApproval, warehouseAccountantApproval, debtAccountantApproval, billAccountApproval, reject, cancel, approved]
 *         example: [warehouseStaffApproval, warehouseAccountantApproval, debtAccountantApproval, billAccountApproval, reject, cancel, approved]
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
 *
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
 * /goodsAdvance/getById/{goodsAdvanceId}:
 *   get:
 *     summary: Lấy thông tin 1 phiếu tạm ứng
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsAdvance]
 *     parameters:
 *     - name: goodsAdvanceId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của phiếu tạm ứng
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
 *                 data: null
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
 * /goodsAdvance/createTemporary:
 *   post:
 *     summary: Gọi api khi nhấn nút tạo phiếu tạm ứng để lấy _id phiếu tạm ứng
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsAdvance]
 *     responses:
 *       200:
 *         description: Tạo phiếu tạm ứng tạm thành công
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
 * /goodsAdvance/create/{goodsAdvanceId}:
 *   post:
 *     summary: Tạo phiếu tạm ứng
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsAdvance]
 *     parameters:
 *     - name: goodsAdvanceId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của phiếu tạm ứng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - borrower
 *               - expectedReturnDate
 *               - customer
 *               - deliveryAddresses
 *             properties:
 *               customerId:
 *                 type: string
 *                 example: 68568d96dd90fa75cb28647a
 *               borrower:
 *                 type: string
 *                 example: path/to/file
 *               expectedReturnDate:
 *                 type: date
 *                 example: 2025-06-23
 *               borrowContent:
 *                 type: string
 *                 example: Nội dung mượn
 *               customer:
 *                 type: string
 *                 example: Tên chính thức của khách hàng
 *               deliveryAddresses:
 *                 type: string
 *                 example: Địa chỉ giao hàng
 *     responses:
 *       200:
 *         description: Tạo phiếu tạm ứng thành công
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
 * /goodsAdvance/cancel/{goodsAdvanceId}:
 *   post:
 *     summary: Hủy phiếu tạm ứng
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsAdvance]
 *     parameters:
 *     - name: goodsAdvanceId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của phiếu tạm ứng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - note
 *             properties:
 *               note:
 *                 type: string
 *                 example: Lí do hủy
 *     responses:
 *       200:
 *         description: Hủy thành công
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
 * /goodsAdvance/extend/{goodsAdvanceId}:
 *   post:
 *     summary: Gia hạn phiếu tạm ứng
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsAdvance]
 *     parameters:
 *     - name: goodsAdvanceId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của phiếu tạm ứng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - extendedReturnDate
 *               - note
 *             properties:
 *               extendedReturnDate:
 *                 type: date
 *                 example: 2025-06-23
 *               note:
 *                 type: string
 *                 example: Lí do hủy
 *     responses:
 *       200:
 *         description: Gia hạn thành công
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
 * /goodsAdvance/addProduct:
 *   post:
 *     summary: Thêm sản phẩm vào phiếu tạm ứng
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsAdvance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - goodsAdvanceId
 *               - productId
 *               - warehouseId
 *               - AdvancedQuantity
 *             properties:
 *               goodsAdvanceId:
 *                 type: string
 *                 example: "684c4cd3d1becf7806470255"
 *               productId:
 *                 type: string
 *                 example: "684c4cd3d1becf7806470255"
 *               borrowWarehouseId:
 *                 type: string
 *                 example: "684c4cd3d1becf7806470255"
 *               origin:
 *                 type: string
 *                 example: Xuất xứ sản phẩm
 *               borrowedQuantity:
 *                 type: number
 *                 example: 3
 *               borrowStatus:
 *                 type: string
 *                 example: Mới
 *               usageContent:
 *                 type: string
 *                 example: Mới
 *               storages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productStorageId:
 *                       type: string
 *                       example: '68568d96dd90fa75cb28647a'
 *                     trackingCode:
 *                       type: string
 *                       example: 'Số serial/ số lô'
 *                     quantity:
 *                       type: number
 *                       example: 10
 *               note:
 *                 type: string
 *                 example: Ghi chú
 *     responses:
 *       200:
 *         description: Thêm sản phẩm cho phiếu tạm ứng thành công
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
 * /goodsAdvance/updateProduct/{goodsAdvanceDetailId}:
 *   post:
 *     summary: Cập nhật sản phẩm của phiếu tạm ứng
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsAdvance]
 *     parameters:
 *     - name: goodsAdvanceDetailId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của 1 sản phẩm được cập nhật của phiếu tạm ứng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - goodsAdvanceId
 *               - productId
 *               - warehouseId
 *               - AdvancedQuantity
 *             properties:
 *               goodsAdvanceId:
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
 *               AdvancedQuantity:
 *                 type: number
 *                 example: 3
 *               storages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productStorageId:
 *                       type: string
 *                       example: '68568d96dd90fa75cb28647a'
 *                     trackingCode:
 *                       type: string
 *                       example: 'Số serial/ số lô'
 *                     quantity:
 *                       type: number
 *                       example: 10
 *               note:
 *                 type: string
 *                 example: Ghi chú
 *     responses:
 *       200:
 *         description: Chỉnh sửa sản phẩm cho phiếu tạm ứng thành công
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
 * /goodsAdvance/deleteProduct/{goodsAdvanceDetailId}:
 *   post:
 *     summary: Xóa sản phẩm khỏi phiếu tạm ứng
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsAdvance]
 *     parameters:
 *     - name: goodsAdvanceDetailId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của 1 sản phẩm xóa khỏi phiếu tạm ứng
 *     responses:
 *       200:
 *         description: Xóa sản phẩm khỏi phiếu tạm ứng thành công
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
 * /goodsAdvance/approval:
 *   post:
 *     summary: Duyệt phiếu tạm ứng
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsAdvance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - goodsAdvanceProcessId
 *             properties:
 *               goodsAdvanceProcessId:
 *                 type: string
 *                 example: "684c4cd3d1becf7806470255"
 *               status:
 *                 type: boolean
 *                 example: true
 *               note:
 *                 type: string
 *                 example: Ok
 *     responses:
 *       200:
 *         description: Xác nhập phiếu tạm ứng thành công
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
 * /goodsAdvance/receiveBack/{goodsAdvanceId}:
 *   post:
 *     summary: Nhận lại hàng từ phiếu tạm ứng (Chỉ thực hiện được 1 lần khi phiếu ở trạng thái 'approved')
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsAdvance]
 *     parameters:
 *     - name: goodsAdvanceId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: ID của phiếu tạm ứng cần xử lý.
 *     requestBody:
 *       required: true
 *       description: Dữ liệu chi tiết về việc nhận lại hàng.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - returner
 *               - returnDate
 *               - details
 *             properties:
 *               returner:
 *                 type: string
 *                 description: "Tên người thực hiện trả hàng."
 *                 example: "Nhân viên Nguyễn Văn Tường"
 *               returnDate:
 *                 type: string
 *                 format: date
 *                 description: "Ngày thực tế trả hàng."
 *                 example: "2025-07-22"
 *               details:
 *                 type: array
 *                 description: "Danh sách chi tiết các sản phẩm được xử lý."
 *                 items:
 *                   type: object
 *                   required:
 *                      - goodsAdvanceDetailId
 *                      - returnWarehouseId
 *                      - declaredQuantity
 *                   properties:
 *                     goodsAdvanceDetailId:
 *                       type: string
 *                       description: "ID của dòng sản phẩm trong phiếu tạm ứng."
 *                       example: "687a08ce43d7e6c16ee8b587"
 *                     returnWarehouseId:
 *                       type: string
 *                       description: "ID của kho nhận lại hàng."
 *                       example: "684c41f3ae24ff427ec487ea"
 *                     declaredQuantity:
 *                       type: number
 *                       description: "Tổng số lượng người dùng khai báo xử lý (giá trị từ ô 'Số lượng trả lại')."
 *                       example: 5
 *                     returnStatus:
 *                       type: string
 *                       description: "Trạng thái của hàng trả về (e.g., 'mới', 'trầy xước')."
 *                       example: "Còn mới, nguyên vẹn"
 *                     returnStorages:
 *                       type: array
 *                       description: "Danh sách các serial/lô hàng được trả lại kho."
 *                       items:
 *                          type: object
 *                          properties:
 *                              trackingCode:
 *                                  type: string
 *                                  example: "SERIAL-001"
 *                              quantity:
 *                                  type: number
 *                                  example: 1
 *                     lostStorages:
 *                       type: array
 *                       description: "Danh sách các serial/lô hàng bị báo mất."
 *                       items:
 *                          type: object
 *                          properties:
 *                              trackingCode:
 *                                  type: string
 *                                  example: "SERIAL-002"
 *                              quantity:
 *                                  type: number
 *                                  example: 1
 *                     lostReason:
 *                        type: string
 *                        description: "Lý do cho các sản phẩm bị mất."
 *                        example: "Thất lạc trong quá trình vận chuyển"
 *                     purchaseStorages:
 *                       type: array
 *                       description: "Danh sách các serial/lô hàng khách hàng muốn mua lại."
 *                       items:
 *                          type: object
 *                          properties:
 *                              trackingCode:
 *                                  type: string
 *                                  example: "SERIAL-003"
 *                              quantity:
 *                                  type: number
 *                                  example: 1
 *                     purchaseReason:
 *                        type: string
 *                        description: "Lý do cho việc chuyển sang mua."
 *                        example: "Khách hàng có nhu cầu sử dụng luôn"
 *     responses:
 *       '200':
 *         description: Nhận lại hàng thành công. Trạng thái phiếu tạm ứng đã được cập nhật thành 'inDebt' (Đang nợ) hoặc 'returned' (Đã trả).
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  status: { type: integer, example: 200 }
 *                  code: { type: integer, example: 1 }
 *                  message: { type: string, example: "OK!" }
 *                  data: { type: 'null', example: null }
 *       '400':
 *         description: Lỗi từ dữ liệu đầu vào không hợp lệ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 code:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: 'null'
 *             examples:
 *               InvalidState:
 *                 summary: "Lỗi sai trạng thái phiếu"
 *                 value:
 *                   status: 400
 *                   code: 73
 *                   message: "Không thể nhận lại hàng cho phiếu tạm ứng ở trạng thái này."
 *                   data: null
 *               QuantityMismatch:
 *                 summary: "Lỗi không khớp số lượng"
 *                 value:
 *                   status: 400
 *                   code: 75
 *                   message: "Tổng số lượng sản phẩm (4) không khớp với Số lượng đã khai báo (5)."
 *                   data: null
 *               OverReturn:
 *                 summary: "Lỗi trả quá số lượng mượn"
 *                 value:
 *                   status: 400
 *                   code: 74
 *                   message: "Số lượng xử lý (6) vượt quá số lượng đã mượn (5) cho sản phẩm X."
 *                   data: null
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
 * /goodsAdvance/export:
 *   post:
 *     summary: Xuất báo cáo tạm ứng chi tiết ra file excel
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsAdvance]
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
 *                 description: "Lọc theo ngày bắt đầu (YYYY-MM-DD). Mặc định là không giới hạn."
 *                 example: "2025-06-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: "Lọc theo ngày kết thúc (YYYY-MM-DD). Mặc định là không giới hạn."
 *                 example: "2025-06-30"
 *               warehouseIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: "ID của kho"
 *                 description: "Mảng chứa các ID của kho cần lọc. Gửi mảng rỗng [] hoặc bỏ qua để lấy tất cả kho."
 *                 example: ["684c41f3ae24ff427ec487ea", "68511d6d55dd137821188fdb"]
 *               statuses:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [warehouseStaffApproval, approved, waitingForExtension, reject, cancel]
 *                 description: "Mảng chứa các trạng thái cần lọc. Gửi mảng rỗng [] hoặc bỏ qua để lấy tất cả."
 *                 example: ["approved", "reject"]
 *     responses:
 *       '200':
 *         description: Yêu cầu thành công. Trả về file Excel để tải xuống.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Chưa xác thực hoặc token không hợp lệ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 401 }
 *                 code: { type: integer, example: -1 }
 *                 message: { type: string, example: 'Không có token' }
 *                 data: { type: 'null', example: null }
 *       '403':
 *         description: Không có quyền truy cập chức năng này.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 403 }
 *                 code: { type: integer, example: -1 }
 *                 message: { type: string, example: 'Không có quyền' }
 *                 data: { type: 'null', example: null }
 *       '500':
 *         description: Lỗi máy chủ nội bộ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 500 }
 *                 code: { type: integer, example: -1 }
 *                 message: { type: string, example: 'Lỗi server!' }
 *                 data: { type: string, example: null }
 */
