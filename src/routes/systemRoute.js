const express = require('express')
const router = express.Router()

const systemController = require('../controllers/systemController')

router.get('/getAllApi', systemController.getAllApi)
router.get('/getAllPermission', systemController.getAllPermission)
router.get('/getAllPermissionApi', systemController.getAllPermissionApi)
router.get(
    '/getPermissionApiById/:permissionId',
    systemController.getPermissionApiById,
)
router.post(
    '/updatePermissionApiById/:permissionId',
    systemController.updatePermissionApi,
)
router.get('/getAllRole', systemController.getAllRole)
router.get('/getRoleById/:roleId', systemController.getRoleById)
router.post('/updateRoleById/:roleId', systemController.updateRoleById)
router.post('/createRole', systemController.createRole)
router.post('/createPermission', systemController.createPermission)
router.get('/getAllParentPermission', systemController.getAllParentPermission)
router.delete('/delete/:roleId', systemController.delete)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: System
 *   description: System
 */

/**
 * @swagger
 * /system/getAllApi:
 *   get:
 *     summary: Lấy danh sách các api
 *     security:
 *       - bearerAuth: []
 *     tags: [System]
 *     parameters:
 *     - name: search
 *       in: query
 *       schema:
 *         type: string
 *       description: Từ khóa tìm kiếm
 *     - name: page
 *       in: query
 *       schema:
 *         type: integer
 *       description: Page muốn lấy
 *     - name: limit
 *       in: query
 *       schema:
 *         type: integer
 *       description: Giới hạn số phần tử trong 1 page
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
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
 *                   example: OK!
 *                 data:
 *                   type: object
 *                   properties:
 *                     apis:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 684686f736b60123f03418dd
 *                           api:
 *                             type: string
 *                             example: system/getAllApi
 *                           note:
 *                             type: string
 *                             example: Lấy ra tất cả Api
 *                     page:
 *                       type: number
 *                       example: 1
 *                     totalItem:
 *                       type: number
 *                       example: 10
 *                     totalPage:
 *                       example: 1
 *                       type: number
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /system/getAllPermission:
 *   get:
 *     summary: Lấy danh sách permission
 *     security:
 *       - bearerAuth: []
 *     tags: [System]
 *     parameters:
 *     - name: search
 *       in: query
 *       schema:
 *         type: string
 *       description: Từ khóa tìm kiếm
 *     - name: page
 *       in: query
 *       schema:
 *         type: integer
 *       description: Page muốn lấy
 *     - name: limit
 *       in: query
 *       schema:
 *         type: integer
 *       description: Giới hạn số phần tử trong 1 page
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
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
 *                   example: OK!
 *                 data:
 *                   type: object
 *                   properties:
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 684686f736b60123f03418dd
 *                           name:
 *                             type: string
 *                             example: xem
 *                           code:
 *                             type: string
 *                             example: xem
 *                           children:
 *                             type: array
 *                             example: []
 *                     page:
 *                       type: number
 *                       example: 1
 *                     totalItem:
 *                       type: number
 *                       example: 10
 *                     totalPage:
 *                       example: 1
 *                       type: number
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /system/getAllPermissionApi:
 *   get:
 *     summary: Lấy danh sách permissionApi
 *     security:
 *       - bearerAuth: []
 *     tags: [System]
 *     parameters:
 *     - name: page
 *       in: query
 *       schema:
 *         type: integer
 *       description: Page muốn lấy
 *     - name: limit
 *       in: query
 *       schema:
 *         type: integer
 *       description: Giới hạn số phần tử trong 1 page
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
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
 *                   example: OK!
 *                 data:
 *                   type: object
 *                   properties:
 *                     groupPermissionApis:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           apiIds:
 *                             type: array
 *                             example: []
 *                           permissionId:
 *                             type: string
 *                             example: 684686f736b60123f03418dd
 *                     page:
 *                       type: number
 *                       example: 1
 *                     totalItem:
 *                       type: number
 *                       example: 10
 *                     totalPage:
 *                       example: 1
 *                       type: number
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /system/getPermissionApiById/{permissionId}:
 *   get:
 *     summary: Lấy thông tin 1 PermissionApi theo permissionId
 *     security:
 *       - bearerAuth: []
 *     tags: [System]
 *     parameters:
 *       - in: path
 *         name: permissionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của permission
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
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
 *                   example: OK!
 *                 data:
 *                   type: object
 *                   properties:
 *                     apiIds:
 *                        type: array
 *                        example: []
 *                     permissionId:
 *                        type: string
 *                        example: 684686f736b60123f03418dd
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */
/**
 * @swagger
 * /system/updatePermissionApiById/{permissionId}:
 *   post:
 *     summary: Cập nhật thông tin permission (name, code, parentPermissionId) và gán lại danh sách API
 *     security:
 *       - bearerAuth: []
 *     tags: [System]
 *     parameters:
 *       - name: permissionId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của permission cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Quản lý người dùng"
 *                 description: Tên mới của permission
 *               code:
 *                 type: string
 *                 example: "USER_MANAGE"
 *                 description: Mã code duy nhất cho permission
 *               parentId:
 *                 type: string
 *                 nullable: true
 *                 example: "6854e30d6b90439ad8c00db7"
 *                 description: ID của permission cha (null nếu không có)
 *               apiIds:
 *                 type: array
 *                 description: Danh sách ID các API được gán cho permission
 *                 items:
 *                   type: string
 *                 example: ["6854e30d6b90439ad8c00db7","6854e30d6b90439ad8c00db8"]
 *             example:
 *               name: "Quản lý người dùng"
 *               code: "USER_MANAGE"
 *               parentId: "6854e30d6b90439ad8c00db7"
 *               apiIds: ["6854e30d6b90439ad8c00db7","6854e30d6b90439ad8c00db8"]
 *     responses:
 *       200:
 *         description: Cập nhật permission thành công
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
 *                   example: "Cập nhật Permission thành công!"
 *                 data:
 *                   type: object
 *                   example: null
 *       400:
 *         description: "Lỗi input (ví dụ: code bị trùng, parentId không hợp lệ, API không tồn tại)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: "Mã permission đã tồn tại!"
 *                 data:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Chưa đăng nhập hoặc thiếu token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: "Không có token"
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập API này
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: "Không có quyền"
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: "Lỗi server!"
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /system/getAllRole:
 *   get:
 *     summary: Lấy danh sách các role
 *     security:
 *       - bearerAuth: []
 *     tags: [System]
 *     parameters:
 *     - name: search
 *       in: query
 *       schema:
 *         type: string
 *       description: Từ khóa tìm kiếm
 *     - name: page
 *       in: query
 *       schema:
 *         type: integer
 *       description: Page muốn lấy
 *     - name: limit
 *       in: query
 *       schema:
 *         type: integer
 *       description: Giới hạn số phần tử trong 1 page
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
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
 *                   example: OK!
 *                 data:
 *                   type: object
 *                   properties:
 *                     apis:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 684686f736b60123f03418dd
 *                           name:
 *                             type: string
 *                             example: BGĐ
 *                           note:
 *                             type: string
 *                             example: Ban giám đốc
 *                     page:
 *                       type: number
 *                       example: 1
 *                     totalItem:
 *                       type: number
 *                       example: 10
 *                     totalPage:
 *                       example: 1
 *                       type: number
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /system/getRoleById/{roleId}:
 *   get:
 *     summary: Lấy thông tin 1 Role theo roleId
 *     security:
 *       - bearerAuth: []
 *     tags: [System]
 *     parameters:
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của role
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
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
 *                   example: OK!
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 684686f736b60123f03418dd
 *                     name:
 *                       type: string
 *                       example: Nhân viên kho
 *                     note:
 *                       type: string
 *                       example: Nhân viên kho
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 684686f736b60123f03418dd
 *                           name:
 *                             type: string
 *                             example: Khách hàng
 *                           code:
 *                             type: string
 *                             example: Khach-hang
 *                           children:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example: 684686f736b60123f03418dd
 *                                 name:
 *                                   type: string
 *                                   example: Thêm
 *                                 code:
 *                                   type: string
 *                                   example: Khach_hang-them
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */
/**
 * @swagger
 * /system/updateRoleById/{roleId}:
 *   post:
 *     summary: Cập nhật permission cho role
 *     security:
 *       - bearerAuth: []
 *     tags: [System]
 *     parameters:
 *       - name: roleId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Id của role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - parentPermissionIds
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Quản trị viên"
 *                 description: Tên mới của role
 *               note:
 *                 type: string
 *                 example: "Role có toàn quyền hệ thống"
 *                 description: Ghi chú cho role
 *               parentPermissionIds:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6854e30d6b90439ad8c00db7
 *                     childrenPermissionIds:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: 6854e30d6b90439ad8c00db7
 *     responses:
 *       200:
 *         description: Cập nhật Permission thành công
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
 *                   example: OK!
 *                 data:
 *                   type: object
 *                   example: null
 *       400:
 *         description: Lỗi input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Tên kho là bắt buộc!
 *                 data:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /system/createRole:
 *   post:
 *     summary: Tạo mới role và gán permission
 *     security:
 *       - bearerAuth: []
 *     tags: [System]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - parentPermissionIds
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Quản trị viên"
 *                 description: Tên của role
 *               note:
 *                 type: string
 *                 example: "Role có toàn quyền hệ thống"
 *                 description: Ghi chú cho role
 *               parentPermissionIds:
 *                 type: array
 *                 description: Danh sách permission cha và các permission con
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6854e30d6b90439ad8c00db7
 *                       description: Id của permission cha
 *                     childrenPermissionIds:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: 6854e30d6b90439ad8c00db7
 *                         description: Id của các permission con
 *     responses:
 *       201:
 *         description: Tạo Role thành công
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
 *                   example: "Tạo Role thành công!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6854e30d6b90439ad8c00db7
 *                     name:
 *                       type: string
 *                       example: "Quản trị viên"
 *                     note:
 *                       type: string
 *                       example: "Role có toàn quyền hệ thống"
 *       400:
 *         description: Lỗi input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: "Tên role là bắt buộc!"
 *                 data:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: "Không có token"
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: "Không có quyền"
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: "Lỗi server!"
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /system/createPermission:
 *   post:
 *     summary: Tạo mới permission (có thể là permission cha hoặc permission con)
 *     description: |
 *       - Nếu **không truyền** `parentPermissionId` thì sẽ tạo **permission cha** (không được gửi `apiIds`).
 *       - Nếu **truyền** `parentPermissionId` thì sẽ tạo **permission con**, có thể gắn danh sách `apiIds`.
 *     security:
 *       - bearerAuth: []
 *     tags: [System]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Quản lý nhân viên"
 *                 description: Tên permission
 *               code:
 *                 type: string
 *                 example: "nhan_vien-xem"
 *                 description: Mã code duy nhất của permission
 *               parentPermissionId:
 *                 type: string
 *                 nullable: true
 *                 example: "684927c871287f2ae7d812fd"
 *                 description: Id của permission cha (bỏ trống để tạo permission cha mới)
 *               apiIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["6854e30d6b90439ad8c00db7","6854e30d6b90439ad8c00db8"]
 *                 description: Danh sách Id của các API (chỉ gửi khi tạo permission con)
 *     responses:
 *       201:
 *         description: Tạo permission thành công
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
 *                   example: "Tạo permission thành công!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "684927c871287f2ae7d812fd"
 *                     name:
 *                       type: string
 *                       example: "Quản lý nhân viên"
 *                     code:
 *                       type: string
 *                       example: "nhan_vien:read"
 *                     parentPermissionId:
 *                       type: string
 *                       example: null
 *       400:
 *         description: "Lỗi input (ví dụ: code trùng, parent không tồn tại, hoặc permission cha gửi kèm apiIds)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: "Mã code đã tồn tại!"
 *                 data:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: "Không có token"
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: "Không có quyền"
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: "Lỗi server!"
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /system/getAllParentPermission:
 *   get:
 *     summary: Lấy danh sách Permission cha
 *     description: API trả về danh sách tất cả Permission cấp cha (không có parentPermissionId).
 *     security:
 *       - bearerAuth: []
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Lấy danh sách Permission cha thành công
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
 *                   example: "Lấy danh sách Permission cha thành công!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 684927c871287f2ae7d812fd
 *                             description: Id của permission cha
 *                           name:
 *                             type: string
 *                             example: "Nhân viên"
 *                             description: Tên permission cha
 *                           code:
 *                             type: string
 *                             example: "nhan_vien"
 *                             description: Mã code của permission cha
 *       401:
 *         description: Chưa đăng nhập (Không có token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: "Không có token"
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: "Không có quyền"
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: "Lỗi server!"
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /system/delete/{roleId}:
 *   delete:
 *     summary: Xóa role
 *     tags: [System]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của role cần xóa
 *     responses:
 *       200:
 *         description: Xoá role thành công
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
 *                   example: OK!
 *                 data:
 *                   type: object
 *                   example: null
 *       400:
 *         description: Lỗi input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Role không tồn tại!
 *                 data:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có token
 *                 data:
 *                   type: string
 *                   example: null
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Không có quyền
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 *                 data:
 *                   type: string
 *                   example: null
 */
