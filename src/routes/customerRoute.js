// src/routes/partnerRoute.js

const express = require('express')
const validate = require('../middlewares/validation')
const partnerController = require('../controllers/customerController')
const partnerValidation = require('../validations/customerValidation')
const router = express.Router()

// The route for creating a new partner (customer or supplier)
router.post(
    '/create',
    validate(partnerValidation.create),
    partnerController.create,
)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Partner
 *   description: Partner (Customer/Supplier) Management
 */

/**
 * @swagger
 * /partner/create:
 *   post:
 *     summary: Create a new partner (customer or supplier)
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [customer, supplier]
 *                 description: The type of partner.
 *               name:
 *                 type: string
 *                 description: The short name of the partner.
 *               officialName:
 *                 type: string
 *                 description: The full legal name of the partner.
 *               taxCode:
 *                 type: string
 *                 description: The partner's tax identification number.
 *               billingAddress:
 *                 type: string
 *                 description: The official billing address.
 *             required:
 *               - type
 *               - name
 *               - officialName
 *               - taxCode
 *               - billingAddress
 *             example:
 *               type: "customer"
 *               name: "Công ty Test"
 *               officialName: "CÔNG TY TNHH TEST"
 *               taxCode: "0123456789"
 *               billingAddress: "123 Đường Test, Phường Test, Quận Test, TP. Test"
 *     responses:
 *       201:
 *         description: Created - The partner was created successfully.
 *       400:
 *         description: Bad Request - The input data was invalid.
 *       401:
 *         description: Unauthorized - No authentication token provided.
 *       403:
 *         description: Forbidden - The user does not have permission to create a partner.
 */