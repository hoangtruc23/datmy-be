require('../config/mongodbConfig')
const { Types } = require('mongoose')

async function run() {
    try {
        for (let i = 0; i < 100; i++) {
            console.log(new Types.ObjectId())
        }
    } catch (err) {
        process.exit(1)
    }
}

run()
