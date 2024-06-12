import Cookies from 'utils/Cookies';

export const getSsrData = (namespace: string) => {
  const cookieData = Cookies.get(namespace);

  try {
    const parsedData = cookieData ? JSON.parse(cookieData) : null;
    if (parsedData && parsedData.length > 0) {
      return namespace in window && window[namespace] ? window[namespace] : parsedData;
    } else {
      return namespace in window && window[namespace] ? window[namespace] : cookieData ?? null;
    }
  } catch {
    return namespace in window && window[namespace] ? window[namespace] : cookieData ?? null;
  }
};
