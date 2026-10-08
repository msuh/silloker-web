<script setup lang="ts">
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Message from 'primevue/message';
import Paginator from 'primevue/paginator';
import ProgressSpinner from 'primevue/progressspinner';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { downloadSearchResults, searchRecords } from '../api/search';
import KeywordInput from '../components/common/KeywordInput.vue';
import RecordTypeSelector from '../components/common/RecordTypeSelector.vue';
import RecordCard from '../components/records/RecordCard.vue';
import type { RecordEntity, RecordType, SearchCriteria } from '../types/records';
import { RECORD_TYPES } from '../types/records';
import { filenameFromContentDisposition, saveBlob } from '../utils/download';
import { errorToMessage } from '../utils/errors';
import { validateSearchCriteria } from '../utils/validation';

const route = useRoute();
const router = useRouter();
const pageSize = 50;

const queryValues = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
  return typeof value === 'string' ? [value] : [];
};

const parseYear = (value: unknown): number | null => {
  const raw = queryValues(value)[0];
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

const initialTypes = queryValues(route.query.types)[0]
  ?.split(',')
  .filter((value): value is RecordType => RECORD_TYPES.includes(value as RecordType));

const keywords = ref<string[]>(queryValues(route.query.q));
const selectedRecordTypes = ref<RecordType[]>(
  initialTypes && initialTypes.length > 0 ? initialTypes : [...RECORD_TYPES],
);
const yearStart = ref<number | null>(parseYear(route.query.from));
const yearEnd = ref<number | null>(parseYear(route.query.to));
const results = ref<RecordEntity[]>([]);
const totalCount = ref(0);
const resultPageIndex = ref(Math.max(0, Number(queryValues(route.query.page)[0] ?? 0) || 0));
const isFetching = ref(false);
const isDownloading = ref(false);
const errorMessage = ref('');
const hasSearched = ref(false);

const criteria = computed<SearchCriteria>(() => ({
  keywords: keywords.value,
  recordTypes: selectedRecordTypes.value,
  yearStart: yearStart.value ?? undefined,
  yearEnd: yearEnd.value ?? undefined,
}));

const activeSummary = computed(() => {
  const parts = [
    `${keywords.value.length} keyword${keywords.value.length === 1 ? '' : 's'}`,
    `${selectedRecordTypes.value.length} source${selectedRecordTypes.value.length === 1 ? '' : 's'}`,
  ];
  if (yearStart.value || yearEnd.value) {
    parts.push(`${yearStart.value ?? 'earliest'}–${yearEnd.value ?? 'latest'}`);
  }
  return parts.join(' · ');
});

const syncQuery = async (pageIndex: number): Promise<void> => {
  await router.replace({
    name: 'search',
    query: {
      q: keywords.value,
      types: selectedRecordTypes.value.join(','),
      from: yearStart.value ?? undefined,
      to: yearEnd.value ?? undefined,
      page: pageIndex || undefined,
    },
  });
};

const executeSearch = async (pageIndex = 0): Promise<void> => {
  errorMessage.value = '';
  const validationError = validateSearchCriteria(criteria.value, isFetching.value);
  if (validationError) {
    errorMessage.value = validationError;
    return;
  }

  isFetching.value = true;
  hasSearched.value = true;
  resultPageIndex.value = pageIndex;
  await syncQuery(pageIndex);

  try {
    const response = await searchRecords(criteria.value, pageIndex, pageSize);
    totalCount.value = response.totalCount;
    results.value = response.entities;
  } catch (error) {
    errorMessage.value = errorToMessage(error);
    totalCount.value = 0;
    results.value = [];
  } finally {
    isFetching.value = false;
  }
};

const downloadResults = async (): Promise<void> => {
  errorMessage.value = '';
  const validationError = validateSearchCriteria(criteria.value, isDownloading.value);
  if (validationError) {
    errorMessage.value = validationError;
    return;
  }

  isDownloading.value = true;
  try {
    const { blob, headers } = await downloadSearchResults(criteria.value);
    saveBlob(
      blob,
      filenameFromContentDisposition(headers.get('content-disposition'), 'search-results.tsv'),
    );
  } catch (error) {
    errorMessage.value = errorToMessage(error);
  } finally {
    isDownloading.value = false;
  }
};

onMounted(() => {
  if (keywords.value.length > 0) void executeSearch(resultPageIndex.value);
});
</script>

<template>
  <div class="page search-page">
    <section class="hero compact-hero">
      <p class="eyebrow">Unified historical search</p>
      <h1>Explore five centuries of Korean records</h1>
      <p>
        Search across court annals and administrative archives, then inspect or download the
        source records behind your results.
      </p>
    </section>

    <section class="search-workspace" aria-labelledby="search-form-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Build a query</p>
          <h2 id="search-form-title">Search the archives</h2>
        </div>
        <RouterLink class="text-link" to="/search/instruction">
          Search guide <i class="pi pi-arrow-right" aria-hidden="true"></i>
        </RouterLink>
      </div>

      <Message v-if="errorMessage" severity="warn" role="alert" :closable="false">
        {{ errorMessage }}
      </Message>

      <form class="search-form" @submit.prevent="executeSearch(0)">
        <RecordTypeSelector v-model="selectedRecordTypes" />

        <div class="year-grid">
          <div class="field-group">
            <label for="year-start">Year start</label>
            <span id="year-start-help" class="field-help">Optional; dynasty begins in 1392.</span>
            <InputNumber
              v-model="yearStart"
              input-id="year-start"
              :use-grouping="false"
              placeholder="1500"
              aria-describedby="year-start-help"
            />
          </div>
          <div class="field-group">
            <label for="year-end">Year end</label>
            <span id="year-end-help" class="field-help">Optional; dynasty ends in 1910.</span>
            <InputNumber
              v-model="yearEnd"
              input-id="year-end"
              :use-grouping="false"
              placeholder="1560"
              aria-describedby="year-end-help"
            />
          </div>
        </div>

        <KeywordInput
          v-model="keywords"
          :maximum="5"
          placeholder="For example, 鳥銃"
        />

        <div class="active-filter-summary" aria-live="polite">
          <strong>Current query</strong>
          <span>{{ activeSummary }}</span>
        </div>

        <div class="action-row">
          <Button type="submit" label="Search records" icon="pi pi-search" :loading="isFetching" />
          <Button
            type="button"
            label="Download TSV"
            icon="pi pi-download"
            severity="secondary"
            outlined
            :loading="isDownloading"
            @click="downloadResults"
          />
        </div>
      </form>
    </section>

    <section class="results-section" aria-labelledby="results-title" :aria-busy="isFetching">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Search results</p>
          <h2 id="results-title">
            {{ hasSearched ? `${totalCount.toLocaleString()} records` : 'Ready when you are' }}
          </h2>
        </div>
      </div>

      <div v-if="isFetching" class="loading-state" role="status" aria-live="polite">
        <ProgressSpinner stroke-width="4" />
        <p>Searching the archives…</p>
      </div>

      <div v-else-if="hasSearched && results.length === 0 && !errorMessage" class="empty-state">
        <i class="pi pi-search" aria-hidden="true"></i>
        <h3>No records matched this query</h3>
        <p>Try a broader date range, another source, or fewer keywords.</p>
      </div>

      <div v-else-if="!hasSearched" class="empty-state subtle">
        <i class="pi pi-book" aria-hidden="true"></i>
        <h3>Your results will appear here</h3>
        <p>Add at least one keyword and choose the records you want to search.</p>
      </div>

      <template v-else>
        <Paginator
          v-if="totalCount > pageSize"
          :first="resultPageIndex * pageSize"
          :rows="pageSize"
          :total-records="totalCount"
          :always-show="false"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          current-page-report-template="{first}–{last} of {totalRecords}"
          @page="executeSearch($event.page)"
        />
        <div class="record-list">
          <RecordCard
            v-for="record in results"
            :key="record.id ?? `${record.title}-${record.year}`"
            :record="record"
            :keywords="keywords"
          />
        </div>
        <Paginator
          v-if="totalCount > pageSize"
          :first="resultPageIndex * pageSize"
          :rows="pageSize"
          :total-records="totalCount"
          :always-show="false"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          current-page-report-template="{first}–{last} of {totalRecords}"
          @page="executeSearch($event.page)"
        />
      </template>
    </section>
  </div>
</template>
