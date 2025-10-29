const express = require('express')

const router = express.Router()

const productTransferHistoryController = require('../controllers/productTranferHistoryController')

router.get('/getAll', productTransferHistoryController.getAll)

router.post(
    '/transferProduct',
    productTransferHistoryController.transferProduct,
)
router.get('/getById/:id', productTransferHistoryController.getById)
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
 *                 example: "Chuyển nhiều lô theo nhóm sản phẩm"
 *                 description: Ghi chú chuyển kho
 *               details:
 *                 type: array
 *                 description: Danh sách sản phẩm chuyển
 *                 items:
 *                   type: object
 *                   required:
 *                     - oldProductId
 *                     - oldStorages
 *                     - newProductId
 *                     - newStorages
 *                   properties:
 *                     oldProductId:
 *                       type: string
 *                       example: "6875c1a10831baa9fe3af047"
 *                       description: ID sản phẩm cũ (kho nguồn)
 *                     oldStorages:
 *                       type: array
 *                       description: Danh sách lô cũ cần trừ
 *                       items:
 *                         type: object
 *                         properties:
 *                           trackingCode:
 *                             type: string
 *                             example: "B1"
 *                           quantity:
 *                             type: number
 *                             example: 1
 *                     newProductId:
 *                       type: string
 *                       example: "6875c16f0831baa9fe3af02c"
 *                       description: ID sản phẩm mới (kho đích)
 *                     newStorages:
 *                       type: array
 *                       description: Danh sách lô mới được cộng
 *                       items:
 *                         type: object
 *                         properties:
 *                           trackingCode:
 *                             type: string
 *                             example: "E2"
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
 *                   example: "Chuyển thành công"
 *                 data:
 *                   type: boolean
 *                   example: true
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
 *                             example: "68e8cc57f83c9f984dfce390"
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
 *                             example: "Chuyển nhiều lô theo nhóm sản phẩm"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-10-10T09:05:27.606Z"
 *                           details:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example: "68e8cc57f83c9f984dfce39c"
 *                                 transferId:
 *                                   type: string
 *                                   example: "68e8cc57f83c9f984dfce390"
 *                                 oldProductId:
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
 *                                 oldStorages:
 *                                   type: array
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       trackingCode:
 *                                         type: string
 *                                         example: "B1"
 *                                       quantity:
 *                                         type: number
 *                                         example: 1
 *                                 newProductId:
 *                                   type: object
 *                                   properties:
 *                                     _id:
 *                                       type: string
 *                                       example: "6875c16f0831baa9fe3af02c"
 *                                     name:
 *                                       type: string
 *                                       example: "test1"
 *                                     code:
 *                                       type: string
 *                                       example: "1"
 *                                 newStorages:
 *                                   type: array
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       trackingCode:
 *                                         type: string
 *                                         example: "E2"
 *                                       quantity:
 *                                         type: number
 *                                         example: 1
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
/**
 * @swagger
 * /productTransferHistory/getById/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết phiếu chuyển kho theo ID
 *     security:
 *       - bearerAuth: []
 *     tags: [ProductTransfer]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phiếu chuyển kho
 *     responses:
 *       200:
 *         description: Lấy chi tiết phiếu chuyển kho thành công
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
 *                     _id:
 *                       type: string
 *                     fromWarehouseId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     toWarehouseId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     note:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           transferId:
 *                             type: string
 *                           oldProductId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               code:
 *                                 type: string
 *                               unit:
 *                                 type: string
 *                           oldStorages:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 trackingCode:
 *                                   type: string
 *                                 quantity:
 *                                   type: number
 *                           newProductId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               code:
 *                                 type: string
 *                               unit:
 *                                 type: string
 *                           newStorages:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 trackingCode:
 *                                   type: string
 *                                 quantity:
 *                                   type: number
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc phiếu chuyển kho không tồn tại
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
