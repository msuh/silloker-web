<script setup lang="ts">
import Button from 'primevue/button';
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';
import { computed, ref } from 'vue';

import {
  downloadAggregation,
  getKeywordAggregation,
  getRecordTypeAggregation,
} from '../api/aggregation';
import AggregationChart from '../components/aggregation/AggregationChart.vue';
import KeywordInput from '../components/common/KeywordInput.vue';
import RecordTypeSelector from '../components/common/RecordTypeSelector.vue';
import type { AggregationCriteria, AggregationResult, AggregationSeries } from '../types/aggregation';
import type { RecordType } from '../types/records';
import { combineAggregationRatio, recordTypeLabel } from '../utils/aggregation';
import { filenameFromContentDisposition, saveBlob } from '../utils/download';
import { errorToMessage } from '../utils/errors';
import { validateAggregationCriteria } from '../utils/validation';

const keywords = ref<string[]>([]);
const selectedRecordTypes = ref<RecordType[]>(['WANGJO', 'SECRETARIAT', 'PIBYUN']);
const result = ref<AggregationResult | null>(null);
const isFetching = ref(false);
const isDownloading = ref(false);
const errorMessage = ref('');

const criteria = computed<AggregationCriteria>(() => ({
  keywords: keywords.value,
  recordTypes: selectedRecordTypes.value,
}));

const graphAggregation = async (): Promise<void> => {
  errorMessage.value = '';
  const validationError = validateAggregationCriteria(criteria.value, isFetching.value);
  if (validationError) {
    errorMessage.value = validationError;
    return;
  }

  isFetching.value = true;
  result.value = null;

  try {
    const [keywordValues, countValues] = await Promise.all([
      Promise.all(
        keywords.value.map((keyword) =>
          getKeywordAggregation(keyword, selectedRecordTypes.value),
        ),
      ),
      Promise.all(selectedRecordTypes.value.map(getRecordTypeAggregation)),
    ]);

    const keywordSeries: AggregationSeries[] = keywords.value.map((label, index) => ({
      label,
      values: keywordValues[index] ?? [],
    }));
    const recordCountSeries: AggregationSeries[] = selectedRecordTypes.value.map(
      (recordType, index) => ({
        label: recordTypeLabel(recordType),
        values: countValues[index] ?? [],
      }),
    );
    const ratioValues = combineAggregationRatio(keywordSeries, recordCountSeries);

    result.value = {
      keywordSeries,
      ratioSeries: [{ label: keywords.value.join(', '), values: ratioValues }],
      recordCountSeries,
    };
  } catch (error) {
    errorMessage.value = errorToMessage(error);
  } finally {
    isFetching.value = false;
  }
};

const downloadResults = async (): Promise<void> => {
  errorMessage.value = '';
  const validationError = validateAggregationCriteria(criteria.value, isDownloading.value, true);
  if (validationError) {
    errorMessage.value = validationError;
    return;
  }

  isDownloading.value = true;
  try {
    const { blob, headers } = await downloadAggregation(criteria.value);
    saveBlob(
      blob,
      filenameFromContentDisposition(
        headers.get('content-disposition'),
        'aggregation-results.tsv',
      ),
    );
  } catch (error) {
    errorMessage.value = errorToMessage(error);
  } finally {
    isDownloading.value = false;
  }
};
</script>

<template>
  <div class="page aggregation-page">
    <section class="hero compact-hero">
      <p class="eyebrow">Trend analysis</p>
      <h1>See language move through time</h1>
      <p>
        Compare the yearly frequency of up to ten terms across selected archives. Counts and
        ratios use the same calculations as the original Silloker application.
      </p>
    </section>

    <section class="search-workspace" aria-labelledby="aggregation-form-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Build an analysis</p>
          <h2 id="aggregation-form-title">Aggregation inputs</h2>
        </div>
      </div>

      <Message v-if="errorMessage" severity="warn" role="alert" :closable="false">
        {{ errorMessage }}
      </Message>

      <form class="search-form" @submit.prevent="graphAggregation">
        <RecordTypeSelector v-model="selectedRecordTypes" />
        <KeywordInput
          v-model="keywords"
          :maximum="10"
          label="Terms to compare"
          placeholder="火藥"
        />
        <div class="context-note">
          <i class="pi pi-info-circle" aria-hidden="true"></i>
          <p>
            The first chart shows matching records by year. The ratio chart divides combined
            keyword hits by the yearly total for your selected sources. Years with no source
            records are reported as unavailable.
          </p>
        </div>
        <div class="action-row">
          <Button type="submit" label="Graph trends" icon="pi pi-chart-bar" :loading="isFetching" />
          <Button
            type="button"
            label="Download one term"
            icon="pi pi-download"
            severity="secondary"
            outlined
            :loading="isDownloading"
            @click="downloadResults"
          />
        </div>
      </form>
    </section>

    <section class="results-section aggregation-results" aria-labelledby="analysis-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Analysis</p>
          <h2 id="analysis-title">Yearly trends</h2>
        </div>
      </div>

      <div v-if="isFetching" class="loading-state" role="status" aria-live="polite">
        <ProgressSpinner stroke-width="4" />
        <p>Collecting yearly totals…</p>
      </div>

      <div v-else-if="!result" class="empty-state subtle">
        <i class="pi pi-chart-line" aria-hidden="true"></i>
        <h3>Your charts will appear here</h3>
        <p>Add one or more terms and select the archives you want to compare.</p>
      </div>

      <div v-else class="chart-stack" aria-live="polite">
        <AggregationChart
          title="Keyword matches"
          description="Matching records for each term, stacked by western year."
          :series="result.keywordSeries"
          mode="bars"
        />
        <AggregationChart
          title="Match ratio"
          description="Combined keyword matches divided by all records in the selected archives."
          :series="result.ratioSeries"
          mode="area"
          percentage
        />
        <AggregationChart
          title="Archive totals"
          description="All available records by source and western year."
          :series="result.recordCountSeries"
          mode="area"
        />
      </div>
    </section>
  </div>
</template>
