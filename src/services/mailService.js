const nodemailer = require('nodemailer')
const MailServerModel = require('../models/mailServer')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')

const mailService = {
    configMailServer: async (reqData) => {
        try {
            const { host, port, secure, username, password } = reqData
            const transporter = nodemailer.createTransport({
                host: host,
                port: port,
                secure: secure,
                auth: {
                    user: username,
                    pass: password,
                },
            })

            try {
                await transporter.verify()
            } catch (error) {
                throw new BadReq(errorCode.MAIL_SERVER_INVALID)
            }

            await MailServerModel.findOneAndUpdate(
                {},
                { host, port, secure, user: username, pass: password },
                { upsert: true },
            )
            return null
        } catch (error) {
            throw error
        }
    },

    configMailReceiver: async (reqData) => {
        try {
            const { receivers } = reqData
            await MailServerModel.findOneAndUpdate(
                {},
                { receivers },
                { upsert: true },
            )
            return null
        } catch (error) {
            throw error
        }
    },

    sendMail: async (reqData) => {
        try {
            const { subject, html } = reqData
            const mailServer = await MailServerModel.findOne({})
            if (!mailServer) {
                throw new BadReq(errorCode.MAIL_SERVER_NOT_DEFINED)
            }

            const transporter = nodemailer.createTransport({
                host: mailServer.host,
                port: mailServer.port,
                secure: mailServer.secure,
                auth: {
                    user: mailServer.user,
                    pass: mailServer.pass,
                },
            })

            for (const receiver of mailServer.receivers) {
                const email = {
                    from: mailServer.user,
                    to: receiver,
                    subject,
                    html,
                }
                try {
                    await transporter.sendMail(email)
                } catch (error) {
                    throw new BadReq(errorCode.SEND_EMAIL_FAILED)
                }
            }

            return null
        } catch (error) {
            throw error
        }
    },
}

module.exports = mailService
