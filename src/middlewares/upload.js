const multer = require('multer')
const path = require('path')
const fs = require('fs')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')

const imageFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new BadReq(errorCode.IMAGE_INCORECT_FORMAT), false)
    }
}

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../public/upload/image')

        cb(null, dir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + file.originalname
        cb(null, uniqueSuffix)
    },
})

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../public/upload/file')
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + file.originalname
        cb(null, uniqueSuffix)
    },
})

const uploadImage = multer({
    storage: imageStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFileFilter,
})

const uploadFile = multer({
    limits: { fileSize: 5 * 1024 * 1024 },
    storage: fileStorage,
})

module.exports = { uploadImage, uploadFile }
