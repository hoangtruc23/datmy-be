const swaggerJSDoc = require('swagger-jsdoc')
const { envConfig } = require('../config/envConfg')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Example API',
            version: '1.0.0',
            description: 'API documentation for your app',
        },
        servers: [
            {
                url: `http://localhost:${envConfig.PORT}${envConfig.BASE_URL}`,
            },
        ],
    },
    apis: ['src/docs/*.js', 'src/routes/*.js'],
}

const swaggerSpec = swaggerJSDoc(options)
module.exports = swaggerSpec
