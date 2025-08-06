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
        worksheet.addRow([
          sale.customerName || '',
          sale.invoiceNumber || '',
          sale.invoiceDate || '',
          sale.taxCode || '',
          sale.productCode || '',
          sale.productName || '',
          sale.unit || '',
          sale.quantity || 0,
          sale.unitPrice || 0,
          sale.totalAmount || 0,
          sale.vatAmount || 0,
          sale.totalPayment || 0,
          sale.address || ''
        ]);
      });

      worksheet.columns.forEach(column => {
        let maxLength = 10;
        column.eachCell({ includeEmpty: true }, cell => {
          const text = cell.value ? cell.value.toString() : '';
          if (text.length > maxLength) maxLength = text.length;
        });
        column.width = maxLength + 2;
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
