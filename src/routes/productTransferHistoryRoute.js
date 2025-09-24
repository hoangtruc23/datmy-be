const express = require('express')

const router = express.Router()

const productTransferHistoryController = require('../controllers/productTranferHistoryController')

router.get('/getAll', productTransferHistoryController.getAll)

router.post(
    '/transferProduct',
    productTransferHistoryController.transferProduct,
)

module.exports = router

/**
 * @swagger
 * /productTransferHistory/transferProduct:
 *   post:
 *     summary: Thực hiện chuyển kho sản phẩm
 *     security:
 *       - bearerAuth: []
 *     tags: [ProductTransfer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromWarehouseId
 *               - toWarehouseId
 *               - details
 *             properties:
 *               fromWarehouseId:
 *                 type: string
 *                 example: "6875c2870831baa9fe3af0b2"
 *                 description: ID kho nguồn
 *               toWarehouseId:
 *                 type: string
 *                 example: "689e9b4d37e48fe8ab1129ca"
 *                 description: ID kho đích
 *               note:
 *                 type: string
 *                 example: "Chuyển kho test"
 *                 description: Ghi chú chuyển kho
 *               details:
 *                 type: array
 *                 description: Danh sách sản phẩm chuyển
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                     - oldStorages
 *                     - newStorages
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "6875c1a10831baa9fe3af047"
 *                     quantity:
 *                       type: number
 *                       example: 1
 *                     oldStorages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           trackingCode:
 *                             type: string
 *                             example: "A100"
 *                           quantity:
 *                             type: number
 *                             example: 1
 *                     newStorages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           trackingCode:
 *                             type: string
 *                             example: "TestA1"
 *                           quantity:
 *                             type: number
 *                             example: 1
 *     responses:
 *       200:
 *         description: Chuyển kho thành công
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
 *                   example: "Chuyển kho thành công"
 *                 data:
 *                   type: object
 *                   description: Thông tin phiếu chuyển kho vừa tạo
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "68c3b8f862734617db69a287"
 *                     fromWarehouseId:
 *                       type: string
 *                       example: "6875c2870831baa9fe3af0b2"
 *                     toWarehouseId:
 *                       type: string
 *                       example: "689e9b4d37e48fe8ab1129ca"
 *                     note:
 *                       type: string
 *                       example: "Chuyển kho test"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-09-12T02:45:30.123Z"
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             example: "6875c1a10831baa9fe3af047"
 *                           quantity:
 *                             type: number
 *                             example: 1
 *                           oldStorages:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 trackingCode:
 *                                   type: string
 *                                   example: "A100"
 *                                 quantity:
 *                                   type: number
 *                                   example: 1
 *                           newStorages:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 trackingCode:
 *                                   type: string
 *                                   example: "TestA1"
 *                                 quantity:
 *                                   type: number
 *                                   example: 1
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc kho/sản phẩm không tồn tại
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền thực hiện
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /productTransferHistory/getAll:
 *   get:
 *     summary: Lấy danh sách phiếu chuyển kho
 *     security:
 *       - bearerAuth: []
 *     tags: [ProductTransfer]
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Trang muốn lấy
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng phiếu trên 1 trang
 *     responses:
 *       200:
 *         description: Lấy danh sách phiếu chuyển kho thành công
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
 *                   example: "OK!"
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
 *                             example: "68c3a8afe6d3212ab1e8aec0"
 *                           fromWarehouseId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: "6875c2870831baa9fe3af0b2"
 *                               name:
 *                                 type: string
 *                                 example: "Kho test"
 *                           toWarehouseId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: "689e9b4d37e48fe8ab1129ca"
 *                               name:
 *                                 type: string
 *                                 example: "Kho Tân Bình"
 *                           note:
 *                             type: string
 *                             example: "Chuyển kho test"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-09-12T04:59:27.099Z"
 *                           details:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example: "68c3a8afe6d3212ab1e8aec7"
 *                                 transferId:
 *                                   type: string
 *                                   example: "68c3a8afe6d3212ab1e8aec0"
 *                                 productId:
 *                                   type: object
 *                                   properties:
 *                                     _id:
 *                                       type: string
 *                                       example: "6875c1a10831baa9fe3af047"
 *                                     name:
 *                                       type: string
 *                                       example: "test2"
 *                                     code:
 *                                       type: string
 *                                       example: "2"
 *                                     unit:
 *                                       type: string
 *                                       example: "6858ba9390e28f169336d106"
 *                                 quantity:
 *                                   type: number
 *                                   example: 1
 *                                 oldStorages:
 *                                   type: array
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       trackingCode:
 *                                         type: string
 *                                         example: "A100"
 *                                       quantity:
 *                                         type: number
 *                                         example: 1
 *                                       _id:
 *                                         type: string
 *                                         example: "68c3a8afe6d3212ab1e8aec8"
 *                                 newStorages:
 *                                   type: array
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       trackingCode:
 *                                         type: string
 *                                         example: "TestA1"
 *                                       quantity:
 *                                         type: number
 *                                         example: 1
 *                                       _id:
 *                                         type: string
 *                                         example: "68c3a8afe6d3212ab1e8aec9"
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalItem:
 *                       type: integer
 *                       example: 1
 *                     totalPage:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
