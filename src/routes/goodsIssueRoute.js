const express = require('express')
const goodsIssueController = require('../controllers/goodsIssueController')
const router = express.Router()

router.get('/getAll', goodsIssueController.getAll)
router.get('/getById/:goodsIssueId', goodsIssueController.getById)
router.post('/createTemporary', goodsIssueController.createTemporary)
router.post('/create/:goodsIssueId', goodsIssueController.create)
router.post('/update/:goodsIssueId', goodsIssueController.update)
router.post('/cancel/:goodsIssueId', goodsIssueController.cancel)
router.post('/addProduct', goodsIssueController.addProduct)
router.post(
    '/updateProduct/:goodsIssueDetailId',
    goodsIssueController.updateProduct,
)
router.post(
    '/deleteProduct/:goodsIssueDetailId',
    goodsIssueController.deleteProduct,
)
router.post('/approval', goodsIssueController.approval)
router.post('/export', goodsIssueController.exportReport)
router.get(
    '/downloadInvoice/:goodsIssueId',
    goodsIssueController.downloadInvoiceFile,
)
router.get('/generatePdf/:goodsIssueId', goodsIssueController.generatePdf)
module.exports = router

/**
 * @swagger
 * tags:
 *   name: GoodsIssue
 *   description: Phiếu xuất kho
 */

/**
 * @swagger
 * /goodsIssue/getAll:
 *   get:
 *     summary: Lấy danh sách các phiếu xuất kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsIssue]
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
 * /goodsIssue/getById/{goodsIssueId}:
 *   get:
 *     summary: Lấy thông tin 1 phiếu xuất kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsIssue]
 *     parameters:
 *     - name: goodsIssueId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của phiếu xuất kho
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
 * /goodsIssue/createTemporary:
 *   post:
 *     summary: Gọi api khi nhấn nút tạo phiếu xuất kho để lấy _id phiếu xuất kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsIssue]
 *     responses:
 *       200:
 *         description: Tạo phiếu xuất kho tạm thành công
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
 * /goodsIssue/create/{goodsIssueId}:
 *   post:
 *     summary: Tạo tài khoản người dùng
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsIssue]
 *     parameters:
 *     - name: goodsIssueId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của phiếu xuất kho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - invoiceOrContractNumber
 *               - estimatedDeliveryDate
 *               - customer
 *               - deliveryAddresses
 *               - orderedBy
 *               - recipient
 *             properties:
 *               customerId:
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
 *               customer:
 *                 type: string
 *                 example: Tên chính thức của khách hàng
 *               deliveryAddresses:
 *                 type: string
 *                 example: Địa chỉ giao hàng
 *               orderedBy:
 *                 type: object
 *                 require:
 *                   - name
 *                   - phone
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Tên người liên hệ bán hàng trong khách hàng
 *                   phone:
 *                     type: string
 *                     example: Số điện thoại người liên hệ bán hàng trong khách hàng
 *               recipient:
 *                 type: object
 *                 require:
 *                   - name
 *                   - phone
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Tên người liên hệ kho trong khách hàng
 *                   phone:
 *                     type: string
 *                     example: Số điện thoại người liên hệ kho trong khách hàng
 *               note:
 *                 type: string
 *                 example: Ghi chú
 *               isDraft:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Tạo phiếu xuất kho thành công
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
 * /goodsIssue/update/{goodsIssueId}:
 *   post:
 *     summary: Cập nhật thông tin phiếu xuất kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsIssue]
 *     parameters:
 *     - name: goodsIssueId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của phiếu xuất kho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - invoiceOrContractNumber
 *               - estimatedDeliveryDate
 *               - customer
 *               - deliveryAddresses
 *               - orderedBy
 *               - recipient
 *             properties:
 *               customerId:
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
 *               customer:
 *                 type: string
 *                 example: Tên chính thức của khách hàng
 *               deliveryAddresses:
 *                 type: string
 *                 example: Địa chỉ giao hàng
 *               orderedBy:
 *                 type: object
 *                 require:
 *                   - name
 *                   - phone
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Tên người liên hệ bán hàng trong khách hàng
 *                   phone:
 *                     type: string
 *                     example: Số điện thoại người liên hệ bán hàng trong khách hàng
 *               recipient:
 *                 type: object
 *                 require:
 *                   - name
 *                   - phone
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Tên người liên hệ kho trong khách hàng
 *                   phone:
 *                     type: string
 *                     example: Số điện thoại người liên hệ kho trong khách hàng
 *               note:
 *                 type: string
 *                 example: Ghi chú
 *               isDraft:
 *                 type: boolean
 *                 example: true
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
 * /goodsIssue/cancel/{goodsIssueId}:
 *   post:
 *     summary: Hủy phiếu xuất kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsIssue]
 *     parameters:
 *     - name: goodsIssueId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của phiếu xuất kho
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
 * /goodsIssue/addProduct:
 *   post:
 *     summary: Thêm sản phẩm vào phiếu xuất kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsIssue]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - goodsIssueId
 *               - productId
 *               - warehouseId
 *               - issuedQuantity
 *               - price
 *               - totalAmount
 *             properties:
 *               goodsIssueId:
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
 *               issuedQuantity:
 *                 type: number
 *                 example: 3
 *               price:
 *                 type: number
 *                 example: 20000
 *               totalAmount:
 *                 type: number
 *                 example: 60000
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
 *         description: Thêm sản phẩm cho phiếu xuất kho thành công
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
 * /goodsIssue/updateProduct/{goodsIssueDetailId}:
 *   post:
 *     summary: Cập nhật sản phẩm vào phiếu xuất kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsIssue]
 *     parameters:
 *     - name: goodsIssueDetailId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của 1 sản phẩm được cập nhật vào phiếu xuất kho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - goodsIssueId
 *               - productId
 *               - warehouseId
 *               - issuedQuantity
 *               - price
 *               - totalAmount
 *             properties:
 *               goodsIssueId:
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
 *               issuedQuantity:
 *                 type: number
 *                 example: 3
 *               price:
 *                 type: number
 *                 example: 20000
 *               totalAmount:
 *                 type: number
 *                 example: 60000
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
 *         description: Chỉnh sửa sản phẩm cho phiếu xuất kho thành công
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
 * /goodsIssue/deleteProduct/{goodsIssueDetailId}:
 *   post:
 *     summary: Xóa sản phẩm khỏi phiếu xuất kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsIssue]
 *     parameters:
 *     - name: goodsIssueDetailId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của 1 sản phẩm xóa khỏi phiếu xuất kho
 *     responses:
 *       200:
 *         description: Xóa sản phẩm khỏi phiếu xuất kho thành công
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
 * /goodsIssue/approval:
 *   post:
 *     summary: Duyệt phiếu xuất kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsIssue]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - goodsIssueApprovalId
 *               - goodsIssueId
 *             properties:
 *               goodsIssueApprovalId:
 *                 type: string
 *                 example: "684c4cd3d1becf7806470255"
 *               status:
 *                 type: string
 *                 enum: [approved, rejected, cancel]
 *                 example: [approved]
 *               content:
 *                 type: string
 *                 example: Ok
 *     responses:
 *       200:
 *         description: Xác nhập phiếu xuất kho thành công
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
 * /goodsIssue/export:
 *   post:
 *     summary: Xuất báo cáo bán hàng (xuất kho) ra file excel
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsIssue]
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
 *                 example: "2025-06-12"
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
 *                 example: []
 *               statuses:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [draft, warehouseStaffApproval, warehouseAccountantApproval, debtAccountantApproval, billAccountApproval, approved, reject, cancel]
 *                 description: "Mảng chứa các trạng thái cần lọc. Gửi mảng rỗng [] để lấy tất cả."
 *                 example: ["approved", "draft"]
 *     responses:
 *       200:
 *         description: Trả về file excel để tải xuống.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
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
 *                   example: "Không có token"
 *                 data:
 *                   type: "object"
 *                   nullable: true
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
 *                   example: "Không có quyền"
 *                 data:
 *                   type: "object"
 *                   nullable: true
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
 *                   example: "Lỗi server!"
 *                 data:
 *                   type: "object"
 *                   nullable: true
 */
/**
 * @swagger
 * /goodsIssue/downloadInvoice/{goodsIssueId}:
 *   get:
 *     summary: Tải file số hoá đơn/hợp đồng của phiếu xuất kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsIssue]
 *     parameters:
 *       - in: path
 *         name: goodsIssueId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phiếu xuất kho
 *     responses:
 *       200:
 *         description: Trả về file để tải về
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Không tìm thấy phiếu hoặc file
 *       500:
 *         description: Lỗi server khi tải file
 */

/**
 * @swagger
 * /goodsIssue/generatePdf/{goodsIssueId}:
 *   get:
 *     summary: Xuất file PDF phiếu xuất kho
 *     security:
 *       - bearerAuth: []
 *     tags: [GoodsIssue]
 *     parameters:
 *       - in: path
 *         name: goodsIssueId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phiếu xuất kho
 *     responses:
 *       200:
 *         description: Trả về file PDF để tải về
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Không tìm thấy phiếu
 *       500:
 *         description: Lỗi tạo PDF
 */
