import PrimeVue from 'primevue/config';
import { fireEvent, render, screen, waitFor } from '@testing-library/vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SearchView from '../../src/views/SearchView.vue';
import { downloadSearchResults, searchRecords } from '../../src/api/search';

vi.mock('../../src/api/search', () => ({
  searchRecords: vi.fn(),
  downloadSearchResults: vi.fn(),
}));

const renderSearch = async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/search', name: 'search', component: SearchView },
      { path: '/search/instruction', component: { template: '<div>Guide</div>' } },
      { path: '/record/:id', name: 'record', component: { template: '<div>Record</div>' } },
    ],
  });
  await router.push('/search');
  await router.isReady();
  return render(SearchView, { global: { plugins: [router, PrimeVue] } });
};

describe('SearchView', () => {
  beforeEach(() => {
    vi.mocked(searchRecords).mockReset();
    vi.mocked(downloadSearchResults).mockReset();
  });

  it('shows nearby validation when a search has no keywords', async () => {
    await renderSearch();
    await fireEvent.click(screen.getByRole('button', { name: /search records/i }));
    expect(await screen.findByText('Provide at least one keyword')).toBeInTheDocument();
  });

  it('adds and removes keyword chips', async () => {
    await renderSearch();
    const input = screen.getByPlaceholderText('鳥銃');
    await fireEvent.update(input, '鳥銃');
    await fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByText('鳥銃')).toBeInTheDocument();

    const remove = screen.getByRole('button', { name: /remove/i });
    await fireEvent.click(remove);
    expect(screen.queryByText('鳥銃')).not.toBeInTheDocument();
  });

  it('renders an empty state after a successful empty response', async () => {
    vi.mocked(searchRecords).mockResolvedValue({ totalCount: 0, entities: [] });
    await renderSearch();

    await fireEvent.update(screen.getByPlaceholderText('鳥銃'), '火藥');
    await fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    await fireEvent.click(screen.getByRole('button', { name: /search records/i }));

    expect(await screen.findByText('No records matched this query')).toBeInTheDocument();
    expect(searchRecords).toHaveBeenCalledWith(
      expect.objectContaining({ keywords: ['火藥'] }),
      0,
      50,
    );
  });

  it('requests the next zero-based page from the paginator', async () => {
    const response = {
      totalCount: 51,
      entities: [
        {
          id: 1,
          title: 'First page record',
          recordType: 'WANGJO',
          content: '火藥',
          edited: false,
        },
      ],
    };
    vi.mocked(searchRecords).mockResolvedValue(response);

    await renderSearch();
    await fireEvent.update(screen.getByPlaceholderText('鳥銃'), '火藥');
    await fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    await fireEvent.click(screen.getByRole('button', { name: /search records/i }));

    const nextButtons = await screen.findAllByRole('button', { name: /next page/i });
    await fireEvent.click(nextButtons[0]!);
    await waitFor(() =>
      expect(searchRecords).toHaveBeenLastCalledWith(
        expect.objectContaining({ keywords: ['火藥'] }),
        1,
        50,
      ),
    );
  });

  it('renders linked results and a recoverable API failure', async () => {
    vi.mocked(searchRecords)
      .mockResolvedValueOnce({
        totalCount: 1,
        entities: [
          {
            id: 7,
            title: 'A historical record',
            recordType: 'WANGJO',
            content: 'A 火藥 record',
            edited: false,
          },
        ],
      })
      .mockRejectedValueOnce(new Error('Service unavailable'));

    await renderSearch();
    await fireEvent.update(screen.getByPlaceholderText('鳥銃'), '火藥');
    await fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    await fireEvent.click(screen.getByRole('button', { name: /search records/i }));

    const link = await screen.findByRole('link', { name: /open record/i });
    expect(link).toHaveAttribute('href', '/record/7');
    expect(document.querySelector('mark')).toHaveTextContent('火藥');

    await fireEvent.click(screen.getByRole('button', { name: /search records/i }));
    await waitFor(() =>
      expect(screen.getByText('Service unavailable')).toBeInTheDocument(),
    );
  });
});
