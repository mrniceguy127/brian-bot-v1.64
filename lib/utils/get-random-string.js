'use-strict';

// Retrieves a random string from a given array, and if provided with
// a prevStringIndex, will ensure that the selected string wasn't
// returned on last run
module.exports = (stringArray, prevStringIndex = -1) => {
  let len = stringArray.length;
  let i = Math.floor(Math.random() * len);

  // If prevStringIndex is valid, make sure that index is not picked
  if (len > 1 && prevStringIndex >= 0 && prevStringIndex < len)
  {
    while (i === prevStringIndex)
    {
      i = Math.floor(Math.random() * len);
    }
  }

  let result = {
    string: stringArray[i],
    index: i
  };
  return result;
};
