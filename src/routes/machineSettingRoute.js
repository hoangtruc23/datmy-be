const express = require('express')
const router = express.Router()

const validate = require('../middlewares/validation')
const machineSettingController = require('../controllers/machineSettingController')
const machineSettingValidation = require('../validations/machineSettingValidation')

router.get('/getMachine', machineSettingController.getMachine)
router.get('/getAllProperties', machineSettingController.getAllProperties)
router.get('/getDefaultValue/:propId', machineSettingController.getDefaultValue)
router.post(
    '/create',
    validate(machineSettingValidation.create),
    machineSettingController.create,
)
router.get('/getAll', machineSettingController.getAll)
router.get('/getById/:machineSettingId', machineSettingController.getById)
router.post(
    '/update/:machineSettingId',
    validate(machineSettingValidation.update),
    machineSettingController.update,
)
router.delete('/delete/:machineSettingId', machineSettingController.delete)

/**
 * @swagger
 * tags:
 *   name: MachineSetting
 *   description: Cấu hình thông số mặc định của máy in
 */

/**
 * @swagger
 * /machineSetting/getMachine:
 *   get:
 *     summary: Lấy toàn bộ dòng máy in theo search để làm dropdown
 *     security:
 *       - bearerAuth: []
 *     tags: [MachineSetting]
 *     parameters:
 *     - name: search
 *       in: query
 *       schema:
 *         type: string
 *       description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Trả về danh sách các dòng máy in theo search
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
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 684c4cd3d1becf7806470255
 *                           name:
 *                             type: string
 *                             example: Máy in phun bao bì công nghiệp hiệu DOMINO A100
 *                           code:
 *                             type: string
 *                             example: A100
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
 * /machineSetting/getAllProperties:
 *   get:
 *     summary: Lấy tất cả các thuộc tính hiện có
 *     security:
 *       - bearerAuth: []
 *     tags: [MachineSetting]
 *     responses:
 *       200:
 *         description: Trả về danh sách các thông số hiện tại
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 69081ac30879097d22c84abe
 *                       name:
 *                         type: string
 *                         example: Loại mực
 *                       type:
 *                         type: string
 *                         description: Loại thuộc tính (linked, custom hoặc normal)
 *                         example: linked
 *                       categoryLinkedName:
 *                         type: string
 *                         nullable: true
 *                         description: Tên danh mục liên kết nếu type là "linked"
 *                         example: NGUYÊN LIỆU - MỰC IN
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
 * /machineSetting/getDefaultValue/{propId}:
 *   get:
 *     summary: Lấy toàn bộ sản phẩm theo thuộc tính hiện tại để làm dropdown chọn giá trị ban đầu
 *     security:
 *       - bearerAuth: []
 *     tags: [MachineSetting]
 *     parameters:
 *     - name: search
 *       in: query
 *       schema:
 *         type: string
 *       description: Từ khóa tìm kiếm
 *     - in: path
 *       name: propId
 *       schema:
 *         type: string
 *       required: true
 *       description: ID của thuộc tính
 *     responses:
 *       200:
 *         description: Trả về danh sách 5 dòng máy in theo search
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
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 684c4cd3d1becf7806470255
 *                           name:
 *                             type: string
 *                             example: Mực in IC-298BK
 *                           code:
 *                             type: string
 *                             example: IC-298BK
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
 * /machineSetting/create:
 *   post:
 *     summary: Tạo kho mới
 *     security:
 *       - bearerAuth: []
 *     tags: [MachineSetting]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - machineId
 *               - props
 *             properties:
 *               machineId:
 *                 type: string
 *                 example: id của máy
 *               props:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - propId
 *                   properties:
 *                     propId:
 *                       type: string
 *                       example: id của thuộc tính
 *                     defaultValue:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: Nếu kiểu linked sẽ lưu id của các sản phẩm default, nếu là custom sẽ lưu các giá trị người dùng nhập vào
 *     responses:
 *       200:
 *         description: Tạo kho thành công
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
 * /machineSetting/getAll:
 *   get:
 *     summary: Lấy toàn bộ các cấu hình máy in
 *     security:
 *       - bearerAuth: []
 *     tags: [MachineSetting]
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
 *         description: Trả về danh sách các cấu hình máy in hiện có
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
 *                     result:
 *                       type: array
 *                       description: Danh sách cấu hình máy in
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 6909a9198652109a0666aa6c
 *                           machineId:
 *                             type: string
 *                             example: 689b2295324b9d06707ddf26
 *                           machineName:
 *                             type: string
 *                             example: Máy in phun bao bì công nghiệp hiệu DOMINO A100
 *                           machineCode:
 *                             type: string
 *                             example: A100
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalItems:
 *                       type: integer
 *                       example: 1
 *                     totalPage:
 *                       type: integer
 *                       example: 1
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
 * /machineSetting/getById/{machineSettingId}:
 *   get:
 *     summary: Lấy thông tin 1 cấu hình máy in chi tiết
 *     security:
 *       - bearerAuth: []
 *     tags: [MachineSetting]
 *     parameters:
 *       - in: path
 *         name: machineSettingId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của cấu hình cần lấy
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
 *                       example: 6909a9198652109a0666aa6c
 *                     machineId:
 *                       type: string
 *                       example: 689b2295324b9d06707ddf26
 *                     machineName:
 *                       type: string
 *                       example: Máy in phun bao bì công nghiệp hiệu DOMINO A100
 *                     machineCode:
 *                       type: string
 *                       example: A100
 *                     props:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 69081ac30879097d22c84abe
 *                           name:
 *                             type: string
 *                             example: Loại mực
 *                           type:
 *                             type: string
 *                             description: Loại thuộc tính (linked, custom, normal)
 *                             example: linked
 *                           isAvailable:
 *                             type: boolean
 *                             example: true
 *                           defaultValue:
 *                             oneOf:
 *                               - type: array
 *                                 description: Dành cho type = linked
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     _id:
 *                                       type: string
 *                                       example: 689b2295324b9d06707de142
 *                                     name:
 *                                       type: string
 *                                       example: Mực in D-200
 *                                     code:
 *                                       type: string
 *                                       example: D-200
 *                               - type: array
 *                                 description: Dành cho type = custom
 *                                 items:
 *                                   type: string
 *                                   example: 30mm
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
 * /machineSetting/update/{machineSettingId}:
 *   post:
 *     summary: Cập nhật cấu hình máy in
 *     security:
 *       - bearerAuth: []
 *     tags: [MachineSetting]
 *     parameters:
 *     - name: machineSettingId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Id của cấu hình
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - machineId
 *               - props
 *             properties:
 *               machineId:
 *                 type: string
 *                 example: id của máy
 *               props:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - propId
 *                   properties:
 *                     propId:
 *                       type: string
 *                       example: id của thuộc tính
 *                     defaultValue:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: Nếu kiểu linked sẽ lưu id của các sản phẩm default, nếu là custom sẽ lưu các giá trị người dùng nhập vào
 *     responses:
 *       200:
 *         description: Cập nhật cấu hình máy in thành công
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
 * /machineSetting/delete/{machineSettingId}:
 *   delete:
 *     summary: Xóa cấu hình máy in
 *     tags: [MachineSetting]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: machineSettingId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của cấu hình cần xóa
 *     responses:
 *       200:
 *         description: Xoá cấu hình thành công
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
 *                   example: Kho không tồn tại!
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
module.exports = router
