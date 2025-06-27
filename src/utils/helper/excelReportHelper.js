// src/utils/helper/excelReportHelper.js
const ExcelJS = require('exceljs');

const generateGoodsReport = async (groupedData, config) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(config.worksheetName);

    // Define Styles
    const border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    const centerAlignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    const leftAlignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    const yellowFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE0' } };

    // Create Report Titles
    worksheet.getCell('A1').value = config.reportTitle;
    worksheet.getCell('A1').font = { name: 'Arial', size: 14, bold: true };
    worksheet.getCell('E1').value = `(Từ ${config.dateRange.startDate} đến ${config.dateRange.endDate})`;
    worksheet.getCell('E1').alignment = { horizontal: 'center' };
    worksheet.getCell('E1').font = { name: 'Arial', size: 12, bold: true };

    // Create Report Header
    const headerRow = worksheet.getRow(3);
    headerRow.values = config.headers;
    headerRow.eachCell(cell => {
        cell.border = border;
        cell.font = { name: 'Arial', size: 9, bold: true };
        cell.alignment = centerAlignment;
        cell.fill = yellowFill;
    });

    let grandTotal = 0;

    // Render Data Rows
    const sortedDates = Array.from(groupedData.keys()).sort((a, b) => new Date(b.split('/').reverse().join('-')) - new Date(a.split('/').reverse().join('-')));
    for (const dateKey of sortedDates) {
        const dayData = groupedData.get(dateKey);
        const sortedReceiptKeys = Array.from(dayData.receipts.keys()).sort((a, b) => a - b);

        for (const receiptKey of sortedReceiptKeys) {
            const receiptData = dayData.receipts.get(receiptKey);
            const startRow = worksheet.rowCount + 1;
            const numItems = receiptData.lineItems.length;

            receiptData.lineItems.forEach((item, index) => {
                const displayStatus = config.statusMap[item.status] || item.status;
                const rowData = config.columnKeys.map(key => {
                    if (key === 'status') return displayStatus;
                    return item[key];
                });

                if (index > 0) {
                    config.mergeableColumnKeys.forEach(key => {
                        const colIndex = config.columnKeys.indexOf(key);
                        if(colIndex !== -1) rowData[colIndex] = null;
                    });
                }
                
                const addedRow = worksheet.addRow(rowData);
                addedRow.font = { name: 'Arial', size: 10 };
                addedRow.alignment = { vertical: 'middle' };
                addedRow.getCell(1).alignment = leftAlignment;
                addedRow.getCell(2).alignment = leftAlignment;
                addedRow.getCell(10).font = { name: 'Arial', size: 9, bold: true};
                addedRow.getCell(10).alignment = centerAlignment;
            });

            if (numItems > 1) {
                config.mergeableColumnKeys.forEach(key => {
                    const colLetter = String.fromCharCode(65 + config.columnKeys.indexOf(key));
                    worksheet.mergeCells(`${colLetter}${startRow}:${colLetter}${startRow + numItems - 1}`);
                });
            }
            
            for (let i = startRow; i <= worksheet.rowCount; i++) {
                worksheet.getRow(i).eachCell({ includeEmpty: true }, (cell) => { cell.border = border; });
                worksheet.getCell(`J${i}`).fill = yellowFill;
            }
        }

        // Render Daily Subtotal Row
        const dailyTotalRow = worksheet.addRow([null, null, null, null, null, null, null, null, null, dayData.dailyTotal]);
        worksheet.mergeCells(`A${dailyTotalRow.number}:I${dailyTotalRow.number}`);
        const subtotalTextCell = worksheet.getCell(`A${dailyTotalRow.number}`);
        subtotalTextCell.value = `${config.summaryRowText} ${dateKey}`;
        subtotalTextCell.font = { name: 'Arial', size: 9, bold: true };
        subtotalTextCell.alignment = centerAlignment;
        dailyTotalRow.getCell('J').font = { name: 'Arial', size: 9, bold: true };
        dailyTotalRow.getCell('J').alignment = centerAlignment;
        for (let col = 1; col <= 10; col++) {
            const cell = dailyTotalRow.getCell(col);
            cell.fill = yellowFill;
            cell.border = border;
        }
        grandTotal += dayData.dailyTotal;
    }

    // Render Grand Total Row
    const grandTotalRow = worksheet.addRow([null, null, null, null, null, null, null, null, null, grandTotal]);
    worksheet.mergeCells(`A${grandTotalRow.number}:I${grandTotalRow.number}`);
    const grandTotalTextCell = worksheet.getCell(`A${grandTotalRow.number}`);
    grandTotalTextCell.value = config.grandTotalText;
    grandTotalTextCell.font = { name: 'Arial', size: 9, bold: true };
    grandTotalTextCell.alignment = centerAlignment;
    grandTotalRow.getCell('J').font = { name: 'Arial', size: 9, bold: true };
    grandTotalRow.getCell('J').alignment = centerAlignment;
    for (let col = 1; col <= 10; col++) {
        const cell = grandTotalRow.getCell(col);
        cell.fill = yellowFill;
        cell.border = border;
    }

    // Apply Final Column Formatting
    worksheet.columns = config.columnConfigs;
    return await workbook.xlsx.writeBuffer();
};

module.exports = { generateGoodsReport };