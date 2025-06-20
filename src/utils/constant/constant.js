const constant = {
    USER_ROOT: 'root',
    USER_BGD: 'bgd',
    REDIS_PREFIX_ACCESS_TOKEN: 'ACCESS_TOKEN',
    REDIS_PREFIX_PERMISSION: 'PERMISSION',
    ROLES: {
        BGD: '684927c871287f2ae7d8130a',
        admin: '684927c871287f2ae7d8130b',
        warehouseStaff: '684927c871287f2ae7d8130c',
        warehouseAccountant: '684927c871287f2ae7d8130e',
        debtAccountant: '684927c871287f2ae7d8130f',
        billAccountant: '684927c871287f2ae7d81310',
        sale: '684927c871287f2ae7d81311',
    },
    PRODUCT_MANAGEMENT_TYPE: {
        NONE: 'none',
        SERIAL: 'serial',
        BATCH: 'batch',
    },
    GOODS_ISSUE_STATUS: {
        WAREHOUSE_STAFF_APPROVAL: 'Chờ nhân viên kho duyệt',
        WAREHOUSE_ACCOUNTANT_APPROVAL: 'Chờ kế toán kho duyệt',
        DEBT_ACCOUNTANT_APPROVAL: 'Chờ kế toán công nợ duyệt',
        BILL_ACCOUNTANT_APPROVAL: 'Chờ kế toán hóa đơn duyệt',
        COMPLETED: 'Hoàn thành',
    },
    GOODS_RECEIPT_STATUS: {
        WAREHOUSE_STAFF_APPROVAL: 'Chờ nhân viên kho duyệt',
        COMPLETED: 'Hoàn thành',
    },
}

module.exports = constant
