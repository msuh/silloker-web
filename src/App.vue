<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

const menuOpen = ref(false);

const closeMenu = (): void => {
  menuOpen.value = false;
};

const handleEscape = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    closeMenu();
  }
};

window.addEventListener('keydown', handleEscape);
onBeforeUnmount(() => window.removeEventListener('keydown', handleEscape));
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <div class="header-inner">
        <RouterLink class="brand" to="/search" aria-label="Silloker search home" @click="closeMenu">
          <span class="brand-mark" aria-hidden="true">實</span>
          <span>
            <strong>Silloker</strong>
            <small>Records in context</small>
          </span>
        </RouterLink>

        <button
          class="menu-toggle"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="primary-navigation"
          aria-label="Toggle navigation"
          @click="menuOpen = !menuOpen"
        >
          <i :class="menuOpen ? 'pi pi-times' : 'pi pi-bars'" aria-hidden="true"></i>
        </button>

        <nav
          id="primary-navigation"
          class="primary-nav"
          :class="{ 'is-open': menuOpen }"
          aria-label="Primary navigation"
        >
          <RouterLink to="/search" @click="closeMenu">Search</RouterLink>
          <RouterLink to="/aggregation" @click="closeMenu">Aggregation</RouterLink>
          <RouterLink to="/about" @click="closeMenu">About</RouterLink>
        </nav>
      </div>
    </header>

    <main id="main-content" class="main-content" tabindex="-1">
      <RouterView />
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <div>
          <strong>Silloker</strong>
          <p>Opening new paths into Korea's Chosŏn historical record.</p>
        </div>
        <div class="footer-links">
          <RouterLink to="/about">About the project</RouterLink>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSecNQwHPlz5ybkG5dbcLiJqJIsFeVwF37pbvk8Rmf4wLsaPQQ/viewform?usp=sf_link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Feedback
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
