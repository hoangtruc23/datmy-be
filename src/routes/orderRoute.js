const express = require('express')

const router = express.Router()
const orderController = require('../controllers/orderController')

router.post('/create', orderController.create)
router.post('/update/:orderId', orderController.update)
router.post('/getById', orderController.getById)
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
 * /order/getById:
 *   post:
 *     summary: Lấy thông tin chi tiết của một hoặc nhiều đơn hàng (gộp sản phẩm trùng nhau)
 *     description: API này cho phép truyền vào một hoặc nhiều ID đơn hàng. Nếu các đơn hàng thuộc cùng một khách hàng, kết quả sẽ gộp sản phẩm trùng nhau và tính tổng số lượng còn lại (quantity - quantityExported).
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
 *                 description: Danh sách ID đơn hàng cần lấy
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
 *                     name:
 *                       type: string
 *                     officialName:
 *                       type: string
 *                     code:
 *                       type: string
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
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           code:
 *                             type: string
 *                           shortName:
 *                             type: string
 *                       totalQuantity:
 *                         type: number
 *                         description: Tổng số lượng đặt (quantity - quantityExported)
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
