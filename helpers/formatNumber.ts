import moment from '@tw/moment-cached';

// convert number of seconds to duration in format 00:00:00
export const formatDuration = (seconds: number): string => {
  if (seconds < 0) {
    return '00:00:00';
  }
  const duration = moment.duration(seconds, 'seconds');
  const hours = duration.hours();
  const minutes = duration.minutes();
  const secs = duration.seconds();
  return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${
    secs < 10 ? '0' : ''
  }${secs}`;
};

export const formatNumber = (value: number, options: any): string => {
  // we want moment format and not Intl format, for backward compatibility
  if (options.style === 'date') {
    return moment(value).format(options.dateFormat);
  }
  if (options.style === 'duration') {
    return formatDuration(value);
  }
  // if you explicitly want a string, you get a string
  if (options.style === 'string') {
    return value.toString();
  }
  if (!value || Number.isNaN(+value) || !Number.isFinite(+value)) {
    value = 0;
  }
  return value.toLocaleString(undefined, options);
};

export const formatToFixed = (value: any, decimals = 2): string => {
  if (typeof value === 'number') {
    return value.toFixed(decimals);
  }
  return value ?? '';
};
