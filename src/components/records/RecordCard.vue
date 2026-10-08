<script setup lang="ts">
import Card from 'primevue/card';
import { computed } from 'vue';
import type { RecordEntity } from '../../types/records';

const props = defineProps<{
  record: RecordEntity;
  keywords?: string[];
}>();

interface Segment {
  text: string;
  highlighted: boolean;
}

const dateText = computed(() =>
  [props.record.year, props.record.month, props.record.day]
    .filter((value) => value !== undefined && value !== null)
    .join('-'),
);

const bookText = computed(() =>
  [
    props.record.bookName,
    props.record.bookVolume ? `Vol. ${props.record.bookVolume}` : undefined,
    props.record.bookNumber ? `No. ${props.record.bookNumber}` : undefined,
  ]
    .filter(Boolean)
    .join(' · '),
);

const contentSegments = computed<Segment[]>(() => {
  const content = props.record.content ?? '';
  const keywords = [...new Set((props.keywords ?? []).filter(Boolean))].sort(
    (left, right) => right.length - left.length,
  );
  if (keywords.length === 0) return [{ text: content, highlighted: false }];

  const segments: Segment[] = [];
  let cursor = 0;
  while (cursor < content.length) {
    const match = keywords
      .map((keyword) => ({ keyword, index: content.indexOf(keyword, cursor) }))
      .filter(({ index }) => index >= 0)
      .sort((left, right) => left.index - right.index)[0];

    if (!match) {
      segments.push({ text: content.slice(cursor), highlighted: false });
      break;
    }
    if (match.index > cursor) {
      segments.push({ text: content.slice(cursor, match.index), highlighted: false });
    }
    segments.push({ text: match.keyword, highlighted: true });
    cursor = match.index + match.keyword.length;
  }
  return segments;
});
</script>

<template>
  <RouterLink
    class="record-card-link"
    :to="{ name: 'record', params: { id: record.id } }"
    :aria-label="`Open record: ${record.title || 'Untitled record'}`"
  >
    <Card class="record-card">
      <template #title>{{ record.title || 'Untitled record' }}</template>
      <template #subtitle>
        <span>{{ record.recordType }}</span>
        <span v-if="dateText">{{ dateText }}</span>
        <span v-if="bookText">{{ bookText }}</span>
      </template>
      <template #content>
        <p class="record-excerpt">
          <template v-for="(segment, index) in contentSegments" :key="index">
            <mark v-if="segment.highlighted">{{ segment.text }}</mark>
            <template v-else>{{ segment.text }}</template>
          </template>
        </p>
      </template>
    </Card>
  </RouterLink>
</template>
