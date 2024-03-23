const { shiftArray } = require('./arrayHelpers')

describe('Array utilities functions', () => {
    it('should return sifted array', () => {
        const arr = [1, 2, 3, 4, 5, 6]
        const shiftedArr = shiftArray(arr, 2);

        expect(shiftedArr).toEqual([5, 6, 1, 2, 3, 4])
    })
}); 