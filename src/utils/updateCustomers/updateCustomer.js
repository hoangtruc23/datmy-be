const XLSX = require('xlsx')
const path = require('path')
const mongoose = require('mongoose')
require('../../config/mongodbConfig')
const GoodsIssueModel = require('../../models/goodsIssue')
const CustomerModel = require('../../models/customer')
function parseExcelDate(value) {
    if (!value) return null
    if (typeof value === 'number') {
        const date = XLSX.SSF.parse_date_code(value)
        return new Date(date.y, date.m - 1, date.d)
    }
    if (typeof value === 'string') {
        // Nếu là chuỗi, thử tách dd/mm/yyyy
        const [day, month, year] = value.split(/[\/\-]/)
        if (day && month && year)
            return new Date(Number(year), Number(month) - 1, Number(day))
    }
    return null
}
function formatCustomerData(item) {
    const taxCode = typeof item.taxCode === 'string' ? item.taxCode.trim() : ''

    return {
        code: item.code?.trim() || '',
        officialName: item.officialName?.trim() || '',
        billingAddress: item.billingAddress?.trim() || '',
        taxCode,
        phone: item.phone?.trim() || '',
        notes: item.note?.trim() || '',
        groupCustomers: item.groupCustomers?.trim() || '',
        CMND: item.CMND?.trim() || '',
        dateOfIssue: item.dateOfIssue ? parseExcelDate(item.dateOfIssue) : null,
        placeOfIssue: item.placeOfIssue?.trim() || '',
        representative: {
            name: item['Representative.name']?.trim() || '',
        },
        contactPersons: {
            debt:
                item['contactPersons.debt.name'] ||
                item['contactPersons.debt.phone'] ||
                item['contactPersons.debt.email']
                    ? [
                          {
                              name: String(
                                  item['contactPersons.debt.name'] || '',
                              ).trim(),
                              phone: String(
                                  item['contactPersons.debt.phone'] || '',
                              ).trim(),
                              email: String(
                                  item['contactPersons.debt.email'] || '',
                              ).trim(),
                          },
                      ]
                    : [],
        },
    }
}
async function findCustomerByCodeAndTax(session, codeValue, taxCode) {
    return await CustomerModel.findOne({
        $expr: {
            $and: [
                { $eq: [{ $toString: '$code' }, String(codeValue)] },
                { $eq: ['$taxCode', taxCode] },
            ],
        },
    }).session(session)
}
async function handleCustomerUpdate(existing, updateData, session) {
    const updateFields = {}

    for (const key in updateData) {
        if (['representative', 'contactPersons', 'notes'].includes(key))
            continue
        const value = updateData[key]
        if (value !== '' && value !== null && value !== undefined) {
            updateFields[key] = value
        }
    }
    if (updateData.notes) {
        const oldNote = existing.notes?.trim() || ''
        const newNote = updateData.notes.trim()
        updateFields.notes = oldNote ? `${oldNote}\n${newNote}` : newNote
    }
    if (updateData.representative?.name) {
        updateFields['representative.name'] =
            updateData.representative.name.trim()
    }
    if (updateData.contactPersons?.debt?.length) {
        updateFields['contactPersons.debt'] = updateData.contactPersons.debt
    }
    await CustomerModel.updateOne(
        { _id: existing._id },
        { $set: updateFields },
    ).session(session)
}
const updateCustomers = async () => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const filePath = path.resolve(__dirname, 'DS-KH-new.xlsx')
        const wb = XLSX.readFile(filePath)
        const ws = wb.Sheets[wb.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(ws)
        //  Đếm số lần xuất hiện của từng taxCode ---
        const taxCodeCount = {}
        for (const item of data) {
            const taxCode =
                typeof item.taxCode === 'string' ? item.taxCode.trim() : ''
            taxCodeCount[taxCode] = (taxCodeCount[taxCode] || 0) + 1
        }

        // Lấy danh sách taxCode trùng trong file Excel ---
        const duplicatedTaxCodes = Object.keys(taxCodeCount).filter(
            (code) => code && taxCodeCount[code] > 1,
        )
        //  Lấy ra những taxCode trùng mà đã tồn tại trong DB ---
        const existingDupCustomers = await CustomerModel.find({
            taxCode: { $in: duplicatedTaxCodes },
        }).select('taxCode')

        const existingDupTaxCodes = new Set(
            existingDupCustomers.map((c) => c.taxCode),
        )
        // ---Lọc dữ liệu hợp lệ để xử lý ---
        // Bao gồm:
        // - taxCode trống
        // - taxCode duy nhất
        const filteredData = data.filter((item) => {
            const taxCode =
                typeof item.taxCode === 'string' ? item.taxCode.trim() : ''
            if (taxCode === '0106701823') return false
            return taxCodeCount[taxCode] === 1 || taxCode === ''
        })
        const duplicatedNotInDB = data.filter((item) => {
            const taxCode =
                typeof item.taxCode === 'string' ? item.taxCode.trim() : ''
            return (
                taxCodeCount[taxCode] > 1 &&
                !existingDupTaxCodes.has(taxCode) &&
                taxCode !== ''
            )
        })
        const duplicatedInDB = data.filter((item) => {
            const taxCode =
                typeof item.taxCode === 'string' ? item.taxCode.trim() : ''
            return (
                taxCodeCount[taxCode] > 1 &&
                existingDupTaxCodes.has(taxCode) && // Đã tồn tại trong DB
                taxCode !== ''
            )
        })

        // // những taxCode trùng nhưng không tồn tại trong DB sẽ được tạo mới
        for (const item of duplicatedNotInDB) {
            const createData = formatCustomerData(item)
            await CustomerModel.create([createData], { session })
        }
        for (const item of filteredData) {
            const updateData = formatCustomerData(item)
            const taxCode = updateData.taxCode?.trim() || ''
            const officialName = updateData.officialName?.trim() || ''

            let existing = null

            if (taxCode) {
                existing = await CustomerModel.findOne({ taxCode }).session(
                    session,
                )
            } else if (officialName) {
                existing = await CustomerModel.findOne({
                    officialName,
                }).session(session)
                if (existing) {
                    // Ghi đè lại taxCode về chuỗi rỗng trong DB
                    existing.taxCode = ''
                }
            }

            if (existing) {
                // Update nếu taxCode duy nhất
                await handleCustomerUpdate(existing, updateData, session)
                if (existing.taxCode === '') {
                    await existing.save({ session })
                }
            } else {
                await CustomerModel.create([updateData], { session })
            }
        }

        //Vòng lặp xử lý các trường hợp đặc biệt
        for (const item of duplicatedInDB) {
            const updateData = formatCustomerData(item)
            const { taxCode, code } = updateData
            const cases = [
                { taxCode: '4300205943', code: 'DUONGQN', oldCode: '787' },
                { taxCode: '4300205943', code: 'DUONGQN1', oldCode: '205' },
                {
                    taxCode: '1600230014',
                    code: 'DVKTNN1-BINHKHANH',
                    oldCode: '272',
                },
                { taxCode: '0300588569', code: 'NGKVN1', oldCode: '484' },
                { taxCode: '0300588569', code: 'SUABOTVN', oldCode: '626' },
                { taxCode: '0300588569', code: 'SUAMEGA1', oldCode: '630' },
                {
                    taxCode: '0300588569',
                    code: 'SUATHONGNHAT1',
                    oldCode: '635',
                },
                {
                    taxCode: '0300588569',
                    code: 'SUATRUONGTHO1',
                    oldCode: '637',
                },
            ]

            //  Các trường hợp cần UPDATE theo oldCode
            const matchCase = cases.find(
                (c) => c.taxCode === taxCode && c.code === code,
            )
            if (matchCase) {
                const customer = await findCustomerByCodeAndTax(
                    session,
                    matchCase.oldCode,
                    matchCase.taxCode,
                )
                if (customer) {
                    await handleCustomerUpdate(customer, updateData, session)
                }
                continue
            }
            //  Các trường hợp cần CREATE mới
            const createCases = [
                { taxCode: '1600230014', code: 'DVKTNN1-BINHLONG' },
                { taxCode: '1600230014', code: 'DVKTNN1-MYAN' },
                { taxCode: '0300588569', code: 'NMSUASG1' },
                { taxCode: '0300588569', code: 'SUAVN' },
            ]
            const matchCreate = createCases.find(
                (c) => c.taxCode === taxCode && c.code === code,
            )
            if (matchCreate) {
                await CustomerModel.create([updateData], { session })
            }
        }
        //  Xử lý khách hàng đặc biệt 0106701823
        const specialItem = data.find(
            (item) =>
                typeof item.taxCode === 'string' &&
                item.taxCode.trim() === '0106701823',
        )
        if (specialItem) {
            const updateData = formatCustomerData(specialItem)
            const customer = await findCustomerByCodeAndTax(
                session,
                '190',
                '0106701823',
            )
            if (customer) {
                await handleCustomerUpdate(customer, updateData, session)
            }
        }
        await session.commitTransaction()
        console.log(' Update + Create hoàn tất thành công!')
    } catch (error) {
        await session.abortTransaction()
        console.error(' Transaction failed, rollback:', error)
    } finally {
        session.endSession()
    }
}
async function migrateCodeToString() {
    const customers = await CustomerModel.find({ code: { $type: 'number' } })
    for (const customer of customers) {
        customer.code = String(customer.code)
        await CustomerModel.updateOne(
            { _id: customer._id },
            { $set: { code: String(customer.code) } },
        )
    }
    console.log('Migrate code to string completed')
}

async function updateCustomerNamesInGoodsIssues() {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const goodsIssues = await GoodsIssueModel.find(
            { customerId: { $ne: null } },
            { _id: 1, customerId: 1 }
        ).session(session)
        let updatedCount = 0
        for (const issue of goodsIssues) {
            const customer = await CustomerModel.findById(issue.customerId)
                .select('officialName')
                .session(session)

            if (customer && customer.officialName) {
                await GoodsIssueModel.updateOne(
                    { _id: issue._id },
                    { $set: { customer: customer.officialName } },
                    { session }
                )
                updatedCount++
            }
        }
        await session.commitTransaction()
        session.endSession()
        console.log(` Cập nhật thành công ${updatedCount} phiếu xuất kho.`)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        console.error('Lỗi khi cập nhật:', error)
    } finally {
        mongoose.connection.close()
    }
}
async function main() {
    // node src/utils/updateCustomers/updateCustomer.js
    await updateCustomers()
    await migrateCodeToString() // cập nhật lại code sang dạng string
    await updateCustomerNamesInGoodsIssues() // Cập nhật lại tên khách hàng trong phiếu xuất kho
}
main()
