const ExcelJS = require('exceljs')
const moment = require('moment');
const { formatDate } = require('../utils/helper/excelReportHelper')
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

            // 1. Xử lý khoảng thời gian (Nếu không truyền mặc định lấy trong tháng này)
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

            // 2. Chạy Aggregation Pipeline gom dữ liệu báo cáo kỹ thuật
            const report = await WorkOrderModel.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: '$technicianId',
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
                                            { $ne: ['$address.provinceCity', 'Hà Nội'] }
                                        ]
                                    },
                                    1, 0
                                ]
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'technicians', // Tên collection kỹ thuật viên trong DB
                        localField: '_id',
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
                        _id: 1,
                        technicianName: { $ifNull: ['$technicianInfo.fullname', 'Không rõ tên'] }, // Map theo trường fullname giống code mẫu của bạn
                        suaChuaMay: 1,
                        baoTriMay: 1,
                        lapDatMayMoi: 1,
                        phieuGiaoDich: 1,
                        tongSoLuongMay: 1,
                        tongSlKhachHang: { $size: '$khachHangList' },
                        daThayLoc: 1,
                        congTacTinh: 1
                    }
                },
                { $sort: { technicianName: 1 } }
            ]);

            // 3. Tính toán dòng Grand Total (Tổng cộng cuối bảng)
            const grandTotal = report.reduce((acc, curr) => {
                acc.suaChuaMay += curr.suaChuaMay;
                acc.baoTriMay += curr.baoTriMay;
                acc.lapDatMayMoi += curr.lapDatMayMoi;
                acc.phieuGiaoDich += curr.phieuGiaoDich;
                acc.tongSoLuongMay += curr.tongSoLuongMay;
                acc.tongSlKhachHang += curr.tongSlKhachHang;
                acc.daThayLoc += curr.daThayLoc;
                acc.congTacTinh += curr.congTacTinh;
                return acc;
            }, {
                technicianName: "Grand Total",
                suaChuaMay: 0,
                baoTriMay: 0,
                lapDatMayMoi: 0,
                phieuGiaoDich: 0,
                tongSoLuongMay: 0,
                tongSlKhachHang: 0,
                daThayLoc: 0,
                congTacTinh: 0
            });

            // 4. Khởi tạo Workbook & vẽ Layout bảng tính ExcelJS
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Báo công tác phòng kỹ thuật');
            worksheet.views = [{ showGridLines: true }];

            // Định nghĩa cột tương ứng cấu trúc file Excel mẫu đầu tiên
            worksheet.columns = [
                { header: 'KỸ THUẬT VIÊN', key: 'technicianName', width: 30 },
                { header: 'SỬA CHỮA MÁY', key: 'suaChuaMay', width: 18 },
                { header: 'BẢO TRÌ MÁY', key: 'baoTriMay', width: 18 },
                { header: 'LẮP ĐẶT MÁY MỚI', key: 'lapDatMayMoi', width: 20 },
                { header: 'PHIẾU GIAO DỊCH', key: 'phieuGiaoDich', width: 20 },
                { header: 'TỔNG SỐ LƯỢNG MÁY', key: 'tongSoLuongMay', width: 22 },
                { header: 'TỔNG SL KHÁCH HÀNG', key: 'tongSlKhachHang', width: 22 },
                { header: 'ĐÃ THAY LỌC 14831', key: 'daThayLoc', width: 20 },
                { header: 'CÔNG TÁC TỈNH', key: 'congTacTinh', width: 18 }
            ];

            // --- Style tiêu đề Header (Dòng 1) ---
            const headerRow = worksheet.getRow(1);

            headerRow.font = { bold: true, size: 11, name: 'Times New Roman' };
            headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            headerRow.height = 30;

            // Đổ màu nền nhạt cho các cột nghiệp vụ (Tùy chọn cho giống màu xanh/đỏ nhẹ của Excel)
            // Màu đỏ nhạt cho các cột loại công việc (Cột 2, 3, 4, 5)
            for (let i = 2; i <= 5; i++) {
                headerRow.getCell(i).font = { bold: true, color: { argb: 'FFC00000' } }; // Chữ đỏ
            }

            // 5. Đổ dữ liệu chi tiết của từng Kỹ thuật viên
            report.forEach((item) => {
                const row = worksheet.addRow({
                    technicianName: item.technicianName,
                    suaChuaMay: item.suaChuaMay || '',
                    baoTriMay: item.baoTriMay || '',
                    lapDatMayMoi: item.lapDatMayMoi || '',
                    phieuGiaoDich: item.phieuGiaoDich || '',
                    tongSoLuongMay: item.tongSoLuongMay || 0,
                    tongSlKhachHang: item.tongSlKhachHang || 0,
                    daThayLoc: item.daThayLoc || '',
                    congTacTinh: item.congTacTinh || ''
                });
                row.alignment = { vertical: 'middle', horizontal: 'center' };
                row.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' }; // Tên KTV căn trái
            });

            // 6. Thêm dòng Tổng cộng (Grand Total) xuống cuối bảng
            const grandTotalRow = worksheet.addRow({
                technicianName: grandTotal.technicianName,
                suaChuaMay: grandTotal.suaChuaMay,
                baoTriMay: grandTotal.baoTriMay,
                lapDatMayMoi: grandTotal.lapDatMayMoi,
                phieuGiaoDich: grandTotal.phieuGiaoDich,
                tongSoLuongMay: grandTotal.tongSoLuongMay,
                tongSlKhachHang: grandTotal.tongSlKhachHang,
                daThayLoc: grandTotal.daThayLoc,
                congTacTinh: grandTotal.congTacTinh
            });

            // Style dòng Grand Total: Chữ đỏ đậm như bản gốc Excel
            grandTotalRow.font = { bold: true, color: { argb: 'FFC00000' }, name: 'Arial' };
            grandTotalRow.alignment = { vertical: 'middle', horizontal: 'center' };
            grandTotalRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'right' }; // Chữ "Grand Total" đẩy sang phải

            // Thêm viền (Borders) cho toàn bộ các ô để hiển thị lưới rõ ràng
            worksheet.eachRow((row) => {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFA6A6A6' } },
                        left: { style: 'thin', color: { argb: 'FFA6A6A6' } },
                        bottom: { style: 'thin', color: { argb: 'FFA6A6A6' } },
                        right: { style: 'thin', color: { argb: 'FFA6A6A6' } }
                    };
                });
            });

            const targetDate = toDate ? new Date(toDate) : new Date();
            const dateString = `Ngày ${moment(targetDate).format('DD')} tháng ${moment(targetDate).format('MM')} năm ${moment(targetDate).format('YYYY')}`;
            const dateRow = worksheet.addRow([]);
            dateRow.getCell(9).value = dateString;

            const dateRowNumber = dateRow.number;
            worksheet.mergeCells(`I${dateRowNumber}:K${dateRowNumber}`);
            dateRow.getCell(9).font = { italic: true, name: 'Arial', size: 10, bold: true };
            dateRow.getCell(9).alignment = { horizontal: 'right', vertical: 'middle' };
            dateRow.height = 22;

            // Thêm dòng các chức danh ký tên
            const signatureRow = worksheet.addRow([]);
            const sigRowNumber = signatureRow.number;

            // Chia và gộp đều 3 block chức danh chữ ký theo bề ngang
            worksheet.mergeCells(`A${sigRowNumber}:C${sigRowNumber}`);
            worksheet.mergeCells(`E${sigRowNumber}:G${sigRowNumber}`);
            worksheet.mergeCells(`I${sigRowNumber}:K${sigRowNumber}`);

            signatureRow.getCell(1).value = 'NGƯỜI LẬP PHIẾU';
            signatureRow.getCell(5).value = 'GIÁM ĐỐC KỸ THUẬT';
            signatureRow.getCell(9).value = 'TỔNG GIÁM ĐỐC';

            signatureRow.height = 25;
            signatureRow.font = { bold: true, name: 'Arial', size: 10 };
            signatureRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
            signatureRow.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' };
            signatureRow.getCell(9).alignment = { horizontal: 'center', vertical: 'middle' };

            // Tạo khoảng cách 4 hàng trống ở dưới cùng để chừa không gian ký tên thực tế
            for (let i = 0; i < 4; i++) {
                worksheet.addRow([]);
            }

            // 7. Xuất Workbook ra định dạng Buffer trả về cho hệ thống
            const buffer = await workbook.xlsx.writeBuffer();
            return buffer;

        } catch (error) {
            throw error;
        }
    }
}

module.exports = excelService
