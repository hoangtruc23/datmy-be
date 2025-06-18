const express = require('express')
const router = express.Router()
const uploadController = require('../controllers/uploadController')
const { uploadImage, uploadFile } = require('../middlewares/upload')

//chưa tạo quyền, đang cmt

router.post('/image', uploadImage.single('image'), uploadController.uploadImage)
router.post('/file', uploadFile.array('file', 12), uploadController.uploadFile)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Upload file
 */

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload hình ảnh
 *     security:
 *       - bearerAuth: []
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh cần upload
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Upload image successfully
 *               data:
 *                 filename: "1718638291234-avatar.png"
 *                 url: "http://localhost:3000/public/upload/image/1718638291234-avatar.png"
 */

/**
 * @swagger
 * /upload/file:
 *   post:
 *     summary: Upload nhiều file tài liệu
 *     security:
 *       - bearerAuth: []
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Danh sách file tài liệu cần upload
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Upload file successfully
 *               data:
 *                 - filename: "1718638291234-doc.pdf"
 *                   url: "http://localhost:3000/public/upload/file/1718638291234-doc.pdf"
 *                 - filename: "1718638295678-doc2.pdf"
 *                   url: "http://localhost:3000/public/upload/file/1718638295678-doc2.pdf"
 */
