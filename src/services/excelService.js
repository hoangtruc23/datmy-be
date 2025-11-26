const ExcelJS = require('exceljs')
const { formatDate } = require('../utils/helper/excelReportHelper')

const excelService = {
    createCustomerReceivableDetailExcel: async (data) => {
        try {
            const {
                customerData,
                startDate,
                endDate,
                totalAmountAllCus,
                totalPaidAllCus,
            } = data

            const workbook = new ExcelJS.Workbook()
            const worksheet = workbook.addWorksheet(
                'CHI TIẾT CÔNG NỢ PHẢI THU CỦA KHÁCH HÀNG',
            )

            //row 1
            worksheet.mergeCells('A1:J1')
            worksheet.getCell('A1').value =
                'CHI TIẾT CÔNG NỢ PHẢI THU KHÁCH HÀNG'
            worksheet.getCell('A1').alignment = { horizontal: 'center' }
            worksheet.getCell('A1').font = {
                name: 'Arial',
                size: 16,
                bold: true,
            }

            //row 2
            worksheet.mergeCells('A2:J2')
            worksheet.getCell('A2').value =
                `Tài khoản: 131, Loại tiền: <<Tổng hợp>>, Từ ngày ${formatDate(startDate)} đến ngày ${formatDate(endDate)}`
            worksheet.getCell('A2').alignment = { horizontal: 'center' }
            worksheet.getCell('A2').font = {
                name: 'Arial',
                size: 11,
                italic: true,
                bold: true,
            }

            //row 3
            worksheet.mergeCells('A3')
            worksheet.getCell('A3').value = ''

            //row 4, 5 (header)
            worksheet.mergeCells('A4:A5')
            worksheet.getCell('A4').value = 'Ngày hạch toán'
            worksheet.mergeCells('B4:B5')
            worksheet.getCell('B4').value = 'Ngày hóa đơn'
            worksheet.mergeCells('C4:C5')
            worksheet.getCell('C4').value = 'Số hóa đơn'
            worksheet.mergeCells('D4:D5')
            worksheet.getCell('D4').value = 'Diễn giải'
            worksheet.mergeCells('E4:E5')
            worksheet.getCell('E4').value = 'TK công nợ'
            worksheet.mergeCells('F4:F5')
            worksheet.getCell('F4').value = 'TK đối ứng'
            worksheet.mergeCells('G4:H4')
            worksheet.getCell('G4').value = 'Phát sinh'
            worksheet.getCell('G5').value = 'Nợ'
            worksheet.getCell('H5').value = 'Có'
            worksheet.mergeCells('I4:J4')
            worksheet.getCell('I4').value = 'Số dư'
            worksheet.getCell('I5').value = 'Nợ'
            worksheet.getCell('J5').value = 'Có'
            // prettier-ignore
            const headerCells = ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'G5', 'H5', 'I4', 'I5', 'J5']
            headerCells.forEach((cell) => {
                worksheet.getCell(cell).font = {
                    name: 'Arial',
                    bold: true,
                    size: 10,
                }
                worksheet.getCell(cell).alignment = {
                    horizontal: 'center',
                    vertical: 'middle',
                }
                worksheet.getCell(cell).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'EFEFEF' },
                }
                worksheet.getCell(cell).border = {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' },
                }
            })

            customerData.forEach((data) => {
                //row 6
                const row = worksheet.addRow([
                    `Tên khách hàng: ${data.customerName}`,
                    '',
                    '',
                    '',
                    '',
                    '',
                    data.totalAmountAll !== 0 ? data.totalAmountAll : '',
                    data.totalPaidAll !== 0 ? data.totalPaidAll : '',
                    '',
                    '',
                ])
                worksheet.mergeCells(row.number, 1, row.number, 6)
                row.eachCell((cell) => {
                    cell.font = {
                        name: 'Times New Roman',
                        size: 11,
                        bold: true,
                    }
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'D3D3D3' },
                    }
                    cell.border = {
                        top: { style: 'thin' },
                        bottom: { style: 'thin' },
                        left: { style: 'thin' },
                        right: { style: 'thin' },
                    }
                })

                if (data.totalAllDebtRemainingBefore !== 0) {
                    const row = worksheet.addRow([
                        '',
                        '',
                        '',
                        'Số dư đầu kỳ',
                        '131',
                        '',
                        '',
                        '',
                        data.totalAllDebtRemainingBefore,
                        '',
                    ])
                    row.eachCell((cell) => {
                        cell.font = {
                            name: 'Times New Roman',
                            size: 11,
                            bold: true,
                        }
                        cell.border = {
                            top: { style: 'thin' },
                            bottom: { style: 'thin' },
                            left: { style: 'thin' },
                            right: { style: 'thin' },
                        }
                    })
                }

                let moneyTemp = data.totalAllDebtRemainingBefore
                data.invoices.forEach((inv) => {
                    moneyTemp += inv.amountDebt
                    moneyTemp -= inv.amountPay

                    const row = worksheet.addRow([
                        formatDate(inv.postingDate),
                        inv.invoiceDate ? formatDate(inv.invoiceDate) : '',
                        inv.invoiceCode ?? '',
                        inv.description,
                        inv.debtAccount,
                        inv.contraAccount,
                        inv.amountDebt !== 0 ? inv.amountDebt : '',
                        inv.amountPay !== 0 ? inv.amountPay : '',
                        moneyTemp > 0 ? moneyTemp : '',
                        moneyTemp < 0 ? -moneyTemp : '',
                    ])

                    row.eachCell((cell, idx) => {
                        cell.font = {
                            name: 'Times New Roman',
                            size: 11,
                        }
                        cell.border = {
                            top: { style: 'thin' },
                            bottom: { style: 'thin' },
                            left: { style: 'thin' },
                            right: { style: 'thin' },
                        }
                        if (idx === 1 || idx === 2) {
                            cell.alignment = { horizontal: 'center' }
                        }
                        if (idx === 4) {
                            cell.alignment = {
                                wrapText: true,
                                vertical: 'top',
                            }
                        }
                    })
                })

                const summaryRow = worksheet.addRow([
                    '',
                    '',
                    '',
                    'Cộng',
                    '131',
                    '',
                    data.totalAmountAll !== 0 ? data.totalAmountAll : '',
                    data.totalPaidAll !== 0 ? data.totalPaidAll : '',
                    moneyTemp > 0 ? moneyTemp : '',
                    moneyTemp < 0 ? -moneyTemp : '',
                ])
                summaryRow.eachCell((cell) => {
                    cell.font = {
                        name: 'Times New Roman',
                        size: 11,
                        bold: true,
                    }
                    cell.border = {
                        top: { style: 'thin' },
                        bottom: { style: 'thin' },
                        left: { style: 'thin' },
                        right: { style: 'thin' },
                    }
                })
            })

            const totalRow = worksheet.addRow([
                'Tổng cộng',
                '',
                '',
                '',
                '',
                '',
                totalAmountAllCus,
                totalPaidAllCus,
                '',
                '',
            ])
            totalRow.eachCell((cell, idx) => {
                if (idx === 1) {
                    cell.alignment = {
                        horizontal: 'center',
                    }
                }
                cell.font = {
                    name: 'Times New Roman',
                    size: 11,
                    bold: true,
                }
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'D3D3D3' },
                }
                cell.border = {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' },
                }
            })

            worksheet.columns.forEach((col, idx) => {
                let maxLength = 6
                for (let rowIdx = 3; rowIdx < worksheet.rowCount; ++rowIdx) {
                    const cell = worksheet.getRow(rowIdx + 1).getCell(idx + 1)
                    if (cell.isMerged) {
                        continue
                    }
                    let text = ''
                    if (cell.value instanceof Date) {
                        text = formatDate(cell.value)
                    } else {
                        text = cell.value ? cell.value.toString() : ''
                    }
                    const length = text.length
                    maxLength = Math.max(length, maxLength)
                }
                const suggested = maxLength + 6
                col.width = Math.min(suggested, 40)
            })

            const buffer = await workbook.xlsx.writeBuffer()
            return buffer
        } catch (error) {
            throw error
        }
    },
    createDebtConfigDetailByInvoiceExcel: async (data) => {
        try {
            const {
                customerData,
                startDate,
                endDate,
                totalPaidAllCus,
                totalAmountAllCus,
                totalRemainingDebtAllCus,
            } = data
            const workbook = new ExcelJS.Workbook()
            const worksheet = workbook.addWorksheet(
                'CHI TIẾT CÔNG NỢ PHẢI THU THEO HÓA ĐƠN',
            )

            //row 1
            worksheet.mergeCells('A1:G1')
            worksheet.getCell('A1').value =
                'CHI TIẾT CÔNG NỢ  PHẢI THU THEO HÓA ĐƠN'
            worksheet.getCell('A1').alignment = { horizontal: 'center' }
            worksheet.getCell('A1').font = {
                name: 'Arial',
                bold: true,
                size: 16,
            }

            //row 2
            worksheet.mergeCells('A2:G2')
            worksheet.getCell('A2').value =
                `Tài khoản: 131, Loại tiền: <<Tổng hợp>>, Từ ngày ${formatDate(startDate)} đến ngày ${formatDate(endDate)}`
            worksheet.getCell('A2').alignment = { horizontal: 'center' }
            worksheet.getCell('A2').font = {
                name: 'Arial',
                bold: true,
                italic: true,
                size: 11,
            }

            //row 3
            worksheet.mergeCells('A3:G3')
            worksheet.getCell('A3').value = ''

            //row 4
            const headers = [
                'Ngày hạch toán',
                'Số hóa đơn',
                'Diễn giải',
                'Hạn thanh toán',
                'Giá trị hóa đơn',
                'Số đã thu',
                'Số còn phải thu',
            ]
            const headerRow = worksheet.addRow(headers)
            headerRow.font = { name: 'Arial', bold: true, size: 10 }
            headerRow.alignment = { horizontal: 'center', vertical: 'middle' }
            headerRow.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'EFEFEF' },
                }
                cell.border = {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' },
                }
            })

            customerData.forEach((data) => {
                const row = worksheet.addRow([
                    `Tên khách hàng: ${data.customerName}`,
                    '',
                    '',
                    '',
                    data.totalAmountAll,
                    data.totalPaidAll,
                    data.totalRemainingDebtAll,
                ])
                worksheet.mergeCells(row.number, 1, row.number, 4)
                row.eachCell((cell) => {
                    cell.font = {
                        name: 'Times New Roman',
                        size: 11,
                        bold: true,
                    }
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'D3D3D3' },
                    }
                    cell.border = {
                        top: { style: 'thin' },
                        bottom: { style: 'thin' },
                        left: { style: 'thin' },
                        right: { style: 'thin' },
                    }
                })

                data.invoices.forEach((inv) => {
                    const row = worksheet.addRow([
                        formatDate(inv.postingDate),
                        inv.invoiceCode,
                        inv.description,
                        formatDate(inv.dueDate),
                        inv.totalAmount,
                        inv.totalPaid,
                        inv.remainingDebt,
                    ])
                    row.eachCell((cell, idx) => {
                        cell.font = {
                            name: 'Times New Roman',
                            size: 11,
                        }
                        cell.border = {
                            top: { style: 'thin' },
                            bottom: { style: 'thin' },
                            left: { style: 'thin' },
                            right: { style: 'thin' },
                        }
                        if (idx === 1 || idx === 4) {
                            cell.alignment = { horizontal: 'center' }
                        }
                        if (idx === 3) {
                            cell.alignment = { wrapText: true, vertical: 'top' }
                        }
                    })
                })
            })

            //row 6 ->

            //total row
            const totalRow = worksheet.addRow([
                'Tổng Cộng',
                '',
                '',
                '',
                totalAmountAllCus,
                totalPaidAllCus,
                totalRemainingDebtAllCus,
            ])
            totalRow.eachCell((cell, idx) => {
                if (idx === 1) {
                    cell.alignment = {
                        horizontal: 'center',
                    }
                }
                cell.font = {
                    name: 'Times New Roman',
                    size: 11,
                    bold: true,
                }
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'D3D3D3' },
                }
                cell.border = {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' },
                }
            })

            worksheet.columns.forEach((column, index) => {
                let maxLength = 6
                for (
                    let rowIndex = 3;
                    rowIndex < worksheet.rowCount;
                    ++rowIndex
                ) {
                    const cell = worksheet
                        .getRow(rowIndex + 1)
                        .getCell(index + 1)
                    if (cell.isMerged) {
                        continue
                    }
                    let text = ''
                    if (cell.value instanceof Date) {
                        text = formatDate(cell.value)
                    } else {
                        text = cell.value ? cell.value.toString() : ''
                    }
                    const length = text.length
                    maxLength = Math.max(length, maxLength)
                }
                const suggested = maxLength + 6
                column.width = Math.min(suggested, 40)
            })
            const buffer = await workbook.xlsx.writeBuffer()
            return buffer
        } catch (error) {
            throw error
        }
    },
    createSalesDetailExcel: async (data) => {
        try {
            const workbook = new ExcelJS.Workbook()
            const worksheet = workbook.addWorksheet('Chi tiết bán hàng')

            // worksheet.mergeCells('A1:M1')
            // worksheet.mergeCells('A2:M2')
            // worksheet.mergeCells('A3:M3')
            // worksheet.mergeCells('A4:M4')
            worksheet.mergeCells('A1:N1')
            worksheet.mergeCells('A2:N2')
            worksheet.mergeCells('A3:N3')
            worksheet.mergeCells('A4:N4')

            worksheet.getCell('A1').value = 'SỔ CHI TIẾT BÁN HÀNG'
            worksheet.getCell('A2').value =
                `Từ ngày ${data.fromDate || ''} đến ngày ${data.toDate || ''}`
            worksheet.getCell('A3').value = data.customerName
                ? `Khách hàng: ${data.customerName}`
                : ''
            worksheet.getCell('A4').value = ''
            ;['A1', 'A2', 'A3'].forEach((cell) => {
                worksheet.getCell(cell).alignment = { horizontal: 'center' }
                worksheet.getCell(cell).font = { bold: true, size: 14 }
            })

            const headers = [
                'Tên khách hàng',
                'Số hóa đơn',
                'Ngày hóa đơn',
                'Mã số thuế',
                'Mã hàng',
                'Tên hàng',
                'ĐVT',
                'Số lượng bán',
                'Đơn giá (VND)',
                // 'Giảm giá (VND)',
                'Doanh số bán (VND)',
                'Thuế suất GTGT (%)',
                'Tiền thuế GTGT (VND)',
                'Tổng thanh toán (VND)',
                'Địa chỉ',
            ]
            worksheet.addRow(headers)

            const headerRow = worksheet.getRow(5)
            headerRow.font = { bold: true }
            headerRow.alignment = { horizontal: 'center', vertical: 'middle' }
            headerRow.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'D3D3D3' },
                }
                cell.border = {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' },
                }
            })
            ;(data.salesData || []).forEach((sale) => {
                const dataRow = worksheet.addRow([
                    sale.customerName || '',
                    sale.invoiceCode || '',
                    sale.invoiceDate || '',
                    sale.taxCode || '',
                    sale.productCode || '',
                    sale.productName || '',
                    sale.unit || '',
                    sale.quantity || 0,
                    sale.unitPrice || 0,
                    // sale.discount || 0,
                    sale.totalAmount || 0,
                    sale.vatRate || 0,
                    sale.vatAmount || 0,
                    sale.totalPayment || 0,
                    sale.address || '',
                ])
                dataRow.height = 50
                dataRow.eachCell((cell) => {
                    cell.alignment = {
                        vertical: 'middle',
                        horizontal: 'left',
                        wrapText: true,
                    }
                })
            })
            const summaryRow = worksheet.addRow([
                'TỔNG CỘNG',
                '',
                '',
                '',
                '',
                '',
                '',
                data.summary.totalQuantity || 0,
                '',
                // '',
                data.summary.totalSalesAmount || 0,
                '',
                data.summary.totalVatAmount || 0,
                data.summary.totalPaymentAmount || 0,
                '',
            ])
            summaryRow.font = { bold: true }
            summaryRow.alignment = {
                horizontal: 'right',
                vertical: 'middle',
            }
            summaryRow.eachCell((cell, colNumber) => {
                if (colNumber === 1) {
                    cell.alignment = { horizontal: 'left', vertical: 'middle' }
                }
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'D3D3D3' },
                }
                cell.border = {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' },
                }
            })
            // worksheet.addRow([]);
            // worksheet.addRow([]);

            worksheet.columns.forEach((column, index) => {
                let maxLength = 6

                for (
                    let rowIndex = 4;
                    rowIndex < worksheet.rowCount;
                    rowIndex++
                ) {
                    const cell = worksheet
                        .getRow(rowIndex + 1)
                        .getCell(index + 1)
                    const text = cell.value ? cell.value.toString() : ''
                    const length = text.length
                    if (length > maxLength) maxLength = length
                }

                const suggested = maxLength + 6
                column.width = Math.min(suggested, 40)
            })

            const buffer = await workbook.xlsx.writeBuffer()
            return buffer
        } catch (error) {
            console.error('Lỗi khi tạo Excel:', error)
            throw error
        }
    },
}

module.exports = excelService
