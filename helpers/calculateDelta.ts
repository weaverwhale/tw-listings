export const calculateDelta = (val1: number, val2: number) => {
  let percent: number;
  if (val1 === val2) percent = 0;
  else {
    if (val2 === 0) {
      percent = 1;
    } else {
      percent = (val1 - val2) / Math.abs(val2);
    }
  }
  return percent;
};
