import { SummaryMetrics } from '@tw/types/module/SummaryMetrics';
import {
  WillyExpressionOrCustomMetric,
  WillyExpressionOrCustomMetricToServer,
  MetricTree,
  MetricMap,
  WillyExpressionMetric,
  WillyCustomMetric,
  ExpressionElement,
  ElementTypes,
  WillyWidgetElement,
} from 'types/Willy';
import { FilterGroup } from 'types/FreeQuery';
import { isEqual } from 'utils/helpers/isEqual';

export function metricIsCustom(
  metric: WillyExpressionOrCustomMetric | WillyExpressionOrCustomMetricToServer
): metric is WillyCustomMetric {
  return !!metric && 'expression' in metric;
}

export function metricIsNonCustomExpression(
  metric: WillyExpressionOrCustomMetric
): metric is WillyExpressionMetric {
  return !metricIsCustom(metric);
}

export function replaceIdsWithObjectsInExpression(
  expression: ExpressionElement[],
  metricMap: MetricMap
): ExpressionElement[] {
  return expression.map((element) => {
    if (element.type === ElementTypes.METRIC && typeof element.value === 'string') {
      const metric = metricMap.get(element.value);
      if (metric && 'expression' in metric) {
        // It's a WillyCustomMetric, so we replace its ID with its full expression
        return {
          ...element,
          value: replaceIdsWithObjectsInExpression(metric.expression, metricMap),
          isCustomMetric: true,
          key: metric.key || metric.id || metric.name,
        };
      } else if (metric) {
        // It's a WillyMetric, replace the ID with the metric object
        return {
          ...element,
          isCustomMetric: false,
          key: metric.key || metric.id || metric.name,
          value: metric,
        };
      }
    }
    return element;
  });
}

export function extractFullMetricTree(
  entryMetric: WillyCustomMetric,
  allMetrics: WillyExpressionOrCustomMetricToServer[]
): MetricTree {
  const metricMap: MetricMap = new Map();

  // Populate the map with all metrics (both WillyMetric and WillyCustomMetric)
  allMetrics.forEach((metric) => metricMap.set(metric.id, metric));

  // Replace IDs in the entry metric's expression with actual metric objects
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { expression, ...rest } = entryMetric;
  return {
    ...rest,
    value: replaceIdsWithObjectsInExpression(entryMetric.expression, metricMap),
    key: entryMetric.key || entryMetric.id || entryMetric.name,
  };
}

function uniqWith(array, compareFn) {
  const unique = [];
  for (const current of array) {
    const isDuplicate = unique.some((other) => compareFn(current, other));
    // @ts-expect-error - it's right
    if (!isDuplicate) unique.push(current);
  }
  return unique;
}

export const convertToServerMetrics = (
  metrics: WillyExpressionOrCustomMetric[]
): WillyExpressionOrCustomMetricToServer[] => {
  return metrics.map((x) => {
    if (metricIsNonCustomExpression(x)) {
      let filtered = x.filter?.filter((x) => x.enabled) ?? [];
      const isShopOverride = filtered.some((x) => x.isOverride);
      if (isShopOverride) {
        const basicFilter = filtered.find((x) => !x.isOverride); // assume we have only one basic filter (only one OR statement)

        filtered = filtered
          .filter((x) => x.isOverride)
          .map(
            (x) =>
              ({
                ...x,
                filters: uniqWith([...(basicFilter?.filters ?? []), ...x.filters], isEqual),
              } as FilterGroup)
          );
      }
      return { ...x, filter: filtered.map((x) => x.filters) };
    } else {
      return x;
    }
  });
};

export function generateMetricTrees(
  widget: WillyWidgetElement
): WillyExpressionOrCustomMetricToServer[] {
  return widget?.metrics
    ? convertToServerMetrics(
        widget?.metrics?.map((metric) => {
          const summaryMetric =
            (metric.key && SummaryMetrics[metric.key]) ??
            (metric.v2metricId && SummaryMetrics[metric.v2metricId]);

          return metricIsCustom(metric as WillyCustomMetric)
            ? {
                ...metric,
                ...summaryMetric,
                ...summaryMetric?.willyConfig,
                ...extractFullMetricTree(
                  metric as WillyCustomMetric,
                  widget.metrics as WillyExpressionOrCustomMetricToServer[]
                ),
              }
            : ({
                ...metric,
                ...summaryMetric?.willyConfig,
                isCustomMetric: false,
              } as WillyExpressionMetric);
        })
      )
    : [];
}
