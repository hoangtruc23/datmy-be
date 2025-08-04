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
                throw new Error('Invalid or missing date inputs');
            }

            const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
            const currentDate = dateFormatter.format(new Date(data.currentDate));
            const startDate = dateFormatter.format(new Date(data.startDate));
            const endDate = dateFormatter.format(new Date(data.endDate));

            let buyerAddress = '';
            if (data.deliveryAddress && Array.isArray(data.deliveryAddress) && data.deliveryAddress.length > 0) {
                buyerAddress = data.deliveryAddress
                    .map(address => {
                        const parts = [
                            address.street,
                            address.ward,
                            address.district,
                            address.city,
                            address.country
                        ].filter(part => part && typeof part === 'string' && part.trim() !== '');
                        return parts.length > 0 ? parts.join(', ') : null;
                    })
                    .filter(Boolean)
                    .join('; ');
            } else if (data.billingAddress && typeof data.billingAddress === 'string' && data.billingAddress.trim() !== '') {
                buyerAddress = data.billingAddress;
            } else {
                buyerAddress = 'Không có thông tin địa chỉ';
            }

            const formattedTotalDebt = data.totalDebt.toLocaleString('vi-VN') + ' VNĐ';

            const templatePath = path.join(__dirname, '../templates/debtReconciliation.html');
            let html = fs.readFileSync(templatePath, 'utf8');

            html = html
                .replace('{{currentDate}}', currentDate)
                .replace('{{buyerName}}', data.officialName || '')
                .replace('{{buyerAddress}}', buyerAddress || '')
                .replace('{{buyerTaxCode}}', data.taxCode || '')
                .replace('{{buyerRepresentative}}', data.representative?.name || '')
                .replace('{{buyerTitle}}', data.representative?.title || '')
                .replace('{{sellerName}}', 'CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ ĐẠT MỸ')
                .replace('{{sellerAddress}}', '12-14, Khu dân cư An Lạc Đường số 16, Phường Bình Trị Đông B, Quận Bình Tân, Thành phố Hồ Chí Minh, Việt Nam')
                .replace('{{sellerPhone}}', '028 37511715')
                .replace('{{sellerFax}}', '028 37511714')
                .replace('{{sellerTaxCode}}', '0301427596')
                .replace('{{sellerRepresentative}}', 'TĂNG THÚY PHỤNG')
                .replace('{{sellerTitle}}', 'Giám đốc')
                .replace('{{sellerBankAccount}}', '2000.14851.035.075 - Ngân hàng Eximbank- CN TP HCM')
                .replace('{{startDate}}', startDate)
                .replace(/{{endDate}}/g, endDate)
                .replace('{{totalDebt}}', formattedTotalDebt)
                .replace('{{totalDebtInWords}}', data.totalDebtInWords)

            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });

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
            });

            await browser.close();
            return pdfBuffer;
        } catch (err) {
            console.error('Error generating PDF:', err);
            throw err;
        }
    },

    paymentRequestForm: async (data) => {
        try {
            // if (!data.invoiceDate || !data.day || !data.month || !data.year) {
            //     throw new Error('Invalid or missing date inputs');
            // }

            // const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
            //     day: '2-digit',
            //     month: '2-digit',
            //     year: 'numeric',
            // });
            // const invoiceDate = dateFormatter.format(new Date(data.invoiceDate));

            // const formattedSubtotal = data.subtotal.toLocaleString('vi-VN');
            // const formattedVat = data.vat.toLocaleString('vi-VN');
            // const formattedTotal = data.total.toLocaleString('vi-VN');
            // const formattedUnitPrice = data.unitPrice.toLocaleString('vi-VN');
            // const formattedLineTotal = data.lineTotal.toLocaleString('vi-VN');

            const templatePath = path.join(__dirname, '../templates/paymentRequest.html');
            let html = fs.readFileSync(templatePath, 'utf8');
   
            // html = html
            //     .replace('{{receiverCompany}}', data.receiverCompany || '')
            //     .replace('{{senderCompany}}', data.senderCompany || '')
            //     .replace('{{machineName}}', data.machineName || '')
            //     .replace('{{invoiceNumber}}', data.invoiceNumber || '')
            //     .replace('{{invoiceDate}}', invoiceDate)
            //     .replace('{{productName}}', data.productName || '')
            //     .replace('{{quantity}}', data.quantity?.toString() || '0')
            //     .replace('{{unitPrice}}', formattedUnitPrice)
            //     .replace('{{lineTotal}}', formattedLineTotal)
            //     .replace('{{subtotal}}', formattedSubtotal)
            //     .replace('{{vat}}', formattedVat)
            //     .replace('{{total}}', formattedTotal)
            //     .replace('{{totalInWords}}', data.totalInWords || '')
            //     .replace('{{debtDueDays}}', data.debtDueDays?.toString() || '30')
            //     .replace('{{day}}', data.day?.toString().padStart(2, '0') || '')
            //     .replace('{{month}}', data.month?.toString().padStart(2, '0') || '')
            //     .replace('{{year}}', data.year?.toString() || '')
            //     .replace('{{accountantName}}', data.accountantName || '');
            html = html
                .replace('{{receiverCompany}}', data.receiverCompany || '');
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });

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
            });

            await browser.close();
            return pdfBuffer;
        } catch (err) {
            console.error('Error generating payment request PDF:', err);
            throw err;
        }
    },

}

module.exports = pdfService
