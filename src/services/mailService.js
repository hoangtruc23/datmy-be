const nodemailer = require('nodemailer')
const MailServerModel = require('../models/mailServer')
const UserModel = require('../models/user')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')
const { logger } = require('../config/loggerConfig')

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
            const { receiverIds } = reqData
            await MailServerModel.findOneAndUpdate(
                {},
                { receiverIds },
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

            const receivers = await UserModel.find({
                _id: { $in: mailServer.receiverIds },
            })

            const mailReceivers = receivers.map((receiver) => receiver.email)

            for (const receiver of mailReceivers) {
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
    getInfo: async () => {
        try {
            const data = await MailServerModel.findOne({})
                .populate({
                    path: 'receiverIds',
                    model: 'users',
                    select: 'username email',
                })
                .lean()
            return data
        } catch (error) {
            throw error
        }
    },
    sendMailToTechnician: async (technicianEmail, subject, html) => {
        try {
            if (!technicianEmail) return null;

            const mailServer = await MailServerModel.findOne({})

            console.log(mailServer)

            if (!mailServer) {
                logger.warn("Mail server is not configured. Cannot send email to technician.")
                return null
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

            console.log(transporter)

            const email = {
                from: mailServer.user,
                to: technicianEmail,
                subject,
                html,
            }

            try {
                const res = await transporter.sendMail(email)
                console.log(res)
            } catch (error) {
                logger.error("Error sending email to technician:", error)
            }
            return null
        } catch (error) {
            logger.error("Mail server error:", error)
            return null
        }
    }
}

module.exports = mailService
