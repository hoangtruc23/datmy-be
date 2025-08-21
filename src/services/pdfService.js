const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const UnitModel = require('../models/unit')
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

        for (const [index, item] of data.goodsIssueDetails.entries()) {
            const unit = await UnitModel.findById(item.unit)
            const unitName = unit ? unit.name : '—'

            total += item.issuedQuantity
            rows += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.productName}</td>
                <td>${item.origin || ''}</td>
                <td>${unitName}</td>
                <td>${item.issuedQuantity}</td>
                <td>${item.note || ''}</td>
            </tr>
            `
        }

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

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        })
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

    debtReconciliationForm: async (data) => {
        try {
            if (!data.currentDate || !data.startDate || !data.endDate) {
                throw new Error('Invalid or missing date inputs')
            }

            const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            })
            const currentDate = dateFormatter.format(new Date(data.currentDate))
            const startDate = dateFormatter.format(new Date(data.startDate))
            const endDate = dateFormatter.format(new Date(data.endDate))

            let buyerAddress = ''
            if (
                data.deliveryAddress &&
                Array.isArray(data.deliveryAddress) &&
                data.deliveryAddress.length > 0
            ) {
                buyerAddress = data.deliveryAddress
                    .map((address) => {
                        const parts = [
                            address.street,
                            address.ward,
                            address.district,
                            address.city,
                            address.country,
                        ].filter(
                            (part) =>
                                part &&
                                typeof part === 'string' &&
                                part.trim() !== '',
                        )
                        return parts.length > 0 ? parts.join(', ') : null
                    })
                    .filter(Boolean)
                    .join('; ')
            } else if (
                data.billingAddress &&
                typeof data.billingAddress === 'string' &&
                data.billingAddress.trim() !== ''
            ) {
                buyerAddress = data.billingAddress
            } else {
                buyerAddress = 'Không có thông tin địa chỉ'
            }

            const formattedTotalDebt =
                data.totalDebt.toLocaleString('vi-VN') + ' VNĐ'

            const templatePath = path.join(
                __dirname,
                '../templates/debtReconciliation.html',
            )
            let html = fs.readFileSync(templatePath, 'utf8')

            html = html
                .replace('{{currentDate}}', currentDate)
                .replace('{{buyerName}}', data.officialName || '')
                .replace('{{buyerAddress}}', buyerAddress || '')
                .replace('{{buyerTaxCode}}', data.taxCode || '')
                .replace(
                    '{{buyerRepresentative}}',
                    data.representative?.name || '',
                )
                .replace('{{buyerTitle}}', data.representative?.title || '')
                .replace(
                    '{{sellerName}}',
                    'CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ ĐẠT MỸ',
                )
                .replace(
                    '{{sellerAddress}}',
                    '12-14, Khu dân cư An Lạc Đường số 16, Phường Bình Trị Đông B, Quận Bình Tân, Thành phố Hồ Chí Minh, Việt Nam',
                )
                .replace('{{sellerPhone}}', '028 37511715')
                .replace('{{sellerFax}}', '028 37511714')
                .replace('{{sellerTaxCode}}', '0301427596')
                .replace('{{sellerRepresentative}}', 'TĂNG THÚY PHỤNG')
                .replace('{{sellerTitle}}', 'Giám đốc')
                .replace(
                    '{{sellerBankAccount}}',
                    '2000.14851.035.075 - Ngân hàng Eximbank- CN TP HCM',
                )
                .replace('{{startDate}}', startDate)
                .replace(/{{endDate}}/g, endDate)
                .replace('{{totalDebt}}', formattedTotalDebt)
                .replace('{{totalDebtInWords}}', data.totalDebtInWords)

            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            })
            const page = await browser.newPage()
            await page.setContent(html, { waitUntil: 'networkidle0' })

            const pdfBuffer = await page.pdf({
                format: 'A4',
                landscape: false,
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
        } catch (err) {
            console.error('Error generating PDF:', err)
            throw err
        }
    },

    paymentRequestForm: async (data) => {
        try {
            const formattedSubtotal =
                data.subtotal?.toLocaleString('vi-VN') || '0'
            const formattedVat = data.vat?.toLocaleString('vi-VN') || '0'
            const formattedTotal = data.total?.toLocaleString('vi-VN') || '0'

            const templatePath = path.join(
                __dirname,
                '../templates/paymentRequest.html',
            )
            let html = fs.readFileSync(templatePath, 'utf8')

            let productRows = ''
            if (data.products && data.products.length > 0) {
                data.products.forEach((product) => {
                    const formattedUnitPrice =
                        product.unitPrice?.toLocaleString('vi-VN') || '0'
                    const formattedLineTotal =
                        product.lineTotal?.toLocaleString('vi-VN') || '0'
                    const formattedDiscount =
                        product.discount?.toLocaleString('vi-VN') || '0'
                    productRows += `
                        <tr>
                            <td>${data.invoiceNumber || ''}</td>
                            <td>${data.invoiceDate || ''}</td>
                            <td>${product.productName || ''}</td>
                            <td>${product.quantity?.toString() || '0'}</td>
                            <td>${formattedUnitPrice}</td>
                            <td>${formattedDiscount}</td>
                            <td>${formattedLineTotal}</td>
                        </tr>
                    `
                })
            } else {
                productRows = `
                    <tr>
                        <td>${data.invoiceNumber || ''}</td>
                        <td>${data.invoiceDate || ''}</td>
                        <td>Nguyên liệu, linh kiện</td>
                        <td>1</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                    </tr>
                `
            }

            html = html
                .replace(/{{officialName}}/g, data.officialName || '')
                .replace(/{{receiverCompany}}/g, data.receiverCompany || '')
                .replace(/{{senderCompany}}/g, data.senderCompany || '')
                .replace(/{{invoiceNumber}}/g, data.invoiceNumber || '')
                .replace(/{{invoiceDate}}/g, data.invoiceDate || '')
                .replace(/{{productRows}}/g, productRows)
                .replace(/{{subtotal}}/g, formattedSubtotal)
                .replace(/{{vatRate}}/g, data.vatRate || '')
                .replace(/{{vat}}/g, formattedVat)
                .replace(/{{total}}/g, formattedTotal)
                .replace(/{{totalDebtInWords}}/g, data.totalDebtInWords || '')
                .replace(
                    /{{limitOverdue}}/g,
                    data.limitOverdue?.toString() || '30',
                )
                .replace(
                    /{{day}}/g,
                    data.day?.toString().padStart(2, '0') || '',
                )
                .replace(
                    /{{month}}/g,
                    data.month?.toString().padStart(2, '0') || '',
                )
                .replace(/{{year}}/g, data.year?.toString() || '')
                .replace(/{{accountantName}}/g, data.accountantName || '')

            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            })

            const page = await browser.newPage()
            await page.setContent(html, { waitUntil: 'networkidle0' })

            const pdfBuffer = await page.pdf({
                format: 'A4',
                landscape: false,
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
        } catch (err) {
            console.error('Lỗi khi tạo PDF đề nghị thanh toán:', err)
            throw err
        }
    },
}

module.exports = pdfService
