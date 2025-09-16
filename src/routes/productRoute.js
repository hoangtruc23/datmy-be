const express = require('express')
const productController = require('../controllers/productController')

const router = express.Router()
router.post('/create', productController.create)
router.post('/update/:id', productController.update)
router.get('/getAllUnit', productController.getAllUnit)

router.post('/lockUnlock/:id', productController.lockUnlock)
router.delete('/delete/:id', productController.delete)
router.get('/getAll', productController.getAll)
router.get('/getById/:id', productController.getById)
router.get(
    '/getTotalQuantityByProductId',
    productController.getTotalQuantityByProductId,
)
router.get('/getAllWithQuantity', productController.getAllWithQuantity)

router.get('/getProductStorages', productController.getProductStorages)
router.get(
    '/getReceiptByTrackingCode',
    productController.getReceiptByTrackingCode,
)
router.get('/getIssueByTrackingCode', productController.getIssueByTrackingCode)
router.get(
    '/getAdvanceByTrackingCode',
    productController.getAdvanceByTrackingCode,
)
router.post(
    '/updateQuantityProductStorage',
    productController.updateQuantityProductStorage,
)
module.exports = router

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product
 */

/**
 * @swagger
 * /product/create:
 *   post:
 *     summary: Tạo mới sản phẩm
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - managementType
 *               - categoryId
 *               - brand
 *               - name
 *               - shortName
 *               - code
 *               - unit
 *               - safetyQuantity
 *             properties:
 *               managementType:
 *                 type: string
 *                 description: Kiểu quản lý sản phẩm
 *                 enum: [none, serial, batch]
 *                 example: none
 *               categoryId:
 *                 type: string
 *                 description: ID danh mục sản phẩm
 *                 example: "60d21b4667d0d8992e610c85"
 *               brand:
 *                 type: string
 *                 description: ID thương hiệu sản phẩm
 *                 example: "60d21b4667d0d8992e610c86"
 *               name:
 *                 type: string
 *                 description: Tên sản phẩm
 *                 example: "Sản phẩm A"
 *               shortName:
 *                 type: string
 *                 description: Tên viết tắt sản phẩm
 *                 example: "SP A"
 *               code:
 *                 type: string
 *                 description: Mã sản phẩm (duy nhất)
 *                 example: "12001"
 *               unit:
 *                 type: string
 *                 description: chuỗi ID của đơn vị sản phẩm
 *                 example:  684927c871287f2ae7d8130b
 *               safetyQuantity:
 *                 type: number
 *                 description: Số lượng tồn kho an toàn
 *                 minimum: 0
 *                 example: 100
 *               isWarranty:
 *                 type: boolean
 *                 description: Có bảo hành hay không
 *                 example: true
 *               specification:
 *                 type: string
 *                 description: Thông số kỹ thuật
 *                 example: "Thông số kỹ thuật chi tiết"
 *               description:
 *                 type: string
 *                 description: Mô tả sản phẩm
 *                 example: "Mô tả sản phẩm A"
 *               image:
 *                 type: string
 *                 description: Đường dẫn ảnh sản phẩm
 *                 example: "https://example.com/product.jpg"
 *               isActive:
 *                 type: boolean
 *                 description: Trạng thái hoạt động
 *                 example: true
 *     responses:
 *       200:
 *         description: Tạo sản phẩm thành công
 */

/**
 * @swagger
 * /product/update/{id}:
 *   post:
 *     summary: Cập nhật sản phẩm
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID sản phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               managementType:
 *                 type: string
 *                 description: Kiểu quản lý sản phẩm
 *                 enum: [none, serial, batch]
 *                 example: serial
 *               categoryId:
 *                 type: string
 *                 description: ID danh mục sản phẩm
 *                 example: "60d21b4667d0d8992e655c85"
 *               brand:
 *                 type: string
 *                 description: ID thương hiệu sản phẩm
 *                 example: "60d21b4667d0d8322e610c86"
 *               name:
 *                 type: string
 *                 description: Tên sản phẩm
 *                 example: "Sản phẩm B"
 *               shortName:
 *                 type: string
 *                 description: Tên viết tắt sản phẩm
 *                 example: "SP B"
 *               code:
 *                 type: string
 *                 description: Mã sản phẩm (duy nhất)
 *                 example: "12001"
 *               unit:
 *                 type: string
 *                 description: chuỗi ID của đơn vị sản phẩm
 *                 example:  684927c871287f2ae7d8130b
 *               safetyQuantity:
 *                 type: number
 *                 description: Số lượng tồn kho an toàn
 *                 minimum: 0
 *                 example: 5
 *               isWarranty:
 *                 type: boolean
 *                 description: Có bảo hành hay không
 *                 example: true
 *               specification:
 *                 type: string
 *                 description: Thông số kỹ thuật
 *                 example: "dài ngang 10cm, rộng 5cm"
 *               description:
 *                 type: string
 *                 description: Mô tả sản phẩm
 *                 example: "Mô tả sản phẩm B"
 *               image:
 *                 type: string
 *                 description: Đường dẫn ảnh sản phẩm
 *                 example: "https://example.com/product.jpg"
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
 */

/**
 * @swagger
 * /product/getAll:
 *   get:
 *     summary: Lấy danh sách danh mục sản phẩm
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng mục trên mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên, tên ngắn hoặc mã sản phẩm
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Lọc theo ID danh mục (ObjectId)
 *
 *     responses:
 *       200:
 *         description: Danh sách danh mục sản phẩm
 */

/**
 * @swagger
 * /product/getById/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần lấy thông tin
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 */

/**
 * @swagger
 * /product/lockUnlock/{id}:
 *   post:
 *     summary: Khóa hoặc mở khóa
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần khóa/mở khóa
 *     responses:
 *       200:
 *         description: Khóa/mở khóa thành công
 */

/**
 * @swagger
 * /product/getAllUnit:
 *   get:
 *     summary: Lấy danh sách tất cả các đơn vị
 *     security:
 *       - bearerAuth: []
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Tạo user thành công
 */

/**
 * @swagger
 * /product/delete/{id}:
 *   delete:
 *     summary: Xóa
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID
 *     responses:
 *       200:
 *         description: Xóa thành công
 */

/**
 * @swagger
 * /product/getTotalQuantityByProductId:
 *   get:
 *     summary: Tính tổng số lượng tồn kho theo productId
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần tính tồn kho
 *       - in: query
 *         name: warehouseId
 *         schema:
 *           type: string
 *         description: ID của kho để lọc tồn kho
 *       - in: query
 *         name: safetyQuantity
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Số lượng tối thiểu an toàn (safetyQuantity)
 *     responses:
 *       200:
 *         description: Tổng số lượng tồn kho và trạng thái an toàn
 */

/**
 * @swagger
 * /product/getAllWithQuantity:
 *   get:
 *     summary: Lấy danh sách sản phẩm kèm số lượng tồn kho và trạng thái an toàn
 *     security:
 *       - bearerAuth: []
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng sản phẩm trên mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên, mã, tên ngắn sản phẩm
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Lọc theo ID danh mục sản phẩm
 *       - in: query
 *         name: warehouseId
 *         schema:
 *           type: string
 *         description: Lọc theo ID kho hàng để tính tồn kho
 *       - in: query
 *         name: isSafeFilter
 *         schema:
 *           type: boolean
 *         description: Lọc theo trạng thái an toàn
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm kèm tồn kho và trạng thái an toàn
 */

/**
 * @swagger
 * /product/getProductStorages:
 *   get:
 *     summary: Lấy danh sách tồn kho theo sản phẩm, kho và trạng thái tồn
 *     security:
 *       - bearerAuth: []
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sản phẩm cần lọc (ObjectId)
 *       - in: query
 *         name: warehouseId
 *         schema:
 *           type: string
 *         description: ID kho hàng để lọc (tùy chọn)
 *       - in: query
 *         name: hasQuantity
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Đang tồn là (`true`) hoặc hết hàng là (`false`), mặc định đang tồn
 *     responses:
 *       200:
 *         description: Danh sách tồn kho thỏa điều kiện
 */

/**
 * @swagger
 * /product/getReceiptByTrackingCode:
 *   get:
 *     summary: Tìm phiếu nhập kho theo mã trackingCode
 *     security:
 *       - bearerAuth: []
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: trackingCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã trackingCode trong chi tiết phiếu nhập
 *     responses:
 *       200:
 *         description: Thông tin phiếu nhập có chứa trackingCode tương ứng
 */

/**
 * @swagger
 * /product/getIssueByTrackingCode:
 *   get:
 *     summary: Tìm phiếu xuất kho theo mã trackingCode
 *     security:
 *       - bearerAuth: []
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: trackingCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã trackingCode trong chi tiết phiếu xuất
 *     responses:
 *       200:
 *         description: Thông tin phiếu xuất có chứa trackingCode tương ứng
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
 *                       goodsIssueId:
 *                         type: string
 *                         example: "68623cd765a37f482d98c864"
 *                       issueNumber:
 *                         type: integer
 *                         example: 30
 *                       status:
 *                         type: string
 *                         example: "rejected"
 *                       approvedBy:
 *                         type: string
 *                         example: "Quản trị viên"
 */

/**
 * @swagger
 * /product/getAdvanceByTrackingCode:
 *   get:
 *     summary: Tìm phiếu tạm ứng theo mã trackingCode
 *     security:
 *       - bearerAuth: []
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: trackingCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã trackingCode trong borrowStorages
 *     responses:
 *       200:
 *         description: Thông tin phiếu tạm ứng chứa trackingCode tương ứng
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
 *                       goodsAdvanceId:
 *                         type: string
 *                         example: "68623cd765a37f482d98c864"
 *                       advanceNumber:
 *                         type: integer
 *                         example: 12
 *                       status:
 *                         type: string
 *                         example: "approved"
 *                       fullname:
 *                         type: string
 *                         example: "Nguyễn Văn A"
 */


/**
 * @swagger
 * /product/updateQuantityProductStorage:
 *   post:
 *     summary: Cập nhật số lượng tồn kho của sản phẩm theo tracking code
 *     security:
 *       - bearerAuth: []
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - warehouseId
 *               - productId
 *               - trackingCode
 *               - quantity
 *             properties:
 *               warehouseId:
 *                 type: string
 *                 description: ID kho hàng (ObjectId)
 *                 example: "6875c2870831baa9fe3af0b2"
 *               productId:
 *                 type: string
 *                 description: ID sản phẩm (ObjectId)
 *                 example: "6875c1a10831baa9fe3af047"
 *               trackingCode:
 *                 type: string
 *                 description: Mã lô/serial của sản phẩm
 *                 example: "A100"
 *               quantity:
 *                 type: number
 *                 description: Số lượng thay đổi (âm để giảm, dương để tăng)
 *                 example: 5
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description:  "Lỗi request (ví dụ: kho hoặc sản phẩm không tồn tại, quantity bằng 0)"
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
 *                   example: "WAREHOUSE_NOT_FOUND"
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
 *                   example: "Không có token"
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
 *                   example: "Không có quyền"
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
 *                   example: "Lỗi server!"
 *                 data:
 *                   type: string
 *                   example: null
 */
