const { Types } = require('mongoose');
const GoodsIssueModel = require('../models/goodsIssue');
const constant = require('../utils/constant/constant');

const salesReportService = {
    getSalesReport: async (filters) => {
        let { startDate, endDate, productId, page, limit } = filters;

        page = Number(page) || 1;
        limit = Number(limit) || 10;

        const matchStatuses = [
            constant.GOODS_ISSUE_STATUS.WAREHOUSE_STAFF_APPROVAL,
            constant.GOODS_ISSUE_STATUS.WAREHOUSE_ACCOUNTANT_APPROVAL,
            constant.GOODS_ISSUE_STATUS.DEBT_ACCOUNTANT_APPROVAL,
            constant.GOODS_ISSUE_STATUS.BILL_ACCOUNTANT_APPROVAL,
            constant.GOODS_ISSUE_STATUS.APPROVED,
        ];

        const matchQuery = {
            'createdAt': { // The match is on the GoodsIssue document itself
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
            'status': { $in: matchStatuses },
        };
        
        const detailsMatchQuery = {};
        if (productId) {
            detailsMatchQuery['details.productId'] = new Types.ObjectId(String(productId));
        }

        const facetPipeline = {
            details: [
                { $unwind: '$details' },
                { $match: detailsMatchQuery },
                {
                    $group: {
                        _id: '$details.productId',
                        productName: { $first: '$details.productName' },
                        productCode: { $first: '$details.productCode' },
                        unit: { $first: '$details.unit' },
                        totalQuantitySold: { $sum: '$details.issuedQuantity' },
                        totalRevenue: { $sum: '$details.totalAmount' },
                        lastSaleDate: { $max: '$createdAt' },
                    },
                },
                {
                    $lookup: {
                        from: 'units',
                        localField: 'unit',
                        foreignField: '_id',
                        as: 'unitInfo'
                    }
                },
                {
                    $project: {
                        _id: 0,
                        productId: '$_id',
                        productCode: '$productCode',
                        productName: '$productName',
                        unit: { $ifNull: [ { $arrayElemAt: ['$unitInfo.name', 0] }, '$unit' ] },
                        quantitySold: '$totalQuantitySold',
                        revenue: '$totalRevenue',
                        averagePrice: {
                            $cond: { if: { $eq: ['$totalQuantitySold', 0] }, then: 0, else: { $divide: ['$totalRevenue', '$totalQuantitySold'] } }
                        },
                        lastSale: '$lastSaleDate',
                    },
                },
                { $sort: { productCode: 1 } },
                { $skip: (page - 1) * limit },
                { $limit: limit },
            ],
            summary: [
                { $unwind: '$details' },
                { $match: detailsMatchQuery },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$details.totalAmount' },
                        totalQuantity: { $sum: '$details.issuedQuantity' },
                        uniqueProducts: { $addToSet: '$details.productId' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        totalProducts: { $size: '$uniqueProducts' },
                        totalQuantity: '$totalQuantity',
                        totalRevenue: '$totalRevenue',
                    },
                },
            ],
            totalCount: [
                { $unwind: '$details' },
                { $match: detailsMatchQuery },
                { $group: { _id: '$details.productId' } },
                { $count: 'count' }
            ]
        };

        const results = await GoodsIssueModel.aggregate([
            { $match: { isTemporary: false, ...matchQuery } },
            {
                $lookup: {
                    from: 'goodsissuedetails',
                    localField: '_id',
                    foreignField: 'goodsIssueId',
                    as: 'details',
                },
            },
            { $facet: facetPipeline },
        ]);

        const details = results[0].details;
        const summary = results[0].summary[0] || { totalProducts: 0, totalQuantity: 0, totalRevenue: 0 };
        const totalItems = results[0].totalCount[0] ? results[0].totalCount[0].count : 0;
        
        return {
            summary,
            details,
            pagination: {
                page: page,
                limit: limit,
                totalItems: totalItems,
                totalPages: Math.ceil(totalItems / limit),
            }
        };
    }
};

module.exports = salesReportService