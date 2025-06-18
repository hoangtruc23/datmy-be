const express = require('express')
const productCategoryController = require('../controllers/productCategoryController')

const router = express.Router()
router.post('/create', productCategoryController.create)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: ProductCategory
 *   description: API quản lý danh mục sản phẩm
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
 *                 example: "http://localhost:3000/public/upload/image/1750222239346-1.png"
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
