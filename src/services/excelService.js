const XLSX = require('xlsx');



const excelService = {
    createSalesDetailExcel: (data) => {
        try {
            const workbook = XLSX.utils.book_new();
            
            const sheetData = [
                ['SỔ CHI TIẾT BÁN HÀNG'],                             
                [`Từ ngày ${data.fromDate ? data.fromDate : ''} đến ngày ${data.toDate ? data.toDate : ''}`], 
                [data.customerName ? `Khách hàng: ${data.customerName}` : ''], 
                [],
                [ 
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
                ],
            ];

            (data.salesData || []).forEach(sale => {
                sheetData.push([
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

            const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

            worksheet['!merges'] = [
                { s: { c: 0, r: 0 }, e: { c: 12, r: 0 } },
                { s: { c: 0, r: 1 }, e: { c: 12, r: 1 } },
                { s: { c: 0, r: 2 }, e: { c: 12, r: 2 } },
                { s: { c: 0, r: 3 }, e: { c: 12, r: 3 } },
            ];

            worksheet['!ref'] = XLSX.utils.encode_range({
                s: { c: 0, r: 0 },
                e: { c: 12, r: sheetData.length - 1 }
            });



           
            // const headerStyle = {
            //     font: { bold: true },
            //     fill: { fgColor: { rgb: "D3D3D3" } }, 
            //     alignment: { horizontal: "center" }
            // };

            // const titleStyle = {
            //     font: { bold: true, size: 14 },
            //     alignment: { horizontal: "center" }
            // };

            // worksheet['A1'].s = titleStyle;
            // worksheet['A2'].s = { alignment: { horizontal: "center" } };
            // worksheet['A3'].s = { alignment: { horizontal: "center" } };

            // headers.forEach((_, index) => {
            //     const cellAddress = XLSX.utils.encode_cell({ c: index, r: 4 });
            //     if (worksheet[cellAddress]) {
            //         worksheet[cellAddress].s = headerStyle;
            //     }
            // });

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Chi tiết bán hàng');

            const excelBuffer = XLSX.write(workbook, { 
                bookType: 'xlsx', 
                type: 'buffer' 
            });

            return excelBuffer;

        } catch (error) {
            console.error('Lỗi khi tạo file Excel:', error);
            throw error;
        }
    },
}

module.exports = excelService
