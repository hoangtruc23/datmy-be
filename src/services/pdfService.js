const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const UnitModel = require('../models/unit')
const ProductModel = require('../models/product')
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

        const areaSet = new Set()
        for (const [index, item] of data.goodsIssueDetails.entries()) {
            let address = item?.warehouseId?.address || ''
            const lower = address.toLowerCase()

            if (
                lower.includes('hcm') ||
                lower.includes('ho chi minh') ||
                lower.includes('hồ chí minh')
            ) {
                areaSet.add('HCM')
            } else if (
                lower.includes('hn') ||
                lower.includes('ha noi') ||
                lower.includes('hà nội')
            ) {
                areaSet.add('HN')
            } else if (address) {
                areaSet.add(address)
            }

            const unit = await UnitModel.findById(item.unit)
            const unitName = unit ? unit.name : '—'

            const product = await ProductModel.findById(item.productId).populate('categoryId', 'productType')
            let specification = product ? product.specification : ''
            if (product && item.explain) {
                specification = product.code
            }
            total += item.issuedQuantity
            rows += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.productName}</td>
                <td>${specification}</td>
                <td>${unitName}</td>
                <td>${item.issuedQuantity}</td>
                <td>${item.note || ''}</td>
            </tr>
            `
        }
        const displayAddress = Array.from(areaSet).join(',')
        html = html.replace('{{deliveryAddresses}}', displayAddress)
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

        if (data.garageAddress && data.garageAddress.trim() !== '') {
            html = html.replace(
                '{{garageAddressSection}}',
                `<p><strong>Địa chỉ gara:</strong> ${data.garageAddress}</p>`,
            )
        } else {
            html = html.replace('{{garageAddressSection}}', '')
        }
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
                // .replace(/{{vatRate}}/g, data.vatRate || '')
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

    generateWorkOrderPdf: async (data) => {
        const templatePath = path.join(
            __dirname,
            "../templates/pdfDialogWorkOrder.html",
        )

        let html = fs.readFileSync(templatePath, 'utf8')
        const logoPath = path.resolve(__dirname, '../public/logo.jpg')
        const logoBuffer = fs.readFileSync(logoPath)
        const logoBase64 = logoBuffer.toString('base64')
        const logoDataUri = `data:image/jpeg;base64,${logoBase64}`
        const typeWorkLabel = data.typeWork === 'repair'
            ? "SỬA CHỮA"
            : data.typeWork === "maintain"
                ? "BẢO TRÌ"
                : "LẮP ĐẶT"; // Default fallback
        

        // Xử lý Linh kiện đã thay
        const replacementHtml = data?.workOrderDetail?.replacement
            ?.map(item => `<div style="color: #3b82f6;">- ${item}</div>`)
            .join('') ?? '';

        // Xử lý Ý kiến kỹ thuật (đề xuất thay)
        const technicalFeedbackHtml = data?.workOrderDetail?.technicalFeedback
            ?.map(item => `<div style="color: #3b82f6;">- ${item}</div>`)
            .join('') ?? '';

        // Xử lý Ý kiến khách hàng (Nếu có)
        const customerFeedback = data?.workOrderDetail?.customerFeedback?.map(item => `<div style="color: #3b82f6;">- ${item}</div>`)
            .join('') ?? '';
        // Tạo HTML cho phần đánh giá (checkbox + emoji)
        // Lấy giá trị đánh giá khách hàng (1=vui, 2=bình, 3=buồn)
        const customerEvaluate = data?.workOrderDetail?.evaluate;
        
        const evaluationRatings = `
    <div style="
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 100%;
        gap: 8px;
        margin-bottom: 8px;
        padding: 0 4px;
        box-sizing: border-box;
    ">
        <!-- Mặt cười -->
        <div style="display: flex; align-items: center; gap: 3px; flex: 0 1 auto;">
            <input type="checkbox" ${customerEvaluate === 3 ? 'checked' : ''} style="width: 14px; height: 14px; cursor: pointer;" />
            <span style="font-size: 16px;">😊</span>
        </div>
        
        <!-- Mặt bình thường -->
        <div style="display: flex; align-items: center; gap: 3px; flex: 0 1 auto;">
            <input type="checkbox" ${customerEvaluate === 2 ? 'checked' : ''} style="width: 14px; height: 14px; cursor: pointer;" />
            <span style="font-size: 16px;">😐</span>
        </div>
        
        <!-- Mặt buồn -->
        <div style="display: flex; align-items: center; gap: 3px; flex: 0 1 auto;">
            <input type="checkbox" ${customerEvaluate === 1 ? 'checked' : ''} style="width: 14px; height: 14px; cursor: pointer;" />
            <span style="font-size: 16px;">☹️</span>
        </div>
    </div>
`;
        // Xử lý Tình hình sự cố máy
        const failureHtml = data?.workOrderDetail?.failureSituation
            ?.map(item => `<div style="color: #2563eb; padding: 2px 0;">- ${item}</div>`)
            .join('') ?? '';

        // Xử lý Cách xử lý khác
        const approachHtml = data?.workOrderDetail?.differentApproach
            ?.map(item => `<div style="color: #2563eb; padding: 2px 0;">- ${item}</div>`)
            .join('') ?? '';

        const specs = {};
        data?.workOrderDetail?.machineSpecs?.forEach(item => {
            specs[item?.propId?.name] = item.value ?? '';
        });

        const getValueSpec = (specName) => {
            const value = specs[specName] || [];
            return value
        };


        const inkConcentration = Object.fromEntries(getValueSpec("Nồng độ mực").map(item => [item.name, item.value])); //Nồng độ mực
        const inkDropletLevel = Object.fromEntries(getValueSpec("Mức giọt mực").map(item => [item.name, item.value])); //Mức Giọt mực

        const itmString = getValueSpec("ITM")
            .map(item => `${item.name}: ${item.value}`)
            .join(" | ");

        html = html
            .replace(/{{typeWorkLabel}}/g, typeWorkLabel ?? '')
            .replace(/{{officialName}}/g, data?.customerId?.officialName ?? '')
            .replace(
                /{{createdAt}}/g,
                new Intl.DateTimeFormat('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }).format(new Date(data?.createdAt)),
            )
            .replace(/{{contactName}}/g, data?.contactPerson?.contactName ?? '')
            .replace(/{{contactPhone}}/g, data?.contactPerson?.contactPhone ?? '')
            .replace(
                /{{repairDate}}/g,
                new Intl.DateTimeFormat('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }).format(new Date(data?.workOrderDetail?.repairDate)),
            )
            .replace(/{{fullAddress}}/g, data?.address?.specificAddress ?? '')
            .replace(
                /{{\s*arrivalTime\s*}}/g,
                new Intl.DateTimeFormat('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    // day: '2-digit',
                    // month: '2-digit',
                    // year: 'numeric',
                }).format(new Date(data?.workOrderDetail?.arrivalTime)),
            )
            .replace(
                /{{\s*leavingTime\s*}}/g,
                new Intl.DateTimeFormat('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    // day: '2-digit',
                    // month: '2-digit',
                    // year: 'numeric',
                }).format(new Date(data?.workOrderDetail?.leavingTime)),
            )
            .replace(/{{customerFeedbackWithEmoji}}/g, evaluationRatings)
            .replace(
                /{{\s*maintainContract_Yes\s*}}/g,
                data?.workOrderDetail?.maintainContract === true ? 'X' : ''
            )
            .replace(
                /{{\s*maintainContract_No\s*}}/g,
                data?.workOrderDetail?.maintainContract === false ? 'X' : ''
            )
            .replace(/{{\s*workingTime\s*}}/g, data?.workOrderDetail?.workingTime ?? '')
            .replace(/{{type}}/g, data?.type ?? '')
            .replace(/{{serialNumber}}/g, data?.serialNumber ?? '')
            .replace(/{{inkCode}}/g, data?.workOrderDetail?.inkCode ?? '')
            .replace(
                /{{\s*installationDate\s*}}/g,
                new Intl.DateTimeFormat('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }).format(new Date(data?.workOrderDetail?.installationDate)),
            )
            .replace(/{{\s*machineStartup\s*}}/g, data?.workOrderDetail?.machineStartup ?? '')
            .replace(/{{\s*inkjetTime\s*}}/g, data?.workOrderDetail?.inkjetTime ?? '')
            .replace(/{{logoPath}}/g, logoDataUri)
            .replace(/{{failureSituation}}/g, failureHtml)
            .replace(/{{differentApproach}}/g, approachHtml)
            .replace(/{{replacementHtml}}/g, replacementHtml) //Linh kiện đã thay
            .replace(/{{replacement}}/g, replacementHtml) // Backward compatible placeholder
            .replace(/{{technicalFeedback}}/g, technicalFeedbackHtml)
            .replace(/{{customerFeedback}}/g, customerFeedback) // Ý kiến khách hàng
            .replace(/{{inkArrival}}/g, inkConcentration['Lúc đến'] || "-") //Nồng độ mực Lúc đến
            .replace(/{{inkLeaving}}/g, inkConcentration['Lúc đi'] || "-") //Nồng độ mực Lúc đi
            .replace(/{{inkDropletLevelAuto}}/g, inkDropletLevel['Cài tự động']) //Mức giọt mực - Cài tự động
            .replace(/{{inkDropletLevelManual}}/g, inkDropletLevel['Thao tác tay']) //Mức giọt mực - Thao tác tay
            .replace(/{{inkDropletLevelBUP}}/g, inkDropletLevel['BUP']) //Mức giọt mực - BUP
            .replace(/{{inkStandard}}/g, getValueSpec("Nồng độ chuẩn"))
            .replace(/{{pumpSpeed}}/g, getValueSpec("Tốc độ bơm"))
            .replace(/{{standardPressure}}/g, getValueSpec("Áp suất chuẩn"))
            .replace(/{{currentPressure}}/g, getValueSpec("Áp suất hiện hành"))
            .replace(/{{nozzle}}/g, getValueSpec("Béc phun"))
            .replace(/{{chargeLevel}}/g, getValueSpec("Charge level"))
            .replace(/{{vacuumPressure}}/g, getValueSpec("Áp chân không"))
            .replace(/{{vacuumPumpSpeed}}/g, getValueSpec("Tốc độ bơm chân không"))
            .replace(/{{printContent}}/g, getValueSpec("Nội dung in phun")) //Nội dung in phun
            .replace(/{{inkTemperature}}/g, getValueSpec("Nhiệt độ mực")) //Nhiệt độ mực
            .replace(/{{ITM}}/g, itmString) //ITM
            .replace(/{{softwareUsed}}/g, getValueSpec("Phần mềm sử dụng")) //Phần mềm sử dụng
            .replace(/{{environmentHumidity}}/g, data?.workOrderDetail?.environmentHumidity) //Phần mềm sử dụng
            .replace(/{{ambientTemperature}}/g, data?.workOrderDetail?.ambientTemperature) //Phần mềm sử dụng
            .replace(/{{dustLevel}}/g, data?.workOrderDetail?.dustLevel) //Phần mềm sử dụng

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        })
        const page = await browser.newPage()
        await page.setContent(html, { waitUntil: 'networkidle0' })

        const pdfBuffer = await page.pdf({
            format: 'A4',
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
