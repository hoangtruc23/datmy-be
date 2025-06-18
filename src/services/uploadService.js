const path = require('path')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')

const uploadService = {
    uploadImage: async (file, req) => {
        if (!file) {
            throw new BadReq(errorCode.FILE_NOT_UPLOADED)
        }
        const fileUrl = `${req.protocol}://${req.get('host')}/public/upload/image/${file.filename}`
        return { filename: file.filename, url: fileUrl }
    },

    uploadFile: async (files, req) => {
        if (!files || files.length === 0) {
            throw new BadReq(errorCode.FILE_NOT_UPLOADED)
        }

        const fileUrls = files.map((file) => {
            const fileUrl = `${req.protocol}://${req.get('host')}/public/upload/file/${file.filename}`
            return { filename: file.filename, url: fileUrl }
        })

        return fileUrls
    },
}

module.exports = uploadService
