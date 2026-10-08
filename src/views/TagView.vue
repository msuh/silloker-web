<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const tagName = computed(() => String(route.params.name));
</script>

<template>
  <div class="page narrow-page">
    <section class="hero compact-hero">
      <p class="eyebrow">Record tag</p>
      <h1>{{ tagName }}</h1>
      <p>
        The current Silloker data service does not expose a verified tag-results endpoint.
        You can search for this term across the archives instead.
      </p>
      <RouterLink
        class="primary-link-button"
        :to="{ name: 'search', query: { q: tagName } }"
      >
        Search for “{{ tagName }}” <i class="pi pi-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </section>
  </div>
</template>
