const express = require('express')
const router = express.Router()
const uploadController = require('../controllers/uploadController')
const { uploadImage, uploadFile } = require('../middlewares/upload')

router.post('/image', uploadImage.single('image'), uploadController.uploadImage)
router.post('/file', uploadFile.single('file'), uploadController.uploadFile)

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
 *                 type: string
 *                 format: binary
 *                 description:  file tài liệu cần upload
 *     responses:
 *       200:
 *         description: Upload thành công
 */
