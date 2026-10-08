<script setup lang="ts">
import * as d3 from 'd3';
import { computed } from 'vue';
import type { AggregationSeries } from '../../types/aggregation';
import { CHART_YEAR_END, seriesRows, totalForSeries, YEAR_START } from '../../utils/aggregation';

const props = defineProps<{
  title: string;
  description: string;
  series: AggregationSeries[];
  mode: 'bars' | 'area';
  percentage?: boolean;
}>();

const width = 960;
const height = 420;
const margin = { top: 30, right: 24, bottom: 48, left: 68 };
const plotWidth = width - margin.left - margin.right;
const plotHeight = height - margin.top - margin.bottom;

const rows = computed(() => seriesRows(props.series));
const keys = computed(() => props.series.map((series) => series.label));
const colors = computed(() =>
  keys.value.map((_, index) => d3.schemeTableau10[index % d3.schemeTableau10.length] ?? '#2457a6'),
);

const stacked = computed(() =>
  d3
    .stack<Record<string, number>>()
    .keys(keys.value)
    .value((row, key) => row[key] ?? 0)(rows.value),
);

const finiteMaximum = computed(() => {
  const values = stacked.value.flatMap((layer) =>
    layer.map((point) => point[1]).filter(Number.isFinite),
  );
  return Math.max(1, ...values);
});

const yScale = computed(() =>
  d3.scaleLinear().domain([0, finiteMaximum.value]).nice().range([plotHeight, 0]),
);
const xScale = d3.scaleLinear().domain([YEAR_START, CHART_YEAR_END]).range([0, plotWidth]);
const xBand = d3
  .scaleBand<string>()
  .domain(d3.range(YEAR_START, CHART_YEAR_END + 1).map(String))
  .range([0, plotWidth])
  .paddingInner(0.08);

const areaPaths = computed(() => {
  const area = d3
    .area<d3.SeriesPoint<Record<string, number>>>()
    .defined((point) => Number.isFinite(point[0]) && Number.isFinite(point[1]))
    .x((_, index) => xScale(YEAR_START + index))
    .y0((point) => yScale.value(point[0]))
    .y1((point) => yScale.value(point[1]))
    .curve(d3.curveNatural);

  return stacked.value.map((layer) => area(layer) ?? '');
});

const yTicks = computed(() => yScale.value.ticks(5));
const xTicks = [1392, 1500, 1600, 1700, 1800, 1900, 1928];

const formatValue = (value: number): string => {
  if (Number.isNaN(value)) return 'Not available';
  if (value === Infinity) return '∞';
  if (value === -Infinity) return '−∞';
  return props.percentage
    ? new Intl.NumberFormat(undefined, { style: 'percent', maximumFractionDigits: 2 }).format(value)
    : new Intl.NumberFormat().format(value);
};

const formatAxisValue = (value: number): string =>
  props.percentage ? `${Math.round(value * 100)}%` : d3.format('~s')(value);
</script>

<template>
  <section class="chart-panel" :aria-labelledby="`${title.replaceAll(' ', '-')}-title`">
    <div class="chart-heading">
      <div>
        <h3 :id="`${title.replaceAll(' ', '-')}-title`">{{ title }}</h3>
        <p>{{ description }}</p>
      </div>
      <ul class="chart-legend" aria-label="Chart series">
        <li v-for="(item, index) in series" :key="item.label">
          <span class="legend-swatch" :style="{ backgroundColor: colors[index] }" aria-hidden="true"></span>
          <span>{{ item.label }}</span>
          <small v-if="!percentage">Total {{ formatValue(totalForSeries(item)) }}</small>
        </li>
      </ul>
    </div>

    <div class="chart-scroll" aria-hidden="true">
      <svg class="aggregation-chart" :viewBox="`0 0 ${width} ${height}`" role="img">
        <g :transform="`translate(${margin.left},${margin.top})`">
          <g class="chart-grid">
            <line
              v-for="tick in yTicks"
              :key="tick"
              x1="0"
              :x2="plotWidth"
              :y1="yScale(tick)"
              :y2="yScale(tick)"
            />
          </g>

          <template v-if="mode === 'bars'">
            <g v-for="(layer, layerIndex) in stacked" :key="keys[layerIndex]">
              <rect
                v-for="(point, pointIndex) in layer"
                :key="pointIndex"
                :x="xBand(String(YEAR_START + pointIndex))"
                :y="yScale(point[1])"
                :width="xBand.bandwidth()"
                :height="Math.max(0, yScale(point[0]) - yScale(point[1]))"
                :fill="colors[layerIndex]"
              />
            </g>
          </template>
          <template v-else>
            <path
              v-for="(path, index) in areaPaths"
              :key="keys[index]"
              :d="path"
              :fill="colors[index]"
              :stroke="colors[index]"
              fill-opacity="0.55"
              stroke-width="1.5"
            />
          </template>

          <g class="axis-labels y-axis">
            <text
              v-for="tick in yTicks"
              :key="tick"
              x="-12"
              :y="yScale(tick)"
              text-anchor="end"
              dominant-baseline="middle"
            >
              {{ formatAxisValue(tick) }}
            </text>
          </g>
          <g class="axis-labels x-axis">
            <text
              v-for="tick in xTicks"
              :key="tick"
              :x="xScale(tick)"
              :y="plotHeight + 28"
              text-anchor="middle"
            >
              {{ tick }}
            </text>
          </g>
          <line class="axis-line" x1="0" :x2="plotWidth" :y1="plotHeight" :y2="plotHeight" />
          <line class="axis-line" x1="0" x2="0" y1="0" :y2="plotHeight" />
        </g>
      </svg>
    </div>

    <details class="chart-table">
      <summary>View accessible chart data</summary>
      <div class="table-scroll">
        <table>
          <caption>{{ title }} by western year</caption>
          <thead>
            <tr>
              <th scope="col">Year</th>
              <th v-for="label in keys" :key="label" scope="col">{{ label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.year">
              <th scope="row">{{ row.year }}</th>
              <td v-for="label in keys" :key="label">{{ formatValue(row[label] ?? 0) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </section>
</template>
