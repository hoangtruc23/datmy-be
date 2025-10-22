const express = require('express')

const router = express.Router()
const orderController = require('../controllers/orderController')

router.post('/create', orderController.create)
router.post('/update/:orderId', orderController.update)
router.post('/getByIdForIssue', orderController.getByIdForIssue)
router.get('/getById/:orderId', orderController.getById)
router.get('/getAll', orderController.getAll)
router.delete('/delete/:orderId', orderController.delete)

module.exports = router
/**
 * @swagger
 * /order/getAll:
 *   get:
 *     summary: Lấy danh sách đơn hàng (lọc theo customerId, phân trang)
 *     security:
 *       - bearerAuth: []
 *     tags: [Order]
 *     parameters:
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *         description: ID của khách hàng để lọc đơn hàng
 *         example: "68e37b235349580024fe756e"
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
 *         description: Số lượng đơn hàng mỗi trang
 *     responses:
 *       200:
 *         description: Lấy danh sách đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   description: Danh sách đơn hàng
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID đơn hàng
 *                       customerId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           code:
 *                             type: string
 *                           officialName:
 *                             type: string
 *                           name:
 *                             type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       __v:
 *                         type: integer
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             orderId:
 *                               type: string
 *                             productId:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *                                 code:
 *                                   type: string
 *                             quantity:
 *                               type: number
 *                             __v:
 *                               type: integer
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                             updatedAt:
 *                               type: string
 *                               format: date-time
 *                 page:
 *                   type: integer
 *                 totalItems:
 *                   type: integer
 *                 totalPage:
 *                   type: integer
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc khách hàng không tồn tại
 *       500:
 *         description: Lỗi server
 */
/**
 * @swagger
 * /order/getByIdForIssue:
 *   post:
 *     summary: Lấy thông tin chi tiết của một hoặc nhiều đơn hàng cùng khách hàng
 *     description: |
 *       API này cho phép truyền vào **một hoặc nhiều ID đơn hàng**.
 *       - Mỗi sản phẩm sẽ có trường **số lượng còn lại** (`remainingQuantity = quantity - quantityExported`).
 *       - Các sản phẩm có `remainingQuantity <= 0` sẽ bị loại bỏ khỏi danh sách.
 *     security:
 *       - bearerAuth: []
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderIds
 *             properties:
 *               orderIds:
 *                 type: array
 *                 description: Danh sách ID của các đơn hàng cần lấy
 *                 items:
 *                   type: string
 *                 example: ["652eabc1234abcd5678ef901", "652eabc1234abcd5678ef902"]
 *     responses:
 *       200:
 *         description: Lấy thông tin đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customer:
 *                   type: object
 *                   description: Thông tin khách hàng của các đơn hàng
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "652eabc1234abcd5678ef000"
 *                     name:
 *                       type: string
 *                       example: "Công ty TNHH ABC"
 *                     officialName:
 *                       type: string
 *                       example: "CÔNG TY TNHH ABC"
 *                     code:
 *                       type: string
 *                       example: "KH001"
 *                 orderIds:
 *                   type: array
 *                   description: Danh sách ID đơn hàng đã gửi lên
 *                   items:
 *                     type: string
 *                 items:
 *                   type: array
 *                   description: Danh sách sản phẩm đã gộp từ các đơn hàng
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: object
 *                         description: Thông tin sản phẩm
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "652eabc1234abcd5678ef111"
 *                           name:
 *                             type: string
 *                             example: "Sản phẩm A"
 *                           code:
 *                             type: string
 *                             example: "SP001"
 *                           shortName:
 *                             type: string
 *                             example: "A"
 *                       totalQuantity:
 *                         type: number
 *                         description: Tổng số lượng đặt của sản phẩm trong các đơn hàng
 *                         example: 100
 *                       totalExported:
 *                         type: number
 *                         description: Tổng số lượng đã xuất kho của sản phẩm
 *                         example: 70
 *                       remainingQuantity:
 *                         type: number
 *                         description: Số lượng còn lại có thể xuất (totalQuantity - totalExported)
 *                         example: 30
 *       400:
 *         description: Dữ liệu không hợp lệ (thiếu orderIds hoặc order không cùng khách hàng)
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền thực hiện
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /order/update/{orderId}:
 *   post:
 *     summary: Cập nhật thông tin đơn hàng theo ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: ID khách hàng
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: Ngày tạo đơn hàng (ISO 8601)
 *               items:
 *                 type: array
 *                 description: Danh sách sản phẩm trong đơn hàng
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID sản phẩm
 *                     quantity:
 *                       type: number
 *                       description: Số lượng sản phẩm
 *     responses:
 *       200:
 *         description: Cập nhật đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID đơn hàng
 *                 customerId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Ngày tạo đơn hàng
 *                 items:
 *                   type: array
 *                   description: Danh sách chi tiết sản phẩm sau khi cập nhật
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       productId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           code:
 *                             type: string
 *                       quantity:
 *                         type: number
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền thực hiện
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /order/delete/{orderId}:
 *   delete:
 *     summary: Xóa một đơn hàng theo ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng cần xóa
 *     responses:
 *       200:
 *         description: Xóa đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order deleted successfully"
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền thực hiện
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /order/create:
 *   post:
 *     summary: Tạo mới một đơn hàng
 *     security:
 *       - bearerAuth: []
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - items
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: ID khách hàng
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: Ngày tạo đơn hàng (ISO 8601). Mặc định là thời gian hiện tại nếu không truyền.
 *               items:
 *                 type: array
 *                 description: Danh sách sản phẩm trong đơn hàng
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID sản phẩm
 *                     quantity:
 *                       type: number
 *                       description: Số lượng sản phẩm
 *     responses:
 *       200:
 *         description: Tạo đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID của đơn hàng
 *                     customerId:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Ngày tạo đơn hàng
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                           quantity:
 *                             type: number
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc customer không tồn tại
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền thực hiện
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /order/getById/{orderId}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một đơn hàng
 *     description: |
 *       API này trả về thông tin **khách hàng** (bao gồm thông tin liên hệ, địa chỉ, người đại diện, v.v.)
 *       và **danh sách sản phẩm** thuộc đơn hàng.
 *       Mỗi sản phẩm bao gồm thông tin cơ bản và số lượng đã xuất kho (nếu có).
 *     security:
 *       - bearerAuth: []
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: ID của đơn hàng cần lấy
 *         schema:
 *           type: string
 *           example: "652eabc1234abcd5678ef901"
 *     responses:
 *       200:
 *         description: Lấy thông tin đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 code:
 *                   type: number
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: "OK!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     customer:
 *                       type: object
 *                       description: Thông tin khách hàng của đơn hàng
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "6899751541af42d9da26a9cd"
 *                         code:
 *                           type: string
 *                           example: "KH004"
 *                         name:
 *                           type: string
 *                           example: "Công ty Dược ABC"
 *                         officialName:
 *                           type: string
 *                           example: "CÔNG TY CỔ PHẦN DƯỢC PHẨM ABC"
 *                         taxCode:
 *                           type: string
 *                           example: "11820251143"
 *                         phone:
 *                           type: string
 *                           example: "0988776655"
 *                         email:
 *                           type: string
 *                           example: "customer@example.com"
 *                         fax:
 *                           type: string
 *                           example: "0281234567"
 *                         billingAddress:
 *                           type: string
 *                           example: "123 Đường Sức Khỏe, Phường 5, Quận 10, TP. HCM"
 *                         garageAddress:
 *                           type: string
 *                           example: "Bãi xe XYZ"
 *                         deliveryAddresses:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               street:
 *                                 type: string
 *                                 example: "456 Đường Lạc Long Quân"
 *                               ward:
 *                                 type: string
 *                                 example: "Phường 10"
 *                               district:
 *                                 type: string
 *                                 example: "Quận 12"
 *                               city:
 *                                 type: string
 *                                 example: "TP.HCM"
 *                               country:
 *                                 type: string
 *                                 example: "Việt Nam"
 *                         representative:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               example: "Nguyễn Thị An"
 *                             title:
 *                               type: string
 *                               example: "Trưởng phòng Mua hàng"
 *                             phone:
 *                               type: string
 *                               example: "0912345678"
 *                         contactPersons:
 *                           type: object
 *                           description: Danh sách liên hệ theo từng vai trò
 *                           properties:
 *                             warehouseAccountant:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                                     example: "Trần Văn Kho"
 *                                   phone:
 *                                     type: string
 *                                     example: "0901112222"
 *                             sale:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                                     example: "Lê Thị Bán Hàng"
 *                                   phone:
 *                                     type: string
 *                                     example: "0903334444"
 *                             accountant:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                                     example: "Phạm Văn Kế Toán"
 *                                   phone:
 *                                     type: string
 *                                     example: "0905556666"
 *                             tech:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                                     example: "Võ Kỹ Thuật"
 *                                   phone:
 *                                     type: string
 *                                     example: "0907778888"
 *                         notes:
 *                           type: string
 *                           example: "Giao hàng sau 2 giờ chiều"
 *                         purchaseCycleInWeeks:
 *                           type: number
 *                           example: 4
 *                         internalTransport:
 *                           type: boolean
 *                           example: false
 *                         productsInUse:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["688056b07b39f0cb892dd257", "68883718d8bdb6a24119d57c"]
 *                         status:
 *                           type: string
 *                           example: "none"
 *                         isActive:
 *                           type: boolean
 *                           example: true
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-08-11T04:44:05.059Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-09-30T03:14:06.161Z"
 *                     items:
 *                       type: array
 *                       description: Danh sách sản phẩm trong đơn hàng
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             example: "6875c16f0831baa9fe3af02c"
 *                           productCode:
 *                             type: string
 *                             example: "SP001"
 *                           productName:
 *                             type: string
 *                             example: "Test sản phẩm A"
 *                           shortName:
 *                             type: string
 *                             example: "test1"
 *                           quantity:
 *                             type: number
 *                             example: 20
 *                           quantityExported:
 *                             type: number
 *                             example: 0
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc thiếu orderId
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền thực hiện
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi server
 */
