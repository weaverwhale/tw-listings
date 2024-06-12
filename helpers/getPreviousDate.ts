import moment, { Moment } from '@tw/moment-cached';
import { Period } from '@tw/types/module/datePicker/datePicker';

export const getPrevDates = (range: { start: Moment; end: Moment }, period?: Period) => {
  let { start, end } = range;

  start = moment(start);
  end = moment(end);

  if (!period) {
    let daysDiff = end.diff(start, 'days');
    daysDiff += 1;

    return {
      start: start.subtract(daysDiff, 'days'),
      end: end.subtract(daysDiff, 'days'),
    };
  }

  return {
    start: start.subtract(1, period),
    end: end.subtract(1, period),
  };
};

// const getPrevPeriod = (val: { start: Date; end: Date }) => {
//   const momentStart = convertDateToMoment(val?.start);
//   const momentEnd = convertDateToMoment(val?.end);

//   var daysDiff = momentEnd.diff(momentStart, 'days');
//   daysDiff += 1;

//   const resStart = momentStart.subtract(daysDiff, 'days');
//   const resEnd = momentEnd.subtract(daysDiff, 'days');
//   return { start: resStart, end: resEnd };
// };
