const multer = require('multer')
const path = require('path')
const fs = require('fs')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')
const memoryStorage = multer.memoryStorage()
const removeVietnameseTones = (str) => {
    if (!str) return ''
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9\-\.]/g, '')
        .toLowerCase()
}

const imageFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new BadReq(errorCode.IMAGE_INCORECT_FORMAT), false)
    }
}

const fileFileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
    ]

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new BadReq(errorCode.FILE_INCORECT_FORMAT), false)
    }
}

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../public/upload/image')

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }

        cb(null, dir)
    },
    filename: (req, file, cb) => {
        const filenameUTF8 = Buffer.from(file.originalname, 'latin1').toString(
            'utf8',
        )
        const cleanName = removeVietnameseTones(filenameUTF8)
        cb(null, `${Date.now()}-${cleanName}`)
    },
})

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../public/upload/file')
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        const filenameUTF8 = Buffer.from(file.originalname, 'latin1').toString(
            'utf8',
        )
        const cleanName = removeVietnameseTones(filenameUTF8)
        cb(null, `${Date.now()}-${cleanName}`)
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
    fileFilter: fileFileFilter,
})

const uploadMemoryFile = multer({
    storage: memoryStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFileFilter,
})

module.exports = { uploadImage, uploadFile, uploadMemoryFile }
