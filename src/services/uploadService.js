const path = require('path');

const uploadService = {
    uploadImage: async (file, req) => {
        if (!file) {
            throw new Error('No image uploaded');
        }
        const fileUrl = `${req.protocol}://${req.get('host')}/public/upload/image/${file.filename}`;
        return { filename: file.filename, url: fileUrl };
    },

    uploadFile: async (files, req) => {
        if (!files || files.length === 0) {
            throw new Error('No files uploaded');
        }

        const fileUrls = files.map(file => {
            const fileUrl = `${req.protocol}://${req.get('host')}/public/upload/file/${file.filename}`;
            return { filename: file.filename, url: fileUrl };
        });

        return fileUrls;
    },

};

module.exports = uploadService;
