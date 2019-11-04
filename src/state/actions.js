export const CONNECTION_CHANGED = 'CONNECTION_CHANGED';
export const CONVERT_CURRENCY = 'CONVERT_CURRENCY';
export const CONVERT_CURRENCIES = 'CONVERT_CURRENCIES';

export const connectionChanged = (status, showNotification) => {
    return {
        status,
        showNotification,
        type: CONNECTION_CHANGED
    };
};

export const convertCurrency = (from, to) => {
    return {
        from, to,
        type: CONVERT_CURRENCY
    };
};

export const convertCurrencies = (from, ...to) => {
    return {
        from, to,
        type: CONVERT_CURRENCIES
    };
};