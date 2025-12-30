const ExcelJS = require('exceljs')
const { Types, mongoose } = require('mongoose')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode.js')
const CustomerModel = require('../models/customer.js')
const PreviousDebtModel = require('../models/previousDebt.js')
const { logger } = require('../config/loggerConfig.js')


const previousDebtService = {
    importFile: async (data) => {
        const { preMonth, file } = data

        const session = await mongoose.startSession()
        await session.startTransaction()

        try {
            const workbook = new ExcelJS.Workbook()
            await workbook.xlsx.load(file, { type: 'buffer' })
            const worksheet = workbook.worksheets[0]

            if (!worksheet) throw new BadReq(errorCode.WORKSHEET_NOT_FOUND)

            // --- Thu thập dữ liệu từ Excel ---
            const excelData = [];
            const allCodes = new Set();

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber <= 3) return;

                const values = row.values;
                let code = values[3]; // Cột thứ 3 (Cột C)
                const nameOffice = values[4];
                const debit = values[5];
                const credit = values[6];

                if (code) {
                    code = String(code).trim();
                    if (code == "Tổng") {
                        return;
                    }
                    excelData.push({ code, nameOffice, debit, credit });
                    allCodes.add(code); // Lưu mã code để tìm kiếm 1 lần
                }
            });

            const customers = await CustomerModel.find({
                code: { $in: Array.from(allCodes) }
            }).select({ _id: 1, code: 1 })
            const customerMap = new Map(customers.map(c => [c.code, c._id]));

            const finalRows = [];
            const failures = [];
            for (const item of excelData) {
                const customerId = customerMap.get(item.code);

                if (!customerId) {
                    // logger.error(`Không tìm được khách hàng: ${item.code} - ${item.nameOffice}`);

                    failures.push({
                        code: item.code,
                        nameOffice: item.nameOffice,
                        debit: item.debit,
                        credit: item.credit
                    });

                    continue;
                }

                finalRows.push({
                    customerId,
                    previousDebitBalance: Number(item.debit) || 0,
                    previousCreditBalance: Number(item.credit) || 0,
                    preMonth
                });
            }

            if (failures.length > 0) {
                // logger.error(failures)
                const errorWorkbook = new ExcelJS.Workbook();
                const sheet = errorWorkbook.addWorksheet('Lỗi Import');

                // Tạo tiêu đề cột
                sheet.columns = [
                    { header: 'Mã Khách Hàng', key: 'code', width: 20 },
                    { header: 'Tên Văn Phòng', key: 'nameOffice', width: 30 },
                    { header: 'Dư nợ', key: 'debit', width: 40 },
                    { header: 'Dư có', key: 'credit', width: 40 }
                ];

                // Thêm các dòng lỗi
                sheet.addRows(failures);

                // // Lưu file
                const fileName = `Error_Report_${Date.now()}.xlsx`;
                await errorWorkbook.xlsx.writeFile(fileName);

                const buffer = await errorWorkbook.xlsx.writeBuffer();

                logger.error(`Import thất bại. Đã xuất file lỗi: ${fileName}`);
                return {
                    success: false,
                    errorFile: buffer,
                }
            }

            if (finalRows.length > 0) {
                await PreviousDebtModel.insertMany(finalRows, { session, ordered: false })
            }

            await session.commitTransaction()
            session.endSession()

            return {
                success: true,
                totalRows: finalRows.length,
            }
        } catch (err) {
            try {
                await session.abortTransaction()
            } catch (e) {
                // ignore
            }
            session.endSession()
            throw err
        }
    }
}

module.exports = previousDebtService