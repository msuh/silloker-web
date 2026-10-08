<template>
  <div class="page narrow-page">
    <section class="empty-state not-found-state">
      <span class="error-code">404</span>
      <h1>That page is outside the archive</h1>
      <p>The address may be incorrect, or the page may have moved.</p>
      <RouterLink class="primary-link-button" to="/search">
        Return to search <i class="pi pi-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </section>
  </div>
</template>
