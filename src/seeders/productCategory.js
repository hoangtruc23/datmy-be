const { Types } = require('mongoose')

const { logger } = require('../config/loggerConfig') // Điều chỉnh đường dẫn file config của bạn nếu cần
const ProductCategoryModel = require('../models/productCategory')

async function productCategorySeeder() {
    try {
        await ProductCategoryModel.deleteMany({})
        await ProductCategoryModel.insertMany([
            {
                _id: new Types.ObjectId('689b2293324b9d06707dd58f'),
                name: 'MÁY IN PHUN BAO BÌ CÔNG NGHIỆP',
                image: 'https://example.com/images/may-in-phun-cong-nghiep.jpg',
                description: 'Máy in phun chất lượng cao phục vụ cho việc in ấn bao bì, mã vạch, ngày sản xuất trong dây chuyền công nghiệp hàng loạt.',
                productType: 'component', // component hoặc material
                isActive: true,
            }
        ])

        logger.info('Product categories seeded successfully')
    } catch (error) {
        logger.error('Error seeding product categories:', error)
    }
}

module.exports = productCategorySeeder