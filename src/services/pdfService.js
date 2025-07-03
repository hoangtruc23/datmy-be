const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

const pdfService = {
    generateGoodsIssuePdf: async (data) => {
        const templatePath = path.join(
            __dirname,
            '../templates/goodsIssue.html',
        )
        let html = fs.readFileSync(templatePath, 'utf8')
        const logoPath = path.resolve(__dirname, '../public/logo.jpg')
        const logoBuffer = fs.readFileSync(logoPath)
        const logoBase64 = logoBuffer.toString('base64')
        const logoDataUri = `data:image/jpeg;base64,${logoBase64}`
        html = html
            .replace('{{customer}}', data.customer)
            .replace('{{issueNumber}}', data.issueNumber)
            .replace('{{invoiceNumber}}', data.invoiceNumber || '')
            .replace(
                '{{invoiceOrContractNumber}}',
                data.invoiceOrContractNumber || '',
            )
            .replace('{{deliveryAddresses}}', data.deliveryAddresses || '')
            .replace('{{garageAddress}}', data.garageAddress || '')
            .replace('{{orderedBy.name}}', data.orderedBy?.name || '')
            .replace('{{orderedBy.phone}}', data.orderedBy?.phone || '')
            .replace('{{recipient.name}}', data.recipient?.name || '')
            .replace('{{recipient.phone}}', data.recipient?.phone || '')
            .replace(
                '{{createdAt}}',
                new Intl.DateTimeFormat('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }).format(new Date()),
            )

            .replace('{{logoPath}}', logoDataUri)

        let rows = ''
        let total = 0
        data.goodsIssueDetails.forEach((item, index) => {
            total += item.issuedQuantity
            rows += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.productName}</td>
                <td>${item.origin || ''}</td>
                <td>${item.unit || ''}</td>
                <td>${item.issuedQuantity}</td>
                <td>${item.note || ''}</td>
            </tr>
            `
        })
        html = html.replace('{{goodsIssueDetails}}', rows)
        html = html.replace('{{totalIssuedQuantity}}', total)
        html = html.replace('{{goodsIssueNote}}', data.note || '')

        html = html
            .replace(
                '{{createBy}}',
                data.goodsIssueApproval.createdBy.approvedBy || '',
            )
            .replace('{{checkBy}}', data.checkBy || '')
            .replace('{{storekeeper}}', data.storekeeper || '')

        const browser = await puppeteer.launch({ headless: true })
        const page = await browser.newPage()
        await page.setContent(html, { waitUntil: 'networkidle0' })

        const pdfBuffer = await page.pdf({
            format: 'A4',
            landscape: true,
            printBackground: true,
            margin: {
                top: '10px',
                bottom: '10px',
                left: '10px',
                right: '10px',
            },
        })

        await browser.close()
        return pdfBuffer
    },
}

module.exports = pdfService
