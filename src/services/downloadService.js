const path = require('path')
const fs = require('fs')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')

const downloadService = {
    downloadFile: async (invoiceFile, res) => {
        if (!invoiceFile) {
            throw new BadReq(errorCode.FILE_NOT_FOUND)
        }
        const fileUrlPath = new URL(invoiceFile).pathname
        const relativeFilePath = fileUrlPath
            .replace(process.env.BASE_URL, '')
            .replace(/^\/+/, '')
        const absolutePath = path.resolve(
            __dirname,
            '../public',
            relativeFilePath,
        )
        if (!fs.existsSync(absolutePath)) {
            throw new BadReq(errorCode.FILE_NOT_FOUND)
        }

        return new Promise((resolve, reject) => {
            res.download(absolutePath, (err) => {
                if (err) {
                    reject(new BadReq(errorCode.FILE_DOWNLOAD_FAILED))
                } else {
                    resolve()
                }
            })
        })
    },
}

module.exports = downloadService
