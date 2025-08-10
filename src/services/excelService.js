const ExcelJS = require('exceljs');

const excelService = {
  createSalesDetailExcel: async (data) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Chi tiết bán hàng');

      worksheet.mergeCells('A1:M1');
      worksheet.mergeCells('A2:M2');
      worksheet.mergeCells('A3:M3');
      worksheet.mergeCells('A4:M4');

      worksheet.getCell('A1').value = 'SỔ CHI TIẾT BÁN HÀNG';
      worksheet.getCell('A2').value = `Từ ngày ${data.fromDate || ''} đến ngày ${data.toDate || ''}`;
      worksheet.getCell('A3').value = data.customerName ? `Khách hàng: ${data.customerName}` : '';
      worksheet.getCell('A4').value = '';

      ['A1', 'A2', 'A3'].forEach(cell => {
        worksheet.getCell(cell).alignment = { horizontal: 'center' };
        worksheet.getCell(cell).font = { bold: true, size: 14 };
      });

      const headers = [
        'Tên khách hàng',
        'Số hóa đơn',
        'Ngày hóa đơn',
        'Mã số thuế',
        'Mã hàng',
        'Tên hàng',
        'ĐVT',
        'Số lượng bán',
        'Đơn giá',
        'Giảm giá',
        'Doanh số bán',
        'Thuế GTGT',
        'Tổng thanh toán',
        'Địa chỉ',
      ];
      worksheet.addRow(headers);

      const headerRow = worksheet.getRow(5);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
      headerRow.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D3D3D3' }
        };
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

       (data.salesData || []).forEach(sale => {
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
          sale.discount || 0,
          sale.totalAmount || 0,
          sale.vatAmount || 0,
          sale.totalPayment || 0,
          sale.address || ''
        ]);
        dataRow.height = 50; 
        dataRow.eachCell(cell => {
          cell.alignment = { 
            vertical: 'middle',
            horizontal: 'left',
            wrapText: true 
          };
        });
      });
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
        '',
        data.summary.totalSalesAmount || 0,
        data.summary.totalVatAmount || 0,
        data.summary.totalPaymentAmount || 0,
        '',
      ]);
      summaryRow.font = { bold: true };
      summaryRow.alignment = { 
        horizontal: 'right', vertical: 'middle' 
      };
      summaryRow.eachCell((cell, colNumber )=> {
        if (colNumber === 1) {
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
          }
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D3D3D3' }
        };
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
      // worksheet.addRow([]);
      // worksheet.addRow([]);

      worksheet.columns.forEach((column, index) => {
        let maxLength = 6;

        for (let rowIndex = 4; rowIndex < worksheet.rowCount; rowIndex++) {
          const cell = worksheet.getRow(rowIndex + 1).getCell(index + 1); 
          const text = cell.value ? cell.value.toString() : '';
          const length = text.length;
          if (length > maxLength) maxLength = length;
        }

        const suggested = maxLength + 6;
        column.width = Math.min(suggested, 40);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;

    } catch (error) {
      console.error('Lỗi khi tạo Excel:', error);
      throw error;
    }
  }
};

module.exports = excelService;
