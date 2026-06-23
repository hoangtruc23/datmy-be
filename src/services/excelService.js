const ExcelJS = require('exceljs')
const moment = require('moment');
const { formatDate, appendSignatureFooter } = require('../utils/helper/excelReportHelper')
const ContactPersonCustomerModel = require('../models/contactPersonCustomer')
const WorkOrderModel = require('../models/workOrder')
const {
    getWorkOrderModel,
    checkExist,
} = require('../utils/helper/workOrderDetailHelper');
const BadReq = require('../utils/response/requestError');
const errorCode = require('../utils/response/errorCode');
const { logger } = require('../config/loggerConfig');

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
                ; (data.salesData || []).forEach((sale) => {
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

    reportHistoryMachine: async (params, body) => {
        try {
            const { deviceId } = params;

            // 1. Tìm thông tin khách hàng sở hữu thiết bị
            const customerContact = await ContactPersonCustomerModel.findOne({
                "devices._id": deviceId
            }).lean();

            if (!customerContact) {
                throw new BadReq({
                    code: "123",
                    message: "Không có lịch sử máy",
                })
            }

            // 2. Tìm chính xác object thiết bị trong mảng devices
            const targetDevice = customerContact.devices.find(
                (device) => device._id.toString() === deviceId.toString()
            );

            // 3. Lấy ra số serial
            const serial = targetDevice ? targetDevice.serialNumber : null;
            const model = targetDevice?.productCode[0]

            if (serial == null || serial === undefined || serial.trim() === "") {
                logger.error("Không tìm thấy số serial cho thiết bị");
                throw new BadReq({
                    code: "125",
                    message: "Không tìm thấy số serial cho thiết bị",
                })
            }

            // 4. Lấy danh sách các Work Order theo số Serial
            const workOrders = await WorkOrderModel.find({ serialNumber: serial, customerId: customerContact?.customerId })
                .populate('customerId', 'officialName contractDate')
                .populate('technicianId', 'fullname')
                .lean();


            if (!workOrders || workOrders.length === 0) {
                throw new BadReq({
                    code: "124",
                    message: "Không tìm thấy dữ liệu báo cáo",
                })
            }
            // 5. Thu thập chi tiết thông số kỹ thuật cho từng Work Order
            const fullWorkOrdersData = await Promise.all(
                workOrders.map(async (order) => {
                    try {
                        const machineType = (order.type && order.type.length > 0) ? order.type : '';
                        const WorkOrderDetailModel = getWorkOrderModel(
                            order.typeWork,
                            machineType[0]
                        );

                        let workOrderDetail = null;
                        if (WorkOrderDetailModel) {
                            workOrderDetail = await WorkOrderDetailModel.findOne({
                                workOrderId: order._id,
                            }).populate('machineSpecs.propId', 'name').lean();
                        }

                        return {
                            ...order,
                            workOrderDetail: workOrderDetail || {}
                        };
                    } catch (err) {
                        console.error(`Lỗi khi lấy chi tiết cho order ${order._id}:`, err);
                        return { ...order, workOrderDetail: {} };
                    }
                })
            );

            // 6. Khởi tạo Workbook & Worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Lịch sử thiết bị');
            worksheet.views = [{ showGridLines: true }];

            if (model === "A") {
                // 7. Định nghĩa cấu trúc cột dữ liệu (Các key độc lập, chính xác)
                worksheet.columns = [
                    { header: 'ContractDate', key: 'contractDate', width: 15 },
                    { header: 'Customer', key: 'customerName', width: 35 },
                    { header: 'Serial No', key: 'serialNo', width: 15 },
                    { header: 'Service Date', key: 'serviceDate', width: 15 },
                    { header: 'Call Type', key: 'callType', width: 15 },
                    { header: 'Technician', key: 'technician', width: 20 },
                    { header: 'Problems', key: 'problems', width: 30 },
                    { header: 'Actions', key: 'actions', width: 45 },
                    { header: 'Technical Feedback (linh kiện đề xuất thay)', key: 'technicalFeedback', width: 30 },
                    { header: 'Components replaced (linh kiện đã thay)', key: 'componentsReplaced', width: 30 },
                    { header: 'Customer Feedback', key: 'customerFeedback', width: 30 },
                    { header: 'MCH Counter (thời gian mở máy)', key: 'mchCounter', width: 25 },
                    { header: 'JET Counter (thời gian in phun)', key: 'jetCounter', width: 25 },
                    { header: 'Pressure Target (áp suất chuẩn)', key: 'pressureTarget', width: 25 },
                    { header: 'Pump Speed (tốc độ bơm)', key: 'pumpSpeed', width: 20 },
                    { header: 'Ink Code (loại mực)', key: 'inkCode', width: 20 },
                    { header: 'BTF Target (nồng độ chuẩn)', key: 'btfTarget', width: 20 },
                    { header: 'BTF Leave (nồng độ hiện hành)', key: 'btfLeave', width: 20 },
                    { header: 'Mod Level (mức giọt mực)', key: 'modLevel', width: 20 },
                    { header: 'BUP Time (thời gian tách)', key: 'bupTime', width: 15 },
                    { header: 'Ink Temperature (nhiệt độ mực)', key: 'inkTemperature', width: 25 },
                    { header: 'Gutter pump speed (tốc độ bơm thu hồi)', key: 'gutterPumpSpeed', width: 30 },
                    { header: 'Vacuum pressure (áp chân không)', key: 'vacuumPressure', width: 25 },
                    { header: 'i-tech module expiry (thời hạn ITM)', key: 'itechModuleExpiry', width: 25 },
                    { header: 'Firmware (Phần mềm)', key: 'firmware', width: 20 },
                    { header: 'Ambient temp (Nhiệt độ môi trường)', key: 'ambientTemperature', width: 20 },
                    { header: 'Humadity (Độ ẩm)', key: 'environmentHumidity', width: 20 },
                ];

                //Lấy thông số
                // const getSpecValue = (specs, matchName, subArrayKey = null) => {
                //     if (!Array.isArray(specs)) return '';
                //     // Tìm phần tử dựa trên trường propId.name tiếng Việt từ DB của bạn
                //     const spec = specs.find(s =>
                //         s && s.propId && s.propId.name &&
                //         s.propId.name.toLowerCase().trim() === matchName.toLowerCase().trim()
                //     );

                //     if (!spec) return '';

                //     // Xử lý đặc biệt nếu trường giá trị là một mảng lồng (như "Mức giọt mực")
                //     if (Array.isArray(spec.value)) {
                //         if (subArrayKey) {
                //             const subItem = spec.value.find(item =>
                //                 item && item.name && item.name.toLowerCase().trim() === subArrayKey.toLowerCase().trim()
                //             );
                //             return subItem ? (subItem.value ?? '') : '';
                //         }
                //         // Fallback gom tất cả phần tử mảng lại nếu không truyền subArrayKey
                //         return spec.value.map(item => `${item.name}: ${item.value}`).join(', ');
                //     }

                //     return spec.value ?? '';
                // };

                const getSpecValue = (specs, matchName, subArrayKey = null) => {
                    if (!Array.isArray(specs)) return '';

                    // 1. Tìm phần tử cha dựa trên trường propId.name (Ví dụ: 'Mức giọt mực')
                    const spec = specs.find(s =>
                        s && s.propId && s.propId.name &&
                        s.propId.name.toLowerCase().trim() === matchName.toLowerCase().trim()
                    );

                    if (!spec) return '';

                    // 2. Xử lý đặc biệt nếu trường giá trị là một mảng lồng (như "Mức giọt mực")
                    if (Array.isArray(spec.value)) {
                        if (subArrayKey) {
                            // Tìm phần tử con khớp với subArrayKey (Ví dụ: 'Cài tự động', 'Thao tác tay', 'BUP')
                            const subItem = spec.value.find(item => {
                                if (!item) return false;

                                // Trích xuất tên thuộc tính con (hỗ trợ cả TH trực tiếp hoặc bọc trong propId)
                                const subName = item.name || (item.propId && item.propId.name);

                                return subName && subName.toLowerCase().trim() === subArrayKey.toLowerCase().trim();
                            });

                            // Trả về value của ô con nếu tìm thấy, nếu không tìm thấy trả về chuỗi rỗng
                            return subItem ? (subItem.value ?? '') : '';
                        }

                        // Fallback: Gom tất cả phần tử mảng lại bằng dấu phẩy nếu không truyền subArrayKey
                        return spec.value.map(item => {
                            const name = item.name || (item.propId && item.propId.name) || '';
                            return `${name}: ${item.value ?? ''}`;
                        }).join(', ');
                    }

                    // 3. Nếu value là text bình thường (không phải array)
                    return spec.value ?? '';
                };


                // 8. Duyệt dữ liệu gộp & đổ vào các hàng hàng Excel
                fullWorkOrdersData.forEach((order) => {
                    const detail = order.workOrderDetail || {};
                    const specs = detail.machineSpecs || [];
                    // Xử lý gộp Problems
                    let problemsText = '';
                    if (Array.isArray(detail.failureSituation)) {
                        problemsText = detail.failureSituation.filter(item => item && item.trim() !== '').join('\n');
                    } else {
                        problemsText = order.description || '';
                    }

                    // 2. Xử lý gộp Actions từ differentApproach
                    let actionsText = '';
                    if (Array.isArray(detail.differentApproach)) {
                        actionsText = detail.differentApproach.filter(item => item && item.trim() !== '').join('\n');
                    } else {
                        actionsText = order.note || ''; // Fallback về note tổng
                    }

                    let technicalFeedbackText = '';
                    if (Array.isArray(detail.technicalFeedback)) {
                        technicalFeedbackText = detail.technicalFeedback.filter(item => item && item.trim() !== '').join('\n');
                    }

                    let customerFeedbackText = '';
                    if (Array.isArray(detail.customerFeedback)) {
                        customerFeedbackText = detail.customerFeedback.filter(item => item && item.trim() !== '').join('\n');
                    }

                    let componentsReplacedText = '';
                    if (Array.isArray(detail.replacement)) {
                        componentsReplacedText = detail.replacement.filter(item => item && item.trim() !== '').join('\n');
                    }

                    const rawInkValue = getSpecValue(specs, "Nồng độ mực");
                    let inkConcentration = {};
                    if (typeof rawInkValue === 'string') {
                        // Tách chuỗi "Lúc đến: 1, Lúc đi: 2" thành mảng các cặp key-value
                        rawInkValue.split(',').forEach(item => {
                            const [name, value] = item.split(':');
                            if (name && value) {
                                inkConcentration[name.trim()] = value.trim();
                            }
                        });
                    } else if (Array.isArray(rawInkValue)) {
                        inkConcentration = Object.fromEntries(rawInkValue.map(item => [item.name, item.value]));
                    }
                    // const inkConcentration = Object.fromEntries(getSpecValue(specs, "Nồng độ mực").map(item => [item.name, item.value])); //Nồng độ mực
                    // ===================================================
                    // Tạo đối tượng dòng dữ liệu map chuẩn với dữ liệu từ DB
                    const rowData = {
                        contractDate: order.customerId?.contractDate ? moment(order.customerId.contractDate).format('YYYY-MM-DD') : '2019-09-26',
                        customerName: order.customerId?.officialName || 'CÔNG TY CỔ PHẦN BMC VIỆT NAM',
                        serialNo: order.serialNumber || 'N/A',
                        serviceDate: order.assignedTime ? moment(order.assignedTime).format('YYYY-MM-DD') : moment(order.createdAt).format('YYYY-MM-DD'),
                        callType: order.typeWork === 'repair' ? 'SỬA CHỮA' : 'BẢO TRÌ',
                        technician: order.technicianId?.fullname || 'CHƯA PHÂN CÔNG',
                        problems: problemsText,
                        actions: actionsText,
                        technicalFeedback: technicalFeedbackText,
                        componentsReplaced: componentsReplacedText,
                        customerFeedback: customerFeedbackText,

                        // Đọc thông số kỹ thuật map chuẩn theo name tiếng Việt trong database của bạn
                        mchCounter: order.workOrderDetail?.machineStartup,
                        jetCounter: order.workOrderDetail?.inkjetTime,
                        pressureTarget: getSpecValue(specs, 'Áp suất chuẩn'),
                        pumpSpeed: getSpecValue(specs, 'Tốc độ bơm'),
                        btfTarget: getSpecValue(specs, 'Nồng độ chuẩn'),
                        btfLeave: getSpecValue(specs, 'Nồng độ hiện hành') || inkConcentration['Lúc đi'],
                        vacuumPressure: getSpecValue(specs, 'Áp chân không'),
                        gutterPumpSpeed: getSpecValue(specs, 'Tốc độ bơm chân không'),

                        modLevel: getSpecValue(specs, 'Mức giọt mực'),
                        bupTime: getSpecValue(specs, 'Mức giọt mực', 'BUP'),

                        inkTemperature: getSpecValue(specs, 'Nhiệt độ mực'),
                        itechModuleExpiry: getSpecValue(specs, 'ITM'),
                        firmware: getSpecValue(specs, 'Phần mềm sử dụng'),
                        inkCode: order.workOrderDetail?.inkCode,
                        ambientTemperature: order.workOrderDetail?.ambientTemperature,
                        environmentHumidity: order.workOrderDetail?.environmentHumidity,
                    };

                    const row = worksheet.addRow(rowData);

                    // Bật wrapText giúp hiển thị xuống dòng (\n) đúng chuẩn trong ô Excel
                    row.alignment = { vertical: 'top', wrapText: true };
                });
            }

            // Định dạng lại hàng Header (In đậm)
            worksheet.getRow(1).font = { bold: true };

            // 9. Ghi workbook xuất ra Buffer gửi về Controller hệ thống
            const buffer = await workbook.xlsx.writeBuffer();
            return buffer;

        } catch (error) {
            throw error;
        }
    },
    reportWorkOrder: async (query) => {
        try {
            const { fromDate, toDate } = query;
            const matchStage = {};

            // 1. Xử lý khoảng thời gian (Mặc định trong tháng hiện tại nếu không truyền)
            matchStage.createdAt = {};
            if (fromDate || toDate) {
                if (fromDate) matchStage.createdAt.$gte = new Date(fromDate);
                if (toDate) matchStage.createdAt.$lte = new Date(toDate);
            } else {
                const now = new Date();
                const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

                matchStage.createdAt.$gte = firstDayOfMonth;
                matchStage.createdAt.$lte = lastDayOfMonth;
            }

            // Chỉ thống kê các phiếu đã gán cho kỹ thuật viên
            matchStage.technicianId = { $exists: true, $ne: null };

            // 2. Aggregation Pipeline thu thập thông tin chi tiết
            const rawReport = await WorkOrderModel.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: {
                            provinceCity: { $ifNull: ['$address.provinceCity', 'Không xác định'] },
                            technicianId: '$technicianId'
                        },
                        suaChuaMay: { $sum: { $cond: [{ $eq: ['$typeWork', 'repair'] }, 1, 0] } },
                        baoTriMay: { $sum: { $cond: [{ $eq: ['$typeWork', 'maintenance'] }, 1, 0] } },
                        lapDatMayMoi: { $sum: { $cond: [{ $eq: ['$typeWork', 'installation'] }, 1, 0] } },
                        phieuGiaoDich: { $sum: { $cond: [{ $eq: ['$typeWork', 'transaction'] }, 1, 0] } },
                        tongSoLuongMay: { $sum: 1 },
                        khachHangList: { $addToSet: '$customerId' },
                        daThayLoc: {
                            $sum: {
                                $cond: [
                                    { $regexMatch: { input: { $ifNull: ['$result', ''] }, regex: /thay lọc|thay loc/i } },
                                    1, 0
                                ]
                            }
                        },
                        congTacTinh: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $ifNull: ['$address.provinceCity', false] },
                                            { $ne: ['$address.provinceCity', 'Thành phố Hà Nội'] },
                                            { $ne: ['$address.provinceCity', 'Thành phố Hồ Chí Minh'] }
                                        ]
                                    },
                                    1, 0
                                ]
                            }
                        },
                        allProvinces: { $push: '$address.provinceCity' },
                        allCustomers: { $push: { id: '$customerId', name: '$customerName', work: '$typeWork' } }
                    }
                },
                {
                    $lookup: {
                        from: 'technicians',
                        localField: '_id.technicianId',
                        foreignField: '_id',
                        as: 'technicianInfo'
                    }
                },
                {
                    $unwind: {
                        path: '$technicianInfo',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        provinceCity: '$_id.provinceCity',
                        technicianId: '$_id.technicianId',
                        technicianName: { $ifNull: ['$technicianInfo.fullname', 'Không rõ tên'] },
                        suaChuaMay: 1,
                        baoTriMay: 1,
                        lapDatMayMoi: 1,
                        phieuGiaoDich: 1,
                        tongSoLuongMay: 1,
                        tongSlKhachHang: { $size: '$khachHangList' },
                        daThayLoc: 1,
                        congTacTinh: 1,
                        allProvinces: 1,
                        allCustomers: 1
                    }
                },
                { $sort: { provinceCity: 1, technicianName: 1 } }
            ]);

            const workbook = new ExcelJS.Workbook();
            const targetMonthStr = moment(toDate ? new Date(toDate) : new Date()).format('MM/YYYY');
            const targetMonthLongStr = moment(toDate ? new Date(toDate) : new Date()).format('MM/YYYY');

            // Gom nhóm dữ liệu theo tỉnh phục vụ tách sheet
            const provincesMap = {};
            rawReport.forEach(item => {
                let pName = item.provinceCity;
                // Định dạng chuẩn hóa tên tỉnh làm tên sheet
                pName = pName.replace('Thành phố ', '').replace('Tỉnh ', '').toUpperCase();
                if (!provincesMap[pName]) provincesMap[pName] = [];
                provincesMap[pName].push(item);
            });

            const provincesList = Object.keys(provincesMap).sort();

            // =========================================================================
            // VẼ SHEET 1: TỔNG HỢP (Layout 11 cột - Theo ảnh mẫu số 1)
            // =========================================================================
            const mainSheetName = `CÔNG VIỆC KỸ THUẬT T${moment(toDate ? new Date(toDate) : new Date()).format('MM.YY')}`;
            const wsMain = workbook.addWorksheet(mainSheetName);
            wsMain.views = [{ showGridLines: true }];

            wsMain.columns = [
                { key: 'technicianName', width: 25 },
                { key: 'suaChuaMay', width: 14 },
                { key: 'baoTriMay', width: 14 },
                { key: 'lapDatMayMoi', width: 14 },
                { key: 'phieuGiaoDich', width: 14 },
                { key: 'tongSoLuongMay', width: 16 },
                { key: 'tongSlKhachHang', width: 16 },
                { key: 'daThayLoc', width: 15 },
                { key: 'congTacTinh', width: 14 },
                { key: 'noiCongTac', width: 30 },
                { key: 'congTacHaNoi', width: 30 }
            ];

            // Tiêu đề đầu trang Sheet 1
            const mainTitle1 = wsMain.addRow([]);
            mainTitle1.getCell(1).value = 'TÊN KHÁCH HÀNG';
            mainTitle1.font = { name: 'Arial', size: 11 };

            const mainTitle2 = wsMain.addRow([]);
            mainTitle2.getCell(1).value = `CÔNG VIỆC PHÒNG KỸ THUẬT T${targetMonthStr}`;
            mainTitle2.font = { bold: true, name: 'Arial', size: 14, color: { argb: 'FF1F4E78' } };
            wsMain.mergeCells('A2:K2');

            wsMain.addRow([]); // Hàng trống số 3

            // Header dữ liệu Sheet 1
            const mainHeader = wsMain.addRow([
                'KỸ THUẬT VIÊN', 'SỬA CHỮA MÁY', 'BẢO TRÌ MÁY', 'LẮP ĐẶT MÁY MỚI', 'PHIẾU GIAO DỊCH',
                'TỔNG SỐ LƯỢNG MÁY', 'TỔNG SL KHÁCH HÀNG', 'ĐÃ THAY LỌC 14831', 'CÔNG TÁC TỈNH',
                'NƠI CÔNG TÁC', 'CÔNG TÁC HÀ NỘI'
            ]);
            mainHeader.height = 35;
            mainHeader.font = { bold: true, name: 'Times New Roman', size: 11 };
            mainHeader.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            for (let i = 2; i <= 5; i++) mainHeader.getCell(i).font = { bold: true, color: { argb: 'FFC00000' }, name: 'Times New Roman', size: 11 };
            mainHeader.getCell(10).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
            mainHeader.getCell(11).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

            const mainGrandTotal = { suaChuaMay: 0, baoTriMay: 0, lapDatMayMoi: 0, phieuGiaoDich: 0, tongSoLuongMay: 0, tongSlKhachHang: 0, daThayLoc: 0, congTacTinh: 0 };

            // Duyệt đổ dữ liệu phân tách theo từng cụm tỉnh
            provincesList.forEach(provinceName => {
                // Tạo dòng phân cách Tên Tỉnh (In đậm)
                const provinceGroupRow = wsMain.addRow([provinceName]);
                provinceGroupRow.font = { bold: true, name: 'Arial', size: 11 };
                provinceGroupRow.alignment = { vertical: 'middle', horizontal: 'left' };

                const rowsInProvince = provincesMap[provinceName];
                rowsInProvince.forEach(item => {
                    mainGrandTotal.suaChuaMay += item.suaChuaMay;
                    mainGrandTotal.baoTriMay += item.baoTriMay;
                    mainGrandTotal.lapDatMayMoi += item.lapDatMayMoi;
                    mainGrandTotal.phieuGiaoDich += item.phieuGiaoDich;
                    mainGrandTotal.tongSoLuongMay += item.tongSoLuongMay;
                    mainGrandTotal.tongSlKhachHang += item.tongSlKhachHang;
                    mainGrandTotal.daThayLoc += item.daThayLoc;
                    mainGrandTotal.congTacTinh += item.congTacTinh;

                    // Xử lý chuỗi Nơi công tác
                    let noiCongTacStr = '';
                    if (item.allProvinces && item.allProvinces.length > 0) {
                        const counts = {};
                        item.allProvinces.forEach(p => {
                            if (p && p !== 'Thành phố Hà Nội' && p !== 'Thành phố Hồ Chí Minh') {
                                const cleanP = p.replace('Thành phố ', '').replace('Tỉnh ', '').toUpperCase();
                                counts[cleanP] = (counts[cleanP] || 0) + 1;
                            }
                        });
                        noiCongTacStr = Object.entries(counts).map(([prov, cnt]) => `${prov} (${cnt})`).join(', ');
                    }

                    const r = wsMain.addRow([
                        `  ${item.technicianName}`,
                        item.suaChuaMay || '', item.baoTriMay || '', item.lapDatMayMoi || '', item.phieuGiaoDich || '',
                        item.tongSoLuongMay || 0, item.tongSlKhachHang || 0, item.daThayLoc || '', item.congTacTinh || '',
                        noiCongTacStr, ''
                    ]);
                    r.alignment = { vertical: 'middle', horizontal: 'center' };
                    r.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
                    r.getCell(10).alignment = { vertical: 'middle', horizontal: 'left' };
                });
            });

            // Hàng Grand Total cho Sheet 1
            const mainTotalRow = wsMain.addRow([
                'Grand Total', mainGrandTotal.suaChuaMay, mainGrandTotal.baoTriMay, mainGrandTotal.lapDatMayMoi, mainGrandTotal.phieuGiaoDich,
                mainGrandTotal.tongSoLuongMay, mainGrandTotal.tongSlKhachHang, mainGrandTotal.daThayLoc, mainGrandTotal.congTacTinh, '', ''
            ]);
            mainTotalRow.font = { bold: true, color: { argb: 'FFC00000' }, name: 'Arial', size: 11 };
            mainTotalRow.alignment = { vertical: 'middle', horizontal: 'center' };
            mainTotalRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'right' };

            // Vẽ viền cho Sheet 1
            for (let r = 4; r <= mainTotalRow.number; r++) {
                wsMain.getRow(r).eachCell({ includeEmpty: true }, cell => {
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFA6A6A6' } }, left: { style: 'thin', color: { argb: 'FFA6A6A6' } },
                        bottom: { style: 'thin', color: { argb: 'FFA6A6A6' } }, right: { style: 'thin', color: { argb: 'FFA6A6A6' } }
                    };
                });
            }
            appendSignatureFooter(wsMain, toDate, 9, 11);


            // =========================================================================
            // VẼ CÁC SHEET TIẾP THEO: CHI TIẾT TỪNG TỈNH (Layout 13 cột - Theo ảnh mẫu số 2)
            // =========================================================================
            provincesList.forEach(provinceName => {
                const wsProv = workbook.addWorksheet(provinceName);
                wsProv.views = [{ showGridLines: true }];

                wsProv.columns = [
                    { key: 'stt', width: 6 }, { key: 'technicianName', width: 22 }, { key: 'soLanCongTac', width: 14 },
                    { key: 'noiCongTac', width: 25 }, { key: 'khachHangLapLai', width: 35 }, { key: 'suaChuaMay', width: 11 },
                    { key: 'baoTriMay', width: 11 }, { key: 'lapDatMayMoi', width: 12 }, { key: 'phieuGiaoDich', width: 12 },
                    { key: 'tongSoLuongMay', width: 14 }, { key: 'tongSlKhachHang', width: 14 }, { key: 'daThayLoc', width: 14 },
                    { key: 'ghiChu', width: 30 }
                ];

                // Dòng 1: Tiêu đề chính
                const provTitle = wsProv.addRow([]);
                provTitle.getCell(1).value = `CÔNG VIỆC KỸ THUẬT THÁNG ${targetMonthLongStr}`;
                provTitle.font = { bold: true, name: 'Arial', size: 14 };
                provTitle.height = 25;
                wsProv.mergeCells('A1:M1');
                provTitle.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

                // Dòng 2: Tên nhóm quản lý khu vực tỉnh
                const rowsInProvince = provincesMap[provinceName];
                const techNames = [...new Set(rowsInProvince.map(r => r.technicianName))].join(', ');
                const provGroup = wsProv.addRow([]);
                provGroup.getCell(1).value = `Nhóm ${provinceName} :  ${techNames}`;
                provGroup.font = { bold: true, name: 'Arial', size: 10, color: { argb: 'FFC00000' } };
                wsProv.mergeCells('A2:M2');

                // Dòng 3 & 4: Khởi tạo Header hai tầng
                const r3 = wsProv.addRow(['STT', 'KỸ THUẬT VIÊN', 'SỐ LẦN CÔNG TÁC', 'NƠI CÔNG TÁC', 'KHÁCH HÀNG LẬP LẠI', 'CÔNG VIỆC', '', '', '', 'TỔNG SỐ LƯỢNG MÁY', 'TỔNG SL KHÁCH HÀNG', 'ĐÃ THAY LỌC 14831', 'GHI CHÚ']);
                const r4 = wsProv.addRow(['', '', '', '', '', 'SỬA CHỮA MÁY', 'BẢO TRÌ MÁY', 'LẮP ĐẶT MÁY MỚI', 'PHIẾU GIAO DỊCH', '', '', '', '']);
                r3.height = 25; r4.height = 25;

                // Tiến hành gộp ô dọc và gộp ô ngang cho header tầng
                wsProv.mergeCells('A3:A4'); wsProv.mergeCells('B3:B4'); wsProv.mergeCells('C3:C4'); wsProv.mergeCells('D3:D4'); wsProv.mergeCells('E3:E4');
                wsProv.mergeCells('F3:I3');
                wsProv.mergeCells('J3:J4'); wsProv.mergeCells('K3:K4'); wsProv.mergeCells('L3:L4'); wsProv.mergeCells('M3:M4');

                // Style phủ màu nền cho Header tầng
                [r3, r4].forEach(row => {
                    row.eachCell({ includeEmpty: true }, cell => {
                        cell.font = { bold: true, size: 10, name: 'Arial' };
                        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB4C6E7' } };
                    });
                });

                const provGrandTotal = { suaChuaMay: 0, baoTriMay: 0, lapDatMayMoi: 0, phieuGiaoDich: 0, tongSoLuongMay: 0, tongSlKhachHang: 0, daThayLoc: 0 };

                // Đổ dữ liệu chi tiết của kỹ thuật viên thuộc tỉnh này
                rowsInProvince.forEach((item, index) => {
                    provGrandTotal.suaChuaMay += item.suaChuaMay;
                    provGrandTotal.baoTriMay += item.baoTriMay;
                    provGrandTotal.lapDatMayMoi += item.lapDatMayMoi;
                    provGrandTotal.phieuGiaoDich += item.phieuGiaoDich;
                    provGrandTotal.tongSoLuongMay += item.tongSoLuongMay;
                    provGrandTotal.tongSlKhachHang += item.tongSlKhachHang;
                    provGrandTotal.daThayLoc += item.daThayLoc;

                    // Phân tách chuỗi Nơi công tác chi tiết lẻ
                    let noiCongTacStr = '0';
                    if (item.allProvinces && item.allProvinces.length > 0) {
                        const counts = {};
                        item.allProvinces.forEach(p => {
                            if (p && p !== 'Thành phố Hà Nội' && p !== 'Thành phố Hồ Chí Minh') {
                                const cleanP = p.replace('Thành phố ', '').replace('Tỉnh ', '').toUpperCase();
                                counts[cleanP] = (counts[cleanP] || 0) + 1;
                            }
                        });
                        const entries = Object.entries(counts);
                        if (entries.length > 0) noiCongTacStr = entries.map(([prov, cnt]) => `${prov} (${cnt})`).join(', ');
                    }

                    // Xử lý cột Khách hàng lập lại & Ghi chú
                    let khachHangLapLaiStr = '';
                    let ghiChuStr = '';
                    if (item.allCustomers && item.allCustomers.length > 0) {
                        const custCounts = {};
                        item.allCustomers.forEach(c => { if (c.name) custCounts[c.name] = (custCounts[c.name] || 0) + 1; });

                        let idx = 1;
                        Object.entries(custCounts).forEach(([name, count]) => {
                            if (count > 1) {
                                khachHangLapLaiStr += `${idx}/ ${name} (${count} lần sửa chữa)\n`;
                                idx++;
                            } else {
                                ghiChuStr += `${name} (1), `;
                            }
                        });
                        if (ghiChuStr) ghiChuStr = ghiChuStr.slice(0, -2);
                    }

                    const r = wsProv.addRow([
                        index + 1, item.technicianName, item.congTacTinh || 0, noiCongTacStr, khachHangLapLaiStr.trim(),
                        item.suaChuaMay || 0, item.baoTriMay || 0, item.lapDatMayMoi || 0, item.phieuGiaoDich || 0,
                        item.tongSoLuongMay || 0, item.tongSlKhachHang || 0, item.daThayLoc || 0, ghiChuStr
                    ]);

                    r.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                    r.getCell(2).alignment = { vertical: 'middle', horizontal: 'left' };
                    r.getCell(4).alignment = { vertical: 'middle', horizontal: 'left' };
                    r.getCell(5).alignment = { vertical: 'middle', horizontal: 'left' };
                    r.getCell(13).alignment = { vertical: 'middle', horizontal: 'left' };
                });

                // Tạo dòng TỔNG SỐ LƯỢNG ở đáy bảng dữ liệu của sheet tỉnh
                const provTotalRow = wsProv.addRow([
                    'TỔNG SỐ LƯỢNG', '', '', '', '', provGrandTotal.suaChuaMay, provGrandTotal.baoTriMay,
                    provGrandTotal.lapDatMayMoi, provGrandTotal.phieuGiaoDich, provGrandTotal.tongSoLuongMay,
                    provGrandTotal.tongSlKhachHang, provGrandTotal.daThayLoc, ''
                ]);
                const provTotalRowNumber = provTotalRow.number;
                wsProv.mergeCells(`A${provTotalRowNumber}:E${provTotalRowNumber}`);

                provTotalRow.font = { bold: true, color: { argb: 'FFC00000' }, name: 'Arial', size: 10 };
                provTotalRow.alignment = { vertical: 'middle', horizontal: 'center' };

                // Đổ màu nền cho dòng tổng kết đồng bộ mẫu 2
                provTotalRow.eachCell({ includeEmpty: true }, cell => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB4C6E7' } };
                });

                // Kẻ khung viền lưới ô cho Sheet Tỉnh
                for (let r = 3; r <= provTotalRowNumber; r++) {
                    const row = wsProv.getRow(r);
                    for (let c = 1; c <= 13; c++) {
                        row.getCell(c).border = {
                            top: { style: 'thin', color: { argb: 'FFA6A6A6' } }, left: { style: 'thin', color: { argb: 'FFA6A6A6' } },
                            bottom: { style: 'thin', color: { argb: 'FFA6A6A6' } }, right: { style: 'thin', color: { argb: 'FFA6A6A6' } }
                        };
                    }
                }
                appendSignatureFooter(wsProv, toDate, 10, 13);
            });

            // 5. Kết xuất Workbook gửi trả Buffer dữ liệu file
            const buffer = await workbook.xlsx.writeBuffer();
            return buffer;

        } catch (error) {
            throw error;
        }
    }
}

module.exports = excelService
