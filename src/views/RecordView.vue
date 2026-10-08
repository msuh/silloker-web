<script setup lang="ts">
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { getRecord } from '../api/records';
import { getRecordTags } from '../api/tags';
import type { RecordEntity, TagEntity } from '../types/records';
import { errorToMessage } from '../utils/errors';

const route = useRoute();
const record = ref<RecordEntity | null>(null);
const tags = ref<TagEntity[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');

const recordId = computed(() => String(route.params.id));
const dateText = computed(() =>
  [record.value?.year, record.value?.month, record.value?.day]
    .filter((value) => value !== undefined && value !== null)
    .join('-'),
);
const bookText = computed(() =>
  [
    record.value?.bookName,
    record.value?.bookVolume ? `Vol. ${record.value.bookVolume}` : undefined,
    record.value?.bookNumber ? `No. ${record.value.bookNumber}` : undefined,
  ]
    .filter(Boolean)
    .join(' · '),
);

onMounted(async () => {
  isLoading.value = true;
  const [recordResult, tagResult] = await Promise.allSettled([
    getRecord(recordId.value),
    getRecordTags(recordId.value),
  ]);

  if (recordResult.status === 'fulfilled') {
    record.value = recordResult.value;
  } else {
    errorMessage.value = errorToMessage(recordResult.reason);
  }

  if (tagResult.status === 'fulfilled') {
    tags.value = tagResult.value;
  } else if (!errorMessage.value) {
    errorMessage.value = errorToMessage(tagResult.reason);
  }
  isLoading.value = false;
});
</script>

<template>
  <div class="page record-page">
    <RouterLink class="back-link" :to="{ name: 'search' }">
      <i class="pi pi-arrow-left" aria-hidden="true"></i> Back to search
    </RouterLink>

    <div v-if="isLoading" class="loading-state" role="status" aria-live="polite">
      <ProgressSpinner stroke-width="4" />
      <p>Loading record…</p>
    </div>

    <Message v-else-if="errorMessage && !record" severity="error" role="alert" :closable="false">
      {{ errorMessage }}
    </Message>

    <article v-else-if="record" class="record-detail">
      <header class="record-header">
        <p class="eyebrow">{{ record.recordType }}</p>
        <h1>{{ record.title || 'Untitled record' }}</h1>
        <dl class="metadata-grid">
          <div v-if="dateText">
            <dt>Date</dt>
            <dd>{{ dateText }}</dd>
          </div>
          <div v-if="bookText">
            <dt>Source</dt>
            <dd>{{ bookText }}</dd>
          </div>
          <div>
            <dt>Record ID</dt>
            <dd>{{ record.id ?? recordId }}</dd>
          </div>
          <div>
            <dt>Edited</dt>
            <dd>{{ record.edited ? 'Yes' : 'No' }}</dd>
          </div>
        </dl>
      </header>

      <section class="record-content" aria-labelledby="record-content-title">
        <h2 id="record-content-title">Record text</h2>
        <p>{{ record.content || 'No record text was provided.' }}</p>
      </section>

      <section v-if="record.originalSourceReference || record.additionalInformation" class="record-notes">
        <h2>Source notes</h2>
        <p v-if="record.originalSourceReference">
          <strong>Original reference:</strong> {{ record.originalSourceReference }}
        </p>
        <p v-if="record.additionalInformation">{{ record.additionalInformation }}</p>
      </section>

      <section class="related-tags" aria-labelledby="related-tags-title">
        <h2 id="related-tags-title">Related tags</h2>
        <p v-if="tags.length === 0">No tags are associated with this record.</p>
        <ul v-else>
          <li v-for="tag in tags" :key="tag.id ?? `${tag.tagName}-${tag.tagContent}`">
            <span>{{ tag.tagName }}</span>
            <RouterLink :to="{ name: 'tag', params: { name: tag.tagContent } }">
              {{ tag.tagContent }}
            </RouterLink>
          </li>
        </ul>
      </section>

      <Message v-if="errorMessage" severity="warn" role="status" :closable="false">
        {{ errorMessage }}
      </Message>
    </article>
  </div>
</template>
