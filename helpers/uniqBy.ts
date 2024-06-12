export const uniqBy = (arr, predicate) => {
  if (!Array.isArray(arr)) {
    return [];
  }

  const cb = typeof predicate === 'function' ? predicate : (o) => o[predicate];

  const pickedObjects = arr
    .filter((item) => item)
    .reduce((map, item) => {
      const key = cb(item);

      if (!key) {
        return map;
      }

      return map.has(key) ? map : map.set(key, item);
    }, new Map())
    .values();

  return [...pickedObjects];
};
