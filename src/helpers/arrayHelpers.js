const  shiftArray = (arr, shifBy) => {
  return arr.reduce((shifted, item, index) => {
    const newIndex = (index + shifBy) % arr.length;
    shifted[newIndex] = item;
    return shifted
  }, [])
};

const caseInsensitiveCheck = (arr, str) => {
  return arr.some(name => name.toLowerCase() === str.toLowerCase());
}

module.exports = { caseInsensitiveCheck, shiftArray };