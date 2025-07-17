<script lang="ts">
  import CloseIcon from "../icons/CloseIcon.svelte";
  import SearchIcon from "../icons/SearchIcon.svelte";

  let {
    search,
    overlayColor,
  }: {
    search: string;
    overlayColor: string;
  } = $props();

  $inspect(search);
</script>

<div
  class="h-[4rem] w-[50rem] bg-[#3B3B3B] rounded-full flex items-center px-6 justify-between"
>
  <div class="size-6 cursor-pointer">
    <SearchIcon {overlayColor} />
  </div>
  <!-- <input type="search" bind:value={search} class="bg-gray-800 w-full h-full" /> -->

  <div class="w-full h-full px-4">
    <input
      type="search"
      bind:value={search}
      class="w-full h-full focus:ring-0 focus:ring-offset-0 appearance-none outline-none
          [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-ms-clear]:hidden [&::-ms-reveal]:hidden"
    />
  </div>

  <button class="size-6 cursor-pointer" onclick={() => (search = "")}>
    {#if search.length > 0}
      <CloseIcon {overlayColor} />
    {/if}
  </button>
</div>
