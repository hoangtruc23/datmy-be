//số tiền ra chữ
function numberToVietnameseText(number) {
    const units = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ']
    const numbers = [
        'không',
        'một',
        'hai',
        'ba',
        'bốn',
        'năm',
        'sáu',
        'bảy',
        'tám',
        'chín',
    ]

    function readThreeDigits(num) {
        let str = ''
        const hundred = Math.floor(num / 100)
        const ten = Math.floor((num % 100) / 10)
        const one = num % 10

        if (hundred > 0) {
            str += numbers[hundred] + ' trăm'
            if (ten > 0 || one > 0) str += ' '
        }

        if (ten === 1) {
            str += 'mười'
            if (one > 0) str += ' ' + (one === 5 ? 'lăm' : numbers[one])
        } else if (ten > 1) {
            str += numbers[ten] + ' mươi'
            if (one > 0)
                str +=
                    ' ' + (one === 5 ? 'lăm' : one === 1 ? 'mốt' : numbers[one])
        } else if (one > 0) {
            str += numbers[one]
        }

        return str.trim()
    }

    if (number === 0) return 'không đồng'

    let result = ''
    let unitIndex = 0
    let num = Math.abs(number)

    while (num > 0) {
        const threeDigits = num % 1000
        if (threeDigits > 0) {
            const text = readThreeDigits(threeDigits)
            result =
                text +
                (text ? ' ' + units[unitIndex] : '') +
                (result ? ' ' + result : '')
        }
        num = Math.floor(num / 1000)
        unitIndex++
    }
    result = result.trim()
    result = result.charAt(0).toUpperCase() + result.slice(1) + ' đồng'
    return result
}

const convertNumberToVietnameseWords = (number) => {
    return numberToVietnameseText(number)
}

module.exports = convertNumberToVietnameseWords
