require('../config/mongodbConfig')

const { logger } = require('../config/loggerConfig')
const apiSeeder = require('./api')
const permissionApiSeeder = require('./permissionApi')
const permissionSeeder = require('./permission')
const rolePermissionSeeder = require('./rolePermission')
const roleSeeder = require('./role')
const userSeeder = require('./user')
const unitSeeder = require('./unit')
const args = process.argv.slice(2)
async function run() {
    try {
        switch (args[0]) {
            case 'api': {
                await apiSeeder()
                break
            }
            case 'permission': {
                await permissionSeeder()
                break
            }
            case 'permissionApi': {
                await permissionApiSeeder()
                break
            }
            case 'role': {
                await roleSeeder()
                break
            }
            case 'rolePermission': {
                await rolePermissionSeeder()
                break
            }
            case 'user': {
                await userSeeder()
                break
            }
            case 'unit': {
                await unitSeeder()
                break
            }
            case 'all': {
                await apiSeeder()
                await permissionSeeder()
                await permissionApiSeeder()
                await roleSeeder()
                await rolePermissionSeeder()
                await userSeeder()
                await unitSeeder()
                break
            }
            default:
                logger.info('Not match')
        }
        logger.info('Seeding completed')
    } catch (error) {
        logger.error('Seeding failed:', error)
    } finally {
        process.exit(1)
    }
}

run()
