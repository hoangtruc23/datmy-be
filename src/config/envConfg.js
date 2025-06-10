require('dotenv').config()

const envConfig = {
    BASE_URL: process.env.BASE_URL || '/inventory/api',
    PORT: process.env.PORT || 3000,
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 27017,
    DB_NAME: process.env.DB_NAME || 'inventory-dat-my-api',
    DB_USERNAME: process.env.DB_USERNAME || 'admin',
    DB_PASSWORD: process.env.DB_PASSWORD || 'Admin123!@#',
    JWT_ACCESS_TOKEN_PRIVATE_KEY:
        process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY ||
        'project-inventory-dat-my-api',
    JWT_ACCESS_TOKEN_EXPIRES: process.env.JWT_ACCESS_TOKEN_EXPIRES || '36000',
    // JWT_REFRESH_TOKEN_PRIVATE_KEY:
    //     process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY ||
    //     'project-inventory-dat-my-api-refresh',
    // JWT_REFRESH_TOKEN_EXPIRES:
    //     process.env.JWT_REFRESH_TOKEN_EXPIRES || '1286400',

    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    REDIS_USERNAME: process.env.REDIS_USERNAME || 'default',
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || 'siginx123',
}

module.exports = { envConfig }
