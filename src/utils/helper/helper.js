function findDuplicateTrackingCode(arr) {
    const seen = new Set()
    const duplicates = new Set()

    for (const item of arr) {
        if (seen.has(item.trackingCode)) {
            duplicates.add(item.trackingCode)
        } else {
            seen.add(item.trackingCode)
        }
    }

    return [...duplicates]
}

module.exports = { findDuplicateTrackingCode }
