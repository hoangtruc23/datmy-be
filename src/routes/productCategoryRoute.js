const express = require('express')
const productCategoryController = require('../controllers/productCategoryController')
const validate = require('../middlewares/validation')

const productCategoryValidation = require('../validations/productCategoryValidation')
const router = express.Router()
router.post(
    '/create',
    validate(productCategoryValidation.create),
    productCategoryController.create,
)
router.post(
    '/update/:id',
    validate(productCategoryValidation.update),
    productCategoryController.update,
)
router.get('/getById/:id', productCategoryController.getById)
router.get('/getAll', productCategoryController.getAll)
router.post('/lockUnlock/:id', productCategoryController.lockUnlock)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: ProductCategory
 *   description: ProductCategory
 */

/**
 * @swagger
 * /productCategory/create:
 *   post:
 *     summary: Tạo mới danh mục sản phẩm
 *     tags: [ProductCategory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               image:
 *                 type: string
 *                 description: Đường dẫn (URL) của ảnh danh mục
 *                 example: "http://localhost:3000/inventory/api/upload/image/1750233539665-1.png"
 *               name:
 *                 type: string
 *                 description: Tên danh mục
 *                 example: "Điện tử"
 *               description:
 *                 type: string
 *                 description: Mô tả danh mục
 *                 example: "Danh mục các thiết bị điện tử"
 *     responses:
 *       200:
 *         description: Tạo danh mục thành công
 */

/**
 * @swagger
 * /productCategory/update/{id}:
 *   post:
 *     summary: Cập nhật danh mục sản phẩm
 *     tags: [ProductCategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục sản phẩm cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 description: Đường dẫn (URL) của ảnh danh mục
 *                 example: "http://localhost:3000/inventory/api/upload/image/1750233539665-1.png"
 *               name:
 *                 type: string
 *                 description: Tên danh mục
 *                 example: "Điện tử"
 *               description:
 *                 type: string
 *                 description: Mô tả danh mục
 *                 example: "Thay đổi theo cập nhật mới"
 *               isActive:
 *                 type: boolean
 *                 description: Trạng thái kích hoạt của danh mục
 *                 example: true
 *     responses:
 *       200:
 *         description: Cập nhật danh mục thành công
 */

/**
 * @swagger
 * /productCategory/getById/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết danh mục sản phẩm theo ID
 *     tags: [ProductCategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục sản phẩm cần lấy
 *     responses:
 *       200:
 *         description: Lấy thông tin danh mục thành công
 */

/**
 * @swagger
 * /productCategory/getAll:
 *   get:
 *     summary: Lấy danh sách tất cả danh mục sản phẩm
 *     tags: [ProductCategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang hiện tại (mặc định là 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số phần tử trên mỗi trang (mặc định là 10)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm theo tên
 *     responses:
 *       200:
 *         description: Lấy danh sách danh mục thành công
 */

/**
 * @swagger
 * /productCategory/lockUnlock/{id}:
 *   post:
 *     summary: Khóa hoặc mở khóa danh mục sản phẩm
 *     tags: [ProductCategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của danh mục sản phẩm cần khóa/mở khóa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Khóa hoặc mở khóa danh mục thành công
 */
