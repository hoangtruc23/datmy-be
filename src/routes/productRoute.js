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
 *           default: 1
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
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
