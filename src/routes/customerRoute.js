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
router.post(
    '/update/:id',
    validate(customerValidation.update),
    customerController.update,
)
router.get('/getById/:id', customerController.getById)
router.get('/getAll', customerController.getAll)
router.get('/cities', customerController.getAllCities)
router.get('/districts', customerController.getAllDistricts)
router.post('/lockUnlock/:id', customerController.changeActiveStatus)
router.delete('/delete/:id', customerController.delete)
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
 *     summary: Tạo khách hàng mới
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

/**
 * @swagger
 * /customer/update/{id}:
 *   post:
 *     summary: Cập nhật thông tin khách hàng
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khách hàng cần cập nhật.
 *         example: "685160b736b60123f03418e2"
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
 *                 example: "Công ty Dược phẩm XYZ (Đã cập nhật)"
 *               officialName:
 *                 type: string
 *                 example: "CÔNG TY CỔ PHẦN DƯỢC PHẨM XYZ"
 *               taxCode:
 *                 type: string
 *                 example: "0312345678"
 *               billingAddress:
 *                 type: string
 *                 example: "123 Đường Cập Nhật, Phường 10, Quận Tân Bình, TP. HCM"
 *               deliveryAddresses:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 5
 *                 items:
 *                   type: object
 *                   properties:
 *                     street: { type: string }
 *                     ward: { type: string }
 *                     district: { type: string }
 *                     city: { type: string }
 *                     country: { type: string }
 *                 example:
 *                   - street: "Kho A, Lô B, KCN Tân Tạo"
 *                     ward: "Phường Tân Tạo A"
 *                     district: "Quận Bình Tân"
 *                     city: "TP. HCM"
 *                     country: "Việt Nam"
 *               representative:
 *                 type: object
 *                 properties:
 *                   name: { type: string, example: "Trần Thị Lan" }
 *                   title: { type: string, example: "Trưởng phòng Kinh doanh" }
 *                   phone: { type: string, example: "0987654321" }
 *               notes:
 *                 type: string
 *                 example: "Giao hàng sau 14:00. Liên hệ Ms. Lan."
 *               isActive:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       '200':
 *         description: OK - Khách hàng đã được cập nhật thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer }
 *                 code: { type: integer }
 *                 message: { type: string }
 *                 data: { type: object }
 *             example:
 *               status: 200
 *               code: 1
 *               message: "OK!"
 *               data:
 *                 _id: "685160b736b60123f03418e2"
 *                 code: 2
 *                 name: "Công ty Dược phẩm XYZ (Đã cập nhật)"
 *                 officialName: "CÔNG TY CỔ PHẦN DƯỢC PHẨM XYZ"
 *                 taxCode: "0312345678"
 *                 billingAddress: "123 Đường Cập Nhật, Phường 10, Quận Tân Bình, TP. HCM"
 *                 deliveryAddresses:
 *                   - street: "Kho A, Lô B, KCN Tân Tạo"
 *                     ward: "Phường Tân Tạo A"
 *                     district: "Quận Bình Tân"
 *                     city: "TP. HCM"
 *                     country: "Việt Nam"
 *                 representative:
 *                   name: "Trần Thị Lan"
 *                   title: "Trưởng phòng Kinh doanh"
 *                   phone: "0987654321"
 *                 notes: "Giao hàng sau 14:00. Liên hệ Ms. Lan."
 *                 isActive: false
 *                 createdAt: "2025-06-18T12:00:00.000Z"
 *                 updatedAt: "2025-06-19T08:30:00.000Z"
 *       '400':
 *         description: Bad Request - Dữ liệu không hợp lệ hoặc không tìm thấy khách hàng.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer }
 *                 code: { type: integer }
 *                 message: { type: string }
 *                 data: { type: 'object' }
 *             examples:
 *               VALIDATION_ERROR:
 *                 summary: "Lỗi validation"
 *                 value:
 *                   status: 400
 *                   code: -1
 *                   message: "Tên là bắt buộc"
 *                   data: null
 *               NOT_FOUND:
 *                 summary: "Không tìm thấy khách hàng"
 *                 value:
 *                   status: 400
 *                   code: 12
 *                   message: "Khách hàng không tồn tại!"
 *                   data: null
 *       '401':
 *         description: Unauthorized - Token không hợp lệ hoặc đã hết hạn.
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
 *         description: Forbidden - Không có quyền thực hiện hành động này.
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

/**
 * @swagger
 * /customer/getById/{id}:
 *   get:
 *     summary: Lấy thông tin khách hàng theo ID
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khách hàng cần lấy thông tin.
 *         example: "685160b736b60123f03418e2"
 *     description: |
 *       Lấy chi tiết thông tin của một khách hàng.
 *       - **Admin/BGĐ** sẽ thấy toàn bộ thông tin người liên hệ (`contactPersons`).
 *       - Các vai trò khác (Bán hàng, Kế toán kho,...) sẽ chỉ thấy thông tin người liên hệ tương ứng với vai trò của họ.
 *     responses:
 *       '200':
 *         description: Lấy thông tin khách hàng thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer }
 *                 code: { type: integer }
 *                 message: { type: string }
 *                 data: { type: object }
 *             examples:
 *               ADMIN_VIEW:
 *                 summary: "Dữ liệu cho Admin/BGĐ (đầy đủ)"
 *                 value:
 *                   status: 200
 *                   code: 1
 *                   message: "OK!"
 *                   data:
 *                     _id: "685160b736b60123f03418e2"
 *                     name: "Công ty Dược ABC"
 *                     contactPersons:
 *                       warehouseAccountant:
 *                         - name: "Trần Văn Kho"
 *                           phone: "0901112222"
 *                       sale:
 *                         - name: "Lê Thị Bán Hàng"
 *                           phone: "0903334444"
 *                       debtAccountant:
 *                         - name: "Đặng Thị Công Nợ"
 *                           phone: "0909990000"
 *               SALE_VIEW:
 *                 summary: "Dữ liệu cho nhân viên Bán hàng (bị lọc)"
 *                 value:
 *                   status: 200
 *                   code: 1
 *                   message: "OK!"
 *                   data:
 *                     _id: "685160b736b60123f03418e2"
 *                     name: "Công ty Dược ABC"
 *                     contactPersons:
 *                       sale:
 *                         - name: "Lê Thị Bán Hàng"
 *                           phone: "0903334444"
 *       '400':
 *         description: Bad Request - Không tìm thấy khách hàng.
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
 *               code: 12
 *               message: "Khách hàng không tồn tại!"
 *               data: null
 *       '401':
 *         description: Unauthorized - Token không hợp lệ hoặc đã hết hạn.
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
 *         description: Forbidden - Không có quyền thực hiện hành động này.
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

/**
 * @swagger
 * /customer/getAll:
 *   get:
 *     summary: Lấy danh sách khách hàng
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Trang hiện tại.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng kết quả mỗi trang.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo Tên hoặc Tên chính thức của khách hàng.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: "Lọc theo trạng thái (active: hoạt động, inactive: đã khóa)."
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Lọc theo Tỉnh/Thành phố.
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: Lọc theo Quận/Huyện.
 *     responses:
 *       '200':
 *         description: OK - Lấy danh sách khách hàng thành công.
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

/**
 * @swagger
 * /customer/cities:
 *   get:
 *     summary: Lấy danh sách tất cả thành phố
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thành phố thành công
 */

/**
 * @swagger
 * /customer/districts:
 *   get:
 *     summary: Lấy danh sách tất cả quận/huyện
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách quận/huyện thành công
 */

/**
 * @swagger
 * /customer/lockUnlock/{id}:
 *   post:
 *     summary: Khóa hoặc Mở khóa khách hàng
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khách hàng cần thay đổi trạng thái.
 *         example: "685160b736b60123f03418e2"
 *     description: "Endpoint này sẽ đảo ngược trạng thái `isActive` của khách hàng."
 *     responses:
 *       '200':
 *         description: OK - Trạng thái đã được thay đổi thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 code: { type: integer, example: 1 }
 *                 message: { type: string, example: "OK!" }
 *                 data:
 *                   type: object
 *                   properties:
 *                      isActive: { type: boolean }
 *             examples:
 *               LOCKED:
 *                 summary: "Khách hàng đã được khóa"
 *                 value:
 *                   status: 200
 *                   code: 1
 *                   message: "OK!"
 *                   data:
 *                      isActive: false
 *               UNLOCKED:
 *                 summary: "Khách hàng đã được mở khóa"
 *                 value:
 *                   status: 200
 *                   code: 1
 *                   message: "OK!"
 *                   data:
 *                      isActive: true
 *       '400':
 *         description: Bad Request - Không tìm thấy khách hàng.
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
 *               code: 12
 *               message: "Khách hàng không tồn tại!"
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

/**
 * @swagger
 * /customer/delete/{id}:
 *   delete:
 *     summary: Xóa một khách hàng
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khách hàng cần xóa.
 *         example: "685160b736b60123f03418e2"
 *     responses:
 *       '200':
 *         description: OK - Xóa khách hàng thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 code: { type: integer, example: 1 }
 *                 message: { type: string, example: "Xóa khách hàng thành công" }
 *                 data: { type: 'object', nullable: true, example: null }
 *       '400':
 *         description: Bad Request - Không tìm thấy khách hàng với ID cung cấp.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer }
 *                 code: { type: integer }
 *                 message: { type: string }
 *                 data: { type: 'object', nullable: true }
 *             example:
 *               status: 400
 *               code: 12
 *               message: "Khách hàng không tồn tại!"
 *               data: null
 *       '401':
 *         description: Unauthorized - Token không hợp lệ hoặc đã hết hạn.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer }
 *                 code: { type: integer }
 *                 message: { type: string }
 *                 data: { type: 'object', nullable: true }
 *             example:
 *               status: 401
 *               code: -1
 *               message: "Không có token"
 *               data: null
 *       '403':
 *         description: Forbidden - Không có quyền thực hiện hành động này.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer }
 *                 code: { type: integer }
 *                 message: { type: string }
 *                 data: { type: 'object', nullable: true }
 *             example:
 *               status: 403
 *               code: -1
 *               message: "Không có quyền"
 *               data: null
 */
