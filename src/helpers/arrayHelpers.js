const  shiftArray = (arr, shifBy) => {
  return arr.reduce((shifted, item, index) => {
    const newIndex = (index + shifBy) % arr.length;
    shifted[newIndex] = item;
    return shifted
  }, [])
};

module.exports = { shiftArray };