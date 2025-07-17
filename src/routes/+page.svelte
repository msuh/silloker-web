<script lang="ts">
  import Logo from "$lib/components/Logo.svelte";
  import SearchBar from "$lib/components/search/SearchBar.svelte";

  const overlayColor: string = "#e6e6e6";

  let search: string = $state("");
</script>

<Logo {overlayColor} />

<div class="h-screen w-screen bg-[#121212] text-[#e6e6e6] overflow-hidden">
  <div class="h-full w-full flex items-center justify-center">
    <SearchBar {search} {overlayColor} />
  </div>
</div>
