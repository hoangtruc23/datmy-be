const uploadService = require('../services/uploadService');
const response = require('../utils/response/response');

const uploadController = {
    uploadImage: async (req, res, next) => {
        try {
            const result = await uploadService.uploadImage(req.file, req);
            return res.status(200).json(response.success(result, 'Upload image successfully'));
        } catch (error) {
            next(error);
        }
    },

    uploadFile: async (req, res, next) => {
        try {
            const result = await uploadService.uploadFile(req.files, req);
            return res.status(200).json(response.success(result, 'Upload file successfully'));
        } catch (error) {
            next(error);
        }
    },

};

module.exports = uploadController;
