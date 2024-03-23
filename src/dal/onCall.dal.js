const { getSpecificSheet } = require('../services/googleSheet.service');
const { shiftArray } = require('../helpers/arrayHelpers');

const fetchCallRotation = async () =>  {
    const { rowData } = await getSpecificSheet('1AETwV9w-Nuf6mwM9fFgdRkqxem0D9jxSEVlb7YWpypY', 'Rotation 2024');
    const rotationList = rowData.slice(1).map(row => row.values[0].formattedValue);

    return shiftArray(rotationList, 3);
};

module.exports = { fetchCallRotation }