/**
 * Luhn algorithm in JavaScript: validate credit card number supplied as string of numbers
 * @author ShirtlessKirk. Copyright (c) 2012.
 * @license WTFPL (http://www.wtfpl.net/txt/copying)
 */
export const luhnChk = (function (arr) {
    return function (ccNum: string): boolean { // Added type annotation for ccNum and return type
        var
            len = ccNum.length,
            bit = 1,
            sum = 0,
            val;

        while (len) {
            val = parseInt(ccNum.charAt(--len), 10);
            // Added a check for NaN in case ccNum contains non-numeric characters
            if (isNaN(val)) {
                return false; // Or handle error appropriately
            }
            sum += (bit ^= 1) ? arr[val] : val;
        }

        return sum !== 0 && sum % 10 === 0;
    };
}([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]));


export const validateExpiryDate = (expiry: string) => {
	if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;

	const [monthStr, yearStr] = expiry.split('/');
	const month = parseInt(monthStr, 10);
	const year = parseInt('20' + yearStr, 10); // Converts '25' -> 2025

	if (isNaN(month) || isNaN(year)) return false;
	if (month < 1 || month > 12) return false;

	const now = new Date();
	const expiryDate = new Date(year, month); // set to first day of next month

	return expiryDate > now;
};
