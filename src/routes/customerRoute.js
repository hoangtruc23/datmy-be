// src/routes/customerRoute.js --- FINAL, SELF-CONTAINED AND CORRECTED VERSION

const express = require('express')
const validate = require('../middlewares/validation')
const customerController = require('../controllers/customerController')
const customerValidation = require('../validations/customerValidation')
const router = express.Router()

router.post(
    '/create',
    validate(customerValidation.create),
    customerController.create,
)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: Customer Management
 */

/**
 * @swagger
 * /customer/create:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customer]
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
 *               - officialName
 *               - taxCode
 *               - billingAddress
 *               - deliveryAddresses
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Công ty Dược ABC"
 *               officialName:
 *                 type: string
 *                 example: "CÔNG TY CỔ PHẦN DƯỢC PHẨM ABC"
 *               taxCode:
 *                 type: string
 *                 example: "1122334455"
 *               fax:
 *                 type: string
 *                 example: "0281234567"
 *               email:
 *                 type: string
 *                 example: "customer@example.com"
 *               phone:
 *                 type: string
 *                 example: "0988776655"
 *               billingAddress:
 *                 type: string
 *                 example: "123 Đường Sức Khỏe, Phường 5, Quận 10, TP. HCM"
 *               garageAddress:
 *                 type: string
 *                 example: "Bãi xe XYZ"
 *               deliveryAddresses:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 5
 *                 items:
 *                   type: object
 *                   properties:
 *                     street:
 *                       type: string
 *                     ward:
 *                       type: string
 *                     district:
 *                       type: string
 *                     city:
 *                       type: string
 *                     country:
 *                       type: string
 *                 example:
 *                   - street: "456 Đường Lạc Long Quân"
 *                     ward: "Phường 10"
 *                     district: "Quận Tân Bình"
 *                     city: "TP.HCM"
 *                     country: "Việt Nam"
 *                   - street: "789 Đường Âu Cơ"
 *                     ward: "Phường 14"
 *                     district: "Quận 11"
 *                     city: "TP.HCM"
 *                     country: "Việt Nam"
 *               representative:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Nguyễn Thị An"
 *                   title:
 *                     type: string
 *                     example: "Trưởng phòng Mua hàng"
 *                   phone:
 *                     type: string
 *                     example: "0912345678"
 *               contactPersons:
 *                 type: object
 *                 properties:
 *                   warehouseAccountant:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name: { type: string }
 *                         phone: { type: string }
 *                     example:
 *                       - name: "Trần Văn Kho"
 *                         phone: "0901112222"
 *                       - name: "Lý Thị Giữ Hàng"
 *                         phone: "0902223333"
 *                   sale:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name: { type: string }
 *                         phone: { type: string }
 *                     example:
 *                       - name: "Lê Thị Bán Hàng"
 *                         phone: "0903334444"
 *                       - name: "Ngô Văn Mua"
 *                         phone: "0904445555"
 *                   accountant:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name: { type: string }
 *                         phone: { type: string }
 *                     example:
 *                       - name: "Phạm Văn Kế Toán"
 *                         phone: "0905556666"
 *                   tech:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name: { type: string }
 *                         phone: { type: string }
 *                     example:
 *                       - name: "Võ Kỹ Thuật"
 *                         phone: "0907778888"
 *                   debtAccountant:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name: { type: string }
 *                         phone: { type: string }
 *                     example:
 *                       - name: "Đặng Thị Công Nợ"
 *                         phone: "0909990000"
 *               notes:
 *                 type: string
 *                 example: "Giao hàng sau 2 giờ chiều"
 *               purchaseCycleInWeeks:
 *                 type: number
 *                 example: 4
 *               internalTransport:
 *                 type: boolean
 *                 example: false
 *               productsInUse:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60d21b4967d0d8992e610c86", "60d21b4967d0d8992e610c87"]
 *               status:
 *                 type: string
 *                 enum: [none, met, not_met]
 *                 example: none
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       '201':
 *         description: Created - The customer was created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 code:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: OK!
 *                 data:
 *                   type: object
 *             example:
 *               status: 201
 *               code: 1
 *               message: "OK!"
 *               data:
 *                 code: 1
 *                 name: "Công ty Dược ABC"
 *                 officialName: "CÔNG TY CỔ PHẦN DƯỢC PHẨM ABC"
 *                 taxCode: "1122334455"
 *                 fax: "0281234567"
 *                 email: "customer@example.com"
 *                 phone: "0988776655"
 *                 billingAddress: "123 Đường Sức Khỏe, Phường 5, Quận 10, TP. HCM"
 *                 garageAddress: "Bãi xe XYZ"
 *                 deliveryAddresses:
 *                   - street: "456 Đường Lạc Long Quân"
 *                     ward: "Phường 10"
 *                     district: "Quận Tân Bình"
 *                     city: "TP.HCM"
 *                     country: "Việt Nam"
 *                   - street: "789 Đường Âu Cơ"
 *                     ward: "Phường 14"
 *                     district: "Quận 11"
 *                     city: "TP.HCM"
 *                     country: "Việt Nam"
 *                 representative:
 *                   name: "Nguyễn Thị An"
 *                   title: "Trưởng phòng Mua hàng"
 *                   phone: "0912345678"
 *                 contactPersons:
 *                   warehouseAccountant:
 *                     - name: "Trần Văn Kho"
 *                       phone: "0901112222"
 *                   sale:
 *                     - name: "Lê Thị Bán Hàng"
 *                       phone: "0903334444"
 *                 notes: "Giao hàng sau 2 giờ chiều"
 *                 purchaseCycleInWeeks: 4
 *                 internalTransport: false
 *                 productsInUse: ["60d21b4967d0d8992e610c86", "60d21b4967d0d8992e610c87"]
 *                 status: "none"
 *                 isActive: true
 *                 _id: "685160b736b60123f03418e2"
 *                 createdAt: "2025-06-18T12:00:00.000Z"
 *                 updatedAt: "2025-06-18T12:00:00.000Z"
 *       '400':
 *         description: Bad Request - The input data was invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer }
 *                 code: { type: integer }
 *                 message: { type: string }
 *                 data: { type: 'object' }
 *             example:
 *               status: 400
 *               code: -1
 *               message: "Tên là bắt buộc"
 *               data: null
 *       '401':
 *         description: Unauthorized - The provided token is missing, invalid, or expired.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer }
 *                 code: { type: integer }
 *                 message: { type: string }
 *                 data: { type: 'object' }
 *             example:
 *               status: 401
 *               code: -1
 *               message: "Không có token"
 *               data: null
 *       '403':
 *         description: Forbidden - The user does not have permission to perform this action.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer }
 *                 code: { type: integer }
 *                 message: { type: string }
 *                 data: { type: 'object' }
 *             example:
 *               status: 403
 *               code: -1
 *               message: "Không có quyền"
 *               data: null
 */