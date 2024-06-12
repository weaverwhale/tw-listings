export function mergeArraysBy<T extends Record<any, any>>(
  arrayA: T[],
  arrayB: T[],
  field: keyof T
) {
  if (!arrayA?.length) {
    return arrayB;
  } else if (!arrayB?.length) {
    return arrayA;
  }

  const mapB = arrayB.reduce<T>((acc, obj) => ({ ...acc, [obj[field]]: obj }), {} as T);

  // Merge arrayA objects with corresponding arrayB objects
  const mergedA = arrayA.map((objA) => {
    const objB = mapB[objA[field]];
    return objB ? { ...objB, ...objA } : objA;
  });

  // Filter arrayB objects that don't have a corresponding object in arrayA
  const exclusiveB = arrayB.filter((objB) => !arrayA.some((objA) => objA[field] === objB[field]));

  // Concatenate mergedA with exclusiveB
  return mergedA.concat(exclusiveB);
}
