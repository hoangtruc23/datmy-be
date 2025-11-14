const { Types } = require('mongoose')
const { logger } = require('../config/loggerConfig')
const WorkOrderBusinessModel = require('../models/workOrderBusiness')

async function workOrderBusinessSeeder() {
    await WorkOrderBusinessModel.deleteMany({})
    await WorkOrderBusinessModel.insertMany([
        {
            _id: new Types.ObjectId(),
            repairFault: [
                {
                    fault: 'Print go while printing',
                    resolution:
                        'Kiểm tra tín hiệu sensor, kiểm tra thời gian in cần thiết và thời gian cho phép giữa 2 lần in',
                },
                {
                    fault: 'Print go while DPS data not ready',
                    resolution: 'Đảm bảo máy sẵn sàng khi bắt đầu in',
                },
                {
                    fault: 'Print start signal ignored',
                    resolution:
                        'Tín hiệu nhận vào khi chưa in xong, kiểm tra thời vị trí cảm biến cho phù hợp',
                },
                {
                    fault: 'Scanhead power missing',
                    resolution: 'Kiểm tra bộ nguồn vàng không có +/-15v',
                },
                {
                    fault: 'Controll uninit over temperature',
                    resolution:
                        'Kiểm tra phần thông gió quạt và lọc bụi controller có bị nghẹt không',
                },
                {
                    fault: 'Laser cooling defective',
                    resolution:
                        'Kiểm tra tất cả quạt hoặc nước làm mát bình thường không, trường hợp máy nước',
                },
                {
                    fault: 'Air fault',
                    resolution:
                        'Kiểm tra lọc bộ chỉnh hơi và áp suất khí nén đang cài đặt',
                },
                {
                    fault: 'Vacuum fault',
                    resolution: 'Kiểm tra đảm bảo DPX đang hoạt động',
                },
                {
                    fault: 'Laser defective or over temperature',
                    resolution:
                        'Kiểm tra hệ thống làm mát (quạt hoặc khí nén, nước làm mát) và cáp kết nối',
                },
                {
                    fault: 'Laser DC power missing',
                    resolution:
                        'Kiểm tra nguồn laser, ít nhất có 1 điện trở đầu laser sáng khi mở in laser',
                },
                {
                    fault: 'Laser cooling fault',
                    resolution:
                        'Kiểm tra tất cả quạt hoặc giải nhiệt để đảm bảo có vào laser',
                },
                {
                    fault: 'Safy relay fault',
                    resolution: 'Mở cả 2 công tắc để reset',
                },
                {
                    fault: 'Encoder too fast',
                    resolution:
                        'Đảm bảo tốc độ encoder không được phép nhanh hơn tốc độ max của bản in',
                },
                {
                    fault: 'Không có nội dung được in ra',
                    resolution:
                        'Kiểm tra nội dung in, thông số in, đầu in có được căn chỉnh đúng vị trí',
                },
                {
                    fault: 'Chất lượng in giảm',
                    resolution:
                        'Vệ sinh đầu in, con lăn, trục captian rulo, tăm để cao su',
                },
                {
                    fault: 'Bản in bị mất một bên',
                    resolution:
                        'Kiểm tra máy in có thẳng hàng với con lăn và tấm đệm cao su',
                },
                {
                    fault: 'Ruy băng bị nhăn',
                    resolution:
                        'Kiểm tra các con lăn nhựa, trục captian có mòn không',
                },
                {
                    fault: 'Mất nét cạnh trước nhãn',
                    resolution: 'Thông số HA đầu in quá ngắn',
                },
                {
                    fault: 'Thiếu cạnh sau của nhãn',
                    resolution:
                        'Thông số Năng đầu in quá dài, giảm thời gian nâng đầu in',
                },
                {
                    fault: 'Mất nét giữa nhãn',
                    resolution: 'Vệ sinh đầu in',
                },
                {
                    fault: 'Thỉnh thoảng bị mất in và máy có tiếng kêu',
                    resolution:
                        'Kiểm tra áp lực đầu in quá cao, giảm áp lực đầu in',
                },
                {
                    fault: 'Lỗi bóng mờ/nhòe ở phần đầu của nhãn',
                    resolution:
                        'Thời gian HA đầu in quá dài, giảm thời gian này trong Tham số in cho đến khi tốt',
                },
                {
                    fault: 'Lỗi bóng mờ/nhòe ở phần cuối của nhãn',
                    resolution:
                        'Thời gian nâng đầu in quá ngắn, tăng thời gian nâng đầu in trong tham số in',
                },
                {
                    fault: 'Lỗi đứt ruy băng',
                    resolution:
                        'Kiểm tra nếu kích hoạt chế độ tiết kiệm ruy băng, hãy giảm áp lực đầu in',
                },
                {
                    fault: 'Nhãn quá dài',
                    resolution:
                        'Kiểm tra tổng chiều dài nhãn (Y-offset + nhãn) đảm bảo đầu in dịch chuyển đúng',
                },
                {
                    fault: 'Tốc độ quá chậm',
                    resolution: 'Điều chỉnh cài đặt tốc độ in tới thích hợp',
                },
                {
                    fault: 'Y-offset quá ngắn',
                    resolution:
                        'Độ lệch Y quá ngắn một phần của nhãn có thể bị bỏ in, tăng Y-offset hoặc chiều dài nhãn',
                },
                {
                    fault: 'Cảnh báo ruy băng',
                    resolution: 'Kiểm tra cuộn ruy băng còn không',
                },
                {
                    fault: 'Có tín hiệu in khi chưa sẵn sàng',
                    resolution: 'Kiểm tra tín hiệu sensor',
                },
                {
                    fault: 'IM position error',
                    resolution:
                        'Kiểm tra thanh trượt cơ cấu giữ đầu in, đảm bảo bộ phận giữ không bị cấn',
                },
                {
                    fault: 'Calibration Failed',
                    resolution: 'Kiểm tra đường dẫn ruy băng',
                },
                {
                    fault: 'Head Position error',
                    resolution:
                        'Đảm bảo khoảng cách chính xác 0.2–0.2mm giữa đầu in và lô cao su (CM)',
                },
                {
                    fault: 'No active serial variables named',
                    resolution:
                        'Một thiết bị bên ngoài cố gắng truy cập một biến tuần tự không tồn tại. Kiểm tra lại biến.',
                },
                {
                    fault: 'Error Reading Design',
                    resolution:
                        'Không thể tải nhãn do nhãn bị lỗi, kiểm tra lại nhãn',
                },
                {
                    fault: 'Pooring print quality',
                    resolution: 'Kiểm tra vệ sinh đầu in, platen roller',
                },
                {
                    fault: 'Label out',
                    resolution: 'Kiểm tra cuộn nhãn',
                },
                {
                    fault: 'No Ribbon',
                    resolution: 'Kiểm tra cuộn ruy băng',
                },
                {
                    fault: 'Printhead up',
                    resolution: 'Kiểm tra gạt đầu in ép vào nhãn',
                },
                {
                    fault: 'Printhead overheated',
                    resolution: 'Kiểm tra cáp kết nối đầu in',
                },
                {
                    fault: 'No air pressure',
                    resolution: 'Kiểm tra vệ sinh lọc nguồn khí nén',
                },
                {
                    fault: 'Applicator error',
                    resolution: 'Kiểm tra đảm bảo đã bật khí nén',
                },
                {
                    fault: 'Lable check',
                    resolution: 'Kiểm tra vệ sinh platen roller',
                },
                {
                    fault: 'Peel roller down',
                    resolution:
                        'Kiểm tra đảm bảo peel roller đã được cài trước khi sản xuất',
                },
                {
                    fault: 'Cover off',
                    resolution: 'Kiểm tra nắp máy in đã được cài chưa',
                },
                {
                    fault: 'Cylinder out',
                    resolution: 'Kiểm tra đảm bảo đã bật khí nén',
                },
                {
                    fault: 'No power to printer',
                    resolution:
                        'Kiểm tra giắc cắm từ máy in vào Mother board trong controller',
                },
                {
                    fault: 'Tag Not Writable',
                    resolution: 'Kiểm tra đảm bảo đầu ghi RFID đã được kết nối',
                },
                {
                    fault: 'Door open',
                    resolution:
                        'Kiểm tra đảm bảo các cửa đã được đóng trước khi vận hành máy',
                },
                {
                    fault: 'Maximum speed exceeded',
                    resolution:
                        'Máy in quá tốc độ, điều chỉnh lại tốc độ bằng tải phù hợp với độ phân giải',
                },
                {
                    fault: 'Printhead not support',
                    resolution: 'Thay đầu in mới',
                },
                {
                    fault: 'Printhead cartridge not support',
                    resolution: 'Kiểm tra lại chân đọc chip đầu in',
                },
                {
                    fault: 'Printhead /n interface error',
                    resolution: 'Kiểm tra đảm bảo bút phun có chip',
                },
                {
                    fault: 'Input for start print not configured',
                    resolution:
                        'Kiểm tra cài đặt Input, gửi tín hiệu in đầu in đã được cấu hình tín hiệu in',
                },
                {
                    fault: 'Faulty group number',
                    resolution:
                        'Kiểm tra số lượng đầu in trong cài đặt đúng với số lượng đầu đang cắm trong máy in',
                },
                {
                    fault: 'Too much trigger output',
                    resolution: 'Kiểm tra cài đặt output trong Cài đặt nhóm',
                },
                {
                    fault: 'Power supply error printhead',
                    resolution: 'Kiểm tra cáp kết nối đầu in',
                },
                {
                    fault: 'Faulty start position of element',
                    resolution:
                        'Kiểm tra cài đặt thành phần trong nhãn rồi gửi in lại',
                },
                {
                    fault: 'True type font error',
                    resolution:
                        'Kiểm tra lại cài đặt font trong nhãn, khởi động lại máy in',
                },
                {
                    fault: 'Check config file, groups number locked',
                    resolution:
                        'Kiểm tra số lượng đầu in đang cài nhiều hơn số lượng đối máy cho phép',
                },
                {
                    fault: 'Error in bmp file format',
                    resolution:
                        'Lỗi file logo trong nhãn, thay thế file bmp đúng chuẩn rồi gửi in lại',
                },
                {
                    fault: 'Modify print label; not enough memory',
                    resolution:
                        'Không thể gửi in nhãn do dữ liệu quá lớn, giảm số lượng thành phần trong nhãn và gửi lại',
                },
            ],
            repairAFault: {
                printHeaderFault: [
                    'Ống thu hồi không có mực',
                    'Xung điện giọt mực có lỗi',
                    'In xấu, mất nét',
                    'Rớt bản cực',
                    'Lỗi van béc phun',
                    'Dơ béc phun',
                    'Ron 06035 biến dạng',
                    'Thu hồi yếu',
                    'Hỏng bộ ốc chỉnh tia mực',
                ],
                inkSystemFault: [
                    'Cháy mực hệ thống',
                    'Nút nắp mực',
                    'Nút nắp dung môi',
                    'Đến hạn thay lọc 14831',
                    'Đến hạn thay lọc 29265',
                    'Đến hạn thay lọc 29273',
                    'Đến hạn thay lọc 37940',
                    'Đến hạn thay ống PE',
                    'Đến hạn thay đầu nối xanh',
                    'Lỗi bơm áp suất',
                    'Lỗi cảm ứng áp suất',
                    'Lỗi bơm thu hồi',
                    'Lỗi cảm ứng áp suất chân không',
                    'Ron van 04150 bị biến dạng, đến hạn thay',
                    'Hỏng van điện từ',
                    'Hỏng thân van',
                    'Ống đo nồng độ có lỗi',
                    'Đến hạn thay ITM',
                    'Đến hạn thay ron ITM',
                    'Hỏng bình chứa dung môi (MUM)',
                    'Đến hạn thay ron bình chứa dung môi',
                    'Hao dung môi',
                    'Máy In dừng lâu',
                ],
                electricalSystemFault: [
                    'Quạt không hoạt động',
                    'Lỗi board chính',
                    'Lỗi board nguồn',
                    'Lỗi board cao áp',
                    'Lỗi board inkSystem',
                    'Lỗi board màn hình',
                    'Lỗi bàn phím',
                    'Lỗi màn hình',
                    'Hỏng cáp inkSystem',
                    'Lỗi thẻ nhớ phần mềm',
                ],
                resolution: [
                    'Rung vệ sinh béc phun',
                    'Vệ sinh xung điện',
                    'Vệ sinh bản cực',
                    'Chỉnh lại tia mực',
                    'Thay van béc phun',
                    'Thay béc phun',
                    'Thay xung điện',
                    'Thay bản cực',
                    'Thay bộ ốc chỉnh tia',
                    'Thay ống PE',
                    'Thay đầu nối xanh',
                    'Thay nắp mực',
                    'Thay nắp dung môi',
                    'Thay lọc 14831',
                    'Thay lọc 29265',
                    'Thay lọc 29273',
                    'Thay lọc 37940',
                    'Vệ sinh hệ thống mực',
                    'Thay bơm áp suất',
                    'Thay cảm ứng áp suất',
                    'Thay Bơm thu hồi',
                    'Thay cảm ứng áp suất chân không',
                    'Thay ron van 04150',
                    'Thay van điện tử',
                    'Thay thân van',
                    'Vệ sinh ống đo nồng độ',
                    'Thay ITM',
                    'Thay ron ITM',
                    'Thay bình chứa dung môi',
                    'Thay ron bình chứa dung môi',
                ],
            },
            maintainOperations: [
                {
                    operationName: 'Kiểm tra công suất nguồn Laser tuýp',
                    valueName: 'Công suất',
                },
                {
                    operationName: 'Kiểm tra quạt và lưới lọc gió',
                },
                {
                    operationName: 'Vệ sinh thấu kính',
                },
                {
                    operationName: 'Kiểm tra tình trạng kính bộ lái tia',
                },
                {
                    operationName: 'Vệ sinh bo chính',
                },
                {
                    operationName: 'Vệ sinh bo CLI',
                },
                {
                    operationName: 'Kiểm tra bộ lọc máy hút',
                },
                {
                    operationName: 'Vệ Sinh vỏ ngoài máy',
                },
                {
                    operationName: 'Vệ sinh lưới lọc gió',
                },
                {
                    operationName: 'Vệ sinh Board điện',
                },
                {
                    operationName: 'Vệ sinh hệ thống mực',
                },
                {
                    operationName: 'Vệ sinh bình chứa dung môi',
                },
                {
                    operationName: 'Vệ sinh đầu in',
                },
                {
                    operationName: 'Điện Nguồn',
                },
                {
                    operationName: 'Dây tiếp mass',
                },
                {
                    operationName: 'Kiểm tra khí nén đầu vào (4-6bar)',
                },
                {
                    operationName: 'Kiểm tra tình trạng đầu in',
                },
                {
                    operationName: 'Kiểm tra tình trạng patten roller',
                },
                {
                    operationName: 'Kiểm tra label sensor',
                },
                {
                    operationName: 'Kiểm tra lò xo hãm cuộn xả nhãn',
                },
                {
                    operationName: 'Kiểm tra cuộn xả ruy băng',
                },
                {
                    operationName: 'Kiểm tra ru lô cao su thu ruy băng',
                },
                {
                    operationName: 'Kiểm tra khoảng cách tay dán đến tách',
                    valueName: 'Khoảng cách',
                },
                {
                    operationName: 'Kiểm tra lọc giảm thanh xả khí bơm chân',
                },
                {
                    operationName: 'Kiểm tra vệ sinh tay dán',
                },
                {
                    operationName: 'Kiểm tra vệ sinh tay dán',
                },
                {
                    operationName: 'Kiểm tra vệ sinh thanh thổi nhãn',
                },
                {
                    operationName: 'Kiểm tra vệ sinh đầu đọc barcode',
                },
                {
                    operationName: 'Vệ sinh quạt thông gió controller',
                },
                {
                    operationName: 'Kiểm tra cover sensor',
                },
                {
                    operationName: 'Kiểm tra máy in có lệch so với trục lỗ khỉ',
                },
                {
                    operationName: 'Kiểm tra encoder khi chạy CM mode',
                },
                {
                    operationName: 'Hiệu chỉnh lại đầu in',
                },
                {
                    operationName: 'Kiểm tra tình trạng đầu in',
                },
                {
                    operationName: 'Kiểm tra tình trạng capstan roller',
                },
                {
                    operationName: 'Kiểm tra tình trạng các lỗ nhựa đen',
                },
                {
                    operationName: 'Kiểm tra tình trạng các lỗ nhựa đen',
                },
                {
                    operationName: 'Kiểm tra tình trạng lótấm cao su đỡ đầu',
                },
                {
                    operationName: 'Kiểm tra Side airm kit',
                },
                {
                    operationName: 'Kiểm tra lõi nhựa gần đầu in',
                },
                {
                    operationName: 'Kiểm tra 2 lõi nhựa gần ruy băng',
                },
            ],
            guide: {
                powerControl: ['Thời gian giữa các lần tắt mở'],
                printProgramming: [
                    'Lập trình mới',
                    'Nhập ngày sản xuất',
                    'Nhập hạn sử dụng',
                    'Lập trình số đếm',
                    'Chữ đậm tắt mở',
                    'Chia ca',
                    'Chọn Font chữ',
                    'Nhập logo',
                    'Lưu tập tin',
                    'In phun chương trình',
                ],
                printSetting: [
                    'In đậm',
                    'In phun liên tục',
                    'In trễ',
                    'chỉnh số đếm',
                    'Điều chỉnh chiều rộng',
                    'Điều chỉnh chiều cao',
                    'Đảo ngược trái phải',
                ],
                saveProgram: [
                    'Chọn chương trình',
                    'Xóa chương trình',
                    'Các chức năng khác',
                ],
                viewSpecifications: [
                    'Thời gian của bình ITM',
                    'Thời gian máy',
                    'Thời gian in phun',
                ],
                inkReplace: [
                    'Thay bình dung môi',
                    'Thay bình mực',
                    'Thay hộp mực',
                    'Thay đầu in',
                ],
                errorMessages: [
                    'Chuẩn bị thêm dung môi',
                    'Chuẩn bị thêm mực',
                    'Cảm biến nhiễu lên',
                    'Tần số dẫn động bên trong quá cao ( vượt tốc độ cho phép',
                    'Xung điện giọt mực có lỗi',
                    'Xung điện bị dơ',
                    'Ống thu hồi không có mực',
                    'Hết mực',
                ],
            },
            technicalFeedback: ['Đề nghị thay'],
            customerFeedback: [
                'Tôi đồng ý thay linh kiện',
                'Tôi đồng ý và sẽ trình ban giám đốc',
            ],
        },
    ])
    logger.info('WorkOrderBusiness seeded')
}

module.exports = workOrderBusinessSeeder
