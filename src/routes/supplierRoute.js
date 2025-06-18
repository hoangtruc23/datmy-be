const express = require('express')
const supplierController = require('../controllers/supplierController')
const validate = require('../middlewares/validation')

const supplierValidation = require('../validations/supplierValidation')

const router = express.Router()
router.post(
    '/create',
    validate(supplierValidation.create),
    supplierController.create,
)
router.post(
    '/update/:id',
    validate(supplierValidation.update),
    supplierController.update,
)
router.delete('/delete/:id', supplierController.delete)
router.get('/getById/:id', supplierController.getById)
router.get('/getAll', supplierController.getAll)
router.post('/lockUnlock/:id', supplierController.lockUnlock)
module.exports = router

/**
 * @swagger
 * tags:
 *   name: Supplier
 *   description: Supplier
 */

/**
 * @swagger
 * /supplier/create:
 *   post:
 *     summary: Tạo mới nhà cung cấp
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - name
 *               - officialName
 *               - taxCode
 *               - billingAddress
 *               - deliveryAddresses
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [customer, supplier]
 *                 example: supplier
 *               name:
 *                 type: string
 *                 example: "Công ty TNHH ABC"
 *               officialName:
 *                 type: string
 *                 example: "Công ty TNHH ABC Việt Nam"
 *               taxCode:
 *                 type: string
 *                 example: "1234567890"
 *               fax:
 *                 type: string
 *                 example: "0281234567"
 *               email:
 *                 type: string
 *                 example: "abc@gmail.com"
 *               phone:
 *                 type: string
 *                 example: "0909123456"
 *               billingAddress:
 *                 type: string
 *                 example: "123 Đường Hoàng Văn Thụ, Q.Phú Nhuận, TP.HCM"
 *               garageAddress:
 *                 type: string
 *                 example: "Bãi xe ABC, KCN XYZ"
 *               deliveryAddresses:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 5
 *                 items:
 *                   type: object
 *                   required:
 *                     - street
 *                     - ward
 *                     - district
 *                     - city
 *                     - country
 *                   properties:
 *                     street:
 *                       type: string
 *                       example: "123 Đường ABC"
 *                     ward:
 *                       type: string
 *                       example: "Phường 5"
 *                     district:
 *                       type: string
 *                       example: "Quận 1"
 *                     city:
 *                       type: string
 *                       example: "TP.HCM"
 *                     country:
 *                       type: string
 *                       example: "Việt Nam"
 *               representative:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Nguyễn Văn A"
 *                   title:
 *                     type: string
 *                     example: "Giám đốc"
 *                   phone:
 *                     type: string
 *                     example: "0909999999"
 *               contactPersons:
 *                 type: object
 *                 properties:
 *                   warehouseAccountant:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required:
 *                         - name
 *                         - phone
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Nguyễn Văn B"
 *                         phone:
 *                           type: string
 *                           example: "0911111111"
 *                   sale:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required:
 *                         - name
 *                         - phone
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Nguyễn Văn C"
 *                         phone:
 *                           type: string
 *                           example: "0922222222"
 *                   accountant:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required:
 *                         - name
 *                         - phone
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Nguyễn Văn D"
 *                         phone:
 *                           type: string
 *                           example: "0933333333"
 *                   tech:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required:
 *                         - name
 *                         - phone
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Nguyễn Văn E"
 *                         phone:
 *                           type: string
 *                           example: "0944444444"
 *               notes:
 *                 type: string
 *                 example: "Khách hàng lâu năm"
 *               purchaseCycleInWeeks:
 *                 type: number
 *                 example: 12
 *               internalTransport:
 *                 type: boolean
 *                 example: true
 *               productsInUse:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60d21b4967d0d8992e610c86", "60d21b4b67d0d8992e610c87"]
 *               status:
 *                 type: string
 *                 enum: [none, met, not_met]
 *                 example: none
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Tạo nhà cung cấp thành công
 */

/**
 * @swagger
 * /supplier/update/{id}:
 *   post:
 *     summary: Cập nhật nhà cung cấp
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của nhà cung cấp cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Các trường cần cập nhật (ít nhất một trường)
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [customer, supplier]
 *                 example: "supplier"
 *               name:
 *                 type: string
 *                 example: "Công ty TNHH XYZ"
 *               officialName:
 *                 type: string
 *                 example: "Công ty TNHH XYZ Việt Nam"
 *               taxCode:
 *                 type: string
 *                 example: "0987654321"
 *               fax:
 *                 type: string
 *                 example: "0287654321"
 *               email:
 *                 type: string
 *                 example: "xyz@example.com"
 *               phone:
 *                 type: string
 *                 example: "0912345678"
 *               billingAddress:
 *                 type: string
 *                 example: "456 Đường Lý Thường Kiệt, Q.10, TP.HCM"
 *               garageAddress:
 *                 type: string
 *                 example: "Bãi xe DEF, KCN UVW"
 *               deliveryAddresses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     street:
 *                       type: string
 *                       example: "456 Đường DEF"
 *                     ward:
 *                       type: string
 *                       example: "Phường 7"
 *                     district:
 *                       type: string
 *                       example: "Quận 3"
 *                     city:
 *                       type: string
 *                       example: "TP.HCM"
 *                     country:
 *                       type: string
 *                       example: "Việt Nam"
 *               representative:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Trần Thị B"
 *                   title:
 *                     type: string
 *                     example: "Phó giám đốc"
 *                   phone:
 *                     type: string
 *                     example: "0923456789"
 *               notes:
 *                 type: string
 *                 example: "Cập nhật thông tin theo yêu cầu khách hàng"
 *               purchaseCycleInWeeks:
 *                 type: number
 *                 example: 24
 *               internalTransport:
 *                 type: boolean
 *                 example: false
 *               productsInUse:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60d21b4967d0d8992e610c86", "60d21b4b67d0d8992e610c87"]
 *               status:
 *                 type: string
 *                 enum: [none, met, notMet]
 *                 example: "active"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Cập nhật nhà cung cấp thành công
 */

/**
 * @swagger
 * /supplier/delete/{id}:
 *   delete:
 *     summary: Xóa nhà cung cấp
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của nhà cung cấp cần xóa
 *     responses:
 *       200:
 *         description: Xóa nhà cung cấp thành công
 */

/**
 * @swagger
 * /supplier/getById/{id}:
 *   get:
 *     summary: Lấy thông tin nhà cung cấp theo ID
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của nhà cung cấp cần tìm
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 */

/**
 * @swagger
 * /supplier/getAll:
 *   get:
 *     summary: Lấy danh sách nhà cung cấp
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Trang hiện tại (mặc định 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Số mục mỗi trang (mặc định 10)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Tìm kiếm theo tên hoặc tên đầy đủ
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         required: false
 *         description: Tìm theo thành phố trong địa chỉ giao hàng
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         required: false
 *         description: Tìm theo quận/huyện trong địa chỉ giao hàng
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */

/**
 * @swagger
 * /supplier/lockUnlock/{id}:
 *   post:
 *     summary: Khóa hoặc mở khóa nhà cung cấp
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhà cung cấp cần khóa/mở khóa
 *     responses:
 *       200:
 *         description: Khóa/mở khóa thành công
 */
