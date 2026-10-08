import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/search' },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
      meta: { title: 'Search' },
    },
    {
      path: '/aggregation',
      name: 'aggregation',
      component: () => import('../views/AggregationView.vue'),
      meta: { title: 'Aggregation' },
    },
    {
      path: '/record/:id',
      name: 'record',
      component: () => import('../views/RecordView.vue'),
      meta: { title: 'Record' },
    },
    {
      path: '/tag/:name',
      name: 'tag',
      component: () => import('../views/TagView.vue'),
      meta: { title: 'Tag' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'About' },
    },
    {
      path: '/search/instruction',
      name: 'instructions',
      component: () => import('../views/InstructionsView.vue'),
      meta: { title: 'Search instructions' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: 'Page not found' },
    },
  ],
  scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { top: 0 },
});

router.afterEach((to) => {
  const pageTitle = typeof to.meta.title === 'string' ? to.meta.title : '';
  document.title = pageTitle ? `${pageTitle} · Silloker` : 'Silloker';
});

export default router;
