import PrimeVue from 'primevue/config';
import { render, screen } from '@testing-library/vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { describe, expect, it } from 'vitest';

import AggregationChart from '../../src/components/aggregation/AggregationChart.vue';
import NotFoundView from '../../src/views/NotFoundView.vue';

describe('route and chart accessibility', () => {
  it('offers a tabular alternative for chart data', () => {
    render(AggregationChart, {
      props: {
        title: 'Keyword matches',
        description: 'Counts by year',
        mode: 'bars',
        series: [{ label: '鳥銃', values: [{ year: 1600, count: 3 }] }],
      },
    });

    expect(screen.getByText('View accessible chart data')).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /keyword matches by western year/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '鳥銃' })).toBeInTheDocument();
  });

  it('renders unknown-route recovery', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/search', name: 'search', component: { template: '<div>Search</div>' } },
        { path: '/:pathMatch(.*)*', component: NotFoundView },
      ],
    });
    await router.push('/missing');
    await router.isReady();

    render(NotFoundView, { global: { plugins: [router, PrimeVue] } });

    expect(screen.getByRole('heading', { name: /outside the archive/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /return to search/i })).toHaveAttribute(
      'href',
      '/search',
    );
  });
});
