import { $currentDateRange } from '$stores/$dateRange';

export const triggerRefresh = () => {
  // trigger refresh with dateRange
  const cd = $currentDateRange.get();
  // @ts-expect-error ignore
  $currentDateRange.set({});
  setTimeout(() => {
    $currentDateRange.set(cd);
  }, 10);
};
